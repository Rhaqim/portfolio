'use client';

import WorkSections from '@/components/Work/WorkSections';
import { motion } from 'framer-motion';
import React from 'react';

const workedFor = [
  {
    name: 'Workplace',
    description: 'My work',
    image:
      'https://images.unsplash.com/photo-1680005084654-b57c0f6e5b77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',
    uri: 'work/workplace',
    duration: 2,
    content: <div>Workplace</div>,
  },
  {
    name: 'Personal',
    description: 'My personal projects',
    image:
      'https://images.unsplash.com/photo-1681163101469-5175a8925526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',
    uri: 'personal',
    duration: 3,
    content: <div>Personal</div>,
  },
  {
    name: 'Open Source',
    description: 'My open source projects',
    image:
      'https://images.unsplash.com/photo-1672717892736-d3fcf1cd23c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
    uri: 'open-source',
    duration: 4,
    content: <div>Open Source</div>,
  },
];

const page = () => {
  return (
    <div className="flex flex-col justify-start items-center w-full min-h-screen space-y-4">
      {workedFor.map((work, index) => (
        <WorkSections
          key={index}
          name={work.name}
          description={work.description}
          image={work.image}
          duration={work.duration}
        >
          {work.content}
        </WorkSections>
      ))}
    </div>
  );
};

export default page;
