'use client';

import LayoutBase from '@/components/LayoutBase';
import React from 'react';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/life', label: 'Life' },
];

export default function BalanceLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <LayoutBase navLinks={navLinks}>{children}</LayoutBase>
    </section>
  );
}
