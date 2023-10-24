"use client";

import { useEffect } from "react";
import { Card, Button } from "react-daisyui";
import Link from "next/link";
import NotFound from "@/app/not-found";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if(error.name === 'NOJ_ERROR 40400') return <NotFound />;
  return (
    <div className="flex flex-col items-center justify-center w-screen h-[70%] absolute">
      <div className="flex justify-center items-center">
        <div className="text-[5.5rem] font-extrabold mr-3">NOJ</div>
        <div>
          <div className="text-4xl">ERROR</div>
          <div className="font-extralight text-xl">Maybe...retry?</div>
        </div>
      </div>
      <div className="text-lg font-bold">
        An error occurred while processing your request
      </div>
      <div className="text-sm">
        Contact the administrators with the following information
      </div>
      <div className="w-full bg-gray-100 rounded-xl p-5 mt-10 flex flex-col max-w-[600px]">
        <div className="text-lg ">{error.name}</div>
        <div className="text-sm mb-2.5">{error.message}</div>
        <div>
          <pre className="text-sm font-light w-full whitespace-pre-wrap break-all">
            {error.stack}
          </pre>
        </div>
      </div>

      <div className="flex mt-10">
        {reset ? <Button className="mr-3" onClick={() => reset()}>RETRY</Button> : ""}
        <Link href="/">
          <Button className="bg-black text-white hover:bg-gray-500">
            RETURN TO NOJ
          </Button>
        </Link>
      </div>
    </div>
  );
}
