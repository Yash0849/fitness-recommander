import { useEffect, useRef, useState } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { postureApiService, type FeedbackMessage, type PoseLandmarkPoint } from '../services/postureApiService';

type SupportedExercise = 'squat' | 'pushup' | 'deadlift' | 'plank';

export function usePostureCoach(userId?: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastAnalyzeAtRef = useRef(0);
  const phaseRef = useRef('up');
  const sessionFeedbackRef = useRef<FeedbackMessage[]>([]);
  const repCountRef = useRef(0);
  const totalScoreRef = useRef(0);
  const framesAnalyzedRef = useRef(0);
  const startedAtRef = useRef<Date | null>(null);

  const [exercise, setExercise] = useState<SupportedExercise>('squat');
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'analyzing' | 'saving' | 'error'>('idle');
  const [feedback, setFeedback] = useState<FeedbackMessage[]>([]);
  const [repCount, setRepCount] = useState(0);
  const [postureScore, setPostureScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return;
      try {
        const response = await postureApiService.getHistory(userId);
        setHistory(response.sessions || []);
      } catch (historyError) {
        console.error(historyError);
      }
    };

    loadHistory();
  }, [userId]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const drawPose = (landmarks: PoseLandmarkPoint[]) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnectors(ctx as any, landmarks as any, POSE_CONNECTIONS as any, {
      color: '#22d3ee',
      lineWidth: 3,
    });
    drawLandmarks(ctx as any, landmarks as any, {
      color: '#f8fafc',
      fillColor: '#38bdf8',
      radius: 4,
    });
  };

  const handleLandmarks = async (landmarks: PoseLandmarkPoint[]) => {
    drawPose(landmarks);

    const now = Date.now();
    if (now - lastAnalyzeAtRef.current < 400) {
      return;
    }

    lastAnalyzeAtRef.current = now;

    try {
      const response = await postureApiService.analyze({
        exercise,
        landmarks,
        previousState: { phase: phaseRef.current },
      });

      phaseRef.current = response.analysis.phase;
      repCountRef.current += response.analysis.repDelta;
      framesAnalyzedRef.current += 1;
      totalScoreRef.current += response.analysis.postureScore;

      const enrichedFeedback = response.analysis.feedback.map((item) => ({
        ...item,
        postureScore: response.analysis.postureScore,
        repCount: repCountRef.current,
        angles: response.analysis.angles,
      }));

      sessionFeedbackRef.current.push(...enrichedFeedback);
      setFeedback(enrichedFeedback);
      setRepCount(repCountRef.current);
      setPostureScore(response.analysis.postureScore);
      setStatus('analyzing');
    } catch (analysisError) {
      const message = analysisError instanceof Error ? analysisError.message : 'Live posture analysis failed';
      setError(message);
      setStatus('error');
    }
  };

  const processFrame = async () => {
    if (!poseRef.current || !videoRef.current || videoRef.current.readyState < 2) {
      rafRef.current = requestAnimationFrame(processFrame);
      return;
    }

    await poseRef.current.send({ image: videoRef.current });
    rafRef.current = requestAnimationFrame(processFrame);
  };

  const start = async () => {
    try {
      setError('');
      setStatus('loading');

      repCountRef.current = 0;
      totalScoreRef.current = 0;
      framesAnalyzedRef.current = 0;
      sessionFeedbackRef.current = [];
      phaseRef.current = exercise === 'pushup' ? 'up' : 'idle';
      setFeedback([]);
      setRepCount(0);
      setPostureScore(0);

      startedAtRef.current = new Date();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 960 },
          height: { ideal: 540 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) {
        throw new Error('Video surface unavailable');
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      if (!poseRef.current) {
        const pose = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        pose.onResults((results: any) => {
          const landmarks = (results.poseLandmarks || []) as PoseLandmarkPoint[];
          if (landmarks.length) {
            handleLandmarks(landmarks);
          }
        });

        poseRef.current = pose;
      }

      setIsActive(true);
      setStatus('analyzing');
      rafRef.current = requestAnimationFrame(processFrame);
    } catch (startError) {
      const message = startError instanceof Error ? startError.message : 'Unable to start camera';
      setError(message);
      setStatus('error');
    }
  };

  const stop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    setStatus('idle');
  };

  const saveSession = async () => {
    if (!userId || !startedAtRef.current) return;

    try {
      setStatus('saving');
      const endedAt = new Date();
      const durationSeconds = Math.round((endedAt.getTime() - startedAtRef.current.getTime()) / 1000);
      const averageScore = framesAnalyzedRef.current
        ? Math.round(totalScoreRef.current / framesAnalyzedRef.current)
        : postureScore;

      await postureApiService.saveSession({
        exercise,
        reps: repCountRef.current,
        averageScore,
        durationSeconds,
        startedAt: startedAtRef.current.toISOString(),
        endedAt: endedAt.toISOString(),
        framesAnalyzed: framesAnalyzedRef.current,
        feedback: sessionFeedbackRef.current.slice(-30),
      });

      const historyResponse = await postureApiService.getHistory(userId);
      setHistory(historyResponse.sessions || []);
      setStatus('idle');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Failed to save posture session';
      setError(message);
      setStatus('error');
    }
  };

  return {
    videoRef,
    canvasRef,
    exercise,
    setExercise,
    isActive,
    status,
    feedback,
    repCount,
    postureScore,
    history,
    error,
    start,
    stop,
    saveSession,
  };
}
