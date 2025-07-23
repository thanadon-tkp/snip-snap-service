import { Prisma } from "@prisma/client";

export const handlePrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // Unique constraint failed
        const field = (error.meta?.target || []) as string[];
        throw {
          status: 409,
          message: `Duplicate value for field: ${field.join(", ")}`,
        };
      case "P2025":
        // Record to update not found
        throw {
          status: 404,
          message: "Record not found",
        };
      case "P2003":
        // Foreign key constraint failed
        throw {
          status: 400,
          message: "Invalid reference: foreign key constraint failed",
        };
      case "P2014":
        // Relation violation
        throw {
          status: 400,
          message: "Relation violation",
        };
      default:
        throw { status: 400, message: `Database error: ${error.message}` };
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw {
      status: 500,
      message: "Unknown database error",
    };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    throw {
      status: 500,
      message: "Database panic occurred",
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw {
      status: 500,
      message: "Database connection error",
    };
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw {
      status: 400,
      message: "Validation failed",
    };
  }

  throw error
};
