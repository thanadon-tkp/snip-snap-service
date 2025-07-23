import { Request, Response } from "express";
import * as snippetServices from "../services/snippetServices";
import { z } from "zod";
import { Languages } from "../types/snippet";

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
  res.status(200).json({
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
  res.status(200).json({
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
    tags: z.array(z.string()).default([]),
    userId: z.number().default(userId),
    isPublic: z.boolean().default(false),
  });
  const result = snippetSchema.safeParse(req.body);
  if (!result.success) {
    throw res.status(400).json({
      message: JSON.parse(result.error.message),
    });
  }
  // create snippet
  const snippet = await snippetServices.createSnippet(result.data);
  res.status(201).json({
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
    title: z.string().optional(),
    description: z.string().nullable().optional(),
    code: z.string().optional(),
    language: z.enum(Languages).optional(),
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean().optional(),
  });
  const result = snippetSchema.safeParse(req.body);
  if (!result.success) {
    throw res.status(400).json({
      message: JSON.parse(result.error.message),
    });
  }
  // destructure id and data
  const { id, ...data } = result.data;

  const snippet = await snippetServices.updateSnippet(id, data);
  res.status(200).json({
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
  res.status(200).json({
    message: "Snippet deleted successfully.",
  });
};
