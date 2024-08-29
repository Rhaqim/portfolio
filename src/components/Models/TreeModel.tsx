'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

const TreeModel = ({
  position,
  scale,
}: {
  position: number[];
  scale: number[];
}) => {
  const group = useRef<THREE.Group>(null);
  // const { nodes, materials } = useGLTF('/models/island_tree_02_4k.gltf/island_tree_02_4k.gltf');
  const { nodes, materials } = useGLTF('/models/tree/Tree 2.glb');

  // Check if the nodes and materials are loaded correctly
  if (!nodes || !materials) {
    return null; // Render nothing if the model is not loaded correctly
  }

  console.log('nodes', nodes);

  console.log('materials', materials);

  return (
    <group
      ref={group}
      position={new Vector3(position[0], position[1], position[2])}
      scale={new Vector3(scale[0], scale[1], scale[2])}
    >
      <primitive object={nodes.Scene} />
      {Object.keys(nodes).map((key) => {
        const node = nodes[key];
        if (node.type === 'Mesh') {
          return (
            <mesh
              key={node.uuid}
              geometry={node.geometry}
              material={materials['Leaf_Prunus-cerasifera_bqm.002']}
              // material={materials[node.material.name]}
            />
          );
        } else if (node.type === 'Group') {
          return (
            <group
              key={node.uuid}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            >
              {node.children.map((child) => (
                <mesh
                  key={child.uuid}
                  geometry={child.geometry}
                  // material={materials[child.material.name]}
                  material={materials['Leaf_Prunus-cerasifera_bqm.002']}
                />
              ))}
            </group>
          );
        }
        return null;
      })}
    </group>
  );
};

export default TreeModel;

{
  /* <group
      ref={group}
      position={new Vector3(position[0], position[1], position[2])}
      scale={new Vector3(scale[0], scale[1], scale[2])}
    >

      <primitive object={nodes.Scene} />

    </group> */
}
