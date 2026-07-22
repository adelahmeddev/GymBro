import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ children, className = '', onClick, hoverable = false, padding = 'md' }: CardProps) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      whileHover={hoverable ? { y: -2 } : undefined}
      className={`
        bg-surface-secondary rounded-xl border border-border
        ${onClick ? 'cursor-pointer text-left w-full' : ''}
        ${hoverable ? 'card-hover' : ''}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
