'use client';

import { AnimatePresence } from 'framer-motion';
import React from 'react';

export default function ThirdSectionLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>

      <AnimatePresence>{children}</AnimatePresence>
    </section>
  );
}
