import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import '@/tailwind.css';

const Toaster = dynamic(
  async () => ({
    default: (await import('react-hot-toast')).Toaster,
  }),
  { ssr: false },
);

export const metadata: Metadata = {
  title: 'Next Online Judge',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
