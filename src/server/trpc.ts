import { TRPCError, initTRPC } from '@trpc/server';

import { Context } from './context';

const trpc = initTRPC.context<Context>().create();

export const middleware = trpc.middleware;
export const router = trpc.router;

const isAuthed = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});
export const procedure = trpc.procedure.use(isAuthed);
export const publicProcedure = trpc.procedure;
