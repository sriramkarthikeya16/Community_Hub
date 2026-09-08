import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-semibold',
  };

  const variantClasses = {
    default: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
  };

  const dotColors = {
    default: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const normalized = status.toUpperCase();

  if (normalized === 'PAID' || normalized === 'RESOLVED' || normalized === 'ACTIVE' || normalized === 'AVAILABLE' || normalized === 'SUCCESS') {
    return <Badge variant="success" dot className={className}>{status}</Badge>;
  }
  if (normalized === 'PENDING' || normalized === 'SUBMITTED' || normalized === 'ACKNOWLEDGED' || normalized === 'OCCUPIED') {
    return <Badge variant="warning" dot className={className}>{status}</Badge>;
  }
  if (normalized === 'IN PROGRESS' || normalized === 'ASSIGNED' || normalized === 'BUSY') {
    return <Badge variant="info" dot className={className}>{status}</Badge>;
  }
  if (normalized === 'OVERDUE' || normalized === 'FAILED' || normalized === 'REJECTED' || normalized === 'EMERGENCY' || normalized === 'HIGH' || normalized === 'URGENT') {
    return <Badge variant="danger" dot className={className}>{status}</Badge>;
  }
  if (normalized === 'VACANT' || normalized === 'ON_LEAVE' || normalized === 'INACTIVE' || normalized === 'CLOSED') {
    return <Badge variant="neutral" dot className={className}>{status}</Badge>;
  }

  return <Badge variant="default" className={className}>{status}</Badge>;
};
