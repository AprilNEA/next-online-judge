import toast from 'react-hot-toast';

import { QueryCache } from '@tanstack/query-core';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { TRPCError } from '@trpc/server';

import type { AppRouter } from '@/server';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],

      queryClientConfig: {
        queryCache: new QueryCache({
          onError: (error: unknown) => {
            if (error instanceof TRPCError) {
              toast.error(error.message);
            } else {
              toast.error(`Something went wrong: ${error}`);
            }
          },
          // toast.error(`Something went wrong: ${error.message}`),
        }),
      },
    };
  },

  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});
