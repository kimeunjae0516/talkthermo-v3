"use client";

import { InputMode } from "@/types/domain";
import { cn } from "@/lib/utils";

const modes: [InputMode, string][] = [["text", "텍스트"], ["ocr", "캡쳐(OCR)"], ["voice", "음성"]];

export function SegmentedMode({ mode, onChange }: { mode: InputMode; onChange: (m: InputMode) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-white/20 p-1">
      {modes.map(([value, label]) => (
        <button
          key={value}
          className={cn("rounded-lg px-3 py-1 text-sm", mode === value && "bg-accent")}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
