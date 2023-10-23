import { Header } from "@/components/layout/header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="max-w-[1300px] mx-auto px-[24px]">{children}</div>
    </>
  );
}
