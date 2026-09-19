import React from 'react';

interface BandBadgeProps {
  band: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'current' | 'target' | 'neutral';
}

export const BandBadge: React.FC<BandBadgeProps> = ({
  band,
  label,
  size = 'md',
  variant = 'neutral',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5 font-bold',
  }[size];

  const variantClasses = {
    current: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    target: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    neutral: 'bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold shadow-xs ${sizeClasses} ${variantClasses}`}
    >
      {label && <span className="text-slate-500 dark:text-slate-400 font-normal">{label}</span>}
      <span>Band {band.toFixed(1)}</span>
    </span>
  );
};
