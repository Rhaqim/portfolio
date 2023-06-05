import { motion } from 'framer-motion';
import React from 'react';

type NavProps = {
  href: string;
  label: string;
};

const Nav = ({ navLinks }: { navLinks: NavProps[] }) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center p-8"
    >
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="border border-black p-2 bg-transparent rounded-lg transition duration-300 ease-in-out"
        >
          {link.label}
        </a>
      ))}
    </motion.nav>
  );
};

export default Nav;
