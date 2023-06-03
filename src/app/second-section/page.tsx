'use client';

import { motion } from 'framer-motion';
import React from 'react';

const page = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      Second page
    </motion.div>
  );
};

export default page;
