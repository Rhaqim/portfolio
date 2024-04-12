'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLineUpRight } from '@phosphor-icons/react';
import PortfolioImage from './PortfolioImageProps';

type ProjectProps = {
  title: string;
  description: string;
  link: string | null;
  github: string;
  tags: string[];
  toolkits: { name: string; logo: string }[];
  images: { src: string; alt: string }[] | [];
};

const Projects: React.FC<ProjectProps> = ({
  title,
  description,
  link,
  github,
  tags,
  toolkits,
  images,
}) => {
  return (
    <div className="flex flex-col items-start justify-center w-full my-4">
      <h3 className="mb-2 text-xl font-semibold md:leading-6 my-2 underline underline-offset-2">
        {title}
      </h3>
      <p className="my-4">{description}</p>
      <div className="grid grid-cols-2 gap-4">
        {images.map((item, index) => (
          <PortfolioImage key={index} {...item} />
        ))}
      </div>
      <div className="flex flex-wrap justify-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 mr-2 mb-2 text-sm font-semibold text-white bg-gray-800 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap space-x-4 items-center w-full">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm font-semibold w-[150px] h-10 hover:bg-purple-600 hover:scale-105 transition-all duration-100 ease-linear border border-neutral-500 p-2 flex justify-between items-center rounded-md"
          >
            <p>View Project</p>
            <ArrowLineUpRight className="w-4 h-4" />
          </a>
        )}
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm font-semibold p-2 flex justify-between items-center"
        >
          <Image
            src={`/toolkit/github.svg`}
            alt={'github logo'}
            width={12}
            height={12}
            className="w-10 h-10 hover:scale-105 transition-all bg-white duration-100 ease-linear bg-base hover:bg-purple-600  rounded-full p-2"
          />
        </a>
      </div>
    </div>
  );
};

export default Projects;
