import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authenticate } from "./middleware/authMiddleware";
import { emailVerificationRequired } from "./middleware/emailVerification";
import { organizationStatusMiddleware } from "./middleware/organizationStatus";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import organizationRoutes from "./routes/organizations";
import apiKeyRoutes from "./routes/apiKeys";

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

  // 5. Custom JWT/API key authentication
  app.use(authenticate);

  // 6. Email verification requirement
  app.use(emailVerificationRequired);

  // 7. Organization status enforcement (last)
  app.use(organizationStatusMiddleware);

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/organizations", organizationRoutes);
  app.use("/api/api-keys", apiKeyRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
