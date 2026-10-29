import { useEffect, useRef, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose?: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (cameraError) {
        const message = cameraError instanceof Error ? cameraError.message : 'Unable to access camera';
        setError(message);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL('image/jpeg', 0.9));
    onClose?.();
  };

  if (error) {
    return <div className="rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <video ref={videoRef} playsInline muted className="w-full rounded-2xl border border-white/10 bg-slate-950 object-cover" />
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white">
          Cancel
        </button>
        <button
          onClick={handleCapture}
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-400"
        >
          Capture
        </button>
      </div>
    </div>
  );
}
