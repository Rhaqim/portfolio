'use client';

import WorkSections from '@/components/Work/WorkSections';
import { workCategories } from '@/constants';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-col justify-start items-center w-full min-h-screen space-y-4">
      {/* Introduction */}
      <div className="w-full flex flex-col justify-center items-center space-y-4 px-4">
        <p className="text-left font-mono font-bold text-xl">
          Hello there! I&apos;m Rhaqim, a passionate full-stack developer with a
          knack for crafting robust APIs, streamlining DevOps processes and all
          round development. I&apos;ve honed my skills in leading teams,
          deciphering complex business requirements, and consistently delivering
          projects on time.
        </p>
      </div>

      {/* Work Categories */}
      {workCategories.map((work, index) => (
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
