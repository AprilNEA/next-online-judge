"use client";

import { IProblem } from "@/types";

import { useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "react-daisyui";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";
import { Button, Divider } from "react-daisyui";
import { fetcher } from "@/utils";

export default function Client({ data }: { data: IProblem }) {
  const [userInput, setUserInput] = useState<string>();
  const { id, title, description, createdAt, updatedAt } = data;

  function submitCode() {
    toast("你的代码已提交");

  }

  return (
    <div>
      <div className="text-3xl mb-10 flex whitespace-nowrap mt-5">
        Question {id} {title}
      </div>
      <div className="markdown-body">
        <Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {description}
        </Markdown>
        <Divider></Divider>
      </div>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans">
        <AceEditor
          theme="xcode"
          editorProps={{ $blockScrolling: true }}
          placeholder="Code..."
          width="100%"
          height="400px"
          fontSize={18}
          value={userInput}
          onChange={(value) => setUserInput(value)}
        />
      </div>
      <div className="flex w-full justify-end">
        <Button onClick={submitCode}>提交</Button>
      </div>
    </div>
  );
}
