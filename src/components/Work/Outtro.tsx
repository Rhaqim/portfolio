import React from 'react';
import { GithubLogo, TwitterLogo, LinkedinLogo } from '@phosphor-icons/react';
import Calendar from '../Calendar';

const Outtro = () => {
  const socialLinks = [
    {
      href: 'https://www.linkedin.com/in/john-franklin-anusiem/',
      icon: <LinkedinLogo className="inline-block w-6 h-6 mr-2" />,
      text: 'LinkedIn',
    },
    {
      href: 'https://github.com/rhaqim',
      icon: <GithubLogo className="inline-block w-6 h-6 mr-2" />,
      text: 'GitHub',
    },
    {
      href: 'https://twitter.com/alaswadkhan',
      icon: <TwitterLogo className="inline-block w-6 h-6 mr-2" />,
      text: 'Twitter',
    },
  ];
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <h1 className="text-4xl font-bold mb-4">Contact</h1>
      <Calendar />
      <div className="flex mb-4 items-center justify-center space-x-4">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 hover:scale-105 flex items-center cursor-pointer mr-2"
          >
            {link.icon}
            <p>{link.text}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Outtro;
