// components/ParallaxScene.js
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';

const Star = ({
  position,
  velocity = new Vector3(
    Math.random() * 0.01 - 0.005,
    Math.random() * 0.01 - 0.005,
    Math.random() * 0.01 - 0.005,
  ),
}: {
  position: Vector3;
  velocity?: Vector3;
}) => {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    // Move the star with velocity
    if (ref.current) {
      ref.current.position.x += velocity.x;
      ref.current.position.y += velocity.y;
      ref.current.position.z += velocity.z;

      // Wrap stars around the screen when they go out of view
      if (
        ref.current.position.x > 10 ||
        ref.current.position.x < -10 ||
        ref.current.position.y > 10 ||
        ref.current.position.y < -10 ||
        ref.current.position.z > 10 ||
        ref.current.position.z < -10
      ) {
        ref.current.position.x = Math.random() * 20 - 10;
        ref.current.position.y = Math.random() * 20 - 10;
        ref.current.position.z = Math.random() * 20 - 10;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );
};

const ParallaxScene = () => {
  const [stars] = useState(() =>
    [...Array(500)].map(() => ({
      position: new Vector3(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
      ),
      velocity: new Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
      ),
    })),
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <SceneContent stars={stars} />
      </Canvas>
    </div>
  );
};

const SceneContent = ({
  stars,
}: {
  stars: { position: Vector3; velocity: Vector3 }[];
}) => {
  return (
    <>
      <ambientLight />
      {stars && stars.map((star, index) => (
        <Star key={index} position={star.position} velocity={star.velocity} />
      ))}
    </>
  );
};

export default ParallaxScene;
