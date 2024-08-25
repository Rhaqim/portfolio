'use client';

import React, { useState } from 'react';
import * as Three from 'three';
import { Sphere, MeshDistortMaterial, Html } from '@react-three/drei';

const CareerFruit = ({
  position,
  title,
  info,
}: {
  position: number[];
  title: string;
  info: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <group position={new Three.Vector3(position[0], position[1], position[2])}>
      <Sphere args={[0.2, 8, 8]} onClick={() => setIsOpen(!isOpen)}>
        <MeshDistortMaterial color="rgba(210,10,46,0.5)" attach="material" />
      </Sphere>
      {/* <Html center>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '10px',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center',
          }}
        >
          {title}
        </div>
      </Html> */}
      {isOpen && (
        <Html style={{ pointerEvents: 'all' }}>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '10px',
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <h3>{title}</h3>
            <p>{info}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

export default CareerFruit;
