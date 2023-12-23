'use client';

import React, { useEffect, useRef } from 'react';
import Background from './Environment';
import useGameControls from './Controls';
import { get } from 'http';

const Game = () => {
  const { playerPosition, controls } = useGameControls();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const backgroundSize = 1000;
    const halfCanvasWidth = canvas.width / 2;
    const halfCanvasHeight = canvas.height / 2;

    const getBackgroundPosition = () => {
      const x = Math.min(
        Math.max(playerPosition.x - halfCanvasWidth, 0),
        backgroundSize - 20,
      );
      const y = Math.min(
        Math.max(playerPosition.y - halfCanvasHeight, 0),
        backgroundSize - 20,
      );

      return { x, y };
    };

    const drawPlayer = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(playerPosition.x, playerPosition.y, 50, 50);
    };

    const update = () => {
      // Update game state based on user input or other game logic
    };

    const gameLoop = () => {
      update();
      getBackgroundPosition();
      drawPlayer();
      requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    gameLoop();
  }, [playerPosition]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        id="gameCanvas"
        width="800"
        height="600"
        className="bg-white"
      ></canvas>
      <div>{controls}</div>
    </div>
  );
};

export default Game;
