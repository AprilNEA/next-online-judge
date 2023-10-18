"use client";

import useSWR from "swr";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Table, Pagination, Button, Select } from "react-daisyui";

import { fetcher } from "@/utils";
import { IPager } from "@/types";

import NextIcon from "@/icons/next.svg";
import PrevIcon from "@/icons/prev.svg";
import Loading from "@/components/layout/loading";

export type ITableHeader = {
  key: string;
  name: string;
  className?: string;
};

export function TableWithPager<T>(props: {
  url: string;
  headers: ITableHeader[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [size, setSize] = useState(
    parseInt(searchParams.get("size") ?? "20", 10)
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") ?? "1", 10)
  );

  const { data, isLoading } = useSWR(
    `${props.url}?size=${size}&page=${page}`,
    (url: string) =>
      fetcher(url).then((res) => {
        return res.json();
      }) as Promise<IPager<T>>
  );

  function updatePage({
    newPage,
    newSize,
  }: {
    newSize?: number;
    newPage?: number;
  }) {
    if ((!newSize && !newPage) || (newSize === size && newPage === page))
      return;
    router.push(`${pathname}?size=${size}&page=${page}`);
    if (newSize) {
      setSize(newSize);
    }
    if (newPage) {
      setPage(newPage);
    }
  }

  if (isLoading || !data) {
    return <Loading />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            {props.headers.map((header) => (
              <span key={header.key} className={header.className}>
                {header.name}
              </span>
            ))}
          </Table.Head>
          <Table.Body>
            {data.data.map((row) => (
              // @ts-ignore
                <Table.Row key={row.key}>
                  {props.headers.map((header) => (
                    // @ts-ignore
                    <span key={`${row.key}-${header.key}`}>
                      {/*@ts-ignore*/}
                      {row[header.key]}
                    </span>
                  ))}
                </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div className="flex w-full component-preview py-5 mt-5 items-center justify-between gap-2 font-sans">
        <div className="flex items-center mr-5">
          <div className="mr-3 text-sm">每页数量</div>
          <Select
            className="border-0"
            value={size}
            onChange={(e) => updatePage({ newSize: Number(e.target.value) })}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </div>
        <Pagination>
          <Button
            onClick={() => updatePage({ newPage: page - 1 })}
            className="join-item px-[10px]"
          >
            <PrevIcon />
          </Button>
          <Button
            onClick={() => updatePage({ newPage: page + 1 })}
            className="join-item px-[10px]"
          >
            <NextIcon />
          </Button>
        </Pagination>
      </div>
    </>
  );
}
