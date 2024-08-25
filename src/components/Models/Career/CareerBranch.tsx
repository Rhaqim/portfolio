'use client';

import React from 'react';
import * as Three from 'three';
import { Cylinder, MeshDistortMaterial, Html } from '@react-three/drei';

import CareerFruit from './CareerFruit';

const getRandomOffset = (scale: number) => {
  const x = (Math.random() - 0.5) * 0.2 * scale; // Slight random offset for x
  const z = (Math.random() - 0.5) * 0.2 * scale; // Slight random offset for z
  return [x, z];
};

const CareerBranch = ({
  title,
  position,
  scale,
  rotation,
  color,
  fruits,
  branches,
}: Branch) => {
  return (
    <group position={new Three.Vector3(position[0], position[1], position[2])}>
      {/* Main branch cylinder */}
      <Cylinder
        args={[0.1, 0.1, scale, 12]}
        rotation={
          rotation
            ? new Three.Euler(rotation[0], rotation[1], rotation[2])
            : undefined
        }
      >
        <MeshDistortMaterial color={color} attach="material" />
      </Cylinder>

      {/* Title label */}
      <Html center>
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '4px',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center',
          }}
        >
          {title}
        </div>
      </Html>

      {/* Render fruits at the top of branch */}
      {/* {fruits &&
        fruits.length > 0 &&
        fruits.map((fruit, index) => (
          <CareerFruit
            key={index}
            // position={fruit.position ?? [0, scale / 2, 0]}
            position={
              fruit.position ?? [0, scale / 2 + Math.random() * 0.1 * scale, 0]
            } // Randomize fruit position around the branch top
            title={fruit.title}
            info={fruit.info}
          />
        ))} */}

      {/* Render child branches */}
      {branches &&
        branches.length > 0 &&
        branches.map((branch, index) => {
          const [xOffset, zOffset] = getRandomOffset(scale);
          return (
            <CareerBranch
              key={index}
              title={branch.title}
              // position={[0, scale / 2, 0]} // Position child branches relative to this branch's top
              position={[xOffset, scale / 2, zOffset]} // Offset the child branches slightly from the top
              scale={branch.scale}
              rotation={branch.rotation}
              color={branch.color}
              fruits={branch.fruits}
              branches={branch.branches} // Recursively render any sub-branches
            />
          );
        })}
    </group>
  );
};

export default CareerBranch;
