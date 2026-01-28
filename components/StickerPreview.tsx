import React from 'react';

interface StickerPreviewProps {
  imageUrl: string;
  onRetake: () => void;
}

const StickerPreview: React.FC<StickerPreviewProps> = ({ imageUrl, onRetake }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `literal-sticker-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full max-w-md aspect-[3/4] bg-black flex flex-col items-center justify-between py-10">
      
      {/* Image Container - Floating in void */}
      <div className="flex-1 w-full flex items-center justify-center p-4">
        <img 
            src={imageUrl} 
            alt="Sticker" 
            className="max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        />
      </div>

      {/* Typographic Actions */}
      <div className="w-full flex flex-row items-center justify-between px-10 pt-8 border-t border-white/10">
        <button 
          onClick={onRetake}
          className="text-white/40 hover:text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
        >
          Retake
        </button>

        <button 
          onClick={handleDownload}
          className="bg-white text-black px-6 py-3 text-xs font-heavy tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default StickerPreview;