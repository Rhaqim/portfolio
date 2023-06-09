'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center p-8"
    >
      <Link href={'/home'}
      className=' hover:scale-75 transition duration-500 ease-in-out z-50'>
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
      {!dropdownOpen && (
        <div className="flex flex-col items-center justify-center z-50">
          <button
            onClick={handleDropdown}
            className="flex flex-col items-center justify-center space-y-2 hover:scale-75 transition duration-500 ease-in-out"
          >
            <div className="w-8 h-1 bg-black dark:bg-white" />
            <div className="w-8 h-1 bg-black dark:bg-white" />
            <div className="w-8 h-1 bg-black dark:bg-white" />
          </button>
        </div>
      )}

      {/* Drop Down */}
      {dropdownOpen && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={
            dropdownOpen ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }
          }
          transition={{ duration: 0.7 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-md z-10"
        >
          <button
            onClick={handleDropdown}
            className="absolute top-0 right-0 m-8 text-gray-500"
          >
            X
          </button>
          <div className="flex flex-col space-y-4 p-4">
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
  );
};

export default Nav;
