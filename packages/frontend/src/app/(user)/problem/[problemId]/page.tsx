import type { IProblem } from "@/types";
import Client from "./client";
import { fetcher } from "@/utils";

async function getProblem(id: number) {
  const response = await fetcher(`/problem/${id}`);
  return (await response.json()) as IProblem;
}

export default async function ProblemPage({
  params,
}: {
  params: { problemId: string };
}) {
  const problem = await getProblem(parseInt(params.problemId, 10));
  return <Client data={problem} />;
}
