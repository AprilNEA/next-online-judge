import Link from "next/link";

type IQuestion = {
  id: number;
  title: string;
  passRate: number;
  difficulty: string;
};

function ProblemRow(props: { data: IQuestion }) {
  const { id, title, passRate, difficulty } = props.data;

  return (
    <tr>
      <th>{id}</th>
      <td>
        <Link href={`/problem/${id}`}>{title} </Link>
      </td>
      <td>{passRate}</td>
      <td>{difficulty}</td>
    </tr>
  );
}

export function Problem() {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>题目</th>
            <th>通过率</th>
            <th>难度</th>
          </tr>
        </thead>
        <tbody>
          <ProblemRow
            data={{
              id: 1,
              title: "两数之和",
              passRate: 0.5,
              difficulty: "简单",
            }}
          />
        </tbody>
      </table>
    </div>
  );
}
