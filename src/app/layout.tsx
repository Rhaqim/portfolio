import { Metadata } from 'next';
import { Goldman } from 'next/font/google';

import AppLayout from '@/ui/Layout';

import './globals.css';

const inter = Goldman({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rhaqim.com/'),
  title: 'Rhaqim',
  description:
    'The chronicles and musings of one Rhaqim, a software engineer and aspiring entrepreneur.',
  authors: { url: 'https://rhaqim.com/', name: 'Rhaqim' },
  creator: 'Rhaqim',
  icons: '/favicon.ico',
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@site',
    creator: '@ivxnio',
    images: '/images/business.png',
    description:
      'The chronicles and musings of one Rhaqim, a software engineer and aspiring entrepreneur.',
  },
  openGraph: {
    title: 'Rhaqim',
    description:
      'The chronicles and musings of one Rhaqim, a software engineer and aspiring entrepreneur.',
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
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    title: 'Rhaqim',
    startupImage: '/images/business.png',
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
