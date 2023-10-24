"use client";

import { fetcher } from "@/utils";
import useSWR from "swr";
import LoadingS from "@/app/loading";
import { ISubmission } from "@/types";
import AccountIcon from "@/icons/account.svg";
import TimeIcon from "@/icons/time.svg";
import JudgeinfoCard from "@/components/judgeinfo-card";
import LanguageIcon from "@/icons/language.svg";
import { useState } from "react";
import Guard from "@/app/guard";

export default function ProblemPage({
  params,
}: {
  params: { submissionId: string };
}) {
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const { data: submission, isLoading } = useSWR<ISubmission>(
    `/problem/status/${params.submissionId}`,
    (url: string) =>
      fetcher(url)
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) {
            let error = new Error(res.message);
            error.name = `NOJ ERROR ${res.code}`;
            throw error;
          } else {
            const result = res.data;
            setIsFinished(
              result.status != "Pending" &&
                result.status != "Running" &&
                result.status != "Compiling"
                ? true
                : false,
            );
            return result;
          }
        }),
    {
      shouldRetryOnError: true,
      keepPreviousData: true,
      refreshInterval: isFinished ? 0 : 1000,
      revalidateIfStale: isFinished ? false : true,
      revalidateOnFocus: isFinished ? false : true,
      revalidateOnReconnect: isFinished ? false : true,
    },
  );

  return (
    <Guard>
      {isLoading ? (
        <LoadingS />
      ) : (
        <>
          <div className="text-3xl flex whitespace-nowrap mt-5">
            Submission #{submission?.id}
          </div>
          <div className="text-sm mb-10 flex whitespace-nowrap mt-1">
            Problem {submission?.problemId} {submission?.problemTitle}
          </div>
          <div className="flex items-center mb-3">
            <AccountIcon />
            <div className="ml-3 text-lg">
              {submission?.userHandle} #{submission?.userId}
            </div>
          </div>
          <div className="flex items-center mb-3">
            <LanguageIcon />
            <div className="ml-3 text-lg">{submission?.language}</div>
          </div>
          <div className="flex items-center mb-10">
            <TimeIcon />
            <div className="ml-3 text-lg">
              {new Date(`${submission?.createdAt}+0000`).toString()}
            </div>
          </div>
          <div className="text-sm mb-3">评测点信息</div>
          <div className="flex flex-wrap justify-start">
            {/*@ts-ignore*/}
            <JudgeinfoCard id="1" status={submission?.status} />
          </div>
        </>
      )}
    </Guard>
  );
}
