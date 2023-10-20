import useSWR from "swr";
import { fetcher } from "@/utils";
import { IUserInfo } from "@/types";

export default function useInfo() {
  const { data, isLoading } = useSWR<IUserInfo>(
    "/user/info",
    (url: string) =>
      fetcher(url).then((res) => {
        if (res.status === 401) {
          return undefined;
        }
        return res.json();
      }),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
    },
  );

  return {
    userInfo: data,
    userInfoLoading: isLoading,
  };
}
