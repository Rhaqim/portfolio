'use client';

import React from 'react';
import Image from 'next/image';

import Intro from '@/components/Work/Intro';
import Outtro from '@/components/Work/Outtro';
import Toolkits from '@/components/Work/Toolkit';
import {
  frontendStack,
  versionControlStack,
  backendStack,
  machineLearningStack,
  frameworkStack,
  databaseStack,
  devOpsStack,
  developerStack,
} from '@/constants';

const page = () => {
  const categories = [
    {
      name: 'Frontend',
      toolkits: frontendStack,
    },
    {
      name: 'Backend',
      toolkits: backendStack,
    },
    {
      name: 'Machine Learning',
      toolkits: machineLearningStack,
    },
    {
      name: 'Framework',
      toolkits: frameworkStack,
    },
    {
      name: 'Database',
      toolkits: databaseStack,
    },
    {
      name: 'DevOps',
      toolkits: devOpsStack,
    },
    {
      name: 'Version Control',
      toolkits: versionControlStack,
    },
    {
      name: 'Developer',
      toolkits: developerStack,
    },
  ];

  return (
    <div className='relative w-full min-h-screen'>
      <Image
        className="absolute top-0 left-0 z-[-10] object-cover w-full h-full opacity-10"
        src="/images/personal.png"
        alt="background"
        fill
      />
      <div
        className="container mx-auto flex flex-col items-center w-full space-y-4 p-4"
        id="home"
      >
        <Intro />
        <Toolkits categories={categories} />
        <Outtro />
      </div>
    </div>
  );
};

export default page;
