import Image from 'next/image';
import React from 'react';

const ToolkitBadge = ({ name, logo }: { name: string; logo: string }) => (
  <div className="flex flex-col space-y-2 items-center justify-center hover:rotate-2 transition-all duration-100 ease-linear">
    <div className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg border border-neutral-400 bg-transparent">
      <Image
        src={`/toolkit/${logo}.svg`}
        alt={name}
        width={12}
        height={12}
        className="w-6 h-6"
      />
    </div>
    <p className="text-sm text-neutral-400 text-center">{name}</p>
  </div>
);

const Toolkits = ({
  categories,
}: {
  categories: { name: string; toolkits: { name: string; logo: string }[] }[];
}) => {
  return (
    <div
      id="toolkits"
      className="flex flex-col space-y-4 min-h-screen items-center justify-center py-4"
    >
      <h1 className="text-4xl font-bold mb-4">Stack</h1>
      {categories.map((category, index) => (
        <div key={index} className="flex flex-col space-y-4 mb-2">
          <h2 className="text-xl text-center font-semibold">{category.name}</h2>
          <div className="flex flex-wrap justify-center items-center space-x-4">
            {category.toolkits.map((toolkit, index) => (
              <ToolkitBadge
                key={index}
                name={toolkit.name}
                logo={toolkit.logo}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toolkits;
