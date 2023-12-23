'use client';

// components/GameComponent.js
import { useState } from 'react';

const GameComponent = () => {
  const [characterPosition, setCharacterPosition] = useState({ x: 0, y: 0 });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moveDistance = 10;

    switch (event.key) {
      case 'ArrowLeft':
        setCharacterPosition((prev) => ({ ...prev, x: prev.x - moveDistance }));
        break;
      case 'ArrowRight':
        setCharacterPosition((prev) => ({ ...prev, x: prev.x + moveDistance }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="game-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <div
        className="character"
        style={{
          height: '50px',
          width: '50px',
          backgroundColor: 'red',
          left: `${characterPosition.x}px`,
          top: `${characterPosition.y}px`,
        }}
      ></div>
      <div className="environment"></div>
      <style jsx>{`
        body,
        html {
          margin: 0;
          overflow: hidden;
        }

        .game-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          outline: none;
        }

        .character {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          background-color: red; /* Character styling */
        }

        .environment {
          position: absolute;
          width: 200%; /* Set the environment width to be twice the screen width */
          height: 100%;
          background-color: #5c94fc; /* Environment styling */
        }
      `}</style>
    </div>
  );
};

export default GameComponent;
