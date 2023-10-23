"use client";

import { useEffect } from "react";
import { Card, Button } from "react-daisyui";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: string;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center">
      <Card className="mt-20 shadow-md hover:shadow-lg transition-shadow rounded-xl">
        <Card.Body className="flex max-w-[1300px] flex-col">
          <div className="font-bold text-4xl">An error occurred while processing your request</div>
          <div className="text-lg">
            Contact the administrators with the following information:
          </div>
          <div className="w-full bg-gray-100 rounded-md tetx-sm p-5 mb-2.5">{error}</div>
          <Card.Actions className="justify-end">
            {reset ? <Button onClick={() => reset()}>RETRY</Button> : ''}
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
