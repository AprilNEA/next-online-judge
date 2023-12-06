import { Redis } from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};
const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL!);
export default redis;

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

export const REDIS_PREFIX = {
  SESSION: 'session:',
  SESSIONS: 'sessions:',
  VALIDATE_CODE: 'validateCode:',
} as const;
