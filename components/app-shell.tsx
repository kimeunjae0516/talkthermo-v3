import Link from "next/link";

const links = [
  ["/", "홈"],
  ["/analyze", "분석"],
  ["/history", "히스토리"],
  ["/patterns", "패턴"],
  ["/privacy", "개인정보"]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">TalkThermo v3</h1>
          <p className="text-sm text-white/70">대화 온도 체크 & 복기 코치</p>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg border border-white/20 px-3 py-1 hover:bg-white/10">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
