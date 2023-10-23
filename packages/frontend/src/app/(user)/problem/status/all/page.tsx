import { TableWithPager } from "@/components/table";
import { ISubmission } from "@/types";

type ISubmissionForList = Omit<ISubmission, "code">;

export default function SubmissionList() {
  return (
    <TableWithPager<ISubmissionForList>
      url="/problem/status/all"
      headers={[
        {
          key: "id",
          name: "ID",
        },
        {
          key: "userHandle",
          name: "Who",
        },
        {
          key: "createdAt",
          name: "When",
        },
        {
          key: "problemTitle",
          name: "Problem",
        },
        {
          key: "language",
          name: "Language",
        },
        {
          key: "status",
          name: "Status",
        },
      ]}
    />
  );
}
