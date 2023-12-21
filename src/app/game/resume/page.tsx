'use client';

// Install required packages:
// npm install tailwindcss framer-motion react-three-fiber

// Resume.tsx
import React from 'react';
import { motion } from 'framer-motion';

const InteractiveResume: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Interactive Resume</h1>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gray-200 p-8 rounded-md shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Education</h2>
        <p>Bachelor&apos;s in Computer Science - Your University</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Skills</h2>
        <ul>
          <li>React.js</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Three.js</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default InteractiveResume;
