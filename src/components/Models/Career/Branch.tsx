'use client';

import React from 'react';

interface BranchProps {
  length?: number;
  thickness?: number;
  depth?: number;
  maxDepth?: number;
}

const Branch: React.FC<BranchProps> = ({
  length = 2,
  thickness = 0.2,
  depth = 0,
  maxDepth = 5,
}) => {
  // Base condition to stop recursion
  if (depth > maxDepth) return null;

  // Generate random rotation and branch count
  const branchCount = depth === 0 ? 2 : Math.floor(Math.random() * 3) + 1;
  const angle = (Math.PI / 4) * (depth % 2 === 0 ? 1 : -1);

  return (
    <group>
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness * 0.7, length, 12]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {new Array(branchCount).fill(null).map((_, index) => (
        <group
          key={index}
          rotation={[angle, (index * Math.PI * 2) / branchCount, 0]}
          position={[0, length, 0]}
        >
          <Branch
            length={length * 0.7}
            thickness={thickness * 0.7}
            depth={depth + 1}
            maxDepth={maxDepth}
          />
        </group>
      ))}

      {depth === maxDepth && (
        <mesh position={[0, length, 0]}>
          <sphereGeometry args={[thickness * 0.5, 12, 12]} />
          <meshStandardMaterial color="#FF6347" />
        </mesh>
      )}
    </group>
  );
};

export default Branch;
