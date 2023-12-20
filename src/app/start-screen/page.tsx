'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CharacterSelect from '@/components/Common/CharacterSelect';

const StartScreen = () => {
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState<{icon: string, name: string} | null>(null);

  

  return (
    <div>
      <h1>Life and Works of Rhaqim!</h1>
      {/* Character select */}
      <CharacterSelect characters={[]} onSelectedCharacter={setSelectedCharacter}/>
      <p>Selected Character: {selectedCharacter?.name}</p>

      {/* Buttons */}
      <button onClick={() => router.push('/')}>Start</button>
      <button onClick={() => router.push('/')}>Settings</button>
      <button onClick={() => router.push('/')}>Contact</button>
      <button onClick={() => router.push('/')}>Character Select</button>
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
