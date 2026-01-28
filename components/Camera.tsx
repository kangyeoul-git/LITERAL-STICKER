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
    
    // Maintain aspect ratio but ensure high quality
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
        
      {/* Compact Frame Container */}
      <div className="relative w-full max-w-[90vw] md:max-w-md aspect-[4/5] bg-[#111] overflow-hidden rounded-sm border border-white/10 shadow-2xl">
          {/* Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transform scale-x-[-1] transition-all duration-700 ${appState === AppState.PROCESSING ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          />

          {/* Countdown Overlay */}
          {appState === AppState.COUNTDOWN && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-20">
                <span className="text-9xl font-light text-white font-sans tracking-tighter animate-ping">
                {countdown}
                </span>
            </div>
          )}

          {/* Processing State in Frame */}
          {appState === AppState.PROCESSING && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
              <p className="text-white/60 font-sans text-[10px] tracking-[0.2em] uppercase animate-pulse">
                Converting to Asset
              </p>
            </div>
          )}
          
          {/* Corner Guides */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30"></div>
      </div>

      {/* Capture Button (Outside Frame) */}
      {appState === AppState.IDLE && (
        <div className="mt-12 flex justify-center z-20">
          <button
            onClick={() => setAppState(AppState.COUNTDOWN)}
            className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-transparent hover:bg-white/5 active:scale-95 transition-all duration-300"
            aria-label="Capture"
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Camera;
