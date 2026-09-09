import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Check } from 'lucide-react';

interface DateTimePickerProps {
  selectedDate: Date;
  selectedTime: string;
  onChange: (date: Date, time: string, formattedSlot: string) => void;
  minDate?: Date;
}

const TIME_SLOTS = [
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM'
];

const WEEKDAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const formatSlotString = (date: Date, time: string): string => {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const year = date.getFullYear();
  return `${day} ${month} ${year} at ${time}`;
};

export const formatDateString = (date: Date): string => {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onChange,
  minDate = new Date()
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keep view year/month in sync if selectedDate changes externally
  useEffect(() => {
    setViewMonth(selectedDate.getMonth());
    setViewYear(selectedDate.getFullYear());
  }, [selectedDate]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Build calendar matrix (Monday as first day of week)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  // In JS: Sunday is 0, Monday is 1 ... Saturday is 6
  // Convert so Monday is 0, Sunday is 6:
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells: {
    day: number;
    monthOffset: -1 | 0 | 1;
    date: Date;
    isPast: boolean;
    isSelected: boolean;
    isToday: boolean;
  }[] = [];

  const now = new Date();
  const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const selectedDateOnly = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  ).getTime();

  // Previous month trailing days
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthDate = new Date(viewYear, viewMonth - 1, day);
    const dateOnly = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), prevMonthDate.getDate()).getTime();
    calendarCells.push({
      day,
      monthOffset: -1,
      date: prevMonthDate,
      isPast: dateOnly < todayDateOnly,
      isSelected: dateOnly === selectedDateOnly,
      isToday: dateOnly === todayDateOnly
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const cellDate = new Date(viewYear, viewMonth, day);
    const dateOnly = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()).getTime();
    calendarCells.push({
      day,
      monthOffset: 0,
      date: cellDate,
      isPast: dateOnly < todayDateOnly,
      isSelected: dateOnly === selectedDateOnly,
      isToday: dateOnly === todayDateOnly
    });
  }

  // Next month leading days to complete 35 or 42 grid
  const remainingCells = 35 - calendarCells.length > 0 ? 35 - calendarCells.length : 42 - calendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthDate = new Date(viewYear, viewMonth + 1, day);
    const dateOnly = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), nextMonthDate.getDate()).getTime();
    calendarCells.push({
      day,
      monthOffset: 1,
      date: nextMonthDate,
      isPast: false,
      isSelected: dateOnly === selectedDateOnly,
      isToday: dateOnly === todayDateOnly
    });
  }

  const handleSelectDate = (date: Date) => {
    onChange(date, selectedTime, formatSlotString(date, selectedTime));
  };

  const handleSelectTime = (time: string) => {
    onChange(selectedDate, time, formatSlotString(selectedDate, time));
  };

  const formattedDisplay = formatSlotString(selectedDate, selectedTime);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-300 hover:border-[#EA580C] focus:border-[#EA580C] focus:ring-2 focus:ring-orange-500/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 flex items-center justify-between transition-all group cursor-pointer shadow-xs text-left"
        aria-label="Select consultation callback date and time"
      >
        <div className="flex items-center gap-2 truncate">
          <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="font-bold text-slate-800 text-xs sm:text-sm block truncate">
              {formattedDisplay}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-[#EA580C] transition-colors shrink-0 ml-2">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold text-orange-600 hidden sm:inline">Change</span>
        </div>
      </button>

      {/* Popover / Dropdown Calendar & Time Picker */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto top-full mt-2 z-50 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 w-full sm:w-[370px] max-w-[95vw]">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
            {/* Left Column: Calendar */}
            <div className="flex-1 space-y-3">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Weekday Names Header */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAY_NAMES.map((name) => (
                  <span key={name} className="text-[10px] font-bold text-slate-400 py-0.5">
                    {name}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarCells.map((cell, idx) => {
                  const isCurrentMonth = cell.monthOffset === 0;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={cell.isPast}
                      onClick={() => handleSelectDate(cell.date)}
                      className={`h-8 w-8 sm:h-8 sm:w-8 mx-auto flex flex-col items-center justify-center text-xs transition-all relative rounded-xl font-medium ${
                        cell.isSelected
                          ? 'bg-[#EA580C] text-white font-bold shadow-md shadow-orange-500/20 scale-105 z-10'
                          : cell.isPast
                          ? 'text-slate-300 cursor-not-allowed'
                          : isCurrentMonth
                          ? 'text-slate-700 hover:bg-orange-50 hover:text-[#EA580C] cursor-pointer'
                          : 'text-slate-300 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <span>{cell.day}</span>
                      {/* Availability or today dot indicator */}
                      {(cell.isToday || (!cell.isPast && isCurrentMonth && (cell.day === 4 || cell.day === 14 || cell.day === 21 || cell.day === 28))) && !cell.isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#EA580C] absolute bottom-1"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Time Slots List */}
            <div className="w-full sm:w-28 sm:border-l sm:border-slate-100 sm:pl-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 sm:text-left text-center">
                Available Time
              </span>
              <div className="max-h-52 sm:max-h-56 overflow-y-auto space-y-1 pr-1 overscroll-contain">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleSelectTime(time)}
                      className={`w-full py-1.5 px-2 text-[11px] rounded-lg transition-all text-center block ${
                        isSelected
                          ? 'bg-orange-100 text-[#EA580C] font-bold border border-orange-200'
                          : 'text-slate-600 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer with summary and confirm */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
              Selected: <span className="font-bold text-slate-800">{formatDateString(selectedDate)}</span> at <span className="font-bold text-[#EA580C]">{selectedTime}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1 transition-all"
            >
              <Check className="w-3 h-3" />
              <span>Set Slot</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
