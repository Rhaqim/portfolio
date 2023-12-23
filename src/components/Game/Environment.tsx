import React from 'react';

const Background = ({
  playerPosition,
}: {
  playerPosition: { x: number; y: number };
}) => {
  const backgroundSize = 100;
  const halfCanvasWidth = 800 / 2;
  const halfCanvasHeight = 600 / 2;

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

  return (
    <div
      className="bg-blue-500 w-full h-full"
      style={{
        backgroundPosition: `-${getBackgroundPosition().x}px -${
          getBackgroundPosition().y
        }px`,
        backgroundSize: `${backgroundSize}px ${backgroundSize}px`,
      }}
    ></div>
  );
};

export default Background;
