'use client';

import React, { useState } from 'react';

interface ActionMusicProps {
  filePath: string;
}

const ActionMusic: React.FC<ActionMusicProps> = ({ filePath }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    const audio = new Audio(filePath);
    audio.play();
    setIsPlaying(true);
  };

  return (
    <div>
      <button onClick={playAudio}>Play Music</button>
      {isPlaying && <div>Now playing: {filePath}</div>}
    </div>
  );
};

export default ActionMusic;
