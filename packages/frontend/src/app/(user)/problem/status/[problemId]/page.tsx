"use client"

import { fetcher } from "@/utils";
import useSWRImmutable from "swr/immutable";
import Loading from "@/app/loading";

export default function ProblemPage({
    params,
  }: {
    params: { problemId: string };
  }) {
    const { data, isLoading } = useSWRImmutable(
      `/problem/${params.problemId}`,
      (url: string) =>
        fetcher(url).then((res) => {
          if (!res.ok) {
            return {
              id: Number(params.problemId),
              title: "在加载问题时发生了错误",
              description: res.status + " " + res.statusText + "\n\n" + JSON.stringify(res.body),
            }
          } else {
            return res.json();
          }
        }),
      {
        shouldRetryOnError: false,
        keepPreviousData: true,
      },
    );
    //@ts-ignore
    return <>{isLoading ? <Loading /> : null}</>;
  }
  