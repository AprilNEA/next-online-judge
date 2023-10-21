"use client";

import type { IProblem } from "@/types";
import Client from "./client";
import { fetcher } from "@/utils";
import useSWRImmutable from "swr/immutable";
import Loading from "@/app/loading";

async function getProblem(id: number) {
  const response = await fetcher(`/problem/${id}`);
  return (await response.json()) as IProblem;
}

export default function ProblemPage({
  params,
}: {
  params: { problemId: string };
}) {
  const { data, isLoading } = useSWRImmutable<IProblem>(
    `/problem/${params.problemId}`,
    (url: string) =>
      fetcher(url).then((res) => {
        if (!res.ok) {
          return {
            id: Number(params.problemId),
            title: "在加载问题时发生了错误",
            description: res.status + " " + res.statusText + "\n\n" + res.body,
          } as IProblem;
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
  return <>{isLoading ? <Loading /> : <Client data={data} />}</>;
}
