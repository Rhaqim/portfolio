'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import Contact from '@/components/Contact';
import {
  frontendStack,
  backendStack,
  databaseStack,
  devOpsStack,
  developerStack,
} from '@/constants';
import { useCursor } from '@/context/Cursor.context';

import { getArticles } from '@/service/devto/routes';
import Articles from '@/types/article.type';

const Page = () => {
  return (
    <div className="w-full min-h-screen">
      <main>
        <Introduction />
        <TechStack />
        <WorkExperience />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
};

export default Page;

const Introduction = () => {
  const { setCursorVariant } = useCursor();

  const [imageHovered, setImageHovered] = React.useState(false);

  const divEnter = () => setCursorVariant('hover');
  const divLeave = () => setCursorVariant('default');

  const handleMouseEnter = () => setImageHovered(true);
  const handleMouseLeave = () => setImageHovered(false);

  return (
    <section
      id="introduction"
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <h1 className="text-3xl md:text-4xl font-bold">Hi there!</h1>
            <h1 className="text-3xl md:text-4xl font-bold">I&apos;m Rhaqim</h1>
            <h1 className="text-3xl md:text-4xl font-bold">
              Lead software developer at
            </h1>
            <h1 className="text-3xl md:text-4xl font-bold">
              <a
                href="https://www.degenerousdao.com/"
                className="text-[#40D5BA] hover:underline"
              >
                Degenerous DAO
              </a>
            </h1>
          </div>
          <p className="text-lg mt-2 max-w-xs md:max-w-sm">
            I am very passionate about building and contributing to exciting new
            projects.
          </p>
          <p className="text-lg mt-2 max-w-xs md:max-w-sm">
            Feel free to explore my work and listen to my playlist.
          </p>
          <div className="flex space-x-4 items-center w-full">
            <a
              className="border-[#297568] hover:scale-110 transition-all ease-in border-4 rounded-lg p-4 justify-center"
              href="https://drive.google.com/file/d/1z_Rm4d8kafzNHrZNRJu5Cq1eC82J9iHi/view?usp=sharing"
              target="_blank"
              onMouseEnter={divEnter}
              onMouseLeave={divLeave}
            >
              View my resume
            </a>
            <a
              className="border-[#297568] hover:scale-110 transition-all ease-in border-4 rounded-lg p-4 justify-center flex items-center space-x-2"
              href="#contact"
              onMouseEnter={divEnter}
              onMouseLeave={divLeave}
            >
              <p>Contact me</p>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.55375 14.4995L0.5 13.4458L11.9462 1.99951H5V0.499512H14.5V9.99951H13V3.05326L1.55375 14.4995Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-between w-full items-center space-y-4">
            {/* Spotify Music Playlist */}
            <iframe
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/playlist/352bD1E6IDJZ6ftuluKXXr?utm_source=generator&theme=0"
              height="152"
              className="w-full"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Rhaqim's Spotify Playlist"
            ></iframe>
          </div>
        </div>
        <div
          className="flex flex-col items-center mt-4 md:mt-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={imageHovered ? '/images/personal.png' : '/images/business.png'}
            alt="Rhaqim"
            width={400}
            height={400}
            className={`rounded-md transition-transform duration-500 ease-in-out ${
              imageHovered ? 'custom-rotate-y' : 'custom-rotate-y-reset'
            }`}
          />
        </div>
      </div>
    </section>
  );
};

const Stack = [
  {
    title: 'Backend',
    stack: backendStack,
  },
  {
    title: 'Frontend',
    stack: frontendStack,
  },
  {
    title: 'Database',
    stack: databaseStack,
  },
  {
    title: 'DevOps',
    stack: devOpsStack,
  },
  {
    title: 'Others',
    stack: developerStack,
  },
];

const TechStack = () => {
  const { setCursorVariant } = useCursor();
  const [contextMenu, setContextMenu] = useState({ open: false, menu: '' });
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (event: React.MouseEvent, menu: string) => {
    event.preventDefault(); // Prevent the default context menu from appearing
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setContextMenu({ open: true, menu });
  };

  const handleClick = () => setContextMenu({ open: false, menu: '' });

  const divEnter = () => setCursorVariant('hoverWithText');
  const divLeave = () => setCursorVariant('default');

  return (
    <section
      id="stack"
      className="flex items-center justify-center w-full min-h-screen"
    >
      <div className="flex flex-col justify-center items-center gap-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">Tech Stack</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-center">
          {Stack.map((stack) => (
            <div
              key={stack.title}
              onContextMenu={(event) => handleRightClick(event, stack.title)}
              onClick={handleClick}
              onMouseEnter={divEnter}
              onMouseLeave={divLeave}
              className="border-2 border-[#40D5BA] p-4 rounded-lg hover:scale-110 transition-all ease-in"
            >
              <p className="text-2xl font-bold text-center">{stack.title}</p>
            </div>
          ))}
        </div>

        {contextMenu.open && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
            onClick={handleClick}
          >
            <div
              className="relative p-8 bg-[#309c88] rounded-full shadow-lg w-96 h-96 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="relative w-full h-full flex items-center justify-center">
                {Stack.find(
                  (stack) => stack.title === contextMenu.menu,
                )?.stack.map((item, index, arr) => {
                  // Calculate angle to evenly distribute items around a circle
                  const angle = (index / arr.length) * 360;
                  const radius = 120; // Radius of the circular layout
                  const x = radius * Math.cos((angle * Math.PI) / 180);
                  const y = radius * Math.sin((angle * Math.PI) / 180);

                  return (
                    <li
                      key={item.name}
                      className="absolute px-4 py-2"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <Image
                        src={`/toolkit/${item.logo}.svg`}
                        alt={item.name}
                        width={12}
                        height={12}
                        className="w-10 h-10 hover:scale-110 rounded-lg transform transition-transform ease-in duration-300"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const workExperience = [
  {
    title: 'Lead Software Developer',
    company: 'Degenerous DAO',
    date: '2024 - Present',
    image: '/degenerousdaoHomePage.png',
    link: 'https://www.degenerousdao.com/',
  },
  {
    title: 'Senior Software Developer',
    company: 'Equity Group Holdings',
    date: '2021 - 2024',
    image: '/equityHomePage.png',
    link: 'https://equitygroupholdings.com/',
  },
  {
    title: 'FullStack Developer',
    company: 'Nirvana Labs',
    date: '2023 - 2024',
    image: '/nirvanalabsHomePage.png',
    link: 'https://www.nirvanalabs.io/',
  },
  {
    title: 'Data Science Intern',
    company: 'UnivelCity',
    date: '2020 - 2021',
    image: '/univelcityHomePage.png',
    link: 'https://www.univelcity.com/',
  },
];

const WorkExperience = () => {
  const { setCursorVariant } = useCursor();

  const divEnter = () => setCursorVariant('hover');
  const divLeave = () => setCursorVariant('default');

  return (
    <section
      id="workexperience"
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div className="flex flex-col justify-center items-center gap-6 border border-[#40D5BA] max-w-4xl mx-auto p-4 rounded-lg">
        <h1 className="text-4xl font-bold text-center">Work Experience</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workExperience.map((work) => (
            <a
              key={work.title}
              href={work.link}
              target="_blank"
              className="flex flex-col gap-2 bg-[#09323399] hover:shadow-lg hover:shadow-[#76b8b999] rounded-lg p-2 transition-shadow ease-in duration-300"
              onMouseEnter={divEnter}
              onMouseLeave={divLeave}
            >
              <Image
                src={work.image}
                alt={work.company}
                width={591}
                height={290}
                className="rounded-lg"
              />
              <h1 className="text-2xl font-bold">{work.title}</h1>
              <p className="text-lg">{work.company}</p>
              <p className="text-lg">{work.date}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const projects = [
  {
    title: 'Buckt',
    description:
      'A simple Object storage service for storing and retrieving media files.',
    stack: ['Golang', 'Object Storage', 'Media Files'],
    github: 'https://github.com/Rhaqim/buckt',
    live: 'https://garch.rhaqim.com/',
    image: '/wip.png',
    position: 'left',
  },
  {
    title: 'USSDFramework',
    description: 'A simple framework for building USSD applications in Rust.',
    stack: ['Rust', 'USSD', 'Framework'],
    github: 'https://github.com/Rhaqim/ussdframework',
    live: 'https://garch.rhaqim.com/',
    image: '/wip.png',
    position: 'right',
  },
  {
    title: 'Garch',
    description:
      'A boilerplate generator for creating and managing Golang projects.',
    stack: ['Golang', 'Boilerplate', 'Architecture', 'CLI'],
    github: 'https://github.com/Rhaqim/garch-go',
    live: 'https://garch.rhaqim.com/',
    image: '/wip.png',
    position: 'left',
  },
  {
    title: 'Jobs We Want',
    description:
      'A helpful extension for tracking jobs you want to or have applied to.',
    stack: ['Chrome', 'Extention', 'Jobs Tracking', 'Metrics'],
    github: 'https://github.com/Rhaqim/jobs_we_want',
    live: 'https://garch.rhaqim.com/',
    image: '/wip.png',
    position: 'right',
  },
];

const Projects = () => {
  const { setCursorVariant } = useCursor();

  const divEnter = () => setCursorVariant('hover');
  const divLeave = () => setCursorVariant('default');
  return (
    <section
      id="projects"
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div className="flex flex-col justify-center items-center gap-6 border border-[#40D5BA] max-w-4xl mx-auto p-4 rounded-lg">
        <h1 className="text-4xl font-bold text-center">Projects</h1>
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <div
              key={project.title}
              className={`flex md:flex-row flex-col gap-2 bg-[#09323399] rounded-lg p-2 items-center justify-between`}
            >
              {project.position === 'left' && (
                <Image
                  src={project.image}
                  alt={project.title}
                  width={219}
                  height={289}
                  className="rounded-lg object-cover hidden md:block"
                />
              )}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 ">
                  <h1 className="text-2xl font-bold">{project.title}</h1>
                  <p className="text-lg">{project.description}</p>
                  <ul className="flex gap-2 flex-wrap">
                    {project.stack.map((item) => (
                      <li
                        key={item}
                        className="bg-[#003135] rounded-md border border-white p-2"
                      >
                        <p className="text-lg  text-center">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between">
                  <a
                    onMouseEnter={divEnter}
                    onMouseLeave={divLeave}
                    href={project.github}
                    className="justify-center hover:scale-105 transition-all ease-in"
                  >
                    <Image
                      src="/toolkit/github.svg"
                      alt="Github"
                      width={20}
                      height={20}
                      className="w-14 h-14 bg-white rounded-lg p-2"
                    />
                  </a>
                  {/* <a
                    href={project.live}
                    className="border-[#297568] hover:scale-105 transition-all ease-in border rounded-lg p-2 justify-center"
                  >
                    View live
                  </a> */}
                </div>
              </div>
              {project.position === 'right' && (
                <Image
                  src={project.image}
                  alt={project.title}
                  width={219}
                  height={289}
                  className="rounded-lg object-cover hidden md:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Blog = () => {
  const { setCursorVariant } = useCursor();

  const [blogPosts, setBlogPosts] = useState<Articles[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await getArticles();
        setBlogPosts(posts.data as Articles[]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogPosts();
  }, []);

  const divEnter = () => setCursorVariant('hover');
  const divLeave = () => setCursorVariant('default');

  return (
    <section
      id="blog"
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 border border-[#40D5BA] max-w-4xl w-full mx-auto p-4 rounded-lg">
        <h1 className="text-4xl font-bold text-center md:w-1/2">Blog Posts</h1>
        <div className="flex flex-col gap-4">
          {blogPosts.map((post) => (
            <a
              key={post.id}
              href={`/work/blog/${post.id}`}
              className="flex flex-col gap-2 border-b-2 border-[#40D5BA] rounded-lg p-2 hover:shadow-lg hover:shadow-[#76b8b999] transition-shadow ease-in duration-300"
              onMouseEnter={divEnter}
              onMouseLeave={divLeave}
            >
              <h2 className="text-xl font-bold mb-2 text-[#40D5BA]">
                {post.title}
              </h2>
              <p>{post.title}</p>
              <p className="text-gray-500 mt-2">
                {new Date(post.published_timestamp).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
