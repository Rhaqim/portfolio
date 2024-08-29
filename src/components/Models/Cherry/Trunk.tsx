'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

const TrunkModel = ({
  position,
  scale,
}: {
  position: number[];
  scale: number[];
}) => {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += 0.0007;
  });

  const { nodes: trunkNodes } = useGLTF('/models/tree/trunk.glb');
  const { nodes: branch1Nodes } = useGLTF('/models/tree/Tree 1.glb');
  const { nodes: branch2Nodes } = useGLTF('/models/tree/Tree 3.glb');
  const { nodes: branch3Nodes } = useGLTF('/models/tree/Tree 4.glb');
  const { nodes: branch4Nodes } = useGLTF('/models/tree/Tree 5.glb');
  const { nodes: branch5Nodes } = useGLTF('/models/tree/Tree 6.glb');
  const { nodes: branch6Nodes } = useGLTF('/models/tree/Tree 7.glb');
  const { nodes: branch7Nodes } = useGLTF('/models/tree/Tree 8.glb');
  const { nodes: branch8Nodes } = useGLTF('/models/tree/Tree 9.glb');
  const { nodes: branch9Nodes } = useGLTF('/models/tree/Tree 10.glb');

  if (
    !trunkNodes ||
    !branch1Nodes ||
    !branch2Nodes ||
    !branch3Nodes ||
    !branch4Nodes ||
    !branch5Nodes ||
    !branch6Nodes ||
    !branch7Nodes ||
    !branch8Nodes ||
    !branch9Nodes
  ) {
    return null;
  }

  return (
    <group
      ref={group}
      position={new Vector3(position[0], position[1], position[2])}
      scale={new Vector3(scale[0], scale[1], scale[2])}
    >
      <primitive object={trunkNodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch1Nodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch2Nodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch3Nodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch4Nodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch5Nodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch6Nodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch7Nodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch8Nodes.Scene} position={[0, 0, 0]} />
      <primitive object={branch9Nodes.Scene} position={[0, 0, 0]} />
    </group>
  );
};

export default TrunkModel;
