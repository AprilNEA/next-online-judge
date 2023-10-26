"use client";

import { Button, Modal, Input, Textarea, Table } from "react-daisyui";
import { ProblemList } from "@/app/admin/problem/problem";
import { useState } from "react";
import { fetcher } from "@/utils";
import { ITestcase } from "@/types";
import { split as SplitEditor } from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { FileInput } from "react-daisyui";

function AddProblemModal() {
  const [title, setTitle] = useState<string>();
  const [isUsingLegacy, setIsUsingLegacy] = useState<boolean>(false);
  const [description, setDescription] = useState<string>();
  const [testcases, setTestcases] = useState<Omit<ITestcase, "problem_id">[]>();
  const [IOData, setIOData] = useState<string[]>(["", ""]);

  async function handleSubmit() {
    await fetcher("/problem/add", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        testcases: [
          {
            input: IOData[0],
            output: IOData[1],
          },
        ],
      }),
    });
  }

  function clearWorkspace() {
    setTitle("");
    setDescription("");
    setIOData(["", ""]);
  }

  return (
    <>
      <Modal.Header className="font-bold mb-5 flex justify-between">
        <div className="flex items-center">添加题目</div>
        <div className="flex">
          <form method="dialog">
            <Button className="mr-1 btn-ghost">取消</Button>
          </form>
          <Button className="mr-1 btn-ghost" onClick={clearWorkspace}>
            清空
          </Button>
          <Button onClick={handleSubmit}>提交</Button>
        </div>
      </Modal.Header>
      <Modal.Body className="flex w-full h-full justify-between">
        <div className="w-1/3 flex flex-col">
          <div className="flex w-full component-preview pb-1 items-center font-sans px-0">
            <div className="flex mr-2 items-center whitespace-nowrap">标题</div>
            <div className="form-control w-full">
              <Input
                type="text"
                value={title}
                placeholder="Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex w-full h-full component-preview py-1 items-center justify-center font-sans">
            <div className="flex mr-2 items-center whitespace-nowrap">描述</div>
            <div className="w-full h-full">
              <Textarea
                className="w-full h-full"
                value={description}
                placeholder="Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-2/3 pl-5 flex flex-col h-full">
          <div className="flex w-full">
            <div className="flex-grow-1 w-full text-sm flex justify-between pr-2">
              输入
              <FileInput
                size="xs"
                accept="text/plain,.in"
                onChange={(event) => {
                  //@ts-ignore
                  const selectedFile = event.target.files[0];
                  if (selectedFile) {
                    const reader = new FileReader();

                    reader.onload = (e) => {
                      //@ts-ignore
                      const content = e.target.result;
                      //@ts-ignore
                      setIOData([content, IOData[1]]);
                    };

                    reader.readAsText(selectedFile);
                  }
                }}
              />
            </div>
            <div className="flex-grow-1 w-full text-sm flex justify-between ">
              输出
              <FileInput
                size="xs"
                accept="text/plain,.out"
                onChange={(event) => {
                  //@ts-ignore
                  const selectedFile = event.target.files[0];
                  if (selectedFile) {
                    const reader = new FileReader();

                    reader.onload = (e) => {
                      //@ts-ignore
                      const content = e.target.result;
                      //@ts-ignore
                      setIOData([IOData[0], content]);
                    };

                    reader.readAsText(selectedFile);
                  }
                }}
              />
            </div>
          </div>
          {/*@ts-ignore*/}
          <SplitEditor
            theme="github"
            splits={2}
            orientation="beside"
            value={IOData}
            width="100%"
            height="100%"
            editorProps={{ $blockScrolling: true }}
            onChange={(value) => {
              setIOData(value);
            }}
          />
        </div>
      </Modal.Body>
    </>
  );
}

export default function AdminProblemPage() {
  const { Dialog, handleShow } = Modal.useDialog();

  return (
    <>
      <div className="flex overflow-hidden pl-0 mt-5 justify-between">
        <div className="text-3xl whitespace-nowrap">题目管理</div>
        <Button onClick={handleShow} color="primary">
          添加题目
        </Button>
      </div>
      <ProblemList />
      <div className="font-sans">
        <Dialog className="h-full w-full max-w-none max-h-none rounded-none flex flex-col">
          <AddProblemModal />
        </Dialog>
      </div>
    </>
  );
}
