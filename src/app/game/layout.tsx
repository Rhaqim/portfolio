'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import BackLink from '@/components/Common/BackLink';
import GameProvider from '@/context/Game.context';

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <GameProvider>
      <div className="absolute top-1 left-2">
        <BackLink />
      </div>
      {children}
    </GameProvider>
  );
}
