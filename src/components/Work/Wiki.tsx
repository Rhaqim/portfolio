import React from 'react';
import Image from 'next/image';

type WikiProps = {
  title: string;
  image?: string;
  content: string;
};

const Wiki: React.FC<WikiProps> = ({ title, image, content }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">{title}</h1>
        <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <Image
            src={image ?? '/images/placeholder.png'}
            alt={title}
            width={300}
            height={300}
            className="rounded-full"
          />
          <p className="mt-3 text-2xl">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Wiki;
