import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import accountRoutes from "./routes/accounts";
import storageRoutes from "./routes/storage";

export function createApp(): Application {
  const app = express();

  // 1. Request logging (top, so every request is logged regardless of outcome)
  app.use(requestLogger);

  // 2. CORS
  app.use(
    cors({
      origin: env.corsAllowedOrigins,
      credentials: true,
    }),
  );

  // 3. Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 4. Cookie parsing
  app.use(cookieParser());

  // 5. Security headers
  app.use(helmet());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // 6. JWT (cookie/bearer) authentication
  app.use(authenticate);

  app.use("/api/accounts", accountRoutes);
  app.use("/api/storage", storageRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
