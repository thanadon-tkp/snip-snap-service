import { PrismaClient, Prisma } from "@prisma/client";
export const prisma = new PrismaClient();
export const {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} = Prisma;
