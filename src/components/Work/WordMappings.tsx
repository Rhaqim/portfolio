'use client';

import React from 'react';
import {
  GoOriginalWordmark,
  RustPlain,
  PythonOriginal,
  DockerOriginalWordmark,
  ReactOriginalWordmark,
  KubernetesPlainWordmark,
} from 'devicons-react';

interface WordMapping {
  [key: string]: React.FunctionComponent<{ size: number }>;
}

const wordMapping: WordMapping = {
  go: GoOriginalWordmark as React.FunctionComponent<{ size: number }>,
  golang: GoOriginalWordmark as React.FunctionComponent<{ size: number }>,
  rust: RustPlain as React.FunctionComponent<{ size: number }>,
  python: PythonOriginal as React.FunctionComponent<{ size: number }>,
  docker: DockerOriginalWordmark as React.FunctionComponent<{ size: number }>,
  react: ReactOriginalWordmark as React.FunctionComponent<{ size: number }>,
  kubernetes: KubernetesPlainWordmark as React.FunctionComponent<{
    size: number;
  }>,
};

const EssayWithIcons = ({ essayText }: { essayText: string }) => {
  const renderEssay = (essayText: string) => {
    const words: string[] = essayText.split(' ').map((word: string) => {
      if (word.includes(',')) {
        return word.replace(',', '');
      } else if (word.includes('.')) {
        return word.replace('.', '');
      } else {
        return word;
      }
    });

    const replacedWords = words.map((word: string, index: number) => {
      const IconComponent = wordMapping[word.toLowerCase()];

      if (IconComponent) {
        return (
          <React.Fragment key={index}>
            <span>
              <IconComponent size={50} />
            </span>
          </React.Fragment>
        );
      } else {
        return word;
      }
    });

    return replacedWords;
  };

  return (
    <div className="grid grid-cols-3 justify-between items-center space-y-4">
      {renderEssay(essayText)}
    </div>
  );
};

export default EssayWithIcons;
