import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useWeightLogs } from '@/hooks/useWorkout';
import { RestTimer } from './RestTimer';
import type { WeightLog } from '@/types';

interface WeightLoggerProps {
  exerciseId: string;
  sets: number;
  restTime: number;
  onExerciseComplete: () => void;
}

export function WeightLogger({ exerciseId, sets, restTime, onExerciseComplete }: WeightLoggerProps) {
  const { t } = useTranslation();
  const { getLogForExercise, logSet } = useWeightLogs();
  const [isOpen, setIsOpen] = useState(false);
  const [log, setLog] = useState<WeightLog | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setLog(getLogForExercise(exerciseId));
  }, [exerciseId, getLogForExercise]);

  const loggedCount = log?.sets.length ?? 0;
  const allSetsLogged = loggedCount >= sets;

  const handleLog = (setNumber: number, weight: number, reps: number) => {
    logSet(exerciseId, setNumber, weight, reps);
    const updated = getLogForExercise(exerciseId);
    setLog(updated);

    const doneCount = (updated?.sets.length ?? 0);
    if (doneCount >= sets) {
      onExerciseComplete();
    } else {
      setTimerRunning(true);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        fullWidth
        icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M2 12h20" />
          </svg>
        }
      >
        {t('exercise.weightLogger')}
      </Button>

      {allSetsLogged && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium text-center"
        >
          {t('exercise.allSetsLogged')}
        </motion.div>
      )}

      <AnimatePresence>
        {timerRunning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <RestTimer
              duration={restTime}
              running={timerRunning}
              onComplete={() => setTimerRunning(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {Array.from({ length: sets }, (_, i) => i + 1).map((setNum) => (
                <WeightSetRow
                  key={setNum}
                  setNumber={setNum}
                  log={log?.sets.find((s) => s.setNumber === setNum) ?? null}
                  onLog={(weight, reps) => handleLog(setNum, weight, reps)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WeightSetRow({
  setNumber,
  log,
  onLog,
}: {
  setNumber: number;
  log: { weight: number; reps: number } | null;
  onLog: (weight: number, reps: number) => void;
}) {
  const { t } = useTranslation();
  const [weight, setWeight] = useState(log?.weight.toString() ?? '');
  const [reps, setReps] = useState(log?.reps.toString() ?? '');

  return (
    <Card padding="sm" className="flex items-center gap-3">
      <span className="text-text-muted text-sm w-10 flex-shrink-0">
        {t('exercise.set')} {setNumber}
      </span>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={t('exercise.weight')}
          className="w-20 px-3 py-1.5 bg-surface-tertiary border border-border rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        />
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder={t('exercise.repsCompleted')}
          className="w-20 px-3 py-1.5 bg-surface-tertiary border border-border rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const w = parseFloat(weight);
            const r = parseFloat(reps);
            if (w > 0 && r > 0) onLog(w, r);
          }}
        >
          {log ? t('exercise.updateSet') : t('exercise.logSet')}
        </Button>
      </div>
      {log && (
        <span className="text-xs text-success font-medium">
          {log.weight}kg × {log.reps}
        </span>
      )}
    </Card>
  );
}
