import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="grid gap-4">
      <Card className="gradient-card p-8">
        <h2 className="text-3xl font-bold">감정 섞인 대화, 안전하게 복기해요.</h2>
        <p className="mt-3 text-white/80">텍스트·캡쳐·음성으로 대화를 넣으면 오해 가능성과 답장 초안을 빠르게 제안해요.</p>
        <Link href="/analyze" className="mt-6 inline-block rounded-xl bg-accent px-4 py-2 font-semibold">지금 분석 시작</Link>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          "기본 저장 OFF (개인정보 우선)",
          "오해 포인트 TOP3 + 근거",
          "soft/clear/short 답장 바로 복사"
        ].map((item) => (
          <Card key={item}>{item}</Card>
        ))}
      </div>
    </main>
  );
}
