import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Character {
    name: string;
    icon: string;
}

interface CharacterSelectProps {
    characters: Character[];
    onSelectedCharacter: (character: Character) => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ characters, onSelectedCharacter }) => {
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);

    const handleSlideLeft = () => {
        setCurrentCharacterIndex((prevIndex) => (prevIndex === 0 ? characters.length - 1 : prevIndex - 1));
    };

    const handleSlideRight = () => {
        setCurrentCharacterIndex((prevIndex) => (prevIndex === characters.length - 1 ? 0 : prevIndex + 1));
    };

    const currentCharacter = characters[currentCharacterIndex];

    useEffect(() => {
        onSelectedCharacter(currentCharacter);
    }, [currentCharacter, onSelectedCharacter]);

    return (
        <div>
            <motion.div
                key={currentCharacter.name}
                initial={{ x: -1000 }}
                animate={{ x: 0 }}
                exit={{ x: 1000 }}
                transition={{ duration: 0.5 }}
            >
                <Image src={currentCharacter.icon} alt={currentCharacter.name} />
                <h2>{currentCharacter.name}</h2>
            </motion.div>

            <button onClick={handleSlideLeft}>Slide Left</button>
            <button onClick={handleSlideRight}>Slide Right</button>
        </div>
    );
};

export default CharacterSelect;
