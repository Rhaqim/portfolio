import React from 'react';
import Image from 'next/image';

type WorkItemProps = {
  company: string;
  logo: string;
  website: string;
  responsibilities: string[];
  toolkits: { name: string; logo: string }[];
};

const WorkItem: React.FC<WorkItemProps> = ({
  company,
  logo,
  website,
}) => {
  return (
    <div className="flex flex-col items-center justify-between my-4 hover:scale-105 transition-transform duration-300 ease-in-out">
      {/* Logo and Company Info */}
      <div className="w-full flex flex-col items-center space-y-4">
        <a href={website} target="_blank" rel="noopener noreferrer">
          <Image
            src={`/work/${logo}.png`}
            alt={`Logo of ${company}`}
            width={400}
            height={400}
            className="h-auto object-contain rounded-md cursor-pointer grid-item-thumbnail"
            blurDataURL="/images/blur/blur-red.png"
            placeholder="blur"
          />
        </a>
        <p className="text-sm text-blue-500 text-center font-bold">
          <a href={website} target="_blank" rel="noopener noreferrer">
            {company}
          </a>
        </p>
      </div>
    </div>
  );
};

export default WorkItem;
