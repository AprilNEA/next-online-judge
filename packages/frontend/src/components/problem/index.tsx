"use client"

import useSWRImmutable from "swr";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useRouter} from "next/navigation";
import {useSearchParams} from 'next/navigation'
import {Table, Pagination, Button, Progress, Select} from "react-daisyui";
import {fetcher} from "@/utils";
import {IPager, IProblem} from "@/types";
import {useEffect, useState, useCallback} from "react";


function ProblemRow(props: { data: IProblem }) {
  const {id, title/*, passRate, difficulty*/} = props.data;

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

  //@ts-ignore
  const {data, isLoading} = useSWRImmutable<IPager<IProblem>>("/problem/all", (url) => fetcher(`${url}?` + `size=${size}` + `&page=${page}`)
  .then(res => {res.json()}));

  function updatePageOrSize({page, size}: {
    page?: number, size?: number
  }) {
    if(page) setPage(page);
    if(size) setSize(size);
  }

  if (isLoading) {
    return <div className="flex w-full justify-center mt-10"><Progress className="w-56" /></div>
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
            <span className="w-1/12">ID</span>
            <span>题目</span>
            <span className="w-1/5">WIP</span>
            <span className="w-1/12">WIP</span>
          </Table.Head>
          <Table.Body>
            { data && 
              data.data.map((row) => (
                <ProblemRow key={row.id} data={row}/>
              ))
            }
          </Table.Body>
        </Table>
      </div>
      <div className="flex w-full component-preview py-5 mt-5 items-center justify-between gap-2 font-sans">
        <div className="flex items-center mr-5">
          <div className="mr-3 text-sm">每页数量</div>
          <Select className="border-0" value={size} onChange={e => setSize(Number(e.target.value))}>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </div>
        <Pagination>
          <Button onClick={() => updatePageOrSize({page: 1})} className="join-item px-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18"><path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
          </Button>
          <Button className="join-item" onClick={() => {updatePageOrSize({page: 1})}}>1</Button>
          <Button onClick={() => updatePageOrSize({page: data?.totalPages})} className="join-item px-[10px]">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18"><path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z"/></svg>
          </Button>
        </Pagination>
      </div>

    </>
  )
    ;
}
