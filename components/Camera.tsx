import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AppState } from '../types';

interface CameraProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
  onCapture: (base64Image: string) => void;
}

const Camera: React.FC<CameraProps> = ({ appState, setAppState, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [countdown, setCountdown] = useState<number>(3);

  // Initialize Camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture Function
  const captureFrame = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Maintain aspect ratio
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Flip horizontally to match mirror view
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.9);
      onCapture(base64);
    }
  }, [onCapture]);

  // Countdown Logic
  useEffect(() => {
    if (appState === AppState.COUNTDOWN) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setTimeout(() => {
                captureFrame();
            }, 200);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [appState, captureFrame]);


  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
        
      {/* Compact Frame Container - Pure Black, No Borders, Floating in Void */}
      <div className="relative w-full aspect-[4/5] bg-black overflow-hidden max-h-[70vh]">
          {/* Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transform scale-x-[-1] transition-all duration-700 ${appState === AppState.PROCESSING ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'}`}
          />

          {/* Countdown Overlay - Huge & Bold */}
          {appState === AppState.COUNTDOWN && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                <span className="text-[12rem] font-[900] text-white tracking-tighter animate-pulse leading-none">
                {countdown}
                </span>
            </div>
          )}

          {/* Processing State - Minimal Text */}
          {appState === AppState.PROCESSING && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black">
              <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin mb-8"></div>
              <p className="text-white font-[900] text-xl tracking-[0.2em] uppercase animate-pulse">
                PROCESSING
              </p>
            </div>
          )}
          
          {/* Subtle Crop Marks - Only visual cue */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white mix-blend-difference"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white mix-blend-difference"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white mix-blend-difference"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white mix-blend-difference"></div>
      </div>

      {/* Capture Button (Outside Frame) - Minimal Ring */}
      {appState === AppState.IDLE && (
        <div className="absolute bottom-[10%] left-0 right-0 flex justify-center z-20">
          <button
            onClick={() => setAppState(AppState.COUNTDOWN)}
            className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-transparent active:scale-90 transition-all duration-200"
            aria-label="Capture"
          >
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Camera;
