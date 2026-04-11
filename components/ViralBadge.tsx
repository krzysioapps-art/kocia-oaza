"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  label: string;
  value: string;
  description: React.ReactNode;
  color: string;
};

export function ViralBadge({ label, value, description, color }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // zamykanie kliknięciem poza
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block z-10">
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border transition hover:scale-105 ${color}`}
      >
        {label}: {value}
        <span className="material-icons text-base ml-1 opacity-70">
          info
        </span>
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 z-[9999]">
          <div className="bg-white text-[var(--deep-brown)] text-sm rounded-xl shadow-xl p-4 border border-[var(--warm-coral)]/20">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}