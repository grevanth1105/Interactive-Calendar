import { useState, useCallback } from "react";
import { isBefore, isSameDay } from "date-fns";

export function useDateRange() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const toggleDateSelection = useCallback((date: Date) => {
    setStartDate(prevStart => {
      setEndDate(prevEnd => {
        if (!prevStart) {
          return null; // endDate is null
        } else if (prevStart && !prevEnd) {
          if (isBefore(date, prevStart)) {
            return null; // endDate is null
          } else if (isSameDay(date, prevStart)) {
            return null;
          } else {
            return date; // SET endDate
          }
        } else if (prevStart && prevEnd) {
          if (isSameDay(date, prevStart) || isSameDay(date, prevEnd)) {
            return null;
          } else {
            return null;
          }
        }
        return prevEnd;
      });

      // We handle setStartDate side effects immediately since the updater
      // functions can't safely cause state side effects. Let's just use the current closure state
      // but wrap inside useCallback dependencies.
      return prevStart;
    });
  }, []);

  // Wait, writing purely functional updates for dual complex state is dangerous/buggy.
  // Better to use useCallback and add `startDate, endDate` to deps array!
  const optimizedToggleDateSelection = useCallback((date: Date) => {
    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isBefore(date, startDate)) {
        setStartDate(date);
      } else if (isSameDay(date, startDate)) {
        setStartDate(null);
      } else {
        setEndDate(date);
      }
    } else if (startDate && endDate) {
      if (isSameDay(date, startDate) || isSameDay(date, endDate)) {
        setStartDate(null);
        setEndDate(null);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    }
  }, [startDate, endDate]);

  const handleHoverDate = useCallback((date: Date | null) => {
    if (startDate && !endDate) {
      setHoverDate(date);
    } else {
      setHoverDate(null);
    }
  }, [startDate, endDate]);

  return {
    startDate,
    endDate,
    hoverDate,
    toggleDateSelection: optimizedToggleDateSelection,
    setHoverDate: handleHoverDate,
  };
}
