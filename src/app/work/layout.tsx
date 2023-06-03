'use client';

import React from 'react';
import LayoutBase from '@/components/LayoutBase';
import { navLinksList } from '@/utils';

export default function WorkLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <LayoutBase navLinks={navLinksList('work')}>{children}</LayoutBase>
    </section>
  );
}
