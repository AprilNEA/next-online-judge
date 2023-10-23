import { HeaderAdmin } from "@/components/layout/header";
import AdminGuard from "@/app/admin/guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <HeaderAdmin />
      <div className="max-w-[1300px] mx-auto px-[24px]">{children}</div>
    </AdminGuard>
  );
}
