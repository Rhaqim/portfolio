'use client';

import Intro from '@/components/Work/Intro';
import WorkSections from '@/components/Work/WorkSections';
import { workCategories } from '@/constants';
import React from 'react';

const page = () => {
  return (
    <div
      className="flex flex-col justify-start items-center w-full min-h-screen space-y-4"
      id="work"
    >
      {/* Introduction */}
      <Intro />

      {/* Work Categories */}
      {workCategories.map((work, index) => (
        <WorkSections
          key={index}
          id={work.id}
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
