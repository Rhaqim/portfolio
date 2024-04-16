'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import Intro from '@/components/Work/Intro';
import Contact from '@/components/Work/Contact';
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
  workExperiences,
  workNavLinks,
} from '@/constants';
import WorkItem from '@/components/Work/WorkItem';
import Blog from '@/components/Blog';
import Resume from '@/components/Resume';
import { projects } from '@/constants/project';
import Projects from '@/components/Work/Projects';
import LayoutBase from '@/components/Layout';
import LogoModel from '@/components/Models';

const Page = () => {
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
    <div className="w-full min-h-screen">
      <div className="w-full h-full fixed z-[-20]">
        <Image
          className="object-cover opacity-30"
          src="/images/personal.png"
          alt="background"
          fill
        />
        <div className="w-full h-full bg-black opacity-50 z-[-10]">
          <LogoModel />
        </div>
      </div>
      <LayoutBase navLinks={workNavLinks}>
        <div
          className="container mx-auto flex flex-col items-center w-full space-y-4 p-4"
          id="home"
        >
          <Intro />
          <Toolkits categories={categories} />
          <div
            id="work-experience"
            className="flex flex-col space-y-4 min-h-screen items-center justify-center py-4"
          >
            <h1 className="text-4xl font-bold mb-4">Work Experience</h1>
            <div className="grid grid-cols-3 gap-4">
              {workExperiences.map((experience, index) => (
                <WorkItem key={index} {...experience} />
              ))}
            </div>
          </div>
          <Resume />
          <div
            id="projects"
            className="flex flex-col space-y-4 min-h-screen items-center justify-center py-4"
          >
            <h1 className="text-4xl font-bold mb-4">Projects</h1>
            <div>
              {projects.map((project, index) => (
                <Projects key={index} {...project} />
              ))}
            </div>
          </div>
          <Blog />
          <Contact />
        </div>
      </LayoutBase>
    </div>
  );
};

export default Page;
