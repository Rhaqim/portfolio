'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Anim from './Anim';

const images = [
  'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1179&q=80',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1179&q=80',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1179&q=80',
];

const randomPosition = () => {
  const maxDistance = 200; // Adjust the maximum distance from the center
  const x = -Math.random() * maxDistance - maxDistance / 10;
  const y = Math.random() * maxDistance - maxDistance / 10;
  return { x, y };
};

const BurstAnimation = () => {
  const artefacts = [
    {
      name: 'Artefact 1',
      description: 'This is the first artefact',
      arteface: <Anim />,
    },
    {
      name: 'Artefact 2',
      description: 'This is the second artefact',
      arteface: <Anim />,
    },
    {
      name: 'Artefact 3',
      description: 'This is the third artefact',
      arteface: <Anim />,
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [middleX, setMiddleX] = useState(0);
  const [middleY, setMiddleY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    // Initial size on mount
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const calculateMiddlePoint = () => {
      setMiddleX(screenWidth / 2);
      setMiddleY(screenHeight / 2);
    };

    calculateMiddlePoint();
  }, [screenWidth, screenHeight]);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-transparent z-0"
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519972064555-542444e71b54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {artefacts.map((imageUrl, index) => (
          <motion.div
            key={index}
            variants={imageVariants}
            initial={{
              opacity: 1,
              scale: 0.2,
              x: 0, // Start the artifacts from the center of the screen
              y: 0, // Start the artifacts from the center of the screen
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: randomPosition().x, // Spread out the artifacts horizontally
              y: randomPosition().y, // Spread out the artifacts vertically
            }}
            transition={{
              type: 'slide',
              damping: 10,
              stiffness: 100,
              duration: 3,
              delay: index * 0.2,
            }}
            style={{
              // backgroundImage: `url('${imageUrl}')`,
              width: '200px',
              height: '200px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              left: `calc(${middleX}px - 100px)`, // Adjust the left position to center the artifacts horizontally
              top: `calc(${middleY}px - 100px)`, // Adjust the top position to center the artifacts vertically
            }}
          >
            {artefacts[index].arteface}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BurstAnimation;
