import { prisma } from "../prisma/client";
import { handlePrismaError } from "../utils/errorHandler";

// type
import type { Snippet } from "../types/snippet";

export const createSnippet = async (snippet: Omit<Snippet, "id">) => {
  try {
    return await prisma.snippet.create({
      data: {
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags,
        isPublic: snippet.isPublic,
        user: {
          connect: {
            id: snippet.userId,
          },
        },
      },
      omit: {
        userId: true,
      },
    });
  } catch (err) {
    handlePrismaError(err);
  }
};
export const updateSnippet = async (
  snippetId: number,
  update: Partial<Omit<Snippet, "id" | "userId">>
) => {
  try {
    return await prisma.snippet.update({
      where: {
        id: snippetId,
      },
      data: update,
      omit: {
        userId: true,
      },
    });
  } catch (err) {
    handlePrismaError(err);
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
    handlePrismaError(err);
  }
};
export const getSnippetById = async (snippetId: number, userId: number) => {
  try {
    return await prisma.snippet.findFirst({
      where: {
        id: snippetId,
        userId: userId,
      },
      omit: {
        userId: true,
      },
    });
  } catch (err) {
    handlePrismaError(err);
  }
};
export const getSnippetByUserId = async (
  userId: number,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const snippets = await prisma.snippet.findMany({
      where: {
        userId: userId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      omit: {
        userId: true,
        code: true,
        description: true,
      },
    });
    const count = await prisma.snippet.count({ where: { userId: userId } });

    return {
      page: page,
      pageSize: pageSize,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      hasNextPage: page * pageSize < count,
      hasPreviousPage: page > 1,
      nextPage: page * pageSize < count ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      details: snippets,
    };
  } catch (err) {
    handlePrismaError(err);
  }
};
