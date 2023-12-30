'use client';

import React, { useEffect, useState } from 'react';
import { GithubLogo, TwitterLogo, InstagramLogo } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const Intro = () => {
  const [language, setLanguage] = useState('English');

  const greetingInLanguage = (language: string): string => {
    switch (language) {
      case 'English':
        return 'Hello World! Rhaqim here.';
      case 'Spanish':
        return '¡Hola Mundo! Rhaqim aquí.';
      case 'Yoruba':
        return 'Mo ki O Ile Aiye! Rhaqim ni.';
      case 'Igbo':
        return 'Ndewo Ụwa! Rhaqim nọ.';
      case 'Japanese':
        return "Kon'nichiwa sekai! Rhaqim wa koko ni imasu.";
      case 'French':
        return 'Bonjour le monde! Rhaqim ici.';
      case 'German':
        return 'Hallo Welt! Rhaqim hier.';
      case 'Italian':
        return 'Ciao mondo! Rhaqim qui.';
      case 'Korean':
        return 'Annyeong sesang! Rhaqim yeogi issseubnida.';
      case 'Mandarin':
        return 'Ni hao shijie! Rhaqim zai zhe.';
      case 'Portuguese':
        return 'Olá Mundo! Rhaqim aqui.';
      case 'Russian':
        return 'Privet mir! Rhaqim zdes.';
      case 'Arabic':
        return 'Marhabaan bialealam! Rhaqim hunaa.';
      case 'Hindi':
        return 'Namaste duniya! Rhaqim yahaan hai.';
      case 'Swahili':
        return 'Habari dunia! Rhaqim hapa.';
      default:
        return 'Hello World! Rhaqim here.';
    }
  };

  useEffect(() => {
    // cycle through languages every 5 seconds
    const languages = [
      'English',
      'French',
      'Japanese',
      'Yoruba',
      'Igbo',
      'Spanish',
      'German',
      'Italian',
      'Korean',
      'Mandarin',
      'Portuguese',
      'Russian',
      'Arabic',
      'Hindi',
      'Swahili',
    ];
    let i = 0;
    setInterval(() => {
      setLanguage(languages[i]);
      i++;
      if (i === languages.length) {
        i = 0;
      }
    }, 6000);
  }, []);

  return (
    <div className="relative w-full items-start">
      <div className={`font-bold text-2xl animate-bounce`}>
        {greetingInLanguage(language)}
        </div>
      <div className="mb-4">
        <div>
          <InstagramLogo className="inline-block w-6 h-6 mr-2" />
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
  );
};

export default Intro;
