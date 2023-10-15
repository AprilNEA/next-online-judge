import "@/globals.css";
import Header from "@/components/layout/client";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="mx-20 my-10">{children}</div>
    </>
  );
}
