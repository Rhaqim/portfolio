import React from 'react';
import { motion } from 'framer-motion';

type WorkSectionsProps = {
  name: string;
  description: string;
  image: string;
  uri: string;
  duration?: number;
};

const WorkSections = ({ name, description, image, uri, duration = 1.5 }: WorkSectionsProps) => {
  return (
    <motion.div
      initial={{ y: 1000, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration }}
      className="flex justify-between items-center p-8"
    >
      <a
        href={`/${uri}`}
        style={{ backgroundImage: `url(${image})` }}
        className="flex-1 h-50 bg-cover bg-center rounded-lg shadow-lg items-center"
      >
        <div className="flex-1 bg-gray-900 bg-opacity-50 rounded-lg p-8 h-full items-center">
          <h3 className="text-3xl text-center text-white font-bold mb-2">{name}</h3>
          <p className="text-xl text-center text-white">{description}</p>
        </div>
      </a>
    </motion.div>
  );
};

export default WorkSections;
