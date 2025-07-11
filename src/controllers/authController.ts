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
  res.status(200).json(result);
};

export const postRefreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await authServices.refreshToken(token);
  res.status(200).json(result);
};
