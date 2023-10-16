"use client";

import { ProblemList } from "@/app/(user)/problem/problem";
import { Accordion } from "react-daisyui";

export default function Home() {
  return (
    <div className="flex flex-wrap gap-2">
      <Accordion defaultChecked>
        <Accordion.Title className="text-xl font-medium">
          欢迎来到 Next Online Judge
        </Accordion.Title>
        <Accordion.Content>
          <ProblemList />
        </Accordion.Content>
      </Accordion>
    </div>
  );
}
