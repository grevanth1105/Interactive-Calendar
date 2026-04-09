import React, { useRef, useEffect } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FastAverageColor } from "fast-average-color";
import { motion } from "framer-motion";

interface HeroSectionProps {
  currentMonth: Date;
  imageUrl: string;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onColorExtracted: (hex: string) => void;
}

export function HeroSection({ currentMonth, imageUrl, onNextMonth, onPrevMonth, onColorExtracted }: HeroSectionProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  // Fallback for when the browser serves the image instantly from cache (reloads)
  // which skips the native `onLoad` event from firing in React.
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      const extractCachedColor = async () => {
        try {
          const fac = new FastAverageColor();
          const color = await fac.getColorAsync(imgRef.current!);
          onColorExtracted(color.hex);
        } catch (e) {
          console.error("Failed to extract color from cached image", e);
        }
      };
      extractCachedColor();
    }
  }, [imageUrl, onColorExtracted]);

  const handleImageLoad = async () => {
    if (imgRef.current) {
      try {
        const fac = new FastAverageColor();
        const color = await fac.getColorAsync(imgRef.current);
        onColorExtracted(color.hex);
      } catch (e) {
        console.error("Failed to extract color from loaded image", e);
      }
    }
  };

  return (
    <div className="relative h-[280px] md:h-[400px] w-full overflow-hidden bg-slate-900 shrink-0 select-none rounded-t-xl group">
      {/* Continuous Slow Zoom Hero Image */}
      <motion.img 
        ref={imgRef}
        src={imageUrl} 
        alt={`Theme for ${format(currentMonth, 'MMMM')}`} 
        className="absolute inset-0 object-cover w-full h-full object-[center_30%] transition-opacity duration-700 opacity-90 group-hover:opacity-100"
        crossOrigin="anonymous"
        onLoad={handleImageLoad}
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Premium Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-[5]" />

      {/* Angled Theme Overlay Layer */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-[var(--theme-color)] h-48 md:h-64 z-10 transition-colors duration-700 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"
        style={{
          clipPath: "polygon(0 55%, 35% 85%, 100% 25%, 100% 100%, 0 100%)"
        }}
      />

      {/* Typography & Navigation with Premium Dropshadows */}
      <div className="absolute bottom-8 right-10 flex flex-col items-end z-20">
        <div className="text-white/80 text-2xl md:text-3xl font-medium tracking-widest leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-1">
          {format(currentMonth, "yyyy")}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onPrevMonth}
            className="text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-95 p-2 cursor-pointer rounded-full hover:bg-white/10 backdrop-blur-sm"
            aria-label="Previous Month"
          >
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>
          <div className="text-white text-5xl md:text-6xl font-black uppercase tracking-widest min-w-[240px] text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            {format(currentMonth, "MMMM")}
          </div>
          <button 
            onClick={onNextMonth}
            className="text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-95 p-2 cursor-pointer rounded-full hover:bg-white/10 backdrop-blur-sm"
            aria-label="Next Month"
          >
            <ChevronRight size={36} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
