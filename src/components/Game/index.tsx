'use client';

import { useEffect, useRef, useState } from 'react';

import Environment from './Environment';
import Player from './Player';
import Game from './State';
import { useGameContext } from '@/context/Game.context';

const MainGame = () => {
  const { selectedCharacter } = useGameContext();
  const envCanvas = useRef<HTMLCanvasElement>(null);
  const [controller, setController] = useState<JSX.Element>();

  const summerBG = '/game/backgrounds/Summer1.png';

  useEffect(() => {
    const canvas = envCanvas.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Environment
    const environment = new Environment(
      ctx,
      { width: canvas.width, height: canvas.height },
      summerBG,
    );

    // Player
    const player = new Player(
      ctx,
      selectedCharacter,
      { x: 400, y: 300 },
      { width: 50, height: 50 },
      'red',
      10,
      { width: canvas.width, height: canvas.height },
    );

    setController(player.controls());

    // Game
    const game = new Game(ctx, player, environment);

    game.start();

    window.addEventListener('keydown', player.handleKeyDown);

    return () => {
      window.removeEventListener('keydown', player.handleKeyDown);
    };
  }, [selectedCharacter]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <canvas
        ref={envCanvas}
        id="gameCanvas"
        width="800"
        height="600"
        className="bg-white"
      ></canvas>
      <div>{controller}</div>
    </div>
  );
};

export default MainGame;
