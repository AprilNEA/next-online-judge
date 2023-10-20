import { TableWithPager } from "@/components/table";
import { IProblem } from "@/types";

export function ProblemList() {
  return (
    <TableWithPager<IProblem>
      url="/problem/all"
      headers={[
        {
          key: "id",
          name: "ID",
        },
        {
          key: "title",
          name: "标题",
        },
        {
          key: "description",
          name: "说明",
        },
        {
          key: "createdAt",
          name: "创建时间",
        },
        {
          key: "updatedAt",
          name: "更新时间",
        },
        {
          key: "action",
          name: "操作",
        },
      ]}
    />
  );
}