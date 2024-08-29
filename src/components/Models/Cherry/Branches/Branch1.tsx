'use client';

import React, { useRef } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

export interface BranchProps {
  title: string;
  description?: string;
  branches?: BranchProps[];
  fruits?: string[];
  length?: number;
  thickness?: number;
  depth?: number;
  maxDepth?: number;
}

const Branch1 = ({
  title,
  description,
  branches,
  fruits,
  length = 2,
  thickness = 0.2,
  depth = 0,
  maxDepth = 4,
}: BranchProps) => {
  const group = useRef<THREE.Group>(null);

  const { nodes } = useGLTF('/models/tree/Tree 10.glb');

  if (!nodes) {
    return null;
  }

  // Base condition to stop recursion
  if (depth > maxDepth) return null;

  // Generate random rotation and branch count
  const branchCount = depth === 0 ? 2 : Math.floor(Math.random() * 3) + 1;
  const angle = (Math.PI / 4) * (depth % 2 === 0 ? 1 : -1);

  return (
    <group ref={group} position={new Vector3(0, 0, 0)}>
      <primitive object={nodes.Scene} position={[0, length / 2, 0]} />
      
      <Html position={[0, length, 0]}>
        <div style={{ color: 'white', fontSize: '10px' }}>{title}</div>
      </Html>

      {branches &&
        branches.map((branch, index) => (
          <group
            key={index}
            rotation={[angle, (index * Math.PI * 2) / branchCount, 0]}
            position={[0, length, 0]}
          >
            <Branch1
              {...branch}
              length={length * 0.7}
              thickness={thickness * 0.7}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          </group>
        ))}

      {depth === maxDepth && (
        <primitive object={nodes.Scene} position={[0, length, 0]} />
      )}
    </group>
  );
};

export default Branch1;
