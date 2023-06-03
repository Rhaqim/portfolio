'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Nav from '@/components/Nav';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/first-section', label: 'First section' },
  { href: '/third-section', label: 'Third section' },
];

export default function SecondSectionLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <AnimatePresence>
        <Nav navLinks={navLinks} />

        {children}
      </AnimatePresence>
    </section>
  );
}
