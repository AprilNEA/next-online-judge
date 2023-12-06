import { compare } from 'bcrypt';
import { customAlphabet, nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { z } from 'zod';

import prisma from '@/libs/prisma';
import redis, { REDIS_PREFIX } from '@/libs/redis';
import { SESSION_ID_COOKIE_NAME } from '@/libs/security';

import { procedure, publicProcedure, router } from '../trpc';

const emailSchema = z.string().email();
const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, 'Invalid phone number');
const handleSchema = z.string().min(3).max(16);
const accountSchema = z.string().transform((value) => {
  if (emailSchema.safeParse(value).success) {
    return { type: 'email', value };
  } else if (phoneSchema.safeParse(value).success) {
    return { type: 'phone', value };
  } else if (handleSchema.safeParse(value).success) {
    return { type: 'handle', value };
  }
  throw new Error('Invalid input');
});
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[0-9]/, 'Password must include a number');
const validateCode = z.string().regex(/^\d{6}$/, 'Invalid verification code');

const loginSchema = z
  .object({
    account: accountSchema,
    password: passwordSchema.optional(),
    code: validateCode.optional(),
  })
  .refine((data) => data.password || data.code, {
    message: 'Either password or code is required',
  });
const registerSchema = z.object({
  account: accountSchema,
  password: passwordSchema,
  code: validateCode,
});

async function newSession(userId: number) {
  const sessionId = nanoid();
  const duration = 7 * 24 * 60 * 60;
  const expires = Date.now() + duration * 1000;
  const sessionsKey = REDIS_PREFIX.SESSIONS + userId;

  await redis
    .multi()
    .setex(REDIS_PREFIX.SESSION + sessionId, duration, userId)
    .zremrangebyscore(sessionsKey, '-inf', expires)
    .zadd(sessionsKey, expires, sessionId)
    .exec((err, _) => {});

  cookies().set(SESSION_ID_COOKIE_NAME, sessionId, {
    expires,
    httpOnly: true,
    path: '/',
  });
}

export const userRouter = router({
  login: publicProcedure
    .input(loginSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email:
            input.account.type === 'email' ? input.account.value : undefined,
          phone:
            input.account.type === 'phone' ? input.account.value : undefined,
          handle:
            input.account.type === 'handle' ? input.account.value : undefined,
        },
      });
      if (input.password) {
        if (!user.password) {
          throw new Error('No password');
        }
        if (!(await compare(input.password, user.password))) {
          throw new Error('Invalid password');
        }
      } else if (input.code) {
        // if (user.code !== input.code) {
        // }
      }

      await newSession(user.id);
      return { success: true };
    }),
  validateCode: publicProcedure
    .input(z.object({ account: accountSchema }))
    .output(z.object({ success: z.boolean(), ttl: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const key = REDIS_PREFIX.VALIDATE_CODE + input.account.value;
      const exist = await redis.get(key);
      if (exist) {
        return { success: false, ttl: await redis.ttl(key) };
      }
      const code = customAlphabet('0123456789', 6)();
      await redis.setex(key, 60, code);
      if (input.account.type === 'email') {
        // await sendEmail(input.account.value, code);
      } else if (input.account.type === 'phone') {
        // await sendSMS(input.account.value, code);
      } else if (input.account.type === 'handle') {
        // await sendSMS(input.account.value, code);
      }
      return { success: true, ttl: 60 };
    }),
  register: publicProcedure
    .input(registerSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      // const user = await prisma.user.create({});

      return { success: true };
    }),
  logout: procedure
    .input(
      z.object({
        all: z.boolean().optional(),
        sessions: z.string().array().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const failure: string[] = [];
      if (input.all) {
        redis.zrange(
          REDIS_PREFIX.SESSIONS + ctx.user.id,
          0,
          -1,
          (err, sessions) => {
            if (err) {
              throw err;
            }
            if (!sessions) {
              throw new Error('Session not found');
            }
            sessions.forEach(async (session) => {
              await redis.del(session, (err, _) => {
                if (err) {
                  failure.push(session);
                }
              });
            });
          },
        );
      } else {
        if (!input.sessions) {
          input.sessions = [ctx.user.session];
        }
        for (const session of input.sessions) {
          await redis
            .multi()
            .del(session)
            .zrem(REDIS_PREFIX.SESSIONS + ctx.user.id, session)
            .exec((err, _) => {
              if (err) {
                failure.push(session);
              }
            });
        }
      }
      return { failure };
    }),
  getSessions: procedure.query(async ({ ctx }) => {
    return {
      sessions: await redis.zrange(
        REDIS_PREFIX.SESSIONS + ctx.user.id,
        0,
        -1,
        'WITHSCORES',
      ),
    };
  }),
});
