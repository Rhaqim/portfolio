'use client';

import React, { useEffect } from 'react';
import { useAnimation, motion } from 'framer-motion';

const Page = () => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ y: 0 });
      await controls.start({ y: 0 });
      await controls.start({ y: 0 });
    };

    sequence();
  }, [controls]);

  return (
    <div className="h-screen w-full flex flex-row items-center justify-between p-2 relative">
      <div
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1680079640329-238b05dee3bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2900&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        className="relative z-10 bg-green-500 h-[94%] w-full m-1 hover:-translate-y-2 hover:scale-105 transition-all duration-300 rounded-md"
        
      >
        1st
      </div>
      <div
        className="relative z-10 bg-red-500 h-[94%] w-full m-1 hover:-translate-y-2 hover:scale-105 transition-all duration-300 rounded-md"
      >
        2nd
      </div>
      <div
        className="relative z-10 bg-yellow-500 h-[94%] w-full m-1 hover:-translate-y-2 hover:scale-105 transition-all duration-300 rounded-md"
        
      >
        3rd
      </div>
    </div>
  );
};

export default Page;
