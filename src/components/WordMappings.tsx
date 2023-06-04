'use client';

import React, { useState } from 'react';
import {
  GoOriginalWordmark,
  RustPlain,
  PythonPlain,
  DockerOriginalWordmark,
  ReactOriginalWordmark,
  KubernetesPlainWordmark,
} from 'devicons-react';

interface WordMapping {
  [key: string]: React.JSX.Element;
}

const wordMapping: WordMapping = {
  go: <GoOriginalWordmark size={24} />,
  rust: <RustPlain size={24} />,
  python: <PythonPlain size={24} />,
  docker: <DockerOriginalWordmark size={24} />,
  react: <ReactOriginalWordmark size={24} />,
  kubernetes: <KubernetesPlainWordmark size={24} />,
};

const EssayWithIcons = () => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const handleWordHover = (word: string) => {
    console.log('hovered over', word);
    setHoveredWord(word);
  };

  const handleWordLeave = () => {
    setHoveredWord(null);
  };

  const renderEssay = (essayText: string) => {
    const words = essayText.split(' ');

    return words.map((word: string, index: number) => {
      // check if word is one of the keys in wordMapping
      const IconComponent = wordMapping[word.toLowerCase()];

      if (IconComponent) {
        return (
          <span
            key={index}
            onMouseEnter={() => handleWordHover(word)}
            onMouseLeave={handleWordLeave}
          >
            {hoveredWord === word ? <span>{word}</span> : IconComponent}
          </span>
        );
      } else {
        return <span key={index}>{word} </span>;
      }
    });
  };

  const essayText =
    'This is an essay about Go, Rust, Python, Docker, React, and Kubernetes.';

  return <div>{renderEssay(essayText)}</div>;
};

export default EssayWithIcons;
