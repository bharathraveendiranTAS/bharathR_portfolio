import React from 'react';
import styles from './SharedComponents.module.scss';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  id?: string;
}

export function GlassCard({
  children,
  interactive = false,
  className = '',
  id,
  ...props
}: GlassCardProps) {
  const cardClass = `${styles['glass-card']} ${
    interactive ? styles['glass-card--interactive'] : ''
  } ${className}`.trim();

  return (
    <div id={id} className={cardClass} {...props}>
      {children}
    </div>
  );
}
