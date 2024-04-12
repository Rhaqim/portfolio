'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="w-full flex flex-col space-y-8 min-h-screen items-center justify-center">
      {/* Personal Introduction Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 mb-4">
          {/* Personal Introduction */}
          <div className="relative w-full items-center md:items-start flex flex-col space-y-4 font-bold text-lg">
            <div className="flex md:text-left items-center space-x-4">
              <Image
                src="/images/business.png"
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-md"
              />
              <p className="hover:text-indigo-600 text-center text-3xl transition duration-300 ease-in-out">
                Hi, I&apos;m&nbsp; Anusiem John-Franklin.
              </p>
            </div>
            <div className='text-xl'>
              Full Stack Developer at &nbsp;
              <Link
                href="https://www.nirvanalabs.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-600 transition duration-300 ease-in-out"
              >
                UniDiff
              </Link>
            </div>
          </div>
        </div>
        {/* Introduction Text */}
        <div
          id="intro-text"
          className="text-center md:text-left font-mono font-bold text-xl mt-2"
        >
          I am a passionate full-stack developer with a knack for crafting
          robust APIs, streamlining DevOps processes and all-round development.
          I&apos;ve honed my skills in leading teams, deciphering complex
          business requirements, and consistently delivering projects on time.
        </div>
      </section>

      {/* Music Playlist Section */}
      <section
      className='w-full'
      >
        <div className="flex flex-col md:flex-row justify-between w-full items-center space-y-4">
          {/* Spotify Music Playlist */}
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/playlist/352bD1E6IDJZ6ftuluKXXr?utm_source=generator&theme=0"
            height="152"
            className="w-full md:w-1/2"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Intro;
