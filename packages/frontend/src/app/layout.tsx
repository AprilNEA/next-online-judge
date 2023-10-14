import "@/globals.css";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const Toaster = dynamic(
  async () => ({
    default: (await import("react-hot-toast")).Toaster,
  }),
  { ssr: false },
);

export const metadata: Metadata = {
  title: "Next Online Judge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Toaster />
    </html>
  );
}
