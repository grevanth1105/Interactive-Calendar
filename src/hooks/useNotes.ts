import { useState, useEffect } from "react";

export function useNotes(key: string = "calendar_notes") {
  const [notes, setNotes] = useState<string>("");

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setNotes(stored);
      }
    } catch (e) {
      console.warn("Failed to read notes from localStorage", e);
    }
  }, [key]);

  // Save to local storage when state changes
  const updateNotes = (newNotes: string) => {
    setNotes(newNotes);
    try {
      localStorage.setItem(key, newNotes);
    } catch (e) {
      console.warn("Failed to save notes to localStorage", e);
    }
  };

  return { notes, setNotes: updateNotes };
}
