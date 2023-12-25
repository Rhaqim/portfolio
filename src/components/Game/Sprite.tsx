'use client';

import React, { useEffect, useRef } from 'react';

const Sprite = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const spriteImg = '/game/sprites/Samurai/Idle.png';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = spriteImg;

    const frameWidth = 128;
    const frameHeight = 128;

    const cols = 6;

    let currentFrame = 0;

    const framesPerRow = img.width / frameWidth;

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const row = Math.floor(currentFrame / framesPerRow);
      const col = Math.floor(currentFrame % framesPerRow);

      ctx.drawImage(
        img,
        col * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight,
      );

      currentFrame = ++currentFrame % cols;
    };

    setInterval(drawFrame, 100);
    
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        id="gameCanvas"
        width="800"
        height="600"
        className="bg-white"
      ></canvas>
    </div>
  );
};

export default Sprite;
