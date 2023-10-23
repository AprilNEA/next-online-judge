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
import Error from "../../error";

export default function ProblemPage({
  params,
}: {
  params: { submissionId: string };
}) {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { data: submission, isLoading } = useSWR<ISubmission>(
    `/problem/status/${params.submissionId}`,
    (url: string) =>
      fetcher(url).then((res) => {
        if (!res.ok) {
          setIsError(true);
          return {
            error: true,
            errorInfo: res.status + " " + res.statusText,
          };
        } else {
          const result = res.json();
          setIsFinished(
            //@ts-ignore
            result.status != "Pending" &&
              //@ts-ignore
              result.status != "Running" &&
              //@ts-ignore
              result.status != "Compiling"
              ? true
              : false
          );
          return result;
        }
      }),
    {
      shouldRetryOnError: true,
      keepPreviousData: true,
      refreshInterval: isFinished || isError ? 0 : 1000,
      revalidateIfStale: isFinished || isError ? false : true,
      revalidateOnFocus: isFinished || isError ? false : true,
      revalidateOnReconnect: isFinished || isError ? false : true,
    }
  );

  return (
    <>
      {isLoading ? (
        <LoadingS />
        //@ts-ignore
      ) : !submission?.error ? (
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
      ) : (
        //@ts-ignore
        <Error error={submission.errorInfo} />
      )}
    </>
  );
}
