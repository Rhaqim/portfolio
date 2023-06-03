'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.nav className="flex justify-between items-center p-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border border-black p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              {link.label}
            </a>
          ))}
        </motion.nav>

        {children}
      </AnimatePresence>
    </section>
  );
}
