import { prisma } from "../prisma/client";

// type
import { Snippet } from "@prisma/client";
import {
  SnippetInput,
  SnippetResponse,
  Languages,
  SnippetShortResponse,
} from "../types/snippet";

export const createSnippet = async (
  snippet: SnippetInput
): Promise<SnippetResponse> => {
  try {
    const res = await prisma.snippet.create({
      data: {
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags,
        user: {
          connect: {
            id: snippet.userId,
          },
        },
      },
    });

    return convertToSnippetResponse(res);
  } catch (err) {
    throw { status: 400, message: err };
  }
};
export const updateSnippet = async (snippet: SnippetInput) => {
  try {
    const res = await prisma.snippet.update({
      where: {
        id: snippet.id,
      },
      data: {
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags,
      },
    });
    return convertToSnippetResponse(res);
  } catch (err) {
    throw { status: 400, message: err };
  }
};
export const deleteSnippet = async (snippetId: number, userId: number) => {
  try {
    return await prisma.snippet.delete({
      where: {
        id: snippetId,
        userId: userId,
      },
    });
  } catch (err) {
    throw { status: 400, message: err };
  }
};
export const getSnippetById = async (
  snippetId: number,
  userId: number
): Promise<SnippetResponse> => {
  try {
    const snippet = await prisma.snippet.findFirst({
      where: {
        id: snippetId,
        userId: userId,
      },
    });

    if (!snippet) {
      throw { status: 400, message: "Snippet not found." };
    }

    return convertToSnippetResponse(snippet as Snippet);
  } catch (err) {
    throw { status: 400, message: err };
  }
};
export const getSnippetByUserId = async (
  userId: number
): Promise<SnippetShortResponse[]> => {
  try {
    const snippet = await prisma.snippet.findMany({
      where: {
        userId: userId,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!snippet) {
      throw { status: 400, message: "Snippet not found." };
    }

    const result: SnippetShortResponse[] = snippet.map((s) => ({
      id: s.id,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      title: s.title,
      language: s.language as Languages,
      tags: s.tags,
    }));

    return result;
  } catch (err) {
    throw { status: 400, message: err };
  }
};

const convertToSnippetResponse = (s: Snippet): SnippetResponse => {
  return {
    id: s.id || 0,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    title: s.title,
    description: s.description,
    code: s.code,
    language: s.language as Languages,
    tags: s.tags,
  };
};
