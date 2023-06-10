import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex space-x-2 animate-bounce">
        <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
        <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
        <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
