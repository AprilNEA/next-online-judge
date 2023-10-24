"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSWR from "swr/immutable";
import { Button, Divider } from "react-daisyui";
import Loading from "@/app/loading";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/theme-textmate";
import "ace-builds/src-min-noconflict/mode-c_cpp";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-statusbar";

import { fetcher } from "@/utils";
import { IProblem } from "@/types";
import Guard from "@/app/guard";

export default function ProblemPage({
  params,
}: {
  params: { problemId: string };
}) {
  const router = useRouter();
  const { data: problem, isLoading } = useSWR<IProblem>(
    `/problem/${params.problemId}`,
    (url: string) =>
      fetcher(url)
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) {
            let error = new Error(res.message);
            error.name = `NOJ ERROR ${res.code}`;
            throw error;
          } else {
            return res.data;
          }
        }),
    {
      shouldRetryOnError: false,
      keepPreviousData: true,
    },
  );

  const [userInput, setUserInput] = useState<string>();

  function submitCode() {
    fetcher(`/problem/submit`, {
      method: "POST",
      body: JSON.stringify({
        problem_id: problem?.id,
        source_code: userInput,
        language: "Cpp",
      }),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("提交成功");
          return res.json();
        } else {
          toast.error("提交失败");
        }
      })
      .then((data) => {
        router.push(`/problem/status/${data.id}`);
      });
  }

  return (
    <Guard>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="text-3xl mb-10 flex whitespace-nowrap mt-5">
            Question {problem?.id} {problem?.title}
          </div>
          <div className="markdown-body">
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {problem?.description}
            </Markdown>
            <Divider></Divider>
          </div>
          <div className="flex w-full component-preview my-4 items-center justify-center gap-2 font-sans border-2 rounded-lg overflow-hidden">
            <AceEditor
              theme="textmate"
              mode="c_cpp"
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
        </>
      )}
    </Guard>
  );
}
