import React, { useEffect } from 'react';

const GameControls = () => {
  useEffect(() => {
    const moveLeft = document.getElementById('move-left');
    const moveRight = document.getElementById('move-right');
    const moveJump = document.getElementById('move-jump');

    if (moveLeft && moveRight && moveJump) {
      moveLeft.addEventListener('click', () => {
        console.log('move left');
      });
      moveRight.addEventListener('click', () => {
        console.log('move right');
      });
      moveJump.addEventListener('click', () => {
        console.log('move jump');
      });
    }
  }, []);

  return (
    <div className="game-controls">
      <button id="move-left" className="control-button">
        Move Left
      </button>
      <button id="move-right" className="control-button">
        Move Right
      </button>
      <button id="move-jump" className="control-button">
        Jump
      </button>
    </div>
  );
};

export default GameControls;
