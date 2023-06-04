import EssayWithIcons from '@/components/WordMappings';
import React from 'react';

const page = () => {
  const technologies = 'Go Python Rust React Docker Kubernetes.';
  return (
    <div className="h-screen">
      <div className="justify-center items-center">
        <EssayWithIcons essayText={technologies} />
      </div>
    </div>
  );
};

export default page;
