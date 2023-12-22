'use client';

import React, { useEffect } from 'react';
import useGameControls from './Controls';

const Game = () => {
  const { playerPosition, controls } = useGameControls();

  useEffect(() => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

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
      drawPlayer();
      requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    gameLoop();
  }, [playerPosition]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <canvas
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
