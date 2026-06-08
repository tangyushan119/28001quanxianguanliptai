import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export default function Table({
  children,
  className = '',
  striped = false,
  hoverable = false,
}: TableProps) {
  const baseStyles = 'w-full border-collapse text-sm';

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className={baseStyles}>
        {children}
      </table>
    </div>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <thead className={`bg-gradient-to-r from-primary-50 to-accent-50 ${className}`}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export function TableBody({
  children,
  className = '',
  striped = false,
  hoverable = false,
}: TableBodyProps) {
  const baseStyles = 'divide-y divide-gray-100';
  
  const rowStyles = striped 
    ? 'even:bg-gray-50/60' 
    : '';
    
  const hoverStyles = hoverable 
    ? 'hover:bg-primary-50/50' 
    : '';

  return (
    <tbody className={`${baseStyles} ${rowStyles} ${className}`}>
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function TableRow({ children, className = '', hoverable = false }: TableRowProps) {
  const hoverStyles = hoverable ? 'hover:bg-primary-50/60 transition-colors duration-150' : '';
  
  return (
    <tr className={`${hoverStyles} ${className}`}>
      {children}
    </tr>
  );
}

interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function TableHeaderCell({
  children,
  className = '',
  align = 'left',
}: TableHeaderCellProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th className={`px-6 py-3.5 text-xs font-semibold text-primary-700 uppercase tracking-wider ${alignStyles[align]} ${className} border-b border-primary-100`}>
      {children}
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  nowrap?: boolean;
}

export function TableCell({
  children,
  className = '',
  align = 'left',
  nowrap = false,
}: TableCellProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const nowrapStyles = nowrap ? 'whitespace-nowrap' : '';

  return (
    <td className={`px-6 py-3.5 text-sm text-gray-700 leading-relaxed ${alignStyles[align]} ${nowrapStyles} ${className}`}>
      {children}
    </td>
  );
}