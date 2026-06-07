import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
  status?: InputStatus;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      status = 'default',
      leftIcon,
      rightIcon,
      errorMessage,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full outline-none transition-all duration-200 ease-in-out';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-5 py-3 text-base rounded-xl',
    };

    const statusStyles = {
      default: 'bg-white border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-900 placeholder-gray-400',
      error: 'bg-white border border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500/20 text-gray-900 placeholder-gray-400',
      success: 'bg-white border border-success-500 focus:border-success-500 focus:ring-2 focus:ring-success-500/20 text-gray-900 placeholder-gray-400',
    };

    const disabledStyles = 'bg-gray-50 cursor-not-allowed opacity-60';

    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${sizeStyles[size]} ${statusStyles[status]} ${props.disabled ? disabledStyles : ''} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${status === 'error' ? 'text-error-500' : status === 'success' ? 'text-success-500' : 'text-gray-400'}`}>
            {rightIcon}
          </span>
        )}
        {errorMessage && status === 'error' && (
          <p className="mt-1 text-sm text-error-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;