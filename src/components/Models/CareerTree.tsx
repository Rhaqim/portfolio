'use client';

import React, { useRef } from 'react';
import * as Three from 'three';

import CareerBranch from './CareerBranch';

const CareerTree = () => {
  const treeRef = useRef<Three.Group>(null);

  // Optionally, you can animate the tree to grow or sway
  // useFrame(() => {
  //   if (!treeRef.current) return;
  //   treeRef.current.rotation.y += 0.007;
  // });

  return (
    <group ref={treeRef} position={[0, -2, 0]}>
      {/* Root Branch */}
      <CareerBranch
        position={[0, 1, 0]}
        scale={4}
        color="brown"
        title="Root"
        branches={[
          {
            title: 'Software Development',
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
                title: 'Python',
                position: [0, 1, 0],
                scale: 1.5,
                rotation: [0, 0, Math.PI / 6],
                color: 'green',
                fruits: [
                  { title: 'Go', info: 'Experience with Go programming.' },
                ],
              },
              {
                title: 'Rust',
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
            title: 'Web Development',
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
