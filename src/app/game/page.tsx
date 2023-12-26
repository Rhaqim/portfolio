'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import CharacterSelect from '@/components/Game/CharacterSelect';
import WithMusic from '@/components/Music/WithMusic';
import { gameNavLinks } from '@/constants';
import { PlayerableCharacters } from '@/components/Game/players.type';

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

const StartScreen = () => {
  const [selectedCharacter, setSelectedCharacter] =
    useState<PlayerableCharacters | null>(null);

  return (
    <div className="max-w-full min-h-screen flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl text-center font-bold mb-6"
      >
        The Life and Works!
      </motion.h1>

      {/* Character Select */}
      <CharacterSelect onSelectedCharacter={setSelectedCharacter} />
      <p className="mt-4">
        Selected Character: {selectedCharacter || 'None selected'}
      </p>

      {/* Buttons */}
      {gameNavLinks.map((link) => (
        <Link
          className="bg-blue-500 text-white p-2 rounded mt-2 cursor-pointer w-[200px] hover:bg-blue-700 items-center text-center"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}

      {/* Hidden Audio Element for Background Music */}
      <WithMusic music_src="Stanislav_Barantsov_-_GiantDune.mp3" />
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
