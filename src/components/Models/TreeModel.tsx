'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

const Model = ({
  position,
  scale,
}: {
  position: number[];
  scale: number[];
}) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/models/island_tree_02_4k.gltf/island_tree_02_4k.gltf');

  return (
    <group
      ref={group}
      position={new Vector3(position[0], position[1], position[2])}
      scale={new Vector3(scale[0], scale[1], scale[2])}
    >
      {/* Access and render different sections of your model */}
      {/* <mesh geometry={nodes.section1.geometry} material={materials.material1} />
      <mesh geometry={nodes.section2.geometry} material={materials.material2} /> */}
      <primitive object={nodes.Scene} />
      {/* Add more sections as needed */}
    </group>
  );
};

export default Model;
