'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const BackLink = () => {
  const router = useRouter();

  return (
    <div>
      <button
        className="absolute top-0 left-0 p-4 text-2xl font-bold text-white transition duration-300 ease-in-out transform bg-black rounded-full hover:scale-110 hover:bg-gray-800"
        onClick={() => router.back()}
      >
        {'<'}
      </button>
    </div>
  );
};

export default BackLink;
