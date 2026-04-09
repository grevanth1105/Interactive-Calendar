import React from "react";
import { useNotes } from "@/hooks/useNotes";
import { getHoliday } from "@/lib/holidays";

interface NotesPanelProps {
  startDate: Date | null;
}

export function NotesPanel({ startDate }: NotesPanelProps) {
  const { notes, setNotes } = useNotes();
  const holiday = startDate ? getHoliday(startDate) : null;

  return (
    <div className="w-full md:w-[300px] shrink-0 flex flex-col p-8 bg-zinc-50/80 border-r border-slate-200 shadow-[inset_-12px_0_24px_-16px_rgba(0,0,0,0.06)] relative z-20">
      {/* Premium Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 rounded-full bg-[var(--theme-color)] shadow-[0_0_10px_var(--theme-color)] opacity-80" />
        <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Notes</h3>
      </div>
      
      {/* Holiday specific note banner */}
      {holiday && (
        <div className="bg-white/80 backdrop-blur-sm border-l-4 border-rose-400 text-rose-600 rounded shadow-sm p-4 mb-6 text-sm font-semibold transition-all animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span className="text-lg">🌟</span> 
          <span>{holiday.name}</span>
        </div>
      )}

      {/* Textured Lined Paper Effect */}
      <textarea 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full grow resize-none outline-none bg-transparent text-slate-700 text-[15px] font-medium leading-loose z-10 placeholder:text-slate-400"
        style={{
          lineHeight: '2.5rem',
          backgroundImage: 'linear-gradient(transparent, transparent calc(2.5rem - 1px), #cbd5e1 calc(2.5rem - 1px), #cbd5e1 2.5rem)',
          backgroundSize: '100% 2.5rem',
          minHeight: '20rem'
        }}
        placeholder="Jot down reminders..."
        spellCheck="false"
      />
    </div>
  );
}
