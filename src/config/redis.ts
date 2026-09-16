import Redis from "ioredis";
import { env } from "./env";

const sentinelEndpoints = env.REDIS_SENTINELS.split(",")
  .map((endpoint) => endpoint.trim())
  .filter(Boolean)
  .map((endpoint) => {
    const [host, port = "26379"] = endpoint.split(":");
    return { host, port: Number(port) };
  });

export const redisConfig = {
  db: env.REDIS_DB,
  masterName: env.REDIS_MASTER_NAME,
  sentinels: sentinelEndpoints,
};

export const redisClient = new Redis({
  sentinels: redisConfig.sentinels,
  name: redisConfig.masterName,
  db: redisConfig.db,
  enableOfflineQueue: false,
  lazyConnect: true,
});

console.info("[redis] sentinel configuration detected", {
  masterName: redisConfig.masterName,
  sentinels: redisConfig.sentinels,
  db: redisConfig.db,
});

let isRedisConnected = false;

redisClient.on("error", (err) => {
  isRedisConnected = false;
  console.error("[redis] client error", err);
});

redisClient.on("connect", () => {
  isRedisConnected = true;
});

redisClient.on("close", () => {
  isRedisConnected = false;
});

redisClient.on("end", () => {
  isRedisConnected = false;
});

export async function connectRedis(): Promise<void> {
  const status = redisClient.status;
  if (status === "ready" || status === "connect" || status === "connecting" || status === "reconnecting") {
    return;
  }

  await redisClient.connect();
}

export async function disconnectRedis(): Promise<void> {
  const status = redisClient.status;
  if (status === "ready" || status === "connect" || status === "connecting" || status === "reconnecting" || status === "wait") {
    await redisClient.quit();
  }
}

export function isRedisAvailable(): boolean {
  return isRedisConnected && redisClient.status === "ready";
}

/**
 * Wraps a Redis operation so a downed Redis degrades according to
 * REDIS_FAIL_CLOSED instead of crashing the request. On failure:
 * fail-closed returns `closedValue` (deny/treat-as-revoked), fail-open
 * returns `openValue` (allow/skip revocation check).
 */
export async function withRedisFallback<T>(
  operation: () => Promise<T>,
  openValue: T,
  closedValue: T,
): Promise<T> {
  try {
    if (redisClient.status !== "ready") {
      return env.REDIS_FAIL_CLOSED ? closedValue : openValue;
    }
    return await operation();
  } catch (err) {
    console.error("[redis] operation failed, applying fallback policy", err);
    return env.REDIS_FAIL_CLOSED ? closedValue : openValue;
  }
}
