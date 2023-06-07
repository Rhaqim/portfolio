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
        <div className="flex flex-col items-center m-4 border border-black p-2 rounded-lg ">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="bg-transparent border-b-4 w-full border-black transition duration-300 ease-in-out"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </motion.nav>
  );
};

export default Nav;
