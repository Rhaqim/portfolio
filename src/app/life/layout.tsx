'use client';

import React from 'react';
import LayoutBase from '@/components/LayoutBase';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/balance', label: 'Balance' },
];

export default function LifeLayout({
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
