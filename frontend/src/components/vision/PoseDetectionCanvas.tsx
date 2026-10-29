import type { RefObject } from 'react';

interface PoseDetectionCanvasProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

export default function PoseDetectionCanvas({ videoRef, canvasRef }: PoseDetectionCanvasProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950 shadow-xl shadow-slate-950/30">
      <video ref={videoRef} playsInline muted className="w-full object-cover" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
