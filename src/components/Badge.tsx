import { ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    info: 'bg-info-100 text-info-700',
    secondary: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}