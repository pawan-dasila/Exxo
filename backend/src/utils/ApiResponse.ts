import { Response } from "express";

export const ApiResponse = <T>(
  res: Response,
  options: {
    status_code: number;
    message: string;
    data?: T;
  },
) => {
  return res.status(options.status_code).json({
    status_code: options.status_code,
    message: options.message,
    data: options.data || null,
  });
};
