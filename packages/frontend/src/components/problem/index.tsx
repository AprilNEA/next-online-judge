"use client";

import useSWR from "swr";
import Link from "next/link";
import { Table, Pagination, Button, Progress, Select } from "react-daisyui";
import { fetcher } from "@/utils";
import { IPager, IProblem } from "@/types";
import { useState, useEffect } from "react";
import NextIcon from "@/icons/next.svg";
import PrevIcon from "@/icons/prev.svg";

function ProblemRow(props: { data: IProblem }) {
  const { id, title /*, passRate, difficulty*/ } = props.data;

  return (
    <Table.Row>
      <span>{id}</span>
      <span>
        <Link href={`/problem/${id}`}>{title} </Link>
      </span>
      {/*<span>{passRate}</span>
      <span>{difficulty}</span>*/}
    </Table.Row>
  );
}

export function ProblemList() {
  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);
  const [buttonList, setButtonList] = useState();
  const [maxButtonsPerRow, setMaxButtonsPerRow] = useState(2);

  const { data, isLoading } = useSWR(
    `/problem/all?size=${size}&page=${page}`,
    (url) =>
      fetcher(url).then((res) => {
        updateButtonsPerRow();
        return res.json();
      }) as Promise<IPager<IProblem>>,
  );

  const updateButtonsPerRow = function () {
    const marginLength = 207.2 + 119.2;
    const ButtonWidth = 40;
    const containerWidth = window.innerWidth;
    const availableWidth = containerWidth - marginLength;
    const totalPages = data?.totalPages ? data?.totalPages : 1;
    setMaxButtonsPerRow(Math.floor(availableWidth / ButtonWidth));
    let buttons: any = [];
    if (totalPages <= maxButtonsPerRow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            className="join-item w-[40px] px-auto"
            onClick={() => {
              updatePageOrSize({ page: i });
            }}
          >
            {i}
          </Button>,
        );
      }
    } else {
      const divideNumber = Math.floor(maxButtonsPerRow / 2);
      for (let i = 1; i <= divideNumber; i++) {
        buttons.push(
          <Button
            key={i}
            className="join-item w-[40px] px-auto"
            onClick={() => {
              updatePageOrSize({ page: i });
            }}
          >
            {i}
          </Button>,
        );
      }
      buttons.push(
        <Button key="⋯" className="join-item w-[40px] px-auto">
          ⋯
        </Button>,
      );
      for (
        let i = totalPages - (maxButtonsPerRow - divideNumber - 1);
        i <= totalPages;
        i++
      ) {
        buttons.push(
          <Button
            key={i}
            className="join-item w-[40px] px-auto"
            onClick={() => {
              updatePageOrSize({ page: i });
            }}
          >
            {i}
          </Button>,
        );
      }
    }
    setButtonList(buttons);
  };

  useEffect(() => {
    window.addEventListener("resize", updateButtonsPerRow);
    return () => {
      window.removeEventListener("resize", updateButtonsPerRow);
    };
  }, [data, buttonList, setButtonList]);

  function updatePageOrSize({ page, size }: { page?: number; size?: number }) {
    if (page) setPage(page);
    if (size) setSize(size);
  }

  if (isLoading) {
    return (
      <div className="flex w-full justify-center mt-10">
        <Progress className="w-56" />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <span className="w-1/12">ID</span>
            <span>题目</span>
            <span className="w-1/5">WIP</span>
            <span className="w-1/12">WIP</span>
          </Table.Head>
          <Table.Body>
            {data &&
              data.data.map((row) => <ProblemRow key={row.id} data={row} />)}
          </Table.Body>
        </Table>
      </div>
      <div className="flex w-full component-preview py-5 mt-5 items-center justify-between gap-2 font-sans">
        <div className="flex items-center mr-5">
          <div className="mr-3 text-sm">每页数量</div>
          <Select
            className="border-0"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </div>
        <Pagination>
          <Button
            onClick={() => updatePageOrSize({ page: 1 })}
            className="join-item px-[10px]"
          >
            <PrevIcon />
          </Button>
          {buttonList}
          <Button
            onClick={() => updatePageOrSize({ page: data?.totalPages })}
            className="join-item px-[10px]"
          >
            <NextIcon />
          </Button>
        </Pagination>
      </div>
    </>
  );
}
