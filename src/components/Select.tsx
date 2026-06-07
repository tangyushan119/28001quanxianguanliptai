import { SelectHTMLAttributes, ReactNode, forwardRef } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectStatus = 'default' | 'error' | 'success';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  size?: SelectSize;
  status?: SelectStatus;
  children: ReactNode;
  errorMessage?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      status = 'default',
      children,
      errorMessage,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full outline-none transition-all duration-200 ease-in-out appearance-none bg-no-repeat bg-right cursor-pointer';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg pr-10',
      lg: 'px-5 py-3 text-base rounded-xl pr-12',
    };

    const statusStyles = {
      default: 'bg-white border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-900',
      error: 'bg-white border border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500/20 text-gray-900',
      success: 'bg-white border border-success-500 focus:border-success-500 focus:ring-2 focus:ring-success-500/20 text-gray-900',
    };

    const disabledStyles = 'bg-gray-50 cursor-not-allowed opacity-60';

    return (
      <div className="relative">
        <select
          ref={ref}
          className={`${baseStyles} ${sizeStyles[size]} ${statusStyles[status]} ${props.disabled ? disabledStyles : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        <svg
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${status === 'error' ? 'text-error-500' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {errorMessage && status === 'error' && (
          <p className="mt-1 text-sm text-error-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;