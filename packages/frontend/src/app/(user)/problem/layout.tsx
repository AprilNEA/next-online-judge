"use client";

import useInfo from "@/hooks/use-info";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/app/loading";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo, userInfoLoading } = useInfo();
  const router = useRouter();
  const pathname = usePathname();
  if (userInfoLoading) return <Loading />;
  if (userInfo && userInfo.status == "unauthorized") {
    router.push(`/auth?path=${pathname}`);
    return;
  }
  return <>{children}</>;
}
