'use client';

import React, { createContext, useContext, useState } from 'react';
import { PlayerableCharacters } from '@/types/players.type';

type GameContextType = {
  selectedCharacter: PlayerableCharacters;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<PlayerableCharacters>>;
};

const GameContext = createContext<GameContextType>({
  selectedCharacter: PlayerableCharacters.Samurai,
  setSelectedCharacter: () => {},
});

export const useGameContext = () => useContext(GameContext);

const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<PlayerableCharacters>(
    PlayerableCharacters.Samurai,
  );

  return (
    <GameContext.Provider value={{ selectedCharacter, setSelectedCharacter }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
