import { useState } from "react";
import { addMonths, subMonths, startOfMonth } from "date-fns";

export function useCalendar(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(initialDate));

  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const setMonth = (date: Date) => setCurrentMonth(startOfMonth(date));

  return {
    currentMonth,
    nextMonth,
    prevMonth,
    setMonth,
  };
}
