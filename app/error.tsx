"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="bg-background p-10 text-foreground">
        <h2 className="text-xl">문제가 발생했어요.</h2>
        <button onClick={reset} className="mt-3 rounded bg-accent px-3 py-2">다시 시도</button>
      </body>
    </html>
  );
}
