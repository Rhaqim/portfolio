import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Nav from './Nav';

type NavProps = {
  href: string;
  label: string;
};

type LayoutBaseProps = {
  children: React.ReactNode;
  navLinks: NavProps[];
};

const LayoutBase = ({ children, navLinks }: LayoutBaseProps) => {
  return (
    <AnimatePresence>
      <Nav navLinks={navLinks} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default LayoutBase;
