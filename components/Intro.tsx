import React, { useState } from 'react';

interface IntroProps {
  onStart: () => void;
}

const Intro: React.FC<IntroProps> = ({ onStart }) => {
  const [fade, setFade] = useState(false);

  const handleClick = () => {
    setFade(true);
    setTimeout(onStart, 600); // Trigger state change after fade starts
  };

  return (
    <div 
      onClick={handleClick}
      className={`w-full h-full flex items-center justify-center bg-black cursor-pointer select-none transition-opacity duration-700 ${fade ? 'opacity-0' : 'opacity-100'}`}
    >
      <h1 className="text-white text-6xl md:text-8xl font-heavy leading-[0.85] tracking-tighter text-center uppercase mix-blend-difference hover:scale-105 transition-transform duration-500">
        LITERAL<br />
        STICKER
      </h1>
    </div>
  );
};

export default Intro;