import "@/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Online Judge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={inter.className}>
      <Header />
      <div className="max-w-[1200px] mx-auto px-[24px] py-5">
        {children}
      </div>
    </body>
  );
}
