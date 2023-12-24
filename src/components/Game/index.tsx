'use client';

import React, { useEffect, useRef } from 'react';
import useGameControls from './Controls';

const Game = () => {
  const { playerPosition, controls } = useGameControls();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });
    };

    const drawBackground = async () => {
      if (!ctx) return;
      const img = await loadImage('/game/backgrounds/Summer1.png');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const drawPlayer = () => {
      if (!ctx) return;
      ctx.fillRect(playerPosition.x, playerPosition.y, 50, 50);
    };

    const update = () => {
      // Update game state based on user input or other game logic
    };

    const gameLoop = async () => {
      if (!ctx) return;
      await drawBackground(); // Wait for the background to be drawn
      update();
      drawPlayer();
      requestAnimationFrame(gameLoop);
    };

    // Start the game loop after the background image is loaded
    drawBackground().then(() => gameLoop());
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

const LoadGameBackground = ({ image }: { image: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawBackground = () => {
      if (!ctx) return;
      const img = new Image();
      img.src = image;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };

    drawBackground();
  }, [image]);

  return (
    <canvas
      ref={canvasRef}
      id="gameCanvas"
      width="800"
      height="600"
      // className="bg-white"
    ></canvas>
  );
};
