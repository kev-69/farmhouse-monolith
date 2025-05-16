import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { prisma } from '../shared/prisma';
import logger from './logger';
import { 
  generateVerificationToken, 
  generateVerificationCode, 
  storeVerificationCode 
} from './email.utils';
import templates from './email.templates';

dotenv.config();

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: process.env.EMAIL_HOST, 
    port: parseInt(process.env.EMAIL_PORT || '587'),
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD // Your email password
    }
});

// Send email utility function
const sendEmail = async (to: string, template: string, data: any): Promise<boolean> => {
  try {
    if (!templates[template]) {
      logger.error(`Email template ${template} not found`);
      return false;
    }

    const { subject, html } = templates[template](data);
    
    const mailOptions = {
      from: `"FarmGhana" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to} using template: ${template}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error}`);
    return false;
  }
};

// Specialized email functions
export const emailService = {
  /**
   * Send account verification email
   * @param email User's email address
   * @param userId User's ID
   * @param name User's name
   */
  sendVerificationEmail: async (email: string, userId: string, name: string): Promise<boolean> => {
    try {
      // Generate verification token
      const token = generateVerificationToken(userId);
      
      // Store the token in the database
      await prisma.verificationToken.create({
        data: {
          token,
          userId,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      });
      
      // Generate verification link
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      
      return await sendEmail(email, 'verifyAccount', { name, verificationLink });
    } catch (error) {
      logger.error(`Error in sendVerificationEmail: ${error}`);
      return false;
    }
  },
  
  /**
   * Resend account verification email
   * @param email User's email address
   */
  resendVerificationEmail: async (email: string): Promise<boolean> => {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        logger.error(`User not found with email: ${email}`);
        return false;
      }
      
      if (user.isVerified) {
        logger.info(`User ${email} is already verified`);
        return true;
      }
      
      // Delete any existing verification tokens for this user
      await prisma.verificationToken.deleteMany({
        where: { userId: user.id }
      });
      
      // Send a new verification email
      return await emailService.sendVerificationEmail(
        email, 
        user.id, 
        `${user.firstName} ${user.lastName}`
      );
    } catch (error) {
      logger.error(`Error in resendVerificationEmail: ${error}`);
      return false;
    }
  },
  
  /**
   * Verify user account using token
   * @param token Verification token
   */
  verifyAccount: async (token: string): Promise<boolean> => {
    try {
      // Find the verification token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token }
      });
      
      if (!verificationToken) {
        logger.error(`Verification token not found: ${token}`);
        return false;
      }
      
      // Check if token has expired
      if (verificationToken.expiresAt < new Date()) {
        logger.error(`Verification token expired: ${token}`);
        await prisma.verificationToken.delete({ where: { token } });
        return false;
      }
      
      // Update user to verified status
      await prisma.user.update({
        where: { id: verificationToken.userId },
        data: { isVerified: true }
      });
      
      // Delete the used token
      await prisma.verificationToken.delete({ where: { token } });
      
      logger.info(`User ${verificationToken.userId} verified successfully`);
      return true;
    } catch (error) {
      logger.error(`Error in verifyAccount: ${error}`);
      return false;
    }
  },
  
  /**
   * Send password reset code
   * @param email User's email address
   */
  sendPasswordResetCode: async (email: string): Promise<boolean> => {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        logger.error(`User not found with email: ${email} for password reset`);
        return false;
      }
      
      // Generate a 6-digit code
      const code = generateVerificationCode();
      
      // Store the code in the database
      await storeVerificationCode(email, code);
      
      return await sendEmail(email, 'resetPassword', { code });
    } catch (error) {
      logger.error(`Error in sendPasswordResetCode: ${error}`);
      return false;
    }
  },
  
  /**
   * Verify password reset code
   * @param email User's email
   * @param code Password reset code
   */
  verifyPasswordResetCode: async (email: string, code: string): Promise<boolean> => {
    try {
      const resetEntry = await prisma.passwordReset.findFirst({
        where: { 
          email,
          code,
          used: false,
          expiresAt: { gt: new Date() }
        }
      });
      
      if (!resetEntry) {
        logger.error(`Invalid or expired password reset code for ${email}`);
        return false;
      }
      
      // Mark code as verified but not used yet
      // It will be marked as used after the password is actually reset
      return true;
    } catch (error) {
      logger.error(`Error in verifyPasswordResetCode: ${error}`);
      return false;
    }
  },
  
  /**
   * Reset password after code verification
   * @param email User's email
   * @param code Verification code
   * @param newPassword New password (already hashed)
   */
  resetPassword: async (email: string, code: string, newPassword: string): Promise<boolean> => {
    try {
      const resetEntry = await prisma.passwordReset.findFirst({
        where: { 
          email,
          code,
          used: false,
          expiresAt: { gt: new Date() }
        }
      });
      
      if (!resetEntry) {
        logger.error(`Invalid or expired password reset code for ${email}`);
        return false;
      }
      
      // Update user's password
      await prisma.user.update({
        where: { email },
        data: { password: newPassword }
      });
      
      // Mark code as used
      await prisma.passwordReset.update({
        where: { id: resetEntry.id },
        data: { used: true }
      });
      
      logger.info(`Password reset successful for ${email}`);
      return true;
    } catch (error) {
      logger.error(`Error in resetPassword: ${error}`);
      return false;
    }
  },
  
  /**
   * Send shop verification email
   * @param email Shop owner's email
   * @param shopId Shop ID
   * @param shopName Shop name
   * @param ownerName Shop owner's name
   */
  sendShopVerificationEmail: async (email: string, shopId: string, shopName: string, ownerName: string): Promise<boolean> => {
    try {
      // Generate verification token
      const token = generateVerificationToken(shopId);
      
      // Store the token in the database
      await prisma.shopVerificationToken.create({
        data: {
          token,
          shopId,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      });
      
      // Generate verification link
      const verificationLink = `${process.env.FRONTEND_URL}/verify-shop?token=${token}`;
      
      return await sendEmail(email, 'shopVerification', { 
        shopName, 
        ownerName, 
        verificationLink 
      });
    } catch (error) {
      logger.error(`Error in sendShopVerificationEmail: ${error}`);
      return false;
    }
  },
  
  /**
   * Resend shop verification email
   * @param email Shop owner's email
   */
  resendShopVerificationEmail: async (email: string): Promise<boolean> => {
    try {
      // Find shop by email
      const shop = await prisma.shop.findUnique({
        where: { email }
      });
      
      if (!shop) {
        logger.error(`Shop not found with email: ${email}`);
        return false;
      }
      
      if (shop.isVerified) {
        logger.info(`Shop ${email} is already verified`);
        return true;
      }
      
      // Delete any existing verification tokens for this shop
      await prisma.shopVerificationToken.deleteMany({
        where: { shopId: shop.id }
      });
      
      // Send a new verification email
      return await emailService.sendShopVerificationEmail(
        email, 
        shop.id, 
        shop.name,
        shop.ownerName
      );
    } catch (error) {
      logger.error(`Error in resendShopVerificationEmail: ${error}`);
      return false;
    }
  },
  
  /**
   * Verify shop account using token
   * @param token Verification token
   */
  verifyShopAccount: async (token: string): Promise<boolean> => {
    try {
      // Find the verification token
      const verificationToken = await prisma.shopVerificationToken.findUnique({
        where: { token }
      });
      
      if (!verificationToken) {
        logger.error(`Shop verification token not found: ${token}`);
        return false;
      }
      
      // Check if token has expired
      if (verificationToken.expiresAt < new Date()) {
        logger.error(`Shop verification token expired: ${token}`);
        await prisma.shopVerificationToken.delete({ where: { token } });
        return false;
      }
      
      // Update shop to verified status
      await prisma.shop.update({
        where: { id: verificationToken.shopId },
        data: { isVerified: true }
      });
      
      // Delete the used token
      await prisma.shopVerificationToken.delete({ where: { token } });
      
      logger.info(`Shop ${verificationToken.shopId} verified successfully`);
      return true;
    } catch (error) {
      logger.error(`Error in verifyShopAccount: ${error}`);
      return false;
    }
  },
  
  // send shop password resend code
  sendShopPasswordReset: async (email: string): Promise<boolean> => {
    try {
      // Check if shop exists
      const shop = await prisma.shop.findUnique({
        where: { email }
      });
      
      if (!shop) {
        logger.error(`Shop not found with email: ${email} for password reset`);
        return false;
      }
      
      // Generate a 6-digit code
      const code = generateVerificationCode();
      
      // Store the code in the database
      await storeVerificationCode(email, code);
      
      return await sendEmail(email, 'resetPassword', { code });
    } catch (error) {
      logger.error(`Error in sendPasswordResetCode: ${error}`);
      return false;
    }
  },

  resetShopPassword: async (email: string, code: string, newPassword: string): Promise<boolean> => {
    try {
      const resetEntry = await prisma.passwordReset.findFirst({
        where: { 
          email,
          code,
          used: false,
          expiresAt: { gt: new Date() }
        }
      });
      
      if (!resetEntry) {
        logger.error(`Invalid or expired password reset code for ${email}`);
        return false;
      }
      
      // Update shop's password
      await prisma.shop.update({
        where: { email },
        data: { password: newPassword }
      });
      
      // Mark code as used
      await prisma.passwordReset.update({
        where: { id: resetEntry.id },
        data: { used: true }
      });
      
      logger.info(`Password reset successful for ${email}`);
      return true;
    } catch (error) {
      logger.error(`Error in resetPassword: ${error}`);
      return false;
    }
  },
  
  /**
   * Send shop approval notification
   * @param email Shop owner's email
   * @param shopId Shop ID
   * @param shopName Shop name
   * @param ownerName Shop owner's name
   */
  sendShopApprovalEmail: async (email: string, shopId: string, shopName: string, ownerName: string): Promise<boolean> => {
    try {
      const dashboardLink = `${process.env.FRONTEND_URL}/seller/dashboard`;
      
      return await sendEmail(email, 'shopApproved', { 
        shopName, 
        ownerName, 
        email,
        dashboardLink
      });
    } catch (error) {
      logger.error(`Error in sendShopApprovalEmail: ${error}`);
      return false;
    }
  },

  // send shop rejected email
  sendShopRejectionEmail: async (email: string, shopId: string, shopName: string, ownerName: string): Promise<boolean> => {
    try {
      const dashboardLink = `${process.env.FRONTEND_URL}/seller/dashboard`;
      
      return await sendEmail(email, 'shopRejected', { 
        shopName, 
        ownerName, 
        email,
        dashboardLink
      });
    } catch (error) {
      logger.error(`Error in sendShopRejectionEmail: ${error}`);
      return false;
    }
  },
  // send shop banned email
  // send shop unbanned email
  
  /**
   * Send order confirmation email
   * @param email Customer's email
   * @param order Order data
   */
  sendOrderConfirmationEmail: async (email: string, order: any): Promise<boolean> => {
    try {
      const orderLink = `${process.env.FRONTEND_URL}/orders/${order.id}`;
      
      // Format order data for email template
      const emailData = {
        name: order.user.firstName + ' ' + order.user.lastName,
        orderNumber: order.id.substring(0, 8).toUpperCase(),
        date: order.createdAt,
        paymentMethod: order.paymentMethod,
        items: order.orderItems.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: order.totalAmount,
        platformFee: order.totalAmount * 0.05, // 5% platform fee
        total: order.totalAmount * 1.05, // Total with platform fee
        shipping: order.shippingAddress,
        orderLink
      };
      
      return await sendEmail(email, 'orderConfirmation', emailData);
    } catch (error) {
      logger.error(`Error in sendOrderConfirmationEmail: ${error}`);
      return false;
    }
  },
  
  /**
   * Send order shipped email
   * @param email Customer's email
   * @param order Order data
   */
  sendOrderShippedEmail: async (email: string, order: any): Promise<boolean> => {
    try {
      const orderLink = `${process.env.FRONTEND_URL}/orders/${order.id}`;
      
      // Format order data for email template
      const emailData = {
        name: order.user.firstName + ' ' + order.user.lastName,
        orderNumber: order.id.substring(0, 8).toUpperCase(),
        shippedDate: new Date(),
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        trackingLink: order.trackingLink || orderLink,
        items: order.orderItems.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity
        })),
        shipping: order.shippingAddress,
        orderLink
      };
      
      return await sendEmail(email, 'orderShipped', emailData);
    } catch (error) {
      logger.error(`Error in sendOrderShippedEmail: ${error}`);
      return false;
    }
  }
};

export default emailService;