"use client";

import { ProblemList } from "@/app/(user)/problem/problem";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 mt-5">
      <div className="text-3xl mb-10 flex whitespace-nowrap pl-0">
        欢迎来到 Next Online Judge
      </div>
      <ProblemList />
    </div>
  );
}
