import React from 'react';
import { motion } from 'framer-motion';
import Dropdown from './Dropdown';

type WorkSectionsProps = {
  name: string;
  description: string;
  image: string;
  duration?: number;
  children?: React.ReactNode;
};

const WorkSections = ({
  name,
  description,
  image,
  duration = 1.5,
  children,
}: WorkSectionsProps) => {
  return (
    <Dropdown
      buttonContent={
        <motion.div
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration }}
          className="flex justify-between items-center p-2 w-full"
        >
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="flex-1 h-50 bg-cover bg-center rounded-lg shadow-lg items-center hover:scale-105 transition-all duration-300"
          >
            <div className="flex-1 bg-gray-900 bg-opacity-50 rounded-lg p-8 h-full items-center">
              <h3 className="text-3xl text-center text-white font-bold mb-2">
                {name}
              </h3>
              <p className="text-xl text-center text-white">{description}</p>
            </div>
          </div>
        </motion.div>
      }
    >
      {children}
    </Dropdown>
  );
};

export default WorkSections;
