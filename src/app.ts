import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import accountRoutes from "./routes/accounts";

export function createApp(): Application {
  const app = express();

  // 1. CORS (top)
  app.use(
    cors({
      origin: env.corsAllowedOrigins,
      credentials: true,
    }),
  );

  // 2. Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3. Cookie parsing
  app.use(cookieParser());

  // 4. Security headers
  app.use(helmet());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // 5. JWT (cookie/bearer) authentication
  app.use(authenticate);

  app.use("/api/accounts", accountRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
