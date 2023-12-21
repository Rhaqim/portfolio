'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Character {
  name: string;
  icon: string;
}

interface CharacterSelectProps {
  characters: Character[];
  onSelectedCharacter: (character: Character) => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({
  characters,
  onSelectedCharacter,
}) => {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);

  const handleSlideLeft = () => {
    setCurrentCharacterIndex((prevIndex) =>
      prevIndex === 0 ? characters.length - 1 : prevIndex - 1,
    );
  };

  const handleSlideRight = () => {
    setCurrentCharacterIndex((prevIndex) =>
      prevIndex === characters.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const currentCharacter = characters[currentCharacterIndex];

  useEffect(() => {
    onSelectedCharacter(currentCharacter);
  }, [currentCharacter, onSelectedCharacter]);

  return (
    <div id="character-select" className="max-w-full mx-auto px-4 py-8">
    <div className="relative flex items-center justify-between">
      <button className="mr-4" onClick={handleSlideLeft}>
        Slide Left
      </button>

      <motion.div
        key={currentCharacter.name}
        initial={{ x: -1000 }}
        animate={{ x: 0 }}
        exit={{ x: 1000 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        {/* <Image src={currentCharacter.icon} alt={currentCharacter.name} /> */}
        <h2>{currentCharacter.name ?? 'Rhaqim'}</h2>
      </motion.div>

      <button className="ml-4" onClick={handleSlideRight}>
        Slide Right
      </button>
    </div>
    </div>
  );
};

export default CharacterSelect;
