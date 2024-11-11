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
          handleMove('up');
          break;
        case 'a':
          handleMove('left');
          break;
        case 's':
          handleMove('down');
          break;
        case 'd':
          handleMove('right');
          break;
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
    <div className="block md:hidden w-[200px] h-[150px]">
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

class Player {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string,
    public speed: number,
    public ctx: CanvasRenderingContext2D,
  ) {}

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill(
      new Path2D(
        `M${this.x} ${this.y} h ${this.width} v ${this.height} h ${-this
          .width} Z`,
      ),
    );

    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  constrols() {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.x -= this.speed;
          break;
        case 'ArrowRight':
          this.x += this.speed;
          break;
        case 'ArrowUp':
          this.y -= this.speed;
          break;
        case 'ArrowDown':
          this.y += this.speed;
          break;
      }
    });
  }

  update() {
    this.draw();
    this.constrols();
  }
}

enum Weapons {
  Sword,
  Bow,
  Staff,
}

class Weapon {
  constructor(
    public type: Weapons,
    public damage: number,
    public range: number,
    public speed: number,
    public player: Player,
  ) {}

  draw() {
    this.player.ctx.beginPath();
    this.player.ctx.fillStyle = 'red';
    this.player.ctx.fill(
      new Path2D(
        `M${this.player.x + 25} ${this.player.y + 25} h ${this.range} v ${
          this.range
        } h ${-this.range} Z`,
      ),
    );
  }

  attack() {
    this.draw();
  }

  update() {
    this.attack();
  }
}
