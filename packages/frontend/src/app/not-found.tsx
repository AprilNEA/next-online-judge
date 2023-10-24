"use client";

import Link from "next/link";
import { Button } from "react-daisyui";
import ReturnIcon from "@/icons/return.svg";

export default function NotFound() {
  return (
    <>
      <Link href="/" className="absolute p-3 z-50">
        <Button className="btn-ghost flex col text-lg items-center"><ReturnIcon />RETURN TO NOJ</Button>
      </Link>
      <div className="flex flex-col items-center justify-center w-screen h-[70%] absolute">
        <div className="flex justify-center items-center">
          <div className="text-[5.5rem] font-extrabold mr-3">NOJ</div>
          <div>
            <div className="text-4xl">ERROR</div>
            <div className="font-extralight text-xl">404 Not Found</div>
          </div>
        </div>
        <div className="text-lg font-bold">
          NOJ could not find your requested resource.
        </div>
      </div>
    </>
  );
}
