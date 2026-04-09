import React, { useMemo } from "react";
import { eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek, differenceInDays, addDays } from "date-fns";
import { motion } from "framer-motion";
import { DateCell } from "./DateCell";

interface CalendarGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  toggleDateSelection: (date: Date) => void;
  setHoverDate: (date: Date | null) => void;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Premium Animation Variants for the Grid extracted to prevent infinite render loops
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.012, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  }
};

export function CalendarGrid({
  currentMonth,
  startDate,
  endDate,
  hoverDate,
  toggleDateSelection,
  setHoverDate,
}: CalendarGridProps) {

  const dates = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDateToRender = startOfWeek(monthStart, { weekStartsOn: 1 });
    let endDateToRender = endOfWeek(monthEnd, { weekStartsOn: 1 });

    // Edge Case: Force exactly 42 days (6 logical weeks) so height transitions smoothly
    const daysDiff = differenceInDays(endDateToRender, startDateToRender) + 1;
    if (daysDiff < 42) {
      endDateToRender = addDays(endDateToRender, 42 - daysDiff);
    }

    return eachDayOfInterval({
      start: startDateToRender,
      end: endDateToRender,
    });
  }, [currentMonth]);

  return (
    <div className="flex-[2] p-4 md:p-6 lg:p-10 flex flex-col bg-[var(--theme-color-light)] transition-colors duration-700" role="grid" aria-label="Monthly Calendar">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-4" role="row">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            role="columnheader"
            aria-label={day}
            className={`text-center font-extrabold text-xs md:text-sm tracking-widest ${i >= 5 ? "text-[var(--theme-color)]" : "text-slate-400"}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid with Staggered Entrance */}
      <motion.div
        role="rowgroup"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        key={currentMonth.toISOString()} // Forces the stagger animation to replay when month changes
      >
        <div className="grid grid-cols-7 flex-1 gap-y-2 md:gap-y-4 auto-rows-min" role="row">
          {dates.map((date) => (
            <motion.div key={date.toISOString()} className="flex h-full w-full">
              <DateCell
                date={date}
                currentMonth={currentMonth}
                startDate={startDate}
                endDate={endDate}
                hoverDate={hoverDate}
                onClick={toggleDateSelection}
                onMouseEnter={setHoverDate}
                onMouseLeave={() => setHoverDate(null)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
