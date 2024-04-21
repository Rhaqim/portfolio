'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Color, Mesh, Group, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const GLBModel = ({
  numberOfPages,
  modelPath,
}: {
  numberOfPages: number;
  modelPath: string;
}) => {
  const bookRef = useRef<Group>(null);

  const { nodes, materials } = useGLTF(modelPath) as any;

  const rodCenter = materials.Metal03 as MeshStandardMaterial;
  const rod1 = materials['Metal03.001'] as MeshStandardMaterial;
  const rod2 = materials['Metal03.002'] as MeshStandardMaterial;
  const rod3 = materials['Metal03.003'] as MeshStandardMaterial;

  rodCenter.color = new Color(0.5, 0.5, 0.5);
  rod1.color = new Color(0.5, 0.5, 0.5);
  rod2.color = new Color(0.5, 0.5, 0.5);
  rod3.color = new Color(0.5, 0.5, 0.5);

  // Animation state for each page
  const [openPages, setOpenPages] = useState(Array(numberOfPages).fill(false));

  // Scroll position state
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (!bookRef.current) return;
    // Setup scroll listener
    const handleScroll = () => {
      // Calculate active section based on scroll position
      // Update setActiveSection accordingly
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <group ref={bookRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <primitive object={nodes.Scene} />
    </group>
  );
};

export default GLBModel;
