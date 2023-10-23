"use client";

import { AuthModal } from "@/components/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useInfo from "@/hooks/use-info";

export default function AuthPage() {
  const { userInfo } = useInfo();
  const searchParams = useSearchParams();
  const path = searchParams.get("path");
  const router = useRouter();

  useEffect(() => {
    if (userInfo?.id) {
      router.push(path ?? "/");
    }
  });

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div className="text-5xl font-bold">NOJ</div>
        {path ? (
          <div className="text-sm mb-10">请登录后再继续执行操作</div>
        ) : (
          ""
        )}
      </div>
      <div className="p-10 rounded-xl shadow-xl border-2 border-gray-100 w-[450px] flex flex-col">
        <AuthModal hide={() => router.push(path ?? "/")} />
      </div>
    </div>
  );
}
