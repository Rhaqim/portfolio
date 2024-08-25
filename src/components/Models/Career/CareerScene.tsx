'use client';

import React, { useEffect, useRef } from 'react';
import * as Three from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import CareerTree from './Tree';

const Scene = () => {
  const cameraRef = useRef<Three.PerspectiveCamera>(null);

  useEffect(() => {
    let start = 5;
    const animate = () => {
      if (start > 1) {
        start -= 0.05;
        if (cameraRef.current) cameraRef.current.position.y = start;
      }
    };
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  

  return (
      <CareerTree data={CareerBranch} />
    // <Canvas>
    //   <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 5, 5]} />
    //   <ambientLight />
    //   <pointLight position={[10, 10, 10]} />
    //   <OrbitControls />
    // </Canvas>
  );
};

export default Scene;


// components/TreeData.tsx
export const CareerBranch = {
  title: 'Career Paths',
  description: 'Explore various career paths and their associated skills.',
  branches: [
    {
      title: 'Backend Engineer',
      description: 'Develop and maintain server-side applications that power the client-side applications.',
      branches: [
        {
          title: 'Database Management',
          fruits: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
        },
        {
          title: 'Server-Side Frameworks',
          fruits: ['Express.js', 'Django', 'Flask', 'Spring Boot'],
        },
        {
          title: 'API Development',
          fruits: ['REST', 'GraphQL', 'gRPC'],
        },
      ],
    },
    {
      title: 'Frontend Engineer',
      description: 'Develop and maintain client-side applications that interact with the server-side applications.',
      branches: [
        {
          title: 'Web Development',
          fruits: ['HTML', 'CSS', 'JavaScript'],
        },
        {
          title: 'Frontend Frameworks',
          fruits: ['React', 'Angular', 'Vue'],
        },
        {
          title: 'Mobile Development',
          fruits: ['React Native', 'Flutter', 'Swift'],
        },
      ],
    },
    {
      title: 'Writing',
      description: 'Create written content for various mediums such as blogs, articles, and social media.',
      branches: [
        {
          title: 'Content Creation',
          fruits: ['Blogs', 'Articles', 'Social Media Posts'],
        },
        {
          title: 'Copywriting',
          fruits: ['Advertising', 'Marketing', 'Branding'],
        },
        {
          title: 'Editing',
          fruits: ['Proofreading', 'Grammar', 'Style'],
        },
      ],
    },
  ],
};
