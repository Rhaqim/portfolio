'use client';

import React, { useEffect, useRef } from 'react';
import * as Three from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import CareerTree from './CareerTree';

const Scene = () => {
  const cameraRef = useRef<Three.PerspectiveCamera>(null);

  useEffect(() => {
    let start = 5;
    const animate = () => {
      if (start > 1) {
        start -= 0.05;
        if (cameraRef.current) cameraRef.current.position.y = start;
      }
    };
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 5, 5]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <CareerTree />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
