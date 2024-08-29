'use client';

import React from 'react';
import Branch2, { BranchProps } from './Branch2';
import Branch1 from '.././Cherry/Branches/Branch1';

const Tree = () => {
  //   return <Branch />;
  return (
    <Branch1 {...CareerBranch} maxDepth={calculateMaxDepth(CareerBranch)} />
  );
};

export default Tree;

const calculateMaxDepth = (
  branch: BranchProps,
  currentDepth: number = 0,
): number => {
  if (!branch.branches || branch.branches.length === 0) {
    return currentDepth;
  }

  return Math.max(
    ...branch.branches.map((subBranch) =>
      calculateMaxDepth(subBranch, currentDepth + 1),
    ),
  );
};

// components/TreeData.tsx
const CareerBranch = {
  title: 'Career Paths',
  description: 'Explore various career paths and their associated skills.',
  branches: [
    {
      title: 'Backend Engineer',
      description:
        'Develop and maintain server-side applications that power the client-side applications.',
      branches: [
        {
          title: 'Database Management',
          fruits: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
        },
        {
          title: 'Server-Side Frameworks',
          fruits: ['Express.js', 'Django', 'Flask', 'Spring Boot'],
        },
        {
          title: 'API Development',
          fruits: ['REST', 'GraphQL', 'gRPC'],
        },
      ],
    },
    {
      title: 'Frontend Engineer',
      description:
        'Develop and maintain client-side applications that interact with the server-side applications.',
      branches: [
        {
          title: 'Web Development',
          fruits: ['HTML', 'CSS', 'JavaScript'],
        },
        {
          title: 'Frontend Frameworks',
          fruits: ['React', 'Angular', 'Vue'],
        },
        {
          title: 'Mobile Development',
          fruits: ['React Native', 'Flutter', 'Swift'],
        },
      ],
    },
    {
      title: 'Writing',
      description:
        'Create written content for various mediums such as blogs, articles, and social media.',
      branches: [
        {
          title: 'Content Creation',
          fruits: ['Blogs', 'Articles', 'Social Media Posts'],
        },
        {
          title: 'Copywriting',
          fruits: ['Advertising', 'Marketing', 'Branding'],
        },
        {
          title: 'Editing',
          fruits: ['Proofreading', 'Grammar', 'Style'],
        },
      ],
    },
  ],
};

const LifeBranch = {
  title: 'Life Paths',
  description: 'Explore various life paths and their associated experiences.',
  branches: [
    {
      title: 'Travel',
      description: 'Explore different countries and cultures around the world.',
      branches: [
        {
          title: 'Asia',
          fruits: ['Japan', 'China', 'India', 'Thailand'],
        },
        {
          title: 'Europe',
          fruits: ['France', 'Italy', 'Germany', 'Spain'],
        },
        {
          title: 'Americas',
          fruits: ['USA', 'Canada', 'Brazil', 'Mexico'],
        },
      ],
    },
    {
      title: 'Education',
      description:
        'Pursue academic studies and lifelong learning opportunities.',
      branches: [
        {
          title: 'School',
          fruits: ['Elementary', 'Middle', 'High'],
        },
        {
          title: 'College',
          fruits: ['Undergraduate', 'Graduate', 'Doctorate'],
        },
        {
          title: 'Online',
          fruits: ['Coursera', 'edX', 'Udemy', 'Khan Academy'],
        },
      ],
    },
    {
      title: 'Work',
      description:
        'Engage in various forms of employment and professional development.',
      branches: [
        {
          title: 'Full-Time',
          fruits: ['40 hours/week', '9-5', 'Monday-Friday'],
        },
        {
          title: 'Part-Time',
          fruits: ['20 hours/week', 'Flexible', 'Weekends'],
        },
        {
          title: 'Freelance',
          fruits: ['Contract', 'Project-Based', 'Remote'],
        },
      ],
    },
  ],
};

const RootBranch = {
  title: 'Root',
  description: 'The root of the tree.',
  branches: [CareerBranch, LifeBranch],
};
