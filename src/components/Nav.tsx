'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type NavProps = {
  href: string;
  label: string;
};

const Nav = ({ navLinks }: { navLinks: NavProps[] }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center p-8"
    >
      <div>
        <p>Rhaqim</p>
      </div>

      {/* Hamburger */}
      {!dropdownOpen && (
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={handleDropdown}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-8 h-1 bg-black"></div>
            <div className="w-8 h-1 bg-black"></div>
            <div className="w-8 h-1 bg-black"></div>
          </button>
        </div>
      )}

      {/* Drop Down */}
      {dropdownOpen && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-md z-0"
        >
          <button
            onClick={handleDropdown}
            className="absolute top-0 right-0 m-2 text-gray-500"
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
