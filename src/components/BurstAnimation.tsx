import React from 'react';
import { motion } from 'framer-motion';

const images = [
  'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1179&q=80',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1179&q=80',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1179&q=80',
];

const randomPosition = () => {
  const maxDistance = 200; // Adjust the maximum distance from the center
  const x = Math.random() * maxDistance - maxDistance / 2;
  const y = Math.random() * maxDistance - maxDistance / 2;
  return { x, y };
};

const BurstAnimation = () => {
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

  const height = 200;
  const width = 200;
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((imageUrl, index) => (
          <motion.div
            key={index}
            variants={imageVariants}
            initial={{
              opacity: 1,
              scale: 0.2,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              ...randomPosition(),
            }}
            transition={{
              type: 'slide',
              damping: 10,
              stiffness: 100,
              duration: 3,
              delay: index * 0.2,
            }}
            style={{
              backgroundImage: `url('${imageUrl}')`,
              width: '200px',
              height: '200px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default BurstAnimation;
