import { prisma } from "../prisma/client";
import { handlePrismaError } from "../utils/errorHandler";

// type
import { SnippetInput } from "../types/snippet";

export const createSnippet = async (snippetInput: SnippetInput) => {
  try {
    return await prisma.snippet.create({
      data: {
        title: snippetInput.title,
        description: snippetInput.description,
        code: snippetInput.code,
        language: snippetInput.language,
        tags: snippetInput.tags,
        user: {
          connect: {
            id: snippetInput.userId,
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
export const updateSnippet = async (snippetInput: SnippetInput) => {
  try {
    return await prisma.snippet.update({
      where: {
        id: snippetInput.id,
      },
      data: {
        title: snippetInput.title,
        description: snippetInput.description,
        code: snippetInput.code,
        language: snippetInput.language,
        tags: snippetInput.tags,
      },
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
