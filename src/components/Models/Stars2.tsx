// components/ParallaxScene.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, Camera } from '@react-three/fiber';
import { Mesh, Vector3, Raycaster, Object3D, Vector2 } from 'three';

const useMouseRaycast = (
  mesh: { current: Mesh | Object3D | null },
  camera: Camera,
) => {
  const [mousePos, setMousePos] = useState(new Vector2());
  const [raycaster] = useState(() => new Raycaster());
  const [intersectedObject, setIntersectedObject] = useState<Object3D | null>(
    null,
  );

  const onMouseMove = (event: MouseEvent) => {
    // Update mouse position
    const { clientX, clientY } = event;
    const mouseVector = new Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
    );
    setMousePos(mouseVector);
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!mesh || !mesh.current) return;

    // Update raycaster
    raycaster.setFromCamera(mousePos, camera);

    // Perform raycasting
    const intersects = raycaster.intersectObject(mesh.current);

    // Update intersected object
    setIntersectedObject(intersects.length > 0 ? intersects[0].object : null);
  }, [mousePos, mesh, raycaster, camera]);

  return intersectedObject;
};

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

const Star = ({
  position,
  velocity,
  mousePosition,
}: {
  position: Vector3;
  velocity: Vector3;
  mousePosition: Vector3;
}) => {
  const ref = useRef<Mesh>(null);

  const raycast = useForwardRaycast(ref);

  useFrame(() => {
    if (ref.current) {
      //   ref.current.position.x += velocity.x;
      //   ref.current.position.y += velocity.y;
      //   ref.current.position.z += velocity.z;

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

      const intersections = raycast();
      if (intersections.length > 0) {
        const intersection = intersections[0];
        const distance = intersection.distance;
        const scale = Math.max(0, 1 - distance / 10);
        ref.current.scale.setScalar(scale);
      } else {
        ref.current.scale.setScalar(1);
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

const Stuff = ({
  color = 'red',
  position,
}: {
  color?: string;
  position?: Vector3;
}) => {
  const meshRef = useRef<Mesh>(null); // Create a ref for the mesh you want to intersect

  const { camera } = useThree(); // Get the camera from the context

  const intersectedObject = useMouseRaycast(meshRef, camera); // Use the hook to get the intersected object

  // This function is called every frame, you can use it to update the mesh or perform other actions
  useFrame(() => {
    // Example: Rotate the mesh if it's intersected by the mouse cursor
    if (!meshRef.current) return;

    if (intersectedObject === meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const ParallaxScene = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Stuff />
      <Stuff color="green" position={new Vector3(2, 0, 0)} />
      {/* <Star
        position={new Vector3(0, 0, 0)}
        velocity={new Vector3(0.01, 0.01, 0.01)}
        mousePosition={new Vector3()}
      /> */}
    </Canvas>
  );
};

export default ParallaxScene;
