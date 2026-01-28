import React, { useState, useEffect } from 'react';

interface StickerPreviewProps {
  imageUrl: string;
  onRetake: () => void;
}

const StickerPreview: React.FC<StickerPreviewProps> = ({ imageUrl, onRetake }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.015;
      const x = Math.sin(time) * 3; // Reduced movement for more stability
      const y = Math.cos(time) * 3;
      setRotation({ x, y });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `literal-sticker-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black animate-fade-in relative">
      
      {/* 3D Object Viewer Area - Pure Black Void */}
      <div className="relative w-full aspect-[4/5] flex items-center justify-center perspective-[1000px] max-h-[70vh]">
        <div 
            className="relative transition-transform duration-100 ease-out preserve-3d"
            style={{
                transform: `rotateX(${rotation.y}deg) rotateY(${rotation.x}deg)`,
                transformStyle: 'preserve-3d'
            }}
        >
            {/* The Asset Card - No background, just the image */}
            <div className="relative">
                {/* Image */}
                <img 
                    src={imageUrl} 
                    alt="Generated Asset" 
                    className="w-full h-full object-contain block select-none drag-none"
                    style={{
                        maxWidth: '85vw',
                        maxHeight: '60vh',
                        // High contrast drop shadow for depth in the void
                        filter: 'drop-shadow(0 20px 30px rgba(255, 255, 255, 0.1))' 
                    }}
                />
            </div>
        </div>
        
        <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
             <span className="text-[10px] text-white/50 tracking-[0.5em] font-[900]">ASSET ACQUIRED</span>
        </div>
      </div>

      {/* Minimal Actions */}
      <div className="absolute bottom-[10%] w-full max-w-[240px] flex flex-col space-y-4 z-20">
        <button
          onClick={handleDownload}
          className="w-full py-4 bg-white text-black text-sm font-[900] tracking-widest uppercase hover:bg-gray-200 transition-colors"
        >
          Download
        </button>
        
        <button
          onClick={onRetake}
          className="w-full py-2 bg-transparent text-white/40 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors"
        >
          Close / Retake
        </button>
      </div>
    </div>
  );
};

export default StickerPreview;
