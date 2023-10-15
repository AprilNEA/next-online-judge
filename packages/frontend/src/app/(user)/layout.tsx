import "@/globals.css";
import Header from "../../components/layout/header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto px-[24px]">{children}</div>
    </>
  );
}
