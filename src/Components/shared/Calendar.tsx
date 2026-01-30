import { useState, useEffect } from "react";
import { CustomSelect } from "./CustomSelect";
import { CustomButton } from "./CustomButton";
import { CustomDivider } from "./CustomDivider";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface CalendarProps {
  value: { start: string; end: string } | null;
  onChange: (value: { start: string; end: string } | null) => void;
  className?: string;
}

// Helper to format date as YYYY-MM-DD using local time
const toLocalISOString = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const Calendar = ({ value, onChange, className = "" }: CalendarProps) => {
  // State for navigation (what month we are looking at)
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Internal state for selection handling before committing
  const [internalSelection, setInternalSelection] = useState(value);

  // Sync internal state if external value changes (optional, but good practice)
  // However, we want the internal state to persist while the user is playing around.
  // We should sync it ONLY if the external value is drastically different or on mount.
  // For now, let's initialize it and maybe sync if value becomes null externally.
  // Actually, standard controlled component behavior: sync with props.
  useEffect(() => {
      setInternalSelection(value);
  }, [value]);

  // Parse YYYY-MM-DD explicitly to avoid timezone issues
  const parseDate = (str: string | undefined) => {
      if (!str) return null;
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
  };

  const startDate = parseDate(internalSelection?.start);
  const endDate = parseDate(internalSelection?.end);

  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sunday

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    // clickedDate.setHours(0, 0, 0, 0); // Not strictly necessary if we use toLocalISOString correctly

    // Convert existing start/end to Date objects for comparison
    const currentStart = startDate ? new Date(startDate.getTime()) : null;
    const currentEnd = endDate ? new Date(endDate.getTime()) : null;
    
    // Check if we should reset (start new range)
    // Reset if: 
    // 1. No start date yet
    // 2. Range is already complete (start and end exist) -> user clicking starts new range
    const isReset = !currentStart || (currentStart && currentEnd);

    let newSelection;
    if (isReset) {
      newSelection = { 
          start: toLocalISOString(clickedDate), 
          end: "" 
      };
    } else {
      // Range completion logic
      // If clicked date is BEFORE current start, we swap them to ensure Start < End
      if (clickedDate < currentStart) {
          newSelection = {
              start: toLocalISOString(clickedDate),
              end: toLocalISOString(currentStart)
          };
      } else {
          newSelection = { 
              start: toLocalISOString(currentStart), 
              end: toLocalISOString(clickedDate) 
          };
      }
    }
    setInternalSelection(newSelection);
  };

  const handleClear = () => {
      setInternalSelection(null);
      onChange(null);
  };

  const handleAccept = () => {
      if (internalSelection && internalSelection.start && !internalSelection.end) {
          // If only start is selected, treat as single day range (start = end)
          const singleDaySelection = {
              start: internalSelection.start,
              end: internalSelection.start
          };
          onChange(singleDaySelection);
          setInternalSelection(singleDaySelection); // Update internal state too
      } else {
          onChange(internalSelection);
      }
  };

  const isSelected = (day: number) => {
    if (!startDate) return false;
    const current = new Date(year, month, day);
    current.setHours(0,0,0,0);
    
    if (startDate && !endDate && current.getTime() === startDate.getTime()) return true;

    if (startDate && endDate) {
        return current >= startDate && current <= endDate;
    }
    return false;
  };

  const isRangeStart = (day: number) => {
    if (!startDate) return false;
    const current = new Date(year, month, day);
    current.setHours(0,0,0,0);
    return current.getTime() === startDate.getTime();
  };

  const isRangeEnd = (day: number) => {
    const current = new Date(year, month, day);
    current.setHours(0,0,0,0);

    if (endDate) {
        return current.getTime() === endDate.getTime();
    }
    // If selecting (no end date yet), hover date acts as potential end
    if (hoverDate) {
        return current.getTime() === hoverDate.getTime();
    }
    return false; 
  };

  // Check if a day is within the hover range (dynamic selection preview)
  const isInRangeHover = (day: number) => {
      // Logic: Start Date is set, End Date is NOT set, and we are hovering
      if (!startDate || endDate || !hoverDate) return false;
      
      const current = new Date(year, month, day);
      current.setHours(0,0,0,0);

      // Forward hover: Start < Current < Hover
      if (current > startDate && current < hoverDate) return true;
      
      // Backward hover: Hover < Current < Start
      if (current < startDate && current > hoverDate) return true;
      
      return false;
  };
  
  const shouldShowConnector = (day: number) => {
      if (!startDate) return false;
      const current = new Date(year, month, day);
      current.setHours(0,0,0,0);

      // Case 1: Range is finalized (Start & End exist)
      if (endDate) {
          if (startDate.getTime() === endDate.getTime()) return false;
          return current >= startDate && current <= endDate;
      }
      
      // Case 2: Range is in progress (Only Start, hovering for End)
      if (hoverDate) {
          // Forward selection visualization
          if (hoverDate > startDate) {
            return current >= startDate && current <= hoverDate;
          }
          // Backward selection visualization
          if (hoverDate < startDate) {
             return current <= startDate && current >= hoverDate;
          }
      }
      
      return false;
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weekDays = ["D", "L", "M", "X", "J", "V", "S"];

  const monthOptions = monthNames.map((m, i) => ({ value: i.toString(), label: m }));
  
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: (currentYear + 10) - 1900 + 1 }, (_, i) => {
      const y = 1900 + i;
      return { value: y.toString(), label: y.toString() };
  }).reverse(); 

  const handleMonthChange = (val: string) => {
      setCurrentDate(new Date(year, parseInt(val), 1));
  };

  const handleYearChange = (val: string) => {
      setCurrentDate(new Date(parseInt(val), month, 1));
  };


  return (
    <div className={`relative p-6 rounded-3xl bg-white/80 dark:bg-black/90 backdrop-blur-2xl border border-black/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-visible w-[340px] select-none ${className}`}>
        
        {/* Decorative Backgrounds */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Navigation Buttons Row */}
        <div className="relative flex items-center justify-between mb-4 z-20">
            <CustomButton
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-neutral-600 dark:text-neutral-300 bg-black/5 hover:bg-black/40 hover:text-white dark:bg-white/10 dark:hover:bg-white/40 dark:hover:text-white"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            >
                <IoChevronBack size={18} />
            </CustomButton>

            <span className="text-sm font-bold text-neutral-700 dark:text-white capitalize">
                {monthNames[month]} {year}
            </span>

            <CustomButton
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-neutral-600 dark:text-neutral-300 bg-black/5 hover:bg-black/40 hover:text-white dark:bg-white/10 dark:hover:bg-white/40 dark:hover:text-white"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            >
                <IoChevronForward size={18} />
            </CustomButton>
        </div>

        {/* Header with Custom Selects - Hidden if buttons are sufficient, or kept as requested "buttons above selects" */}
        {/* User asked for buttons "above" the selects, implying they want both or maybe wants easier nav. 
            The selects are useful for big jumps. I will keep them but possibly remove the title I added above if it's redundant.
            Actually, user said "above the selects", so keeping selects is correct. 
            I will keep the selects below the buttons.
        */}
        <div className="relative flex items-center justify-between mb-6 z-20 gap-2">
           <div className="w-1/2">
                <CustomSelect 
                    options={monthOptions}
                    value={month.toString()}
                    onChange={handleMonthChange}
                    className="h-9 text-sm bg-transparent border-black/40 dark:border-white/10"
                />
           </div>
           <div className="w-1/2">
                <CustomSelect 
                    options={yearOptions}
                    value={year.toString()}
                    onChange={handleYearChange}
                    className="h-9 text-sm bg-transparent border-black/40 dark:border-white/10"
                />
           </div>
        </div>

        {/* Grid Header */}
        <div className="grid grid-cols-7 mb-2 z-10 relative">
            {weekDays.map((d, i) => (
                <div key={i} className="flex justify-center items-center h-8">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{d}</span>
                </div>
            ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-2 z-10 relative">
            {/* Empty placeholders for start of month */}
            {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9 w-9" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isDaySelected = isSelected(day);
                const isStart = isRangeStart(day);
                const isEnd = isRangeEnd(day);
                const showConnector = shouldShowConnector(day);
                
                const dateObj = new Date(year, month, day);
                const isToday = new Date().toDateString() === dateObj.toDateString();

                return (
                    <div 
                        key={day} 
                        className="relative flex justify-center items-center group"
                        onMouseEnter={() => setHoverDate(new Date(year, month, day))}
                        onMouseLeave={() => setHoverDate(null)}
                    >   
                        {/* Range Background Connector */}
                        {showConnector && (
                             <div className={`absolute top-0 bottom-0 bg-neutral-100 dark:bg-white/10
                                ${isStart ? 'left-1/2 right-0 rounded-l-none' : ''}
                                ${isEnd ? 'left-0 right-1/2 rounded-r-none' : ''}
                                ${!isStart && !isEnd ? 'left-0 right-0' : ''}
                            `} />
                        )}

                        <button
                            onClick={() => handleDateClick(day)}
                            className={`
                                relative w-9 h-9 rounded-lg text-sm font-medium transition-all duration-300 z-10
                                flex items-center justify-center cursor-pointer
                                ${isDaySelected || (isInRangeHover(day) && !isEnd)
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg shadow-neutral-900/20 dark:shadow-white/10 scale-100' 
                                    : 'text-black hover:text-white dark:text-white dark:hover:bg-white/90 dark:hover:text-black'
                                }
                                ${(isEnd && !endDate && hoverDate) ? 'bg-neutral-900 text-black dark:bg-white font-bold dark:text-white' : ''}
                                ${isToday && !isDaySelected && !showConnector ? 'text-black bg-black/20  dark:bg-white/20 font-bold' : ''}
                            `}
                        >
                            {day}
                        </button>
                    </div>
                );
            })}
        </div>

        {/* Footer Actions */}
        <CustomDivider className="mt-6 mb-4 bg-black/40 dark:bg-white/40" variant="glass" />
        <div className="flex gap-2 z-20 relative">
            <CustomButton
                variant="outline"
                size="sm"
                className="w-1/2 border-black/40 dark:border-white/10 text-black dark:text-neutral-300 hover:bg-primary hover:text-white dark:hover:bg-white/5"
                onClick={handleClear}
            >
                Limpiar
            </CustomButton>
            <CustomButton
                variant="solid"
                size="sm"
                className="w-1/2 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-white/90"
                onClick={handleAccept}
            >
                Aceptar
            </CustomButton>
        </div>
    </div>
  );
};
