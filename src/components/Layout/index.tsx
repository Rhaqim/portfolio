import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Nav from './Nav';
import BackLink from '../Common/BackLink';

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Nav navLinks={navLinks} />

        <div>{children}</div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LayoutBase;
