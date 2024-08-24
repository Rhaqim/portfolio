'use client';

import React from 'react'
import Scene from './Scene';
import Model from './TreeModel';

const Sectins = () => {
    const sections = [
        { position: [0, 0, 0], scale: [1, 1, 1] },
        { position: [2, 0, 0], scale: [1, 1, 1] },
        { position: [4, 0, 0], scale: [1, 1, 1] },
        // Add more section positions and scales as needed
      ];
    
      return (
        <Scene>
          {sections.map((section, index) => (
            <Model key={index} position={section.position} scale={section.scale} />
          ))}
        </Scene>
      );
    };

export default Sectins