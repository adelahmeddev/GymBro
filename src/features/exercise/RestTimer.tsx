import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface RestTimerProps {
  duration: number;
  running: boolean;
  onComplete: () => void;
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

export function RestTimer({ duration, running, onComplete }: RestTimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const circleRef = useRef<SVGCircleElement | null>(null);
  const beepedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!running) return;

    setRemaining(duration);
    beepedRef.current = false;

    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = String(circumference);
      circleRef.current.style.strokeDashoffset = '0';
    }

    const endTime = Date.now() + duration * 1000;

    const tick = () => {
      const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setRemaining(left);

      if (circleRef.current) {
        const elapsed = 1 - left / duration;
        circleRef.current.style.strokeDashoffset = String(circumference * elapsed);
      }

      if (left <= 0) {
        if (!beepedRef.current) {
          beepedRef.current = true;
          playBeep();
          onCompleteRef.current();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const rafRef: { current: number | null } = { current: null };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, duration]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center py-4"
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-tertiary" />
          <circle
            ref={circleRef}
            cx="50" cy="50" r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-accent"
            style={{ strokeDasharray: '0', strokeDashoffset: '0' }}
          />
        </svg>
        <span className="relative text-3xl font-bold text-text-primary tabular-nums">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-text-muted text-sm mt-2">Rest</span>
    </motion.div>
  );
}
