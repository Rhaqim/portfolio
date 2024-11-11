import { Metadata } from 'next';
import { Goldman } from 'next/font/google';

import './globals.css';
import AppLayout from '@/ui/Layout';

const inter = Goldman({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rhaqim.com/'),
  title: 'Rhaqim',
  description: "Rhaqim's personal website",
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@site',
    creator: '@ivxnio',
    images: '/images/business.png',
  },
  openGraph: {
    title: 'Rhaqim',
    description: "Rhaqim's personal website",
    images: [
      {
        url: '/images/business.png',
        width: 1200,
        height: 630,
        alt: 'Rhaqim',
      },
      {
        url: '/images/personal.png',
        width: 1200,
        height: 630,
        alt: 'Rhaqim',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
