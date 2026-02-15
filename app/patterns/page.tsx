"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/stores/useAppStore";
import { PatternCharts } from "@/components/charts/pattern-charts";

export default function PatternsPage() {
  const { records, profiles, load } = useAppStore();
  const [personId, setPersonId] = useState("");
  useEffect(() => { void load(); }, [load]);
  const picked = useMemo(() => records.filter((r) => !personId || r.personId === personId), [records, personId]);

  return (
    <main className="grid gap-4">
      <Card>
        <h2 className="text-xl font-semibold">패턴 대시보드 (메타데이터 전용)</h2>
        <select className="mt-2 rounded-xl bg-black/30 p-2" value={personId} onChange={(e) => setPersonId(e.target.value)}>
          <option value="">전체 상대</option>
          {profiles.map((p) => <option key={p.id} value={p.id}>{p.nickname}</option>)}
        </select>
      </Card>
      <PatternCharts records={picked} />
      <Card>
        <h3 className="font-semibold">내 반응 패턴</h3>
        <p className="text-sm text-white/80">최근 기록 기준으로 {picked.length ? `평균 톤 점수 ${Math.round(picked.reduce((a,b)=>a+b.toneScore,0)/picked.length)}점` : "데이터가 아직 적어요"}이며, 특정 태그가 반복되면 문장 길이와 단정 표현을 줄여보세요.</p>
      </Card>
    </main>
  );
}
