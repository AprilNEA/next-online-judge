"use client";

import useInfo from "@/hooks/use-info";
import { Loading } from "react-daisyui";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo, userInfoLoading } = useInfo();

  if (userInfoLoading) {
    return <Loading />;
  }
  return <>{children}</>;
}
