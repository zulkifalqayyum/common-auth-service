import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

/**
 * Central error handler. Never logs req.body, cookies, or headers —
 * only method/path/status — so JWTs and API keys can't leak into logs.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";
  const code = err instanceof HttpError ? err.code : undefined;

  console.error(`[error] ${req.method} ${req.path} -> ${statusCode}: ${message}`);

  res.status(statusCode).json({
    error: statusCode === 500 && env.isProduction ? "Internal server error" : message,
    ...(code ? { code } : {}),
  });
}

export function asyncHandler<T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>>(
  fn: T,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
