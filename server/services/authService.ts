import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { prisma } from '../config/prisma.js';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAuthToken = (userId: string): string => {
  const secret = env.JWT_SECRET;
  const expiresIn = env.JWT_EXPIRES_IN || '1h';

  // jsonwebtoken types are strict; cast to any for runtime call
  return (jwt as any).sign({ userId }, secret as any, { expiresIn } as any);
};

export const verifyAuthToken = (token: string): { userId: string } => {
  const secret = env.JWT_SECRET;
  return jwt.verify(token, secret) as { userId: string };
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (name: string | undefined, email: string, passwordHash: string) => {
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export default {
  hashPassword,
  verifyPassword,
  generateAuthToken,
  verifyAuthToken,
  findUserByEmail,
  findUserById,
  createUser,
};
