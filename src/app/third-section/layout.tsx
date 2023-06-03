'use client';

import Nav from '@/components/Nav';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/first-section', label: 'First section' },
  { href: '/second-section', label: 'Second section' },
];

export default function ThirdSectionLayout({
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
