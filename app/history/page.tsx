"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/stores/useAppStore";

export default function HistoryPage() {
  const { records, profiles, load } = useAppStore();
  const [filterPerson, setFilterPerson] = useState("");
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => records.filter((r) => !filterPerson || r.personId === filterPerson), [records, filterPerson]);

  return (
    <main className="grid gap-4">
      <Card>
        <h2 className="mb-2 text-xl font-semibold">저장된 메타데이터 히스토리</h2>
        <select className="rounded-xl bg-black/30 p-2" value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)}>
          <option value="">전체 상대</option>
          {profiles.map((p) => <option key={p.id} value={p.id}>{p.nickname}</option>)}
        </select>
      </Card>
      {filtered.map((r) => (
        <Card key={r.id}>
          <p>{new Date(r.createdAt).toLocaleString()} · {r.mode}</p>
          <p>tone {r.toneScore} ({r.toneLabel})</p>
          <p className="text-xs">tags: {r.conflictTags.join(", ") || "없음"}</p>
        </Card>
      ))}
    </main>
  );
}
