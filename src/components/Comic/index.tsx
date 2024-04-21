'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

const panels = [
  'Panel 1 content',
  'Panel 2 content',
  'Panel 3 content',
  // Add more panels as needed
];

export default function ComicBook() {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.clientHeight;
      const scrollPosition = window.scrollY;

      const currentPage = Math.floor((scrollPosition / (documentHeight - windowHeight)) * panels.length);
      setCurrentPage(currentPage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
        {panels.map((panel, index) => (
          <div key={index} className={index === currentPage ? "block" : "hidden"}>
            <div className="h-screen flex justify-center items-center">
              <div className="max-w-xl p-8 border border-gray-300 rounded-lg shadow-lg">
                <p className="text-xl">{panel}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
