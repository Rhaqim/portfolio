'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Scene = ({ children }: { children: React.ReactNode }) => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {children}
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
