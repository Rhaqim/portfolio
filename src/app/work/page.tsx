'use client';

import ParallaxScene from '@/components/Models/Stars2';
import React from 'react';

const page = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* <div className="fixed inset-0 flex items-center justify-center bg-black z-[-10] opacity-25"> */}
        <ParallaxScene />
      {/* </div> */}
    </div>
  );
};

export default page;
