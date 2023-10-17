"use client";

import { Button, Modal, Input, Textarea } from "react-daisyui";
import { ProblemList } from "@/app/admin/problem/problem";
import { useState } from "react";

export default function AdminProblemPage() {
  const { Dialog, handleShow } = Modal.useDialog();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [inData, setInData] = useState<string>();
  const [outData, setOutData] = useState<string>();

  return (
    <>
      <div className=" flex overflow-hidden pl-0 mt-5 justify-between">
        <div className="text-3xl whitespace-nowrap">题目管理</div>
        <Button onClick={handleShow} color="primary">
          添加题目
        </Button>
      </div>
      <ProblemList />
      <div className="font-sans">
        <Dialog>
          <Modal.Header className="font-bold mb-5 flex justify-between">
            <div className="flex items-center">添加题目</div>
            <div className="flex">
              <form method="dialog">
                <Button className="mr-1 btn-ghost">取消</Button>
              </form>
              <Button>提交</Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="flex w-full component-preview p-1 items-center font-sans px-0">
              <div className="flex mr-2 items-center whitespace-nowrap">
                标题
              </div>
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
            <div className="flex w-full component-preview py-1 items-center justify-center font-sans">
              <div className="flex mr-2 items-center whitespace-nowrap">
                描述
              </div>
              <div className="form-control w-full">
                <Textarea
                  value={description}
                  placeholder="Description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex w-full component-preview py-1 items-center justify-center font-sans">
              <div className="flex mr-2 items-center whitespace-nowrap">
                输入
              </div>
              <div className="form-control w-full">
                <Textarea
                  value={inData}
                  placeholder="In Data"
                  onChange={(e) => {
                    setInData(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex w-full component-preview py-1 items-center justify-center font-sans">
              <div className="flex mr-2 items-center whitespace-nowrap">
                输出
              </div>
              <div className="form-control w-full">
                <Textarea
                  value={outData}
                  placeholder="Out Data"
                  onChange={(e) => {
                    setOutData(e.target.value);
                  }}
                />
              </div>
            </div>
          </Modal.Body>
        </Dialog>
      </div>
    </>
  );
}
