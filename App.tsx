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
    // Use dynamic viewport height (h-[100dvh] equivalent style)
    <div className="w-screen flex flex-col overflow-hidden font-sans bg-black text-white" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      
      {/* Intro Page */}
      {appState === AppState.INTRO && (
        <Intro onStart={handleStart} />
      )}

      {/* Main App (Visible after Intro) */}
      {appState !== AppState.INTRO && (
        <main className="flex-1 w-full h-full relative animate-fade-in flex flex-col items-center justify-center">
          
          {/* Header removed for pure black immersion */}
          
          <div className="w-full h-full max-w-lg mx-auto flex flex-col">
            {appState === AppState.ERROR ? (
                 <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                    <div className="text-red-500 text-xs border border-red-900/30 bg-red-950/10 p-4 tracking-widest uppercase font-bold">
                        {errorMsg || "System Failure"}
                    </div>
                    <button 
                        onClick={handleRetake}
                        className="text-white/50 text-[10px] tracking-widest hover:text-white uppercase"
                    >
                        Reset Connection
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
            animation: fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
