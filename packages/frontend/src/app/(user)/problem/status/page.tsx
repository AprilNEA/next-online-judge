import { ISubmission } from "@/types";
import { BASE } from "@/constant";

async function getSubmissions() {
  const response = await fetch(`${BASE}/problem/status`);
  return (await response.json()) as Omit<ISubmission, "code">[];
}

function SubmissionTable({ data }: { data: Omit<ISubmission, "code">[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>#</th>
            <th>When</th>
            <th>Who</th>
            <th>Problem</th>
            <th>Lang</th>
            <th>Verdict</th>
            <th>Time</th>
            <th>Memory</th>
          </tr>
        </thead>
        <tbody>
          {data.map((submission) => (
            <tr key={submission.id}>
              <th>{submission.id}</th>
              <td>{submission.createdAt}</td>
              <td>{submission.userHandle}</td>
              <td>{submission.problemTitle}</td>
              <td>{submission.language}</td>
              <td>{submission.status}</td>
              <td>WIP</td>
              <td>WIP</td>
            </tr>
          ))}
        </tbody>
        {/*<tfoot>*/}
        {/*  <tr>*/}
        {/*    <th></th>*/}
        {/*    <th>Name</th>*/}
        {/*    <th>Job</th>*/}
        {/*    <th>company</th>*/}
        {/*    <th>location</th>*/}
        {/*    <th>Last Login</th>*/}
        {/*    <th>Favorite Color</th>*/}
        {/*  </tr>*/}
        {/*</tfoot>*/}
      </table>
    </div>
  );
}

export default async function SubmissionAllPage() {
  const data = await getSubmissions();
  return <SubmissionTable data={data} />;
}
