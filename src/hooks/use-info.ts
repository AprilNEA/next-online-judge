import useSWR from "swr";
import { fetcher } from "@/utils";
import { IUserInfo } from "@/types";

export default function useInfo() {
  const { data, isLoading } = useSWR<IUserInfo>("/info", (url: string) =>
    fetcher(url).then((res) => res.json()),
  );

  return {
    userInfo: data,
    userInfoLoading: isLoading,
  };
}
