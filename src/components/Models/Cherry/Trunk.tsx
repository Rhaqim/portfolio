'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

const TrunkModel = ({
  position,
  scale,
}: {
  position: number[];
  scale: number[];
}) => {
  const group = useRef<THREE.Group>(null);

  const { nodes } = useGLTF('/models/tree/Tree 10.glb');

  if (!nodes) {
    return null;
  }

  return (
    <group
      ref={group}
      position={new Vector3(position[0], position[1], position[2])}
      scale={new Vector3(scale[0], scale[1], scale[2])}
    >
      <primitive object={nodes.Scene} />
    </group>
  );
};

export default TrunkModel;
