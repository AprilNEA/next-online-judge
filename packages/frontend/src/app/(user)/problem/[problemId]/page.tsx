import { BASE } from "@/constant";
import type { IProblem } from "@/types";

export function Problem({ data }: { data: IProblem }) {
  const { id, title, description, createdAt, updatedAt } = data;
  return (
    <div>
      <h1>Question</h1>
      <h2>{title}</h2>
      <div>{description}</div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">代码</span>
          <span className="label-text-alt">C++</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Code"
        ></textarea>
        <label className="label">
          <span className="label-text-alt"></span>
          <span className="label-text-alt">提交</span>
        </label>
      </div>
    </div>
  );
}

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
  return <Problem data={problem} />;
}
