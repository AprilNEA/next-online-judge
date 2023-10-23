"use client";

import Link from "next/link";
import { Card, Button } from "react-daisyui";

export default function NotFound() {
  return (
    <div className="flex justify-center">
      <Card className="mt-20 shadow-md hover:shadow-lg transition-shadow rounded-xl">
        <Card.Body className="flex max-w-[1300px] flex-col">
          <div className="font-bold text-4xl">ERROR 404 Not Found</div>
          <div className="text-lg">
            NOJ could not find your requested resource.
          </div>
          <Card.Actions className="justify-end">
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
