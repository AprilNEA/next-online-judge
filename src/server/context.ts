import { NextRequest } from 'next/server';

import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import redis, { REDIS_PREFIX } from '@/libs/redis';
import { SESSION_ID_COOKIE_NAME, parseSessionId } from '@/libs/security';

export interface NextRequestContentFnOptions
  extends FetchCreateContextFnOptions {
  req: NextRequest;
}

export async function createContext({
  req,
  resHeaders,
}: NextRequestContentFnOptions) {
  async function parseUser() {
    if (!req.cookies) return null;

    const sessionId =
      req.cookies.get(SESSION_ID_COOKIE_NAME)?.value ??
      parseSessionId(req.cookies.toString());
    if (!sessionId) return null;

    const userId = await redis.get(REDIS_PREFIX.SESSION + sessionId);
    if (!userId) return null;

    return {
      id: userId,
      session: sessionId,
    };
  }

  return {
    user: await parseUser(),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
