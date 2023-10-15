"use client"

import useSWR from "swr";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useRouter} from "next/navigation";
import {useSearchParams} from 'next/navigation'
import {Table, Join, Button} from "react-daisyui";
import {fetcher} from "@/utils";
import {IPager, IProblem} from "@/types";
import {useEffect, useState, useCallback} from "react";


function ProblemRow(props: { data: IProblem }) {
  const {id, title, passRate, difficulty} = props.data;

  return (
    <Table.Row>
      <span>{id}</span>
      <span>
        <Link href={`/problem/${id}`}>{title} </Link>
      </span>
      <span>{passRate}</span>
      <span>{difficulty}</span>
    </Table.Row>
  );
}


export function ProblemList() {
  const [size, setSize] = useState<number>();
  const [page, setPage] = useState<number>();

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams();

  const {data, isLoading} = useSWR<IPager<IProblem>>("/problem/all", (url) => fetcher(`${url}?` + new URLSearchParams({
    size: searchParams.get("size") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  })
  ).then(res => res.json()));

  function updatePageOrSize({page, size}: {
    page?: number, size?: number
  }) {
    router.push(`${pathname}?` + new URLSearchParams({
      size,
      page,
    }))
  }

  // const asyncParams = useCallback(
  //   () => {
  //     const size = searchParams.get("size")
  //     const page = searchParams.get("page")
  //     setSize((_) => size ? parseInt(size) : undefined)
  //     setPage((_) => page ? parseInt(page) : undefined)
  //   },
  //   [searchParams]
  // )
  //
  // useEffect(() => {
  //   asyncParams();
  // }, [searchParams])

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <span>ID</span>
            <span>题目</span>
            <span>通过率</span>
            <span>难度</span>
          </Table.Head>
          <Table.Body>
            {
              data.map((row) => (
                <ProblemRow data={row}/>
              ))
            }
          </Table.Body>
        </Table>
      </div>
      <Join>
        <Button onClick={() => updatePageOrSize({page: page - 1})} className="join-item px-[10px]">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18">
            <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </Button>

      </Join>
    </>
  )
    ;
}
