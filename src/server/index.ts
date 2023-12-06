import { TRPCError } from '@trpc/server';

import { createContext } from '@/server/context';
import { userRouter } from '@/server/router/user';

import { procedure, publicProcedure, router } from './trpc';

export const appRouter = router({
  health: publicProcedure.query(() => 'hello!'),
  user: userRouter,

  problem: router({
    get: publicProcedure.query(async ({ input, ctx }) => {}),
    getAll: publicProcedure.query(async ({ input, ctx }) => {}),
  }),

  submission: router({
    status: procedure.query(async ({ input, ctx }) => {}),
    submit: procedure.mutation(async ({ input, ctx }) => {}),
  }),
});
export type AppRouter = typeof appRouter;
