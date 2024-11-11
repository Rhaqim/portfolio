import React from 'react';
import {
  GithubLogo,
  TwitterLogo,
  LinkedinLogo,
  DevToLogo,
} from '@phosphor-icons/react';
import Calendar from '../Calendar';

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/john-franklin-anusiem/',
    icon: <LinkedinLogo className="inline-block w-20 h-20 mr-2" />,
    text: 'LinkedIn',
  },
  {
    href: 'https://github.com/rhaqim',
    icon: <GithubLogo className="inline-block w-20 h-20 mr-2" />,
    text: 'GitHub',
  },
  {
    href: 'https://dev.to/rhaqim',
    icon: <DevToLogo className="inline-block w-20 h-20 mr-2" />,
    text: 'Dev.to',
  },
  {
    href: 'https://twitter.com/ivxnio',
    icon: <TwitterLogo className="inline-block w-20 h-20 mr-2" />,
    text: 'Twitter',
  },
];

const Contact = () => {
  return (
    <section
      id="contact"
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div className="flex flex-col justify-center items-center gap-8 max-w-4xl w-full mx-auto p-4 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Contact</h1>

        {/* <div className="flex mb-4 items-center justify-center space-x-4"> */}
        <div className="grid grid-cols-2 md:flex gap-4 items-center justify-center">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#40D5BA] hover:scale-110 flex items-center cursor-pointer mr-2 transition-all duration-300 ease-in-out"
            >
              {link.icon}
            </a>
          ))}
        </div>
        <Calendar />
      </div>
    </section>
  );
};

export default Contact;
