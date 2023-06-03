'use client';

import LayoutBase from '@/components/LayoutBase';
import { navLinksList } from '@/utils';
import React from 'react';

export default function BalanceLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <LayoutBase navLinks={navLinksList('balance')}>{children}</LayoutBase>
    </section>
  );
}
