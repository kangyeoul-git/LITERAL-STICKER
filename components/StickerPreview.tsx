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
      const x = Math.sin(time) * 4;
      const y = Math.cos(time) * 4;
      setRotation({ x, y });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `literal-asset-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black animate-fade-in">
      
      {/* 3D Object Viewer Area */}
      <div className="relative w-full max-w-[90vw] md:max-w-md aspect-[4/5] flex items-center justify-center perspective-[1000px]">
        <div 
            className="relative transition-transform duration-100 ease-out preserve-3d"
            style={{
                transform: `rotateX(${rotation.y}deg) rotateY(${rotation.x}deg)`,
                transformStyle: 'preserve-3d'
            }}
        >
            {/* The Asset Card */}
            <div className="relative bg-black rounded-sm shadow-2xl border border-white/5">
                {/* Image */}
                <img 
                    src={imageUrl} 
                    alt="Generated Asset" 
                    className="w-full h-full object-contain block bg-black mix-blend-normal"
                    style={{
                        maxWidth: '80vw',
                        maxHeight: '50vh',
                        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 1)'
                    }}
                />
                {/* Pseudo-Spline overlay effect for gloss */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            </div>
        </div>

        {/* Spline Placeholder Tag as requested (hidden functionally but semantically present if we were loading a real scene) */}
        {/* <spline-viewer loading="lazy" url="..."></spline-viewer> */}
        
        <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
             <span className="text-[9px] text-white/30 tracking-[0.3em] font-sans">OBJECT_001</span>
        </div>
      </div>

      {/* Minimal Actions */}
      <div className="mt-12 w-full max-w-[200px] flex flex-col space-y-3 z-20">
        <button
          onClick={handleDownload}
          className="w-full py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
        >
          Download
        </button>
        
        <button
          onClick={onRetake}
          className="w-full py-3 bg-transparent border border-white/10 text-white/40 text-[10px] tracking-widest uppercase hover:text-white hover:border-white/30 transition-colors"
        >
          Retake
        </button>
      </div>
    </div>
  );
};

export default StickerPreview;
