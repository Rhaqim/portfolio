'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import BackLink from '@/components/Common/BackLink';

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute top-1 left-2">
        <BackLink />
      </div>
      {children}
    </>
  );
}
