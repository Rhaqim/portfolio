'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowArcLeft } from '@phosphor-icons/react';

const BackLink = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>
      <ArrowArcLeft
        size={30}
        className="hover:scale-110 ease-in-out duration-300"
      />
    </button>
  );
};

export default BackLink;
