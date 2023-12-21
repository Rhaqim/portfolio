'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CharacterSelect from '@/components/Common/CharacterSelect';
import WithMusic from '@/components/Music/WithMusic';
import { motion } from 'framer-motion';

const StartScreen = () => {
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState<{
    icon: string;
    name: string;
  } | null>(null);

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: '#4299e1',
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      backgroundColor: '#3182ce',
      transition: { duration: 0.3 },
    },
  };

  const characters = [
    {
      icon: '/images/characters/rhaqim.png',
      name: 'Castor',
    },
    {
      icon: '/images/characters/raiqim.png',
      name: 'Rhaqim',
    },
    {
      icon: '/images/characters/raiqim.png',
      name: 'John',
    },
    {
      icon: '/images/characters/raiqim.png',
      name: 'Ivan',
    },
  ];

  return (
    <div className="max-w-full min-h-screen flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6"
      >
        The Life and Works of Rhaqim!
      </motion.h1>

      {/* Character Select */}
      <CharacterSelect
        characters={characters}
        onSelectedCharacter={setSelectedCharacter}
      />
      <p className="mt-4">
        Selected Character: {selectedCharacter?.name || 'None selected'}
      </p>

      {/* Buttons */}
      <motion.a
        href="/home"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer"
      >
        Start
      </motion.a>

      <motion.a
        href="/settings"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-blue-500 text-white p-2 rounded mt-2 cursor-pointer"
      >
        Settings
      </motion.a>

      <motion.a
        href="/contact"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-blue-500 text-white p-2 rounded mt-2 cursor-pointer"
      >
        Contact
      </motion.a>

      {/* Hidden Audio Element for Background Music */}
      <WithMusic />
    </div>
  );
};

export default StartScreen;

// Helper functions to get/set character from/to cookies
const getCharacterFromCookies = (): string | null => {
  // Implement your logic to retrieve character from cookies
  // Return null if character is not found
  return null;
};

const saveCharacterToCookies = (character: string) => {
  // Implement your logic to save character to cookies
};
