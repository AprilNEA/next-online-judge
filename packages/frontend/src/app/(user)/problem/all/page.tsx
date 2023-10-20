"use client";

import { ProblemList } from "@/app/(user)/problem/problem";

export default function ProblemListPage() {
  return (
    <>
      <div className="text-3xl mb-10 flex whitespace-nowrap overflow-hidden pl-0 mt-5">
        题目列表
      </div>
      <ProblemList />
    </>
  );
}
