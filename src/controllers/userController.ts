import { Request, Response } from "express";
import * as userServices from "../services/userServices";

export const getUserByToken = async (req: Request, res: Response) => {
  const id = req.user?.id || null
  if (!id) {
    throw res.json({
      message: "user not found.",
    });
  }

  const result = await userServices.getUserById(id);
  res.json(result);
};
