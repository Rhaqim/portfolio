'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import CharacterSelect from '@/components/Common/CharacterSelect';
import WithMusic from '@/components/Music/WithMusic';
import { gameNavLinks } from '@/constants';

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

const AnimatedLink = ({ href, children }: { href: string; children: any }) => {
  return (
    <motion.div
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className="bg-blue-500 text-white p-2 rounded mt-2 cursor-pointer"
    >
      <Link href={href}>{children}</Link>
    </motion.div>
  );
};

const StartScreen = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<{
    icon: string;
    name: string;
  } | null>(null);

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
      <CharacterSelect onSelectedCharacter={setSelectedCharacter} />
      <p className="mt-4">
        Selected Character: {selectedCharacter?.name || 'None selected'}
      </p>

      {/* Buttons */}
      {gameNavLinks.map((link) => (
        <AnimatedLink href={link.href} key={link.href}>
          {link.label}
        </AnimatedLink>
      ))}

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
