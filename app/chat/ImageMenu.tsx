"use client";
import { useState } from "react";

// Simple image menu component for delete option
export default function ImageMenu({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute top-1 right-1 z-10">
      <button
        className="bg-white/80 hover:bg-blue-200 text-blue-700 rounded-full p-1 text-xs shadow"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open image menu"
      >
        <span style={{ fontSize: 18, fontWeight: 700 }}>⋮</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg py-1">
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
