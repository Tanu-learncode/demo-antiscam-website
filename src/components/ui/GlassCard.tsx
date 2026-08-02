import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'primary' | 'error' | 'none';
}

export function GlassCard({ children, className = '', glow = 'none', ...props }: GlassCardProps) {
  const glowClass = glow === 'primary' ? 'glow-primary' : glow === 'error' ? 'glow-error' : '';
  
  return (
    <div 
      className={`glass-card rounded-2xl ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
