import React, { useState } from 'react';
import { AppState } from './types';
import Camera from './components/Camera';
import StickerPreview from './components/StickerPreview';
import Intro from './components/Intro';
import { processImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStart = () => {
    setAppState(AppState.IDLE);
  };

  const handleCapture = async (base64Image: string) => {
    setAppState(AppState.PROCESSING);
    setErrorMsg(null);
    
    try {
      const resultImage = await processImageWithGemini(base64Image);
      setGeneratedImage(resultImage);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      setErrorMsg("Bridge disconnected.");
      setAppState(AppState.ERROR);
    }
  };

  const handleRetake = () => {
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden font-sans bg-black text-white">
      
      {/* Intro Page */}
      {appState === AppState.INTRO && (
        <Intro onStart={handleStart} />
      )}

      {/* Main App (Visible after Intro) */}
      {appState !== AppState.INTRO && (
        <main className="flex-1 w-full h-full relative animate-fade-in flex flex-col">
          
          {/* Subtle Indicator / Branding - kept minimal */}
          <div className="absolute top-6 w-full text-center z-40 opacity-30 pointer-events-none">
             <div className="w-1 h-1 bg-white rounded-full mx-auto mb-2"></div>
             <p className="text-[8px] tracking-[0.4em] uppercase">Literal Sticker</p>
          </div>

          <div className="flex-1 w-full h-full">
            {appState === AppState.ERROR ? (
                 <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                    <div className="text-red-500 text-xs border border-red-900/30 bg-red-950/10 p-4 tracking-widest uppercase">
                        {errorMsg || "System Failure"}
                    </div>
                    <button 
                        onClick={handleRetake}
                        className="text-white/50 text-[10px] tracking-widest hover:text-white"
                    >
                        RESET
                    </button>
                 </div>
            ) : appState === AppState.RESULT && generatedImage ? (
              <StickerPreview 
                imageUrl={generatedImage} 
                onRetake={handleRetake} 
              />
            ) : (
              <Camera 
                appState={appState} 
                setAppState={setAppState} 
                onCapture={handleCapture} 
              />
            )}
          </div>
        </main>
      )}
      
      <style>{`
        .animate-fade-in {
            animation: fadeIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default App;
