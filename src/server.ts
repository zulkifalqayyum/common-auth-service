import { createApp } from "./app";
import { env } from "./config/env";
import {
  checkDatabaseConnection,
  closeDatabaseConnection,
} from "./config/database";
import { connectRedis, disconnectRedis } from "./config/redis";

async function main(): Promise<void> {
  await connectRedis().catch((err) => {
    console.error(
      "[startup] failed to connect to Redis, continuing per fallback policy",
      err,
    );
  });

  const dbOk = await checkDatabaseConnection();
  if (!dbOk) {
    throw new Error("Unable to connect to PostgreSQL on startup");
  }

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(
      `[server] Node Express Auth Backend listening on port ${env.PORT} (${env.NODE_ENV})`,
    );
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`[server] received ${signal}, shutting down gracefully`);
    server.close(async () => {
      await Promise.all([disconnectRedis(), closeDatabaseConnection()]);
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("[startup] fatal error", err);
  process.exit(1);
});
