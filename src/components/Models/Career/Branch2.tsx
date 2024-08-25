'use client';

import React from 'react';
import { Html } from '@react-three/drei';

export interface FruitProps {
  name: string;
  position: [number, number, number];
  color?: string;
}

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

const Fruit: React.FC<FruitProps> = ({ name, position, color = '#FF6347' }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.2, 12, 12]} />
      <meshStandardMaterial color={color} />
    </mesh>

    <Html center>
      <div style={{ color: 'white', fontSize: '30px' }}>{name}</div>
    </Html>
  </group>
);

const Branch: React.FC<BranchProps> = ({
  title,
  description,
  branches,
  fruits,
  length = 2,
  thickness = 0.2,
  depth = 0,
  maxDepth = 3,
}) => {
  // Base condition to stop recursion
  if (depth > maxDepth) return null;

  // Generate random rotation and branch count
  const branchCount = branches ? branches.length : 0;
  const angle = (Math.PI / 4) * (depth % 2 === 0 ? 1 : -1);

  return (
    <group>
      {/* Branch geometry */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness * 0.7, length, 12]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      <Html position={[0, length, 0]}>
        <div style={{ color: 'white', fontSize: '30px' }}>{title}</div>
      </Html>

      {/* Recursively add branches */}
      {branches &&
        branches.map((branch, index) => (
          <group
            key={index}
            rotation={[angle, (index * Math.PI * 2) / branchCount, 0]}
            position={[0, length, 0]}
          >
            <Branch
              {...branch}
              length={length * 0.7}
              thickness={thickness * 0.7}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          </group>
        ))}

      {/* Fruits */}
      {/* {fruits &&
        fruits.map((fruit, index) => (
          <Fruit
            key={index}
            name={fruit}
            position={[0, length + index * 0.5, 0]}
          />
        ))} */}
    </group>
  );
};

export default Branch;
