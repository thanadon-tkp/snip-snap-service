import { Request, Response } from "express";
import * as authServices from "../services/authServices";

export const postSignUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authServices.createUser({ name, email, password });
  res.status(201).json(result);
};

export const postSignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authServices.login({
    email,
    password,
  });

  if (!result) {
    res.status(400).json({ message: "Login Failed!" });
    return;
  }

  res.cookie("accessToken", result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // or "strict" for higher security
    maxAge: 1000 * 60 * 15, // 15 minutes
  });
  res.cookie("refreshToken", result.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // or "strict" for higher security
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(200).json({ message: "Login Successfully!" });
};

export const postRefreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await authServices.refreshToken(token);

  if (!result) {
    res.status(400).json({ message: "Refresh Token Failed!" });
    return;
  }

  res.cookie("accessToken", result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // or "strict" for higher security
    maxAge: 1000 * 60 * 15, // 15 minutes
  });
  res.status(200).json({ message: "Refresh Token Successfully!" });
};

export const postLogout = async (_req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
