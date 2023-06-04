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
  [key: string]: React.FunctionComponent<{ size: number }>;
}

const wordMapping: WordMapping = {
  go: GoOriginalWordmark as React.FunctionComponent<{ size: number }>,
  rust: RustPlain as React.FunctionComponent<{ size: number }>,
  python: PythonPlain as React.FunctionComponent<{ size: number }>,
  docker: DockerOriginalWordmark as React.FunctionComponent<{ size: number }>,
  react: ReactOriginalWordmark as React.FunctionComponent<{ size: number }>,
  kubernetes: KubernetesPlainWordmark as React.FunctionComponent<{
    size: number;
  }>,
};

const EssayWithIcons = ({ essayText }: { essayText: string }) => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const handleWordHover = (word: string) => {
    setHoveredWord(word);
  };

  const handleWordLeave = () => {
    setHoveredWord(null);
  };

  const renderEssay = (essayText: string) => {
    const words = essayText.split(' ');

    // check if words have commas or periods

    const new_words = words.map((word: string) => {
      if (word.includes(',')) {
        return word.replace(',', '');
      } else if (word.includes('.')) {
        return word.replace('.', '');
      } else {
        return word;
      }
    });

    return new_words.map((word: string, index: number) => {
      // check if word is one of the keys in wordMapping
      const IconComponent = wordMapping[word.toLowerCase()];

      if (IconComponent) {
        const Icon = IconComponent; // Extract the component from the mapping

        return (
          <React.Fragment key={index}>
            <span
              onMouseEnter={() => handleWordHover(word)}
              onMouseLeave={handleWordLeave}
            >
              {/* {hoveredWord === word ? <span>{word}</span> : <Icon size={24} />}{' '} */}
              <Icon size={34} />
            </span>{' '}
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={index}>
            <span>{word}</span>{' '}
          </React.Fragment>
        );
      }
    });
  };

  return <div className="flex items-center space-x-1">{renderEssay(essayText)}</div>;
};

export default EssayWithIcons;
