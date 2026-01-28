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

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } }, // Request square/high quality
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera Error", err);
      }
    };
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      onCapture(canvas.toDataURL('image/jpeg', 0.9));
    }
  }, [onCapture]);

  useEffect(() => {
    if (appState === AppState.COUNTDOWN) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((p) => {
          if (p === 1) {
            clearInterval(timer);
            setTimeout(captureFrame, 200);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [appState, captureFrame]);

  return (
    <div className="relative w-full max-w-md aspect-[3/4] bg-[#050505] flex flex-col overflow-hidden">
      
      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transform scale-x-[-1] transition-all duration-500 ${appState === AppState.PROCESSING ? 'opacity-20 blur-lg grayscale' : 'opacity-100 grayscale-0'}`}
      />

      {/* Countdown Overlay */}
      {appState === AppState.COUNTDOWN && countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <span className="font-heavy text-[120px] text-white leading-none">{countdown}</span>
        </div>
      )}

      {/* Processing Overlay */}
      {appState === AppState.PROCESSING && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <span className="text-white font-heavy text-2xl tracking-[0.5em] animate-pulse">CREATING</span>
        </div>
      )}

      {/* Controls */}
      {appState === AppState.IDLE && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
          <button
            onClick={() => setAppState(AppState.COUNTDOWN)}
            className="w-20 h-20 rounded-full border-[1px] border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Camera;