import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

export type DatePickerSize = 'sm' | 'md' | 'lg';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  size?: DatePickerSize;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const quickRanges = [
  { label: '今天', days: 0 },
  { label: '昨天', days: 1 },
  { label: '本周', days: 7 },
  { label: '本月', days: 30 },
  { label: '近7天', days: 7 },
  { label: '近30天', days: 30 },
];

function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  return days;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date | null {
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

export default function DatePicker({
  value,
  onChange,
  size = 'md',
  placeholder = '选择日期',
  disabled = false,
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const parsed = parseDate(value);
    return parsed || new Date();
  });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedDate = parseDate(value);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getDaysInMonth(year, month);
  const firstDayOfMonth = days[0].getDay();
  const weekStart = getWeekStart(days[0]);

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    setCurrentDate(newDate);
  };

  const handleYearChange = (delta: number) => {
    const newDate = new Date(year + delta, month, 1);
    setCurrentDate(newDate);
  };

  const handleSelectDate = (date: Date) => {
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const handleQuickRange = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return formatDate(date) === formatDate(selectedDate);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isSameMonth = (date: Date): boolean => {
    return date.getMonth() === month && date.getFullYear() === year;
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-3 text-base rounded-xl',
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all ${sizeStyles[size]} ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-400'} ${className}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              onClick={() => handleYearChange(-1)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                {year}年 {MONTHS[month]}
              </span>
            </div>
            <button
              onClick={() => handleYearChange(1)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {quickRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handleQuickRange(range.days)}
                  className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 p-2">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="text-center py-2 text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9" />
            ))}
            
            {days.map((date) => {
              const isSelectedDay = isSelected(date);
              const isTodayDay = isToday(date);
              const isOutsideMonth = !isSameMonth(date);
              const isHovered = hoveredDate && formatDate(date) === formatDate(hoveredDate);

              return (
                <button
                  key={formatDate(date)}
                  onClick={() => handleSelectDate(date)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`h-9 w-full flex items-center justify-center text-sm rounded-lg transition-all ${
                    isOutsideMonth
                      ? 'text-gray-300 cursor-default'
                      : isSelectedDay
                      ? 'bg-primary-500 text-white font-medium'
                      : isTodayDay
                      ? 'text-primary-600 font-medium hover:bg-primary-50'
                      : isHovered
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-3 h-3" />
              清除
            </button>
            <button
              onClick={() => {
                const today = new Date();
                onChange(formatDate(today));
                setIsOpen(false);
              }}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              今天
            </button>
          </div>
        </div>
      )}
    </div>
  );
}