export interface EmailTemplateData {
  [key: string]: any;
}

export interface EmailTemplateResult {
  subject: string;
  html: string;
}

export interface EmailTemplates {
  [key: string]: (data: EmailTemplateData) => EmailTemplateResult;
}

export const templates: EmailTemplates = {
  verifyAccount: (data) => ({
    subject: 'Verify Your FarmGhana Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1e8e3e; margin-bottom: 20px;">Verify Your Email Address</h2>
          <p>Hello ${data.name},</p>
          <p>Thank you for registering with FarmGhana! To complete your registration, please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${data.verificationLink}
          </p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, please ignore this email.</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),
  
  resetPassword: (data) => ({
    subject: 'Password Reset Code for FarmGhana',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1e8e3e; margin-bottom: 20px;">Password Reset Code</h2>
          <p>Hello,</p>
          <p>We received a request to reset your FarmGhana account password. Please use the verification code below to proceed with the password reset:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${data.code}
            </div>
          </div>
          <p>This code will expire in 20 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),
  
  shopVerification: (data) => ({
    subject: 'Shop Registration - Verification Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1e8e3e; margin-bottom: 20px;">Shop Registration - Verification Required</h2>
          <p>Hello ${data.ownerName},</p>
          <p>Thank you for registering your shop "${data.shopName}" with FarmGhana! To complete your shop registration, please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Shop Email</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${data.verificationLink}
          </p>
          <p>This link will expire in 24 hours.</p>
          <p>Please note that your shop registration will still require approval by our admin team before you can start selling. You will receive another email once your shop has been approved.</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),
  
  shopApproved: (data) => ({
    subject: 'Congratulations! Your Shop Has Been Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1e8e3e; margin-bottom: 20px;">Your Shop Has Been Approved!</h2>
          <p>Hello ${data.ownerName},</p>
          <p>Great news! Your shop "${data.shopName}" has been reviewed and approved by our team.</p>
          <p>You can now access your seller dashboard and start listing products for sale.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{http://localhost:5173}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Seller Dashboard</a>
          </div>
          <p><strong>Login Information:</strong></p>
          <ul>
            <li>Email: ${data.email}</li>
            <li>Password: Your registration password</li>
          </ul>
          <p>We're excited to have you as a seller on FarmGhana. If you have any questions about setting up your shop or listing products, please don't hesitate to contact our seller support team.</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  shopRejected: (data) => ({
    subject: 'Shop Registration - Application Not Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #d32f2f; margin-bottom: 20px;">Shop Registration Not Approved</h2>
          <p>Hello ${data.ownerName},</p>
          <p>Thank you for your interest in becoming a seller on FarmGhana.</p>
          <p>After careful review of your shop application for "${data.shopName}", we regret to inform you that your application has not been approved at this time.</p>
          
          <p>You may address the issues mentioned above and submit a new application. We encourage you to:</p>
          <ul>
            <li>Review our seller guidelines</li>
            <li>Provide more complete documentation</li>
            <li>Ensure all information meets our marketplace standards</li>
          </ul>
          
          <p>If you have questions or need further clarification, please contact our seller support team.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.supportLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Contact Seller Support</a>
          </div>
          
          <p>Thank you for your understanding.</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  shopBanned: (data) => ({
    subject: `Your Shop "${data.shopName}" Has Been Suspended`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #d32f2f; margin-bottom: 20px;">Your Shop Has Been Suspended</h2>
          <p>Hello ${data.ownerName},</p>
          <p>We regret to inform you that your shop "${data.shopName}" has been suspended from the FarmGhana platform.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Reason for suspension:</strong> ${data.banReason}</p>
            <p style="margin: 5px 0;"><strong>Suspension Date:</strong> ${new Date(data.banDate).toLocaleDateString()}</p>
          </div>
          
          <p>This action has been taken because your shop was found to be in violation of our seller guidelines. During this suspension period:</p>
          <ul>
            <li>Your shop and products will not be visible on the marketplace</li>
            <li>You cannot process or fulfill pending orders</li>
            <li>You cannot access seller features on the platform</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.appealLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Appeal Suspension</a>
          </div>
          
          <p>For more information about our policies and guidelines, please review our <a href="${data.policiesLink}" style="color: #1e8e3e;">Seller Guidelines</a>.</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  shopUnbanned: (data) => ({
    subject: `Your Shop "${data.shopName}" Has Been Reinstated`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1e8e3e; margin-bottom: 20px;">Your Shop Has Been Reinstated</h2>
          <p>Hello ${data.ownerName},</p>
          <p>We're pleased to inform you that your shop "${data.shopName}" has been reinstated on the FarmGhana platform.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Reinstatement Date:</strong> ${new Date(data.reinstatementDate).toLocaleDateString()}</p>
          </div>
          
          <p>Your shop is now active again, which means:</p>
          <ul>
            <li>Your shop and products are now visible on the marketplace</li>
            <li>You can process and fulfill orders</li>
            <li>You have full access to all seller features</li>
          </ul>
          
          <p>We appreciate your cooperation in resolving the previous issues. To ensure continued compliance with our policies, please review our updated seller guidelines.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.dashboardLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Seller Dashboard</a>
          </div>
          
          <p>If you have any questions or need assistance with your shop, please don't hesitate to contact our seller support team.</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),
  
  orderConfirmation: (data) => ({
    subject: `Order Confirmation - FarmGhana Order #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1e8e3e; margin-bottom: 20px;">Order Confirmation</h2>
          <p>Hello ${data.name},</p>
          <p>Thank you for your order! We've received your order and it is now being processed.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          </div>
          
          <h3 style="color: #1e8e3e;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="border-bottom: 2px solid #eaeaea;">
                <th style="text-align: left; padding: 8px;">Product</th>
                <th style="text-align: center; padding: 8px;">Quantity</th>
                <th style="text-align: right; padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map((item: any) => `
                <tr style="border-bottom: 1px solid #eaeaea;">
                  <td style="padding: 8px;">${item.name}</td>
                  <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 8px;">GH₵${item.price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align: right; padding: 8px;"><strong>Subtotal:</strong></td>
                <td style="text-align: right; padding: 8px;">GH₵${data.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: right; padding: 8px;"><strong>Platform Fee:</strong></td>
                <td style="text-align: right; padding: 8px;">GH₵${data.platformFee.toFixed(2)}</td>
              </tr>
              <tr style="font-size: 18px;">
                <td colspan="2" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
                <td style="text-align: right; padding: 8px; color: #1e8e3e;"><strong>GH₵${data.total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <h3 style="color: #1e8e3e;">Shipping Information</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>${data.shipping.fullName}</strong></p>
            <p style="margin: 5px 0;">${data.shipping.street}</p>
            <p style="margin: 5px 0;">${data.shipping.city}, ${data.shipping.state}</p>
            <p style="margin: 5px 0;">${data.shipping.zipCode}, ${data.shipping.country}</p>
            <p style="margin: 5px 0;">Phone: ${data.shipping.phone}</p>
          </div>
          
          <p>You will receive another email when your order ships. If you have any questions about your order, please contact our customer support.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.orderLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
          </div>
          <p>Thank you for shopping with FarmGhana!</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),
  
  orderShipped: (data) => ({
    subject: `Your Order Has Shipped - FarmGhana Order #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1e8e3e; margin-bottom: 20px;">Your Order Has Shipped!</h2>
          <p>Hello ${data.name},</p>
          <p>Good news! Your order has been shipped and is on its way to you.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Shipped Date:</strong> ${new Date(data.shippedDate).toLocaleDateString()}</p>
            ${data.trackingNumber ? 
              `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
              <p style="margin: 5px 0;"><strong>Carrier:</strong> ${data.carrier}</p>` : ''}
          </div>
          
          ${data.trackingNumber ? 
            `<div style="text-align: center; margin: 30px 0;">
              <a href="${data.trackingLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Your Package</a>
            </div>` : ''}
          
          <h3 style="color: #1e8e3e;">Order Summary</h3>
          <div style="margin-bottom: 20px;">
            ${data.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eaeaea; padding: 10px 0;">
                <div>${item.name} × ${item.quantity}</div>
              </div>
            `).join('')}
          </div>
          
          <h3 style="color: #1e8e3e;">Delivery Information</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>${data.shipping.fullName}</strong></p>
            <p style="margin: 5px 0;">${data.shipping.street}</p>
            <p style="margin: 5px 0;">${data.shipping.city}, ${data.shipping.state}</p>
            <p style="margin: 5px 0;">${data.shipping.zipCode}, ${data.shipping.country}</p>
          </div>
          
          <p>If you have any questions about your delivery, please contact our customer support.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.orderLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
          </div>
          <p>Thank you for shopping with FarmGhana!</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  orderCompleted: (data) => ({
    subject: `Your Order Has Been Delivered - FarmGhana Order #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #1e8e3e; margin-bottom: 20px;">Your Order Has Been Delivered!</h2>
          <p>Hello ${data.name},</p>
          <p>We're happy to inform you that your order has been successfully delivered.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Delivery Date:</strong> ${new Date(data.deliveredDate).toLocaleDateString()}</p>
          </div>
          
          <h3 style="color: #1e8e3e;">Order Summary</h3>
          <div style="margin-bottom: 20px;">
            ${data.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eaeaea; padding: 10px 0;">
                <div>${item.name} × ${item.quantity}</div>
              </div>
            `).join('')}
          </div>
          
          <h3 style="color: #1e8e3e;">Delivery Information</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>${data.shipping.fullName}</strong></p>
            <p style="margin: 5px 0;">${data.shipping.street}</p>
            <p style="margin: 5px 0;">${data.shipping.city}, ${data.shipping.state}</p>
            <p style="margin: 5px 0;">${data.shipping.zipCode}, ${data.shipping.country}</p>
            <p style="margin: 5px 0;">Phone: ${data.shipping.phone}</p>
          </div>
          <p>We hope you are satisfied with your purchase. If you have any questions or concerns about your order, please contact our customer support.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.orderLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
          </div>
        </div>
      </div>
    `
  }),

  orderCancelled: (data) => ({
    subject: `Order Cancelled - FarmGhana Order #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding: 10px;">
          <img src="https://farmghana.com/logo.png" alt="FarmGhana Logo" style="max-width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #d32f2f; margin-bottom: 20px;">Your Order Has Been Cancelled</h2>
          <p>Hello ${data.name},</p>
          <p>We regret to inform you that your order has been cancelled.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Cancellation Date:</strong> ${new Date(data.cancelledDate).toLocaleDateString()}</p>
          </div>
          
          <h3 style="color: #1e8e3e;">Order Summary</h3>
          <div style="margin-bottom: 20px;">
            ${data.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eaeaea; padding: 10px 0;">
                <div>${item.name} × ${item.quantity}</div>
              </div>
            `).join('')}
          </div>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Cancellation Reason:</strong> ${data.reason}</p>
          </div>
          
          <p>If you have any questions about the cancellation or need assistance, please contact our customer support team.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.supportLink}" style="background-color: #1e8e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Contact Support</a>
          </div>
          <p>Thank you for your understanding.</p>
          <p>Best regards,<br>The FarmGhana Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f5f5f5; color: #666; font-size: 12px; border-top: 1px solid #eaeaea;">
          <p>&copy; ${new Date().getFullYear()} FarmGhana. All rights reserved.</p>
        </div>
      </div>
    `
  }),
}

export default templates;