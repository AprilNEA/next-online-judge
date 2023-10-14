"use client";

import { IProblem } from "@/types";

import { useState } from "react";
import toast from "react-hot-toast";

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
      <div className="form-control">
        <label className="label">
          <span className="label-text">代码</span>
          <select className="label-text-alt select-xs w-fit max-w-xs">
            <option>C++</option>
          </select>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Code"
        ></textarea>
        <label className="label">
          <span className="label-text-alt"></span>
          <span className="label-text-alt" onClick={onSubmit}>
            提交
          </span>
        </label>
      </div>
    </div>
  );
}
