"use client";

import { IProblem } from "@/types";

import { useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "react-daisyui";

export default function Client({ data }: { data: IProblem }) {
  const [userInput, setUserInput] = useState<string>();
  const { id, title, description, createdAt, updatedAt } = data;

  function onSubmit() {
    toast("你的代码已提交");
  }

  return (
    <div>
      <h1>Question {id}</h1>
      <h2>{title}</h2>
      <div>{description}</div>

      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans">
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Code"
        />
      </div>
    </div>
  );
}
