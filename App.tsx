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
      setErrorMsg("CONNECTION LOST");
      setAppState(AppState.ERROR);
    }
  };

  const handleRetake = () => {
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* INTRO LAYER */}
      <div className={`absolute inset-0 z-50 transition-opacity duration-1000 ease-in-out ${appState === AppState.INTRO ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         {appState === AppState.INTRO && <Intro onStart={handleStart} />}
      </div>

      {/* MAIN APP LAYER */}
      <div className={`w-full h-full transition-opacity duration-1000 delay-300 ease-in-out flex items-center justify-center ${appState === AppState.INTRO ? 'opacity-0' : 'opacity-100'}`}>
         
         {appState === AppState.ERROR ? (
             <div className="text-center space-y-4">
                 <p className="text-red-600 font-heavy text-xs tracking-widest">{errorMsg}</p>
                 <button onClick={handleRetake} className="text-white border-b border-white pb-1 text-xs tracking-widest uppercase">Reset</button>
             </div>
         ) : appState === AppState.RESULT && generatedImage ? (
             <StickerPreview imageUrl={generatedImage} onRetake={handleRetake} />
         ) : (
             // Only render camera if we are not in INTRO or RESULT to save resources
             appState !== AppState.INTRO && appState !== AppState.RESULT && (
                <Camera appState={appState} setAppState={setAppState} onCapture={handleCapture} />
             )
         )}
      </div>
    </div>
  );
};

export default App;