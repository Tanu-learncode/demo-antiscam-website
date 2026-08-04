import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ANTISCAM - AI Protection',
  description: 'Antiscam AI protection experience',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-on-background">{children}</body>
    </html>
  );
}
