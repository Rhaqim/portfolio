'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { Actions, PlayerableCharacters } from '../../types/players.type';

const characters = Object.values(PlayerableCharacters);

interface CharacterSelectProps {
  onSelectedCharacter: (character: PlayerableCharacters) => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onSelectedCharacter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    const loadImage = (
      character: PlayerableCharacters,
    ): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = `/game/sprites/${character}/${Actions.Idle}.png`;
      });
    };

    const animateCharacter = async (character: PlayerableCharacters) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let image = await loadImage(character);

      const frameWidth = 128;
      const frameHeight = 128;

      const numFrames = 6;

      let currentFrame = 0;

      const framesPerRow = image.width / frameWidth;

      const drawFrame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const row = Math.floor(currentFrame / framesPerRow);
        const col = Math.floor(currentFrame % framesPerRow);

        ctx.drawImage(
          image,
          col * frameWidth,
          row * frameHeight,
          frameWidth,
          frameHeight,
          40,
          0,
          frameWidth,
          frameHeight,
        );

        currentFrame = ++currentFrame % numFrames;
      };

      setInterval(drawFrame, 100);
    };

    animateCharacter(currentCharacter);
  }, [currentCharacter, onSelectedCharacter]);

  return (
    <div id="character-select" className="max-w-full mx-auto px-4 py-8">
      <div className="relative flex items-center justify-between">
        <button className="mr-4" onClick={handleSlideLeft}>
          <ArrowLeft className="w-6 h-6" />{' '}
        </button>

        <motion.div
          key={currentCharacter}
          initial={{ x: -1000 }}
          animate={{ x: 0 }}
          exit={{ x: 1000 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <canvas
            ref={canvasRef}
            id="gameCanvas"
            width="200"
            height="200"
          ></canvas>
        </motion.div>

        <button className="ml-4" onClick={handleSlideRight}>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CharacterSelect;
