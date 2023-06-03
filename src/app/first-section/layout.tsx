'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '@/components/Nav';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/second-section', label: 'Second section' },
  { href: '/third-section', label: 'Third section' },
];

export default function SectionLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <AnimatePresence>
        <Nav navLinks={navLinks} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
