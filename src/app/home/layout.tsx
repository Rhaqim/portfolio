import React from 'react';

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <h1>The Header</h1>
      <nav></nav>

      {children}
      <h1>The Footer</h1>
    </section>
  );
}
