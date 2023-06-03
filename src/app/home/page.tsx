'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';


// ...

const sectionsData = [
  {
    id: 'hhgffrew123',
    bgColor: 'bg-green-500',
    image:
      'https://images.unsplash.com/photo-1680035116082-c7cd5e96fdb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    altText: 'Work',
    href: '/work',
    content: 'My Work',
  },
  {
    id: 'lkkjnh5443',
    bgColor: 'bg-red-500',
    image:
      'https://images.unsplash.com/photo-1680028136470-5a957bc07a5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    altText: 'Life',
    href: '/life',
    content: 'My Life',
  },
  {
    id: 'lmddfghyt8897',
    bgColor: 'bg-yellow-500',
    image:
      'https://images.unsplash.com/photo-1679772692631-08eb486c5a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80',
    altText: 'Balance',
    href: '/balance',
    content: 'The Balance',
  },
];

const Page = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await new Promise((resolve) => setTimeout(resolve, 500));
      await new Promise((resolve) => setTimeout(resolve, 500));
    };

    sequence();
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const video = e.currentTarget;
    video.style.filter = 'brightness(100%)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const video = e.currentTarget;
    video.style.filter = 'brightness(70%)';
  };

  return (
    <>
      {isTransitioning && (
        <motion.div
          className="transitioning-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <div
        className={`${
          isTransitioning ? 'transitioning' : ''
        } h-screen w-full flex flex-row items-center justify-between p-2 relative`}
      >
        {/* Background Image */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-transparent"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1680079640329-238b05dee3bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2900&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Sections */}
        {sectionsData.map((section) => (
          <motion.a
            key={section.id}
            href={section.href}
            className={`relative z-10 h-[94%] w-full m-1 hover:-translate-y-2 hover:scale-105 transition-all duration-300 rounded-md hover:z-20 ${section.bgColor}`}
            style={{
              backgroundImage: `url('${section.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(70%)',
            }}
            onMouseEnter={(e) => {
              handleMouseEnter(e);
            }}
            onMouseLeave={(e) => {
              handleMouseLeave(e);
            }}
            onClick={(e) => {
              e.preventDefault();
              setIsTransitioning(true);
              setTimeout(() => {
                router.push(section.href);
              }, 800); // Adjust the delay as needed
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-black p-4 font-bold text-2xl opacity-0 hover:opacity-100 transition-opacity duration-300">
              {section.content}
            </div>
          </motion.a>
        ))}
      </div>
    </>
  );
};

export default Page;
