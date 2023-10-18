"use client";

import useInfo from "@/hooks/use-info";
import Loading from "@/components/layout/loading"

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
