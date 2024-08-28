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
      <div style={{ color: 'white', fontSize: '5px' }}>{name}</div>
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
  maxDepth = 4,
}) => {
  console.log(
    'Branch',
    title,
    description,
    branches,
    fruits,
    length,
    thickness,
    depth,
    maxDepth,
  );
  // Base condition to stop recursion
  if (depth > maxDepth) return null;

  const branchCount = branches ? branches.length : 0;
  const baseAngle = Math.PI / 4; // Base angle for rotation
  const angleVariance = Math.PI / 8; // Variance to add randomness

  return (
    <group>
      {/* Branch geometry */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness * 0.7, length, 12]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      <Html position={[0, length, 0]}>
        <div style={{ color: 'white', fontSize: '10px' }}>{title}</div>
      </Html>

      {/* Recursively add branches */}
      {branches &&
        branches.map((branch, index) => {
          const angle = baseAngle + (Math.random() - 0.5) * angleVariance; // Controlled random angle
          const rotationY = (index * Math.PI * 5) / branchCount; // Spread around Y-axis
          return (
            <group
              key={index}
              rotation={[angle, -rotationY, 0]}
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
          );
        })}

      {depth === maxDepth && (
        <mesh position={[0, length, 0]}>
          <sphereGeometry args={[thickness * 0.5, 12, 12]} />
          <meshStandardMaterial color="#FF6347" />
        </mesh>
      )}

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
