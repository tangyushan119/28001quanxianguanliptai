import { ReactNode, MouseEventHandler, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: CSSProperties;
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'lg',
  shadow = 'md',
  onClick,
  style,
}: CardProps) {
  const baseStyles = 'bg-white rounded-2xl border border-gray-100 overflow-hidden';
  
  const hoverStyles = hoverable 
    ? 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out' 
    : '';
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)]',
    md: 'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
    lg: 'shadow-[0_4px_16px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]',
  };

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
      onClick={onClick}
      style={style}
    >
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
    <div className={`pb-4 mb-4 border-b border-gray-100 flex items-center justify-between ${className}`}>
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
    <h2 className={`text-base sm:text-lg font-semibold text-gray-800 leading-tight ${className}`}>
      {children}
    </h2>
  );
}

interface CardSubtitleProps {
  children: ReactNode;
  className?: string;
}

export function CardSubtitle({ children, className = '' }: CardSubtitleProps) {
  return (
    <p className={`text-xs sm:text-sm text-gray-500 mt-1 ${className}`}>
      {children}
    </p>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`text-sm text-gray-700 leading-relaxed ${className}`}>
      {children}
    </div>
  );
}