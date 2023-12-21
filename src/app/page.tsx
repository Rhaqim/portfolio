'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import LogoModel from '@/components/Models';

// ...

const sectionsData = [
  {
    id: 'work',
    bgColor: 'bg-green-500',
    image: '/images/business.png',
    altText: 'Work',
    href: '/work',
    text: 'Work',
    textColor: 'text-white',
  },
  {
    id: 'play',
    bgColor: 'bg-red-500',
    image: '/images/personal.png',
    altText: 'game',
    href: '/game',
    text: 'Play',
    textColor: 'text-black',
  },
];

type activeSectionType = 'work' | 'play' | 'default';

const Page = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeSection, setActiveSection] =
    useState<activeSectionType>('default');

  const router = useRouter();

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const video = e.currentTarget;
    video.style.filter = 'brightness(100%)';

    // set active section to the id of the section
    setActiveSection(video.id as activeSectionType);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const video = e.currentTarget;
    video.style.filter = 'brightness(70%)';

    // set active section to default
    setActiveSection('default');
  };

  const renderBackground = () => {
    switch (activeSection) {
      case 'work':
        return <div className="bg-green-500" />; //TODO: change to video
      case 'play':
        return <div className="bg-red-500" />; // TODO: change to video of gameplay
      default:
        return <LogoModel />;
    }
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
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {renderBackground()}
          </div>

          {/* Sections */}
          {sectionsData.map((section) => (
            <motion.a
              key={section.id}
              href={section.href}
              id={section.id}
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
