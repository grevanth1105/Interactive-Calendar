"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { HeroSection } from "./HeroSection";
import { NotesPanel } from "./NotesPanel";
import { CalendarGrid } from "./CalendarGrid";

const MONTH_THEMES = [
  { image: "https://picsum.photos/seed/cal_jan/1600/900" }, // Jan
  { image: "https://picsum.photos/seed/cal_feb/1600/900" }, // Feb
  { image: "https://picsum.photos/seed/cal_mar/1600/900" }, // Mar
  { image: "https://picsum.photos/seed/cal_apr/1600/900" }, // Apr
  { image: "https://picsum.photos/seed/cal_may/1600/900" }, // May
  { image: "https://picsum.photos/seed/cal_jun/1600/900" }, // Jun
  { image: "https://picsum.photos/seed/cal_jul/1600/900" }, // Jul
  { image: "https://picsum.photos/seed/cal_aug/1600/900" }, // Aug
  { image: "https://picsum.photos/seed/cal_sep/1600/900" }, // Sep
  { image: "https://picsum.photos/seed/cal_oct/1600/900" }, // Oct
  { image: "https://picsum.photos/seed/cal_nov/1600/900" }, // Nov
  { image: "https://picsum.photos/seed/cal_dec/1600/900" }, // Dec
];

export function CalendarWidget() {
  const { currentMonth, nextMonth, prevMonth } = useCalendar();
  const { startDate, endDate, hoverDate, toggleDateSelection, setHoverDate } = useDateRange();
  
  const [direction, setDirection] = useState(0);
  const [extractedThemeColor, setExtractedThemeColor] = useState("#1e92d0"); // Fallback initial blue

  const handleNextMonth = () => {
    setDirection(1);
    nextMonth();
  };

  const handlePrevMonth = () => {
    setDirection(-1);
    prevMonth();
  };

  const handleColorExtracted = (colorHex: string) => {
    setExtractedThemeColor(colorHex);
  };

  const currentMonthIndex = currentMonth.getMonth();
  const theme = MONTH_THEMES[currentMonthIndex];

  // Up/down flip variant
  const variants = {
    enter: (direction: number) => ({
      rotateX: direction > 0 ? -90 : 90,
      y: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      rotateX: 0,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      rotateX: direction < 0 ? -90 : 90,
      y: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div 
      className="w-full max-w-5xl bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] rounded-b-2xl relative perspective-[1200px] border border-slate-100"
      style={{
        '--theme-color': extractedThemeColor,
        '--theme-color-light': `${extractedThemeColor}15`,
        '--theme-color-hover': `${extractedThemeColor}cc`,
      } as React.CSSProperties}
    >
      {/* Ultra-realistic Metallic Binder Rings */}
      <div className="absolute top-0 left-0 right-0 h-6 flex justify-around px-[4%] md:px-[6%] z-[100] pointer-events-none overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <div 
            key={i} 
            className="w-[3px] md:w-[6px] h-8 md:h-[38px] bg-gradient-to-b from-zinc-300 via-zinc-600 to-zinc-900 rounded-full shadow-[0_5px_8px_rgba(0,0,0,0.6)] border-[0.5px] border-zinc-900 border-t-zinc-100 -mt-[12px] md:-mt-[16px]" 
          />
        ))}
      </div>

      <div className="relative w-full h-full" style={{ minHeight: "45rem" }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateX: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.3 },
              y: { type: "spring", stiffness: 200, damping: 25 }
            }}
            className="w-full h-full flex flex-col bg-white overflow-hidden origin-top rounded-b-xl"
          >
            <HeroSection 
              currentMonth={currentMonth} 
              imageUrl={theme.image}
              onNextMonth={handleNextMonth} 
              onPrevMonth={handlePrevMonth}
              onColorExtracted={handleColorExtracted}
            />
            
            <div className="flex flex-col md:flex-row relative bg-white">
              <NotesPanel startDate={startDate} />
              
              <CalendarGrid 
                currentMonth={currentMonth}
                startDate={startDate}
                endDate={endDate}
                hoverDate={hoverDate}
                toggleDateSelection={toggleDateSelection}
                setHoverDate={setHoverDate}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
