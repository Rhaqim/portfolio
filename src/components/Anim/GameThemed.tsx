'use client';

// GameThemedAnimations.tsx
import React from 'react';
import { motion, useAnimation } from 'framer-motion';

const GameThemedAnimations: React.FC = () => {
  const controls = useAnimation();

  // Define animation variants
  const animationVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  // Function to trigger animation
  const startAnimation = async () => {
    await controls.start('animate');
    await controls.start('exit');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Game-Themed Animations</h1>

      <motion.div
        initial="initial"
        animate={controls}
        exit="exit"
        variants={animationVariants}
        transition={{ duration: 0.5 }}
        className="bg-gray-200 p-8 rounded-md shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Game Element Animation</h2>

        {/* Gamified Animation */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="bg-blue-500 text-white p-4 rounded cursor-pointer"
          onClick={startAnimation}
        >
          Click me for animation!
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameThemedAnimations;
