// components/ParallaxScene.js
import React, { useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Object3D, Raycaster } from 'three';

const useForwardRaycast = (obj: { current: Object3D | null }) => {
  const raycaster = useMemo(() => new Raycaster(), []);

  const pos = useMemo(() => new Vector3(), []);
  const dir = useMemo(() => new Vector3(), []);
  const scene = useThree((state) => state.scene);

  return () => {
    if (!obj.current) return [];
    raycaster.set(
      obj.current.getWorldPosition(pos),
      obj.current.getWorldDirection(dir),
    );
    return raycaster.intersectObjects(scene.children);
  };
};

const SceneContent = () => {
  const ref = useRef<Mesh>(null);
  const raycast = useForwardRaycast(ref);

  useFrame((state, delta) => {
    if (!ref.current) return;

    ref.current.rotation.y += 1 * delta;
    const intersections = raycast();
    console.log(intersections.length);
    //...do something here
  });

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const ParallaxScene = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <SceneContent />
    </Canvas>
  );
};

export default ParallaxScene;
