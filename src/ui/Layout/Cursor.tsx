'use client';

import React, { useEffect, useState } from 'react';
import { mix, motion } from 'framer-motion';

import { useCursor } from '@/context/Cursor.context';

const Cursor = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const { cursorVariant } = useCursor();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: cursorPosition.x - 20,
      y: cursorPosition.y - 20,
      backgroundColor: '#25797a99',
    },
    hover: {
      height: 80,
      width: 80,
      x: cursorPosition.x - 40,
      y: cursorPosition.y - 40,
      backgroundColor: '#25797a',
    },
    hoverWithText: {
      height: 80,
      width: 80,
      x: cursorPosition.x - 40,
      y: cursorPosition.y - 40,
      backgroundColor: '#25797a99',
    },
  };

  return (
    <motion.div
      variants={variants}
      animate={cursorVariant}
      className="cursor flex justify-items-center items-center w-20 h-20 rounded-full bg-[#25797a99] border-2 border-[#25797a]"
    >
      <div>
        {cursorVariant === 'hoverWithText' && (
          <p className="text-white text-sm p-2 text-center">Right click</p>
        )}
      </div>
    </motion.div>
  );
};

export default Cursor;
