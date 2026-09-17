import type { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const globalErrorHandler = (
  err: Error & { statusCode?: number; details?: unknown },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode ?? 500;
  const message = statusCode >= 500 ? 'Something went wrong' : err.message;

  const payload = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== 'production' && err.details) {
    Object.assign(payload, { details: err.details });
  }

  res.status(statusCode).json(payload);
};
