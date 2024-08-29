'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Three from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import CareerTree from './Tree';
import TrunkModel from '../Cherry/Trunk';

const Scene = () => {
  const cameraRef = useRef<Three.PerspectiveCamera>(null);

  const [cameraPosition, setCameraPosition] = useState(
    new Three.Vector3(0, 0, 0),
  );

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
    <>
      <Canvas>
        <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 4]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <CameraPositionLogger setCameraPosition={setCameraPosition} />
        <TrunkModel position={[0, -2.5, -1.7]} scale={[2, 2, 2]} />
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
        <div>X: {cameraPosition.x.toFixed(2)}</div>
        <div>Y: {cameraPosition.y.toFixed(2)}</div>
        <div>Z: {cameraPosition.z.toFixed(2)}</div>
      </div>
    </>
  );
};

export default Scene;

const CameraPositionLogger = ({
  setCameraPosition,
}: {
  setCameraPosition: (position: Three.Vector3) => void;
}) => {
  const { camera } = useThree();

  useFrame(() => {
    // Update the state with the camera position on every frame
    setCameraPosition(camera.position.clone());
  });

  return null;
};
