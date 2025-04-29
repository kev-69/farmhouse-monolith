import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const testPrisma = new PrismaClient();

export function generateTestToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
}