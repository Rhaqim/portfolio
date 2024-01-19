'use client';

import React, { useEffect } from 'react';
import { GithubLogo, TwitterLogo, LinkedinLogo } from '@phosphor-icons/react';
import Link from 'next/link';

const Intro = () => {
  useEffect(() => {
    const introText = document
      .getElementById('intro-text')!
      .textContent?.trim();

    const splitText = introText?.split(' ');

    // for each word, wrap each letter in a span tag add hover effect
    const wrappedText = splitText?.map((word, index) => {
      return `<span key="${index}" class="tooltipTrigger hover:text-indigo-500 hover:scale-75 transition duration-100 ease-in-out">${word}</span>`;
    });

    // join the words back together
    const joinedText = wrappedText?.join(' ');

    // replace the text content with the wrapped text
    introText &&
      (document.getElementById('intro-text')!.innerHTML = joinedText!);
  }, []);

  return (
    <div className="w-full flex flex-col space-y-4 px-4">
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div className="relative w-full items-center md:items-start flex flex-col space-y-4 font-bold text-lg">
          <div className={`flex flex-col md:text-left text-center text-2xl`}>
            <p>Anusiem John-Franklin.</p>
          </div>
          <div>
            Full Stack Developer at &nbsp;
            <Link
              href="https://www.nirvanalabs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-600 transition duration-300 ease-in-out"
            >
              Nirvana Labs
            </Link>
          </div>
          <div className="flex mb-4 items-center justify-center md:justify-start">
            <div>
              <LinkedinLogo className="inline-block w-6 h-6 mr-2" />
              <a
                href="https://www.linkedin.com/in/john-franklin-anusiem-104692166/"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2"
              >
                LinkedIn
              </a>
              <GithubLogo className="inline-block w-6 h-6 mr-2" />
              <a
                href="https://github.com/rhaqim"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2"
              >
                GitHub
              </a>
              <TwitterLogo className="inline-block w-6 h-6 mr-2" />
              <a
                href="https://twitter.com/alaswadkhan"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/352bD1E6IDJZ6ftuluKXXr?utm_source=generator&theme=0"
          width="40%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
      <div
        id="intro-text"
        className="text-center md:text-left font-mono font-bold text-xl"
      >
        I am a passionate full-stack developer with a knack for crafting robust
        APIs, streamlining DevOps processes and all round development. I&apos;ve
        honed my skills in leading teams, deciphering complex business
        requirements, and consistently delivering projects on time.
      </div>
    </div>
  );
};

export default Intro;
