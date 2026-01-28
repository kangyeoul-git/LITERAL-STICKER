import React, { useState } from 'react';

interface IntroProps {
  onStart: () => void;
}

const Intro: React.FC<IntroProps> = ({ onStart }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStartClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onStart();
    }, 800); // Wait for fade out
  };

  return (
    <div 
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <button 
        onClick={handleStartClick}
        className="group flex flex-col items-center justify-center text-center cursor-pointer select-none"
        aria-label="Enter Application"
      >
        <h1 className="text-white text-6xl md:text-8xl font-[900] tracking-tighter leading-[0.85] uppercase transition-transform duration-500 group-hover:scale-105 group-active:scale-95">
          LITERAL<br />
          STICKER
        </h1>
        {/* Invisible hit area expansion for better mobile UX */}
        <div className="absolute inset-0 w-full h-full" />
      </button>
      
    </div>
  );
};

export default Intro;
