import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';

export type DateRangePickerSize = 'sm' | 'md' | 'lg';

export interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  size?: DateRangePickerSize;
  placeholder?: { start: string; end: string };
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
  { label: '近90天', days: 90 },
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

export default function DateRangePicker({
  value,
  onChange,
  size = 'md',
  placeholder = { start: '开始日期', end: '结束日期' },
  disabled = false,
  className = '',
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStartDate, setCurrentStartDate] = useState(() => {
    const parsed = parseDate(value.startDate);
    return parsed || new Date();
  });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);
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

  const startDate = parseDate(value.startDate);
  const endDate = parseDate(value.endDate);
  const year = currentStartDate.getFullYear();
  const month = currentStartDate.getMonth();
  const days = getDaysInMonth(year, month);
  const nextMonthDays = getDaysInMonth(year, month + 1);
  const firstDayOfMonth = days[0].getDay();

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentStartDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    setCurrentStartDate(newDate);
  };

  const handleYearChange = (delta: number) => {
    const newDate = new Date(year + delta, month, 1);
    setCurrentStartDate(newDate);
  };

  const isInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false;
    const dateStr = formatDate(date);
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);
    return dateStr >= startStr && dateStr <= endStr;
  };

  const isStartDate = (date: Date): boolean => {
    if (!startDate) return false;
    return formatDate(date) === formatDate(startDate);
  };

  const isEndDate = (date: Date): boolean => {
    if (!endDate) return false;
    return formatDate(date) === formatDate(endDate);
  };

  const handleSelectDate = (date: Date) => {
    const dateStr = formatDate(date);
    
    if (selectingStart) {
      if (endDate && dateStr > formatDate(endDate)) {
        onChange({ startDate: dateStr, endDate: dateStr });
      } else {
        onChange({ ...value, startDate: dateStr });
      }
      setSelectingStart(false);
    } else {
      if (startDate && dateStr < formatDate(startDate)) {
        onChange({ startDate: dateStr, endDate: formatDate(startDate) });
      } else {
        onChange({ ...value, endDate: dateStr });
      }
      setIsOpen(false);
    }
  };

  const handleQuickRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    onChange({
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({ startDate: '', endDate: '' });
    setIsOpen(false);
    setSelectingStart(true);
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-3 text-base rounded-xl',
  };

  const allDays = [...days, ...nextMonthDays];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all ${sizeStyles[size]} ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-400'} ${className}`}
      >
        <div className="flex items-center gap-2 flex-1 justify-start">
          <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className={value.startDate ? 'text-gray-900' : 'text-gray-400'}>
            {value.startDate || placeholder.start}
          </span>
        </div>
        <div className="flex items-center gap-2 px-2">
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1 justify-end">
          <span className={value.endDate ? 'text-gray-900' : 'text-gray-400'}>
            {value.endDate || placeholder.end}
          </span>
        </div>
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
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-800">
                {year}年 {MONTHS[month]}
              </span>
              <span className="text-gray-400">~</span>
              <span className="text-sm font-semibold text-gray-800">
                {year}年 {MONTHS[(month + 1) % 12]}
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

          <div className="grid grid-cols-14 gap-1 p-2">
            <div className="col-span-7">
              <div className="grid grid-cols-7 gap-1">
                {WEEK_DAYS.map((day) => (
                  <div key={`first-${day}`} className="text-center py-2 text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
                  <div key={`first-empty-${i}`} className="h-9" />
                ))}
                
                {days.map((date) => {
                  const inRange = isInRange(date);
                  const isStart = isStartDate(date);
                  const isEnd = isEndDate(date);
                  const isHovered = hoveredDate && formatDate(date) === formatDate(hoveredDate);

                  return (
                    <button
                      key={`first-${formatDate(date)}`}
                      onClick={() => handleSelectDate(date)}
                      onMouseEnter={() => setHoveredDate(date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={`h-9 w-full flex items-center justify-center text-sm rounded-lg transition-all relative ${
                        inRange && !isStart && !isEnd
                          ? 'bg-primary-100 text-gray-700'
                          : isStart
                          ? 'bg-primary-500 text-white font-medium rounded-l-lg'
                          : isEnd
                          ? 'bg-primary-500 text-white font-medium rounded-r-lg'
                          : isHovered
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {date.getDate()}
                      {inRange && !isStart && !isEnd && (
                        <span className="absolute inset-0 bg-primary-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-7">
              <div className="grid grid-cols-7 gap-1">
                {WEEK_DAYS.map((day) => (
                  <div key={`second-${day}`} className="text-center py-2 text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: nextMonthDays[0].getDay() === 0 ? 6 : nextMonthDays[0].getDay() - 1 }).map((_, i) => (
                  <div key={`second-empty-${i}`} className="h-9" />
                ))}
                
                {nextMonthDays.map((date) => {
                  const inRange = isInRange(date);
                  const isStart = isStartDate(date);
                  const isEnd = isEndDate(date);
                  const isHovered = hoveredDate && formatDate(date) === formatDate(hoveredDate);

                  return (
                    <button
                      key={`second-${formatDate(date)}`}
                      onClick={() => handleSelectDate(date)}
                      onMouseEnter={() => setHoveredDate(date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={`h-9 w-full flex items-center justify-center text-sm rounded-lg transition-all ${
                        inRange && !isStart && !isEnd
                          ? 'bg-primary-100 text-gray-700'
                          : isStart
                          ? 'bg-primary-500 text-white font-medium rounded-l-lg'
                          : isEnd
                          ? 'bg-primary-500 text-white font-medium rounded-r-lg'
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
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-3 h-3" />
              清除
            </button>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-primary-500" />
                {selectingStart ? '选择开始日期' : '选择结束日期'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}