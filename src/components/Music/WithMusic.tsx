'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play } from '@phosphor-icons/react';

const WithMusic: React.FC<{ music_src: string }> = ({ music_src }) => {
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
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="p-1 m-1 rounded-md shadow-md absolute top-1 right-0"
    >
      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="bg-blue-500 text-white p-2 rounded-full cursor-pointer"
      >
        {isPlaying ? (
          <Pause className="inline-block w-6 h-6" />
        ) : (
          <Play className="inline-block w-6 h-6" />
        )}
      </button>

      {/* Hidden Audio Element for Background Music */}
      <audio id="bgMusic" loop>
        <source src={`/music/${music_src}`} type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>
    </motion.div>
  );
};

export default WithMusic;
