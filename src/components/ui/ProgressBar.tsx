import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, className = '', showLabel = false }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-2 bg-surface-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-accent rounded-full"
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-secondary mt-1 block">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
