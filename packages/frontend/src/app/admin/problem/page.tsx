"use client";

import { Button, Modal, Input, Textarea } from "react-daisyui";
import { ProblemList } from "@/app/admin/problem/problem";
import { useState } from "react";
import { fetcher } from "@/utils";
import { ITestcase } from "@/types";

function AddProblemModal() {
  const [title, setTitle] = useState<string>();
  const [isUsingLegacy, setIsUsingLegacy] = useState<boolean>(false);
  const [description, setDescription] = useState<string>();
  const [testcases, setTestcases] = useState<Omit<ITestcase, "problem_id">[]>();
  const [inputData, setInputData] = useState<string>("");
  const [outputData, setOutputData] = useState<string>("");

  function addIOData() {
    if (!inputData || !outputData) return;
    setTestcases((prevState) => [
      ...(prevState ?? []),
      { input: inputData, output: outputData },
    ]);
    setInputData("");
    setOutputData("");
  }

  async function handleSubmit() {
    await fetcher("/problem/add", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        testcases: [
          {
            input: inputData,
            output: outputData,
          },
        ],
      }),
    });
  }
  return (
    <>
      <Modal.Header className="font-bold mb-5 flex justify-between">
        <div className="flex items-center">添加题目</div>
        <div className="flex">
          <form method="dialog">
            <Button className="mr-1 btn-ghost">取消</Button>
          </form>
          <Button onClick={handleSubmit}>提交</Button>
        </div>
      </Modal.Header>
      <Modal.Body className="flex w-full h-full justify-between">
        <div className="w-1/3 flex flex-col">
          <div className="flex w-full component-preview p-1 items-center font-sans px-0">
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
        <div className="w-2/3 pl-5 flex flex-col">
          <div className="flex w-full component-preview py-1 items-center justify-center font-sans">
            <div className="flex mr-2 items-center whitespace-nowrap">输入</div>
            <div className="form-control w-full">
              <Textarea
                value={inputData}
                placeholder="In Data"
                onChange={(e) => {
                  setInputData(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex w-full component-preview py-1 items-center justify-center font-sans">
            <div className="flex mr-2 items-center whitespace-nowrap">输出</div>
            <div className="form-control w-full">
              <Textarea
                value={outputData}
                placeholder="Out Data"
                onChange={(e) => {
                  setOutputData(e.target.value);
                }}
              />
            </div>
          </div>
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
