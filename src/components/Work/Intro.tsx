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
    <div
      id="intro"
      className="w-full flex flex-col space-y-8 min-h-screen items-center justify-center py-4"
    >
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
              <div className="text-xl transition duration-300 ease-in-out">
                <p>
                  Hi there, I&apos;m <span className='font-bold text-2xl'>Rhaqim.</span>
                </p>
                <div className="text-xl">
                  A Full Stack Developer at &nbsp;
                  <Link
                    href="https://github.com/UnidiffKenya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-600 transition duration-300 ease-in-out"
                  >
                    UniDiff
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Introduction Text */}
        <div
          id="intro-text"
          className="text-center font-mono font-bold text-xl mt-2"
        >
          I am very passionate about building and contributing to exciting new
          projects, feel free to explore my work and listen to my playlist
        </div>
      </section>

      {/* Music Playlist Section */}
      <section className="w-full">
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
