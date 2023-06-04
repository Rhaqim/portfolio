import EssayWithIcons from '@/components/WordMappings';
import React from 'react';

const page = () => {
  const essayText =
    'This is an essay about Go, Rust, Python, Docker, React, and Kubernetes.';
  return (
    <div>
      <EssayWithIcons essayText={essayText} />
    </div>
  );
};

export default page;
