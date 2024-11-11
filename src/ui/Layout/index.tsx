import React from 'react';

import NavBar from './NavBar';
import Cursor from './Cursor';
import { CursorProvider } from '@/context/Cursor.context';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen min-h-screen">
      <CursorProvider>
        <Cursor />
        <NavBar />
        {children}
      </CursorProvider>
    </div>
  );
};

export default AppLayout;
