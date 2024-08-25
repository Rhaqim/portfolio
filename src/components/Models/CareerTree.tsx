'use client';

import React, { useRef } from 'react';
import * as Three from 'three';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshDistortMaterial } from '@react-three/drei';

import CareerFruit from './CareerFruit';

const Branch = ({
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
        args={[0.1, 0.1, scale, 32]}
        rotation={
          rotation
            ? new Three.Euler(rotation[0], rotation[1], rotation[2])
            : undefined
        }
      >
        <MeshDistortMaterial color={color} attach="material" />
      </Cylinder>

      {/* Render fruits at the top of branch */}
      {fruits &&
        fruits.length > 0 &&
        fruits.map((fruit, index) => (
          <CareerFruit
            key={index}
            position={fruit.position ?? [0, scale / 2, 0]}
            title={fruit.title}
            info={fruit.info}
          />
        ))}

      {/* Render child branches */}
      {branches &&
        branches.length > 0 &&
        branches.map((branch, index) => (
          <Branch
            key={index}
            position={[0, scale / 2, 0]} // Position child branches relative to this branch's top
            scale={branch.scale}
            rotation={branch.rotation}
            color={branch.color}
            fruits={branch.fruits}
            branches={branch.branches} // Recursively render any sub-branches
          />
        ))}
    </group>
  );
};

const CareerTree = () => {
  const treeRef = useRef<Three.Group>(null);

  // Optionally, you can animate the tree to grow or sway
  useFrame(() => {
    if (!treeRef.current) return;
    treeRef.current.rotation.y += 0.001;
  });

  return (
    <group ref={treeRef} position={[0, -2, 0]}>
      {/* Trunk */}
      {/* <Branch position={[0, 1, 0]} scale={4} color="brown" /> */}

      {/* Branches */}
      {/* <Branch
        position={[0, 3, 0]}
        scale={2}
        rotation={[0, 0, Math.PI / 4]}
        color="green"
      />
      <Branch
        position={[0, 3, 0]}
        scale={2}
        rotation={[0, 0, -Math.PI / 4]}
        color="green"
      />
      <Branch
        position={[1, 3, 0]}
        scale={1.5}
        rotation={[0, 0, Math.PI / 6]}
        color="green"
      />
      <Branch
        position={[-1, 3, 0]}
        scale={1.5}
        rotation={[0, 0, -Math.PI / 6]}
        color="green"
        fruits={[
          { title: 'React', info: 'Frontend library', position: [0, 0.5, 0] },
          { title: 'Node.js', info: 'Backend runtime', position: [0, -0.5, 0] },
        ]}
      /> */}

      {/* More branches representing skills, languages, etc. */}
        {/* Root Branch */}
        <Branch
          position={[0, 1, 0]}
          scale={4}
          color="brown"
          fruits={[
            { title: 'Career Start', info: 'This is where it all began.' },
          ]}
          branches={[
            {
              position: [0, 2, 0],
              scale: 2,
              rotation: [0, 0, Math.PI / 4],
              color: 'green',
              fruits: [
                {
                  title: 'Programming',
                  info: 'Growth in languages like Go, Rust, Python.',
                },
              ],
              branches: [
                {
                  position: [0, 1, 0],
                  scale: 1.5,
                  rotation: [0, 0, Math.PI / 6],
                  color: 'green',
                  fruits: [
                    { title: 'Go', info: 'Experience with Go programming.' },
                  ],
                },
                {
                  position: [0, 1, 0],
                  scale: 1.5,
                  rotation: [0, 0, -Math.PI / 6],
                  color: 'green',
                  fruits: [
                    {
                      title: 'Rust',
                      info: 'Experience with Rust programming.',
                    },
                  ],
                },
              ],
            },
            {
              position: [0, 2, 0],
              scale: 2,
              rotation: [0, 0, -Math.PI / 4],
              color: 'green',
              fruits: [
                {
                  title: 'Web Development',
                  info: 'Growth in web technologies.',
                },
              ],
            },
          ]}
        />
    </group>
  );
};

export default CareerTree;
