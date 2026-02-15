"use client";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Toggle({ checked, onCheckedChange }: ToggleProps) {
  return (
    <button
      type="button"
      aria-label="저장 토글"
      onClick={() => onCheckedChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-accent" : "bg-white/20"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  );
}
