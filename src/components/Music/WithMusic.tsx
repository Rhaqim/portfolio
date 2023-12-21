'use client';

// WithMusic.tsx
// WithMusic.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WithMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    const audio = document.getElementById('bgMusic') as HTMLAudioElement;

    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="p-8 rounded-md shadow-md"
      >

        {/* Music Toggle Button */}
        <button
          onClick={toggleMusic}
          className="bg-blue-500 text-white p-2 rounded cursor-pointer"
        >
          {isPlaying ? 'Pause Music' : 'Play Music'}
        </button>

        {/* Hidden Audio Element for Background Music */}
        <audio id="bgMusic" loop>
          <source src="/music/Stanislav_Barantsov_-_GiantDune.mp3" type="audio/mp3" />
          Your browser does not support the audio tag.
        </audio>
      </motion.div>
    </div>
  );
};

export default WithMusic;
