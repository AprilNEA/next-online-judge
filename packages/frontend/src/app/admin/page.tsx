"use client";

import { Card, Button } from "react-daisyui";
import Link from "next/link";

export default function AdminPage() {
  return (
    <>
      <div className="text-3xl flex whitespace-nowrap overflow-hidden pl-0 mt-5">
        首页
      </div>
      <div className="text-lg mb-10 flex whitespace-nowrap overflow-hidden pl-0">
        请选择管理的项目
      </div>
      <div className="flex w-full justify-start">
      <Card className="w-[300px] shadow-md hover:shadow-lg transition-shadow mr-5">
        <Card.Body>
          <Card.Title tag="h2">题目管理</Card.Title>
          <p>管理NOJ数据库中所有的题目</p>
          <Card.Actions className="justify-end">
            <Link href="/admin/problem">
              <Button className="bg-black text-white hover:bg-gray-500">
                前往
              </Button>
            </Link>
          </Card.Actions>
        </Card.Body>
      </Card>
      <Card className="w-[300px] shadow-md hover:shadow-lg transition-shadow">
        <Card.Body>
          <Card.Title tag="h2">用例管理</Card.Title>
          <p>管理NOJ中题目的用例</p>
          <Card.Actions className="justify-end">
            <Link href="/admin/cases">
              <Button className="bg-black text-white hover:bg-gray-500">
                前往
              </Button>
            </Link>
          </Card.Actions>
        </Card.Body>
      </Card>
      </div>
    </>
  );
}
