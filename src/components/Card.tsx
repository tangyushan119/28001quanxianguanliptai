import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'lg',
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl border border-gray-100 overflow-hidden';
  
  const hoverStyles = hoverable ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200' : '';
  
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`pb-4 mb-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h2 className={`text-xl font-bold text-gray-800 ${className}`}>
      {children}
    </h2>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}