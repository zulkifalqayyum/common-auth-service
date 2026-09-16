import type { Request, Response, NextFunction } from "express";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(
      `[INFO-${startedAt}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`,
    );
  });

  next();
}
