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
}: {
  position: number[];
  scale: number;
  rotation?: number[];
  color: string;
  fruits?: Fruit[];
}) => {
  return (
    <group position={new Three.Vector3(position[0], position[1], position[2])}>
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
      {fruits && fruits.length > 0 ? (
        fruits.map((fruit, index) => (
          <CareerFruit
            key={index}
            position={fruit.position ?? [0, scale / 2, 0]}
            title={fruit.title}
            info={fruit.info}
          />
        ))
      ) : (
        <></>
      )}
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
      <Branch position={[0, 1, 0]} scale={4} color="brown" />

      {/* Branches */}
      <Branch
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
      />

      {/* More branches representing skills, languages, etc. */}
    </group>
  );
};

export default CareerTree;
