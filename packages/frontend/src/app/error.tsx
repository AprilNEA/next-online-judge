"use client";

import { useEffect } from "react";
import { Card, Button } from "react-daisyui";
import Link from "next/link";

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

  return (
    <div className="flex justify-center">
      <Card className="mt-20 shadow-md hover:shadow-lg transition-shadow rounded-xl">
        <Card.Body className="flex max-w-[1300px] flex-col">
          <div className="font-bold text-3xl">
            An error occurred while processing your request
          </div>
          <div className="text-lg">
            Contact the administrators with the following information:
          </div>
          <div className="w-full bg-gray-100 rounded-md p-5 mb-5">
            <div className="text-lg ">{error.name}</div>
            <div className="text-sm mb-2.5 ">{error.message}</div>
            <p className="text-sm font-light">{error.digest}</p>
            <p className="text-sm font-light">{error.stack}</p>
          </div>

          <Card.Actions className="justify-end">
            {reset ? <Button onClick={() => reset()}>RETRY</Button> : ""}
            <Link href="/">
              <Button className="bg-black text-white hover:bg-gray-500">
                RETURN TO NOJ
              </Button>
            </Link>
          </Card.Actions>
        </Card.Body>
      </Card>
    </div>
  );
}
