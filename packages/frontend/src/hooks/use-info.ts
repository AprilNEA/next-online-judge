import useSWR from "swr";
import { fetcher } from "@/utils";
import { IUserInfo } from "@/types";

export default function useInfo() {
  const { data, isLoading } = useSWR<IUserInfo>(
    "/user/info",
    (url: string) =>
      fetcher(url).then(({ status, json }) => {
        if (status === 401) {
          return undefined;
        } else {
          return json();
        }
      }),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  return {
    userInfo: data,
    userInfoLoading: isLoading,
  };
}
