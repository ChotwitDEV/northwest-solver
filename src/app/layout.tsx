// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-thai',
});

export const metadata: Metadata = {
  title: 'North-West Corner Solver | Transportation Model',
  description:
    'Interactive Transportation Problem Solver using the North-West Corner Method with Auto-Dummy Balancing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${inter.variable} ${notoSansThai.variable} font-sans antialiased bg-slate-100 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}