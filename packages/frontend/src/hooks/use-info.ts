import useSWR from "swr";
import { fetcher } from "@/utils";
import { IUserInfo } from "@/types";

export default function useInfo() {
  const { data, isLoading } = useSWR<IUserInfo>(
    "/user/info",
    (url: string) =>
      fetcher(url)
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) {
            return {
              id: undefined,
              role: undefined,
              status: "unauthorized",
              handle: undefined,
            };
          } else {
            return res.data;
          }
        }),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    userInfo: data,
    userInfoLoading: isLoading,
  };
}
