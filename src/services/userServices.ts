import { prisma } from "../prisma/client";
import { handlePrismaError } from "../utils/errorHandler";

export const getUserById = async (id: number) => {
  try {
    return await prisma.user.findFirst({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
  } catch (err) {
    handlePrismaError(err);
  }
};
