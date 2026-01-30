import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  className,
  error,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useLayoutEffect(() => {
    if (isOpen && listRef.current && value) {
      const selectedElement = listRef.current.querySelector(`[data-value="${value}"]`) as HTMLElement;
      if (selectedElement) {
        // Calculate the position to center the element
        const container = listRef.current;
        const scrollPosition = selectedElement.offsetTop - container.clientHeight / 2 + selectedElement.clientHeight / 2;
        
        container.scrollTo({
            top: scrollPosition,
            behavior: "instant" // Use instant for immediate positioning on open
        });
      }
    }
  }, [isOpen, value]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={cn(
          "w-full h-auto py-1.5 px-3 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-white/10 dark:text-white rounded-full flex items-center justify-between cursor-pointer transition-all outline-none",
          isOpen && "ring-2 ring-primary/50 border-primary/50",
          error && "border-red-500 ring-1 ring-red-500",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn("text-sm", !selectedOption && "text-neutral-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaAngleDown
          className={cn(
            "opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
            ref={listRef}
          >
            {options.map((option) => (
              <div
                key={option.value}
                data-value={option.value}
                className={cn(
                  "px-4 py-3 text-sm cursor-pointer dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-white/5",
                  value === option.value && "bg-primary/10 dark:text-primary text-primary font-medium dark:bg-primary/20"
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && <p className="text-red-500 text-xs ml-1 mt-1">{error}</p>}
    </div>
  );
};
