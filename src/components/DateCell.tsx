import React, { memo } from "react";
import { format, isSameDay, isSameMonth } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getHoliday } from "@/lib/holidays";

// Helper function to figure out if date falls within a start-end range
function calculateInRange(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
  hoverDate: Date | null
): boolean {
  if (startDate && endDate) {
    const min = startDate < endDate ? startDate : endDate;
    const max = startDate < endDate ? endDate : startDate;
    return date > min && date < max;
  } else if (startDate && hoverDate && !endDate) {
    const min = startDate < hoverDate ? startDate : hoverDate;
    const max = startDate < hoverDate ? hoverDate : startDate;
    return date > min && date < max;
  }
  return false;
}

interface DateCellProps {
  date: Date;
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
}

const DateCellComponent = ({
  date,
  currentMonth,
  startDate,
  endDate,
  hoverDate,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: DateCellProps) => {
  const isSelectedStart = startDate && isSameDay(date, startDate);
  const isSelectedEnd = endDate && isSameDay(date, endDate);
  const inRange = calculateInRange(date, startDate, endDate, hoverDate);
  
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isToday = isSameDay(date, new Date());
  const holiday = getHoliday(date);

  const isReversedSelected = endDate && startDate && endDate < startDate;
  const isReversedHover = hoverDate && startDate && hoverDate < startDate;
  const isHoverEndMatch = !endDate && startDate && hoverDate && isSameDay(date, hoverDate) && !isSameDay(date, startDate);

  const ariaSelected = Boolean(isSelectedStart || isSelectedEnd || isHoverEndMatch);

  // Grouped ClassName definitions for structure
  const rootClasses = cn(
    "relative h-12 md:h-14 flex items-center justify-center cursor-pointer text-sm md:text-base font-semibold group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-color)] rounded",
    !isCurrentMonth ? "text-slate-300" : (isWeekend ? "text-[var(--theme-color)]" : "text-foreground")
  );

  const circleClasses = cn(
    "flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-colors duration-200",
    (isSelectedStart || isSelectedEnd) && "bg-[var(--theme-color)] text-white shadow-md z-10",
    !isSelectedStart && !isSelectedEnd && isToday && "bg-[var(--theme-color)] text-white", 
    !(isSelectedStart || isSelectedEnd) && !isToday && "group-hover:bg-slate-100",
    isHoverEndMatch && "bg-[var(--theme-color-light)] ring-1 ring-[var(--theme-color)] text-foreground z-10"
  );

  return (
    <button
      type="button"
      role="gridcell"
      aria-label={`${format(date, "MMMM d, yyyy")}${holiday ? `, ${holiday.name}` : ''}`}
      aria-selected={ariaSelected}
      className={rootClasses}
      onClick={() => onClick(date)}
      onMouseEnter={() => onMouseEnter(date)}
      onMouseLeave={onMouseLeave}
      // Re-map keyboard enter/space to onClick 
      onKeyDown={(e) => {
         if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(date);
         }
      }}
    >
      {/* Range Backgrounds leveraging stable layout anchors */}
      <motion.div 
        initial={false}
        animate={{ opacity: inRange ? 1 : 0, scale: inRange ? 1 : 0.8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute inset-x-[-2px] inset-y-0 bg-[var(--theme-color-light)] -z-10 origin-center pointer-events-none" 
      />

      <motion.div 
        initial={false}
        animate={{ opacity: isSelectedStart && (endDate || hoverDate) ? 1 : 0, scaleX: isSelectedStart && (endDate || hoverDate) ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "absolute top-0 bottom-0 w-[55%] bg-[var(--theme-color-light)] -z-10 pointer-events-none origin-left",
          isReversedSelected || isReversedHover ? "left-[-2px] right-auto origin-right" : "right-[-2px] left-auto origin-left"
        )} 
      />
      
      <motion.div 
        initial={false}
        animate={{ opacity: isSelectedEnd && startDate ? 1 : 0, scaleX: isSelectedEnd && startDate ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "absolute top-0 bottom-0 w-[55%] bg-[var(--theme-color-light)] -z-10 pointer-events-none origin-right",
          isReversedSelected ? "right-[-2px] left-auto origin-left" : "left-[-2px] right-auto origin-right"
        )} 
      />

      <motion.div 
        initial={false}
        animate={{ opacity: isHoverEndMatch ? 1 : 0, scaleX: isHoverEndMatch ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "absolute top-0 bottom-0 w-[55%] bg-[var(--theme-color-light)] -z-10 pointer-events-none origin-right",
          isReversedHover ? "right-[-2px] left-auto origin-left" : "left-[-2px] right-auto origin-right"
        )} 
      />
      
      {/* Date Marker Content */}
      <motion.div whileTap={{ scale: 0.9 }} className={circleClasses}>
        {format(date, "d")}
      </motion.div>

      {/* Holiday Indicator */}
      {holiday && (
        <div 
          className={cn(
            "absolute bottom-1 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full z-20 transition-all",
            (isSelectedStart || isSelectedEnd || isToday) ? "bg-white" : "bg-rose-400 group-hover:bg-rose-500"
          )}
          title={holiday.name}
        />
      )}
    </button>
  );
};

DateCellComponent.displayName = "DateCell";

/**
 * Custom comparative equality check completely eliminates generic looping evaluation.
 * If the literal visual derivation doesn't change, we skip the expensive render pipeline.
 */
export const DateCell = memo(DateCellComponent, (prev, next) => {
  if (!isSameDay(prev.date, next.date)) return false;
  if (prev.currentMonth.getTime() !== next.currentMonth.getTime()) return false;

  const prevIsStart = prev.startDate && isSameDay(prev.date, prev.startDate);
  const nextIsStart = next.startDate && isSameDay(next.date, next.startDate);
  if (prevIsStart !== nextIsStart) return false;

  const prevIsEnd = prev.endDate && isSameDay(prev.date, prev.endDate);
  const nextIsEnd = next.endDate && isSameDay(next.date, next.endDate);
  if (prevIsEnd !== nextIsEnd) return false;

  const prevInRange = calculateInRange(prev.date, prev.startDate, prev.endDate, prev.hoverDate);
  const nextInRange = calculateInRange(next.date, next.startDate, next.endDate, next.hoverDate);
  if (prevInRange !== nextInRange) return false;

  const prevIsHoverEnd = !prev.endDate && prev.startDate && prev.hoverDate && isSameDay(prev.date, prev.hoverDate) && !isSameDay(prev.date, prev.startDate);
  const nextIsHoverEnd = !next.endDate && next.startDate && next.hoverDate && isSameDay(next.date, next.hoverDate) && !isSameDay(next.date, next.startDate);
  if (prevIsHoverEnd !== nextIsHoverEnd) return false;

  // Track reverse drag directions
  const prevReversedSelected = !!(prev.endDate && prev.startDate && prev.endDate < prev.startDate);
  const nextReversedSelected = !!(next.endDate && next.startDate && next.endDate < next.startDate);
  if (prevIsStart && (prevReversedSelected !== nextReversedSelected)) return false;
  if (prevIsEnd && (prevReversedSelected !== nextReversedSelected)) return false;

  const prevReversedHover = !!(prev.hoverDate && prev.startDate && prev.hoverDate < prev.startDate);
  const nextReversedHover = !!(next.hoverDate && next.startDate && next.hoverDate < next.startDate);
  if (prevIsHoverEnd && (prevReversedHover !== nextReversedHover)) return false;
  if (prevIsStart && !prev.endDate && (prevReversedHover !== nextReversedHover)) return false;

  return true;
});
