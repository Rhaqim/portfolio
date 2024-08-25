'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Branch, { BranchProps } from './Branch2';

const Tree: React.FC<{
  data: BranchProps;
}> = ({ data }) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Branch {...data} length={4} thickness={0.3} depth={0} maxDepth={10} />
    </Canvas>
  );
};

export default Tree;
