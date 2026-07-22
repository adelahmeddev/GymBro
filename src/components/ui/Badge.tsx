import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variants = {
  default: 'bg-surface-tertiary text-text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-info/10 text-info',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}
