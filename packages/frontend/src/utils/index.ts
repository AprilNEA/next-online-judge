import { BASE } from "@/constant";

export const fetcher = (url: string, init?: RequestInit) => {
  return fetch(`${BASE}${url}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
};
