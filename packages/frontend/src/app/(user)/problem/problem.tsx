import { useRouter } from "next/navigation";

import { IProblem } from "@/types";
import { TableWithPager } from "@/components/table";

export function ProblemList() {
  const router = useRouter();
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
      ]}
      rowClick={(key: string | number) => router.push(`/problem/${key}`)}
    />
  );
}
