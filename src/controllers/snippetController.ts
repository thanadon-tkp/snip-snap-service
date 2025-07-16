import { Request, Response } from "express";
import * as snippetServices from "../services/snippetServices";
import { z } from "zod";
import { SnippetInput, Languages } from "../types/snippet";

export const getSnippetById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw res.status(400).json({
      message: "User not found.",
    });
  }
  const snippetId = parseInt(req.params.id);
  if (isNaN(snippetId)) {
    throw res.status(400).json({
      message: "Invalid snippet id.",
    });
  }

  const snippet = await snippetServices.getSnippetById(snippetId, userId);
  return res.status(200).json({
    message: "Successfully.",
    data: snippet,
  });
};
export const getSnippetByUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw res.status(400).json({
      message: "User not found.",
    });
  }

  const snippets = await snippetServices.getSnippetByUserId(userId);
  return res.status(200).json({
    message: "Successfully.",
    data: snippets,
  });
};
export const postCreateSnippet = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw res.status(400).json({
      message: "User not found.",
    });
  }
  // validate
  const snippetSchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    code: z.string(),
    language: z.enum(Languages),
    tags: z.array(z.string()).optional().default([]),
    userId: z.number().default(userId),
  });
  const result = snippetSchema.safeParse(req.body);
  if (!result.success) {
    throw res.status(400).json({
      message: JSON.parse(result.error.message),
    });
  }
  const data: SnippetInput = result.data;

  const snippet = await snippetServices.createSnippet(data);
  return res.status(201).json({
    message: "Snippet created successfully.",
    data: snippet,
  });
};
export const putUpdateSnippet = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw res.status(400).json({
      message: "User not found.",
    });
  }
  // validate
  const snippetSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    code: z.string(),
    language: z.enum(Languages),
    tags: z.array(z.string()).optional().default([]),
    userId: z.number().default(userId),
  });
  const result = snippetSchema.safeParse(req.body);
  if (!result.success) {
    throw res.status(400).json({
      message: JSON.parse(result.error.message),
    });
  }
  const data: SnippetInput = result.data;

  const snippet = await snippetServices.updateSnippet(data);
  return res.status(200).json({
    message: "Snippet updated successfully.",
    data: snippet,
  });
};
export const deleteSnippet = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw res.status(400).json({
      message: "User not found.",
    });
  }

  const snippetId = parseInt(req.params.id);
  if (isNaN(snippetId)) {
    throw res.status(400).json({
      message: "Invalid snippet id.",
    });
  }

  await snippetServices.deleteSnippet(snippetId, userId);
  return res.status(200).json({
    message: "Snippet deleted successfully.",
  });
};
