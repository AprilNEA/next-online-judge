"use client";

import useInfo from "@/hooks/use-info";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/components/layout/loading";

export default function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { userInfo, userInfoLoading } = useInfo();

  if (userInfoLoading) {
    return <Loading />;
  }

  if (userInfo && userInfo.status == "unauthorized") {
    router.push(`/auth?path=${pathname}`);
    return;
  }
  return <>{children}</>;
}
