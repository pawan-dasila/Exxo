import { Response } from "express";
import { z, ZodError } from "zod";
import { ErrorRequestHandler } from "express";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { MulterError } from "multer";
import { HTTPSTATUS } from "../configs/Https.config";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";
import { Env } from "../configs/env.config";

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    status_code: HTTPSTATUS.BAD_REQUEST,
    message: "Validation failed",
    data: {
      errors: errors,
      errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    },
  });
};

const handleMulterError = (error: MulterError) => {
  const messages = {
    LIMIT_UNEXPECTED_FILE: "Invalid file field name. Please use 'file'",
    LIMIT_FILE_SIZE: "File size exceeds the limit",
    LIMIT_FILE_COUNT: "Too many files uploaded",
    default: "File upload error",
  };

  return {
    status: HTTPSTATUS.BAD_REQUEST,
    message: messages[error.code as keyof typeof messages] || messages.default,
    error: error.message,
  };
};

export const ErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
): void => {
  logger.error(error, `Error occurred on PATH: ${req.path}`);

  if (error instanceof ZodError) {
    formatZodError(res, error);
    return;
  }

  if (error instanceof MulterError) {
    const { status, message, error: err } = handleMulterError(error);
    res.status(status).json({
      status_code: status,
      message,
      data: {
        error: err,
        errorCode: ErrorCodeEnum.FILE_UPLOAD_ERROR,
      },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status_code: error.statusCode,
      message: error.message,
      data: {
        errorCode: error.errorCode,
      },
    });
    return;
  }

  // Handle unknown errors
  const isProduction = Env.NODE_ENV === "PRODUCTION";
  res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    status_code: HTTPSTATUS.INTERNAL_SERVER_ERROR,
    message: isProduction ? "Internal Server Error" : error?.message || "Unknown error occurred",
    data: isProduction ? null : {
      stack: error?.stack,
      error: error?.message
    },
  });
};
