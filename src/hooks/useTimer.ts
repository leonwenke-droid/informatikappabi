import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (seconds: number) => void;
}

export function useTimer(initialSeconds: number): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clear();
    }
    return clear;
  // timeLeft bewusst nicht in deps — Intervall nutzt funktionale setState
  // eslint-disable-next-line react-hooks/exhaustive-deps -- siehe oben
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((seconds: number) => {
    clear();
    setIsRunning(false);
    setTimeLeft(seconds);
  }, []);

  useEffect(() => () => clear(), []);

  return { timeLeft, isRunning, start, pause, reset };
}
