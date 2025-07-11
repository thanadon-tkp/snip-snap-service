import { prisma } from "../prisma/client";

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    const result = {
      ...user,
    };

    delete result?.password;

    return result;
  } catch (err) {
    throw { status: 400, message: err };
  }
};
