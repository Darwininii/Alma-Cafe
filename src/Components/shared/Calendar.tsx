import { useState, useEffect } from "react";
import { CustomSelect } from "./CustomSelect";
import { CustomButton } from "./CustomButton";
import { CustomDivider } from "./CustomDivider";

interface CalendarProps {
  value: { start: string; end: string } | null;
  onChange: (value: { start: string; end: string } | null) => void;
  className?: string;
}

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

  const startDate = internalSelection?.start ? new Date(internalSelection.start + 'T00:00:00') : null;
  const endDate = internalSelection?.end ? new Date(internalSelection.end + 'T00:00:00') : null;

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
    clickedDate.setHours(0, 0, 0, 0);

    const isReset = !startDate || (startDate && endDate) || (startDate && clickedDate < startDate);

    let newSelection;
    if (isReset) {
      newSelection = { 
          start: clickedDate.toISOString().split('T')[0], 
          end: "" 
      };
    } else {
      newSelection = { 
          start: startDate!.toISOString().split('T')[0], 
          end: clickedDate.toISOString().split('T')[0] 
      };
    }
    setInternalSelection(newSelection);
  };

  const handleClear = () => {
      setInternalSelection(null);
      onChange(null);
  };

  const handleAccept = () => {
      onChange(internalSelection);
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
    if (hoverDate && hoverDate > startDate!) {
        return current.getTime() === hoverDate.getTime();
    }
    return false; 
  };

  const isInRangeHover = (day: number) => {
      if (!startDate || endDate || !hoverDate) return false;
      const current = new Date(year, month, day);
      current.setHours(0,0,0,0);
      return current > startDate && current < hoverDate;
  };
  
  const shouldShowConnector = (day: number) => {
      if (!startDate) return false;
      const current = new Date(year, month, day);
      current.setHours(0,0,0,0);

      if (endDate) {
          if (startDate.getTime() === endDate.getTime()) return false;
          return current >= startDate && current <= endDate;
      }
      
      if (hoverDate && hoverDate > startDate) {
          return current >= startDate && current <= hoverDate;
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
    <div className={`relative p-6 rounded-3xl bg-white/80 dark:bg-black/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-visible w-[340px] select-none ${className}`}>
        
        {/* Decorative Backgrounds */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Custom Selects */}
        <div className="relative flex items-center justify-between mb-6 z-20 gap-2">
           <div className="w-1/2">
                <CustomSelect 
                    options={monthOptions}
                    value={month.toString()}
                    onChange={handleMonthChange}
                    className="h-9 text-sm bg-transparent border-neutral-200 dark:border-white/10"
                />
           </div>
           <div className="w-1/2">
                <CustomSelect 
                    options={yearOptions}
                    value={year.toString()}
                    onChange={handleYearChange}
                    className="h-9 text-sm bg-transparent border-neutral-200 dark:border-white/10"
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
        <CustomDivider className="mt-6 mb-4 bg-black/40 dark:bg-white/70" variant="glass" />
        <div className="flex gap-2 z-20 relative">
            <CustomButton
                variant="outline"
                size="sm"
                className="w-1/2 border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-primary hover:text-white dark:hover:bg-white/5"
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
