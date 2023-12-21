import React from 'react'
import Image from 'next/image'
import Toolkits from './Toolkit'

type WorkItemProps = {
  company: string
  logo: string
  website: string
  responsibilities: string[]
  toolkits: { name: string; logo: string }[]
}

const WorkItem: React.FC<WorkItemProps> = ({
  company,
  logo,
  website,
  responsibilities,
  toolkits
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between my-4">
      <div className="mr-4 w-full md:w-[30%] flex flex-col space-y-4">
        <a href={website} target="_blank" rel="noopener noreferrer">
          <Image
            src={`/work/${logo}.png`}
            alt={`Logo of ${company}`}
            width={180}
            height={200}
            className="w-full h-1/2 object-contain cursor-pointer grid-item-thumbnail"
            blurDataURL="/images/blur/blur-red.png"
            placeholder="blur"
          />
        </a>
        <p className="mt-2 text-sm text-blue-500 text-center font-bold text-[15px]">
          <a href={website} target="_blank" rel="noopener noreferrer">
            {company}
          </a>
        </p>
        <div className="mt-2">
          <Toolkits toolkits={toolkits} />
        </div>
      </div>
      <ul className="w-full md:w-[70%]">
        {responsibilities.map((task, index) => (
          <li key={index} className="list-disc ml-4">
            {task}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WorkItem
