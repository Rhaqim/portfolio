'use client';

import React, { useRef } from 'react';
import { Color, Mesh, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const GLBModel = ({ modelPath }: { modelPath: string }) => {
  const modelRef = useRef<Mesh>(null);

  const { nodes, materials } = useGLTF(modelPath) as any;

  const rodCenter = materials.Metal03 as MeshStandardMaterial;
  const rod1 = materials['Metal03.001'] as MeshStandardMaterial;
  const rod2 = materials['Metal03.002'] as MeshStandardMaterial;
  const rod3 = materials['Metal03.003'] as MeshStandardMaterial;

  rodCenter.color = new Color(0.5, 0.5, 0.5);
  rod1.color = new Color(0.5, 0.5, 0.5);
  rod2.color = new Color(0.5, 0.5, 0.5);
  rod3.color = new Color(0.5, 0.5, 0.5);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={modelRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <primitive object={nodes.Scene} />
    </mesh>
  );
};

export default GLBModel;
