import React from 'react';

import GameThemedAnimations from '../Anim/GameThemed';

interface EnvironmentProps {
  width: number;
  height: number;
}

const Environment: React.FC<EnvironmentProps> = ({ width, height }) => {
  return (
    <canvas width={width} height={height}>
      {/* Render game elements here */}
    </canvas>
  );
};

export default Environment;
