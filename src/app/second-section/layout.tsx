'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';

export default function SecondSectionLayout({
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
