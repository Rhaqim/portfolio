'use client';

import React from 'react';
import LayoutBase from '@/components/Layout';
import { workNavLinks } from '@/constants';

export default function WorkLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBase navLinks={workNavLinks}>{children}</LayoutBase>;
}
