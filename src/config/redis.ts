import { createClient, type RedisClientType } from "redis";
import { env } from "./env";

const sentinelEndpoints = env.REDIS_SENTINELS.split(",")
  .map((endpoint) => endpoint.trim())
  .filter(Boolean)
  .map((endpoint) => {
    const [host, port = "26379"] = endpoint.split(":");
    return { host, port: Number(port) };
  });

export const redisConfig = {
  url:
    env.REDIS_URL ||
    `redis://${env.REDIS_HOST}:${env.REDIS_PORT}/${env.REDIS_DB}`,
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
  masterName: env.REDIS_MASTER_NAME,
  sentinels: sentinelEndpoints,
};

export const redisClient: RedisClientType = createClient({
  url: redisConfig.url,
});

if (redisConfig.sentinels.length > 0) {
  console.info("[redis] sentinel configuration detected", {
    masterName: redisConfig.masterName,
    sentinels: redisConfig.sentinels,
    db: redisConfig.db,
  });
}

let isRedisConnected = false;

redisClient.on("error", (err) => {
  isRedisConnected = false;
  console.error("[redis] client error", err);
});

redisClient.on("connect", () => {
  isRedisConnected = true;
});

redisClient.on("end", () => {
  isRedisConnected = false;
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
}

export function isRedisAvailable(): boolean {
  return isRedisConnected && redisClient.isOpen;
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
    if (!redisClient.isOpen) {
      return env.REDIS_FAIL_CLOSED ? closedValue : openValue;
    }
    return await operation();
  } catch (err) {
    console.error("[redis] operation failed, applying fallback policy", err);
    return env.REDIS_FAIL_CLOSED ? closedValue : openValue;
  }
}
