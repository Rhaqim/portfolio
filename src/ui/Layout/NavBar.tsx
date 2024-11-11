import React from 'react';
import Image from 'next/image';

const NavLinks = [
  {
    title: 'Stack',
    href: '#stack',
  },
  {
    title: 'Work Experience',
    href: '#workexperience',
  },
  {
    title: 'Projects',
    href: '#projects',
  },
  {
    title: 'Blog',
    href: '#blog',
  },
  {
    title: 'Contact',
    href: '#contact',
  },
];

const NavBar = () => {
  return (
    <div className="flex justify-between items-center w-full px-2 py-4">
      <a href="#introduction" className="text-2xl font-bold flex space-x-2 items-center">
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="Code logo"
          width={46}
          height={30}
          priority
        />
        <span>Rhaqim</span>
      </a>
      <div className="items-center space-x-4 hidden md:block">
        {NavLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="mx-4 navbar-pointer text-md"
          >
            {link.title}
          </a>
        ))}
      </div>
      <div />
    </div>
  );
};

export default NavBar;
