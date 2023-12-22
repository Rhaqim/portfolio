'use client';

import { useEffect, useState } from 'react';

const useGameControls = () => {
  const [playerPosition, setPlayerPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 400, y: 300 });

  const handleMove = (direction: 'left' | 'up' | 'right' | 'down') => {
    setPlayerPosition((prev) => ({
      x:
        direction === 'left'
          ? prev.x - 10
          : direction === 'right'
          ? prev.x + 10
          : prev.x,
      y:
        direction === 'up'
          ? prev.y - 10
          : direction === 'down'
          ? prev.y + 10
          : prev.y,
    }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          handleMove('left');
          break;
        case 'ArrowUp':
          handleMove('up');
          break;
        case 'ArrowRight':
          handleMove('right');
          break;
        case 'ArrowDown':
          handleMove('down');
          break;
        // handle WASD
        case 'w':
            handleMove('up')
            break
        case 'a':
            handleMove('left')
            break
        case 's':
            handleMove('down')
            break
        case 'd':
            handleMove('right')
            break
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const controls = (
    <div className="w-[200px] h-[150px]">
      <div className="flex flex-col items-center h-full w-full justify-between">
        <button onClick={() => handleMove('up')}>Up</button>
        <div className="flex flex-row justify-between w-full">
          <button onClick={() => handleMove('left')}>Left</button>
          <button onClick={() => handleMove('right')}>Right</button>
        </div>
        <button onClick={() => handleMove('down')}>Down</button>
      </div>
    </div>
  );

  return { controls, playerPosition };
};

export default useGameControls;
