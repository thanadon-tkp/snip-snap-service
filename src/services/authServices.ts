import { prisma, PrismaClientKnownRequestError } from "../prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
// types
import { SignUp, JwtPayload } from "../types/auth";
import { CreateUserRequest } from "../types/user";

export const createUser = async (user: CreateUserRequest) => {
  try {
    const data = { ...user };
    data.password = await hashPassword(user.password);

    await prisma.user.create({ data });

    return { message: "Created successfully" };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      throw {
        status: 409,
        message: "Email already existss",
      };
    }

    throw { status: 400, message: err };
  }
};

export const login = async (credentials: SignUp) => {
  try {
    // find user in db
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) throw (new Error().message = "Invalid email or password");

    // check password
    const isCompare = await comparePassword(
      credentials.password,
      user.password
    );

    if (!isCompare) throw (new Error().message = "Invalid email or password");

    // genarate token
    const payload: JwtPayload = {
      user: {
        id: user.id,
      },
    };
    const access_token = signAccessToken(payload);
    const refresh_token = signRefreshToken(payload);

    return {
      access_token,
      refresh_token,
    };
  } catch (err) {
    throw { status: 400, message: err };
  }
};

export const refreshToken = async (token: string) => {
  try {
    const payload = verifyRefreshToken(token) as JwtPayload;
    const access_token = signAccessToken({ user: payload.user });

    return {
      access_token,
    };
  } catch (err) {
    throw { status: 400, message: err };
  }
};
