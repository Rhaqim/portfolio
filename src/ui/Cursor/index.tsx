'use client';

import React, { useEffect, useState } from 'react';

const CustomCursorApp = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Update cursor position on mouse move
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Function to toggle hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="relative w-screen h-screen bg-gray-900 cursor-none">
      {/* Custom Cursor */}
      <div
        className={`pointer-events-none fixed rounded-full flex items-center justify-center text-transparent transition-transform duration-300 ${
          isHovered ? 'bg-green-500 text-white transform scale-105' : 'bg-white'
        }`}
        style={{
          width: '40px',
          height: '40px',
          left: cursorPosition.x - 5,
          top: cursorPosition.y - 5,
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          scale: isHovered ? 1.5 : 1,
          transitionDuration: '300ms',
        }}
      >
        {isHovered && (
          <span
            // className="text-sm text-white flex justify-items-center items-center p-2"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '6px',
              color: 'white',
            }}
          >
            Click me
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4">
        <p>Move your mouse around the screen and hover over the box below!</p>
        <div
          className="w-64 h-64 bg-blue-900 rounded-lg mt-8 flex items-center justify-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Hover over this box!
        </div>
      </div>
    </div>
  );
};

const MouseCheck = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default context menu from appearing

    // Set the position of the custom dropdown
    setMenuPosition({
      x: event.pageX,
      y: event.pageY,
    });
    setMenuVisible(true); // Show the custom menu
  };

  const handleClick = () => {
    // Hide the custom menu when clicking elsewhere
    setMenuVisible(false);
  };

  return (
    <div
      className="w-screen h-screen bg-gray-900"
      onContextMenu={handleRightClick} // Attach right-click handler
      onClick={handleClick} // Hide menu on click
    >
      <p className="p-4">
        Right-click anywhere on this page to see the custom menu!
      </p>

      {menuVisible && (
        <div
          className="absolute bg-black border border-gray-300 shadow-lg rounded-lg p-2"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <ul className="list-none m-0 p-0">
            <li
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => alert('Option 1 selected')}
            >
              Option 1
            </li>
            <li
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => alert('Option 2 selected')}
            >
              Option 2
            </li>
            <li
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => alert('Option 3 selected')}
            >
              Option 3
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
