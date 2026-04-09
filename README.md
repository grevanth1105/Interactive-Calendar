# Premium Dynamic Wall Calendar

A production-grade, highly interactive calendar application designed to replicate the beautiful aesthetics and functionality of a physical wall calendar. It features dynamic real-time color extraction, buttery smooth 3D page flip animations, and a rich, fully memoized interactive date selection UI.

## ✨ Core Functionalities

*   **Dynamic Theme Engine**: Every month fetches a unique hero image. The app automatically scans the image matrix in real-time using `fast-average-color`, extracting the dominant hex code to dynamically re-theme the entire application (glassmorphism accents, selection UI, texts).
*   **3D Perspective Flips**: Month-to-month transitions leverage Framer Motion to execute a highly realistic, anchored `rotateX` 3D page turn, mimicking physically flipping through a real wall calendar.
*   **Animated Range Selection**: Instead of static blocks, dragging your mouse across dates triggers continuous, fluid `scaleX` Framer Motion animations that effortlessly bridge date connectors together.
*   **Context-Aware Notes & Holidays**: A premium textured side-panel automatically cross-references your selected dates against a local holiday dictionary. If a holiday matches, it injects a beautiful banner above your personal `localStorage` saved notes.
*   **Zero-Waste Memoization**: Solved standard React "map" lag. Granular comparative configurations inside a custom `React.memo` hook strictly prevent the 42-cell grid from indiscriminately re-rendering during rapid hover iterations.
*   **Enterprise Accessibility**: Every date cell acts as a strict W3C `<button role="gridcell">` allowing for pure `TAB` key navigation and JAWS/Voiceover screen reader compatibility.

## 🛠️ Tech Stack

*   **Framework**: Next.js (App Router) + React 18
*   **Styling**: Tailwind CSS (Arbitrary runtime variable injection)
*   **Animations**: Framer Motion
*   **Date Operations**: `date-fns`
*   **Color Extraction**: `fast-average-color`
*   **Icons**: `lucide-react`

## 🗂️ Project Structure

The project strictly follows functional component separation:

```text
src/
├── app/
│   ├── globals.css           # Global theme variables & Tailwind imports
│   └── page.tsx              # Application execution entry point
├── components/
│   ├── CalendarWidget.tsx    # Structural container, manages global hook states and fake metallic rings 
│   ├── HeroSection.tsx       # Infinite-zoom photographic header & theme data scanner
│   ├── CalendarGrid.tsx      # Memoized ARIA-compliant 42-day rendering layout
│   ├── DateCell.tsx          # Extremely optimized, touch-target accessible day node
│   └── NotesPanel.tsx        # Textured notebook pane handling `localStorage` inputs
├── hooks/
│   ├── useCalendar.ts        # Handles date math (next/prev month navigation)
│   ├── useDateRange.ts       # Handles the math behind dragging ranges and selection intersections
│   └── useNotes.ts           # Handles persistent localStorage syncing
└── lib/
    ├── holidays.ts           # Dictionary of holidays for pattern matching
    └── utils.ts              # Tailwind specific classname mergers (clsx/tailwind-merge)
```

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

3.  **View the application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.
