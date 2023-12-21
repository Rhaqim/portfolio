'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

type NavProps = {
  href: string;
  label: string;
};

const Nav = ({ navLinks }: { navLinks: NavProps[] }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const name = 'Rhaqim'.split('');

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        !document.getElementById('logo')?.contains(event.target as Node) &&
        !document
          .getElementById('dropdown-content')
          ?.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleOutsideClick);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center p-8"
      >
        <Link
          href={'/'}
          className=" hover:scale-75 transition duration-500 ease-in-out z-50"
          id="logo"
        >
          {name.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="font-bold text-3xl"
            >
              {letter}
            </motion.span>
          ))}
        </Link>

        {/* Hamburger */}
        {!dropdownOpen ? (
          <div
            className="flex flex-col items-center justify-center"
            id="hamburger"
          >
            <button
              onClick={handleDropdown}
              className="flex flex-col items-center justify-center space-y-2 hover:scale-75 transition duration-500 ease-in-out"
            >
              <div className="w-8 h-1 bg-black dark:bg-white" />
              <div className="w-8 h-1 bg-black dark:bg-white" />
              <div className="w-8 h-1 bg-black dark:bg-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleDropdown}
            className="absolute top-0 right-0 m-8 text-gray-500 hover:scale-75 transition duration-500 ease-in-out z-50 pt-2"
          >
            <div className="w-8 h-1 bg-black dark:bg-white transform rotate-45"></div>
            <div className="w-8 h-1 bg-black dark:bg-white transform scale-x-0"></div>
            <div className="w-8 h-1 bg-black dark:bg-white transform -rotate-45"></div>
          </button>
        )}

        {/* Drop Down */}
        {dropdownOpen && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-md z-10 transition-all ease-in-out"
          >
            <div id="dropdown-content" className="flex flex-col space-y-4 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-5xl font-bold bg-transparent hover:border-b-4 border-black transition duration-500 ease-in-out text-center"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>
    </AnimatePresence>
  );
};

export default Nav;
