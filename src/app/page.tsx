'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import LogoModel from '@/components/Models';

// ...

const sectionsData = [
  {
    id: 'hhgffrew123',
    bgColor: 'bg-green-500',
    image: '/images/business.png',
    altText: 'Work',
    href: '/work',
    text: 'Work',
    textColor: 'text-white',
  },
  {
    id: 'lkkjnh5443',
    bgColor: 'bg-red-500',
    image: '/images/personal.png',
    altText: 'game',
    href: '/game',
    text: 'Play',
    textColor: 'text-black',
  },
];

const Page = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const sequence = async () => {
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
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
          } h-screen w-full flex flex-col lg:flex-row lg:items-center lg:justify-between lg:p-2 relative justify-center items-center p-0`}
        >
          {/* Background Image */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-transparent"
            style={{
              backgroundColor: 'black',
              // backgroundImage:
              //   "url('https://images.unsplash.com/photo-1680079640329-238b05dee3bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2900&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <LogoModel />
          </div>

          {/* Sections */}
          {sectionsData.map((section) => (
            <motion.a
              key={section.id}
              href={section.href}
              className={`relative z-10 h-[94%] w-full m-1 hover:-translate-y-2 transition-all duration-300 rounded-md hover:z-20 ${section.bgColor}`}
              style={{
                backgroundImage: `url('${section.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(70%)',
                width: '620px',
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
              <div
                className={`${section.textColor} absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 font-bold text-5xl opacity-0 hover:opacity-100 transition-opacity duration-300`}
              >
                {section.text}
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Page;
