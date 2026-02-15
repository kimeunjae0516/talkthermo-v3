"use client";

export default function AnalyzeError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl border border-red-300/40 bg-red-900/20 p-5">
      <p>분석 화면에서 문제가 발생했어요.</p>
      <button onClick={reset} className="mt-3 rounded-lg bg-accent px-3 py-1">다시 시도</button>
    </div>
  );
}
