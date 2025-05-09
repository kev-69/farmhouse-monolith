import { createHash } from 'crypto';
import { prisma } from '../shared/prisma';
import logger from './logger';

/**
 * Generate a verification token
 * @param userId User ID to generate token for
 * @returns Hashed verification token
 */
export const generateVerificationToken = (userId: string): string => {
  const timestamp = Date.now().toString();
  const data = `${userId}-${timestamp}`;
  return createHash('sha256').update(data).digest('hex');
};

/**
 * Generate a random 6-digit code
 * @returns Six digit verification code
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store verification code in database with expiration time (20 mins)
 * @param email User email
 * @param code Verification code
 */
export const storeVerificationCode = async (email: string, code: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now
  
  await prisma.passwordReset.upsert({
    where: { email },
    update: {
      code,
      expiresAt,
      used: false
    },
    create: {
      email,
      code,
      expiresAt,
      used: false
    }
  });
};