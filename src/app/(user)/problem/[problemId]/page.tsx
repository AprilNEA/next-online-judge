import { BASE } from "@/constant";
import type { IProblem } from "@/types";
import Client from "./client";

async function getProblem(id: number) {
  const response = await fetch(`${BASE}/problem/${id}`);
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
