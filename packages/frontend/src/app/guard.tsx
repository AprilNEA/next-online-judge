"use client";

import useInfo from "@/hooks/use-info";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/components/layout/loading";
import { useEffect } from "react";

export default function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { userInfo, userInfoLoading } = useInfo();

  if (userInfoLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (userInfo && userInfo.status == "unauthorized") {
      return router.push(`/auth?path=${pathname}`);
    }
  }, [userInfo, pathname]);

  return <>{children}</>;
}
