"use client";

import { useEffect, useMemo, useState } from "react";
import Tesseract from "tesseract.js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { SegmentedMode } from "@/components/analyze/segmented-mode";
import { ToneGauge } from "@/components/analyze/tone-gauge";
import { useAppStore } from "@/stores/useAppStore";
import { AnalyzeOutput } from "@/types/domain";

const initialSituation = { relationshipType: "", goal: "", myEmotion: "", keyMessage: "", lastMessage: "" };

export function AnalyzeClient() {
  const { mode, setMode, saveEnabled, setSaveEnabled, personId, setPersonId, profiles, addProfile, load, saveMetadata } = useAppStore();
  const [nickname, setNickname] = useState("");
  const [text, setText] = useState("");
  const [situation, setSituation] = useState(initialSituation);
  const [loading, setLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [result, setResult] = useState<AnalyzeOutput | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { void load(); }, [load]);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const sttSupported = typeof window !== "undefined" && SpeechRecognition;

  const personWarning = useMemo(() => "실명/민감정보 입력 금지", []);

  const cleanLines = () => setText((v) => v.replace(/\n{3,}/g, "\n\n").trim());
  const estimateSpeakers = () => setText((v) => v.split("\n").map((line, i) => `${i % 2 ? "other" : "me"}: ${line.replace(/^.+?:\s*/, "")}`).join("\n"));
  const cleanOcrNoise = () => setText((v) => v.replace(/[|_`~]{2,}/g, " ").replace(/\s{2,}/g, " "));

  const onAnalyze = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          language: "ko",
          rawText: text,
          situation,
          options: { saveEnabled, personId }
        })
      });
      const data = await res.json();
      setResult(data.analysis as AnalyzeOutput);
      if (saveEnabled) {
        await saveMetadata({ mode, personId, relationshipType: situation.relationshipType || undefined, goal: situation.goal || undefined, userFeeling: situation.myEmotion || undefined, output: data.analysis });
      }
    } catch {
      setError("분석에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally { setLoading(false); }
  };

  const onImage = async (file: File) => {
    setMode("ocr");
    const { data } = await Tesseract.recognize(file, "kor+eng", { logger: (m) => { if (m.status === "recognizing text") setOcrProgress(Math.round((m.progress ?? 0) * 100)); } });
    setText(data.text);
  };

  const startStt = () => {
    if (!sttSupported) return;
    setMode("voice");
    const recog = new SpeechRecognition();
    recog.lang = "ko-KR";
    recog.interimResults = true;
    recog.onresult = (event: any) => {
      const merged = Array.from(event.results).map((r: any) => r[0].transcript).join(" ");
      setText(merged);
    };
    recog.start();
    setTimeout(() => recog.stop(), 8000);
  };

  return (
    <main className="grid gap-4">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedMode mode={mode} onChange={setMode} />
          <span className="text-xs text-yellow-300">저장은 기본 OFF · 메타데이터만 저장</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="사람 닉네임 추가" value={nickname} onChange={(e) => setNickname(e.target.value)} aria-label="닉네임" />
          <Button onClick={() => nickname && addProfile(nickname)}>닉네임 저장</Button>
          <select className="rounded-xl bg-black/30 p-2" value={personId ?? ""} onChange={(e) => setPersonId(e.target.value || undefined)}>
            <option value="">상대 선택(옵션)</option>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.nickname}</option>)}
          </select>
          <div className="flex items-center gap-2"><Toggle checked={saveEnabled} onCheckedChange={setSaveEnabled} /><span className="text-sm">Save ON</span></div>
        </div>
        <p className="text-xs text-red-300">{personWarning}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {Object.keys(situation).map((key) => (
            <Input key={key} placeholder={key} value={(situation as any)[key]} onChange={(e) => setSituation((s) => ({ ...s, [key]: e.target.value }))} />
          ))}
        </div>
        <Textarea aria-label="transcript" value={text} onChange={(e) => setText(e.target.value)} placeholder="대화 내용을 붙여넣거나 입력하세요." />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setText("me: 어제 답 못해서 미안해\nother: 괜찮은데 다음엔 알려줘")}>예시 넣기</Button>
          <Button onClick={cleanLines}>줄바꿈 정리</Button>
          <Button onClick={estimateSpeakers}>화자 추정</Button>
          <Button onClick={cleanOcrNoise}>OCR 잡음 제거</Button>
          <label className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
            캡쳐 업로드
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onImage(e.target.files[0])} />
          </label>
          <Button onClick={startStt}>음성 시작/8초 자동종료</Button>
        </div>
        {!sttSupported && <p className="text-xs text-yellow-300">현재 브라우저는 Web Speech API를 지원하지 않을 수 있어요.</p>}
        {mode === "ocr" && ocrProgress > 0 && <p className="text-xs">OCR 진행률: {ocrProgress}%</p>}
        <Button disabled={loading} onClick={onAnalyze}>{loading ? "분석 중..." : "Analyze"}</Button>
        {error && <p className="text-sm text-red-300">{error}</p>}
      </Card>

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card><h3 className="font-semibold">요약</h3><p>{result.summary}</p></Card>
          <Card><h3 className="font-semibold">온도</h3><ToneGauge score={result.toneScore} /><p>{result.toneLabel}</p></Card>
          <Card>
            <h3 className="font-semibold">오해 포인트</h3>
            <ul className="list-disc pl-4 text-sm">{result.misunderstandings.map((m, i) => <li key={i}><b>{m.quote}</b> - {m.reason}</li>)}</ul>
          </Card>
          <Card>
            <h3 className="font-semibold">갈등 신호 태그</h3>
            <div className="flex flex-wrap gap-2">{result.conflictSignals.map((c, i) => <span key={i} className="rounded-full bg-white/10 px-2 py-1 text-xs">{c.tag}: {c.evidence}</span>)}</div>
          </Card>
          <Card className="md:col-span-2">
            <h3 className="font-semibold">답장 제안</h3>
            <div className="grid gap-2 md:grid-cols-3">
              {result.replySuggestions.map((s) => (
                <div key={s.style} className="rounded-xl border border-white/10 p-3 text-sm">
                  <p className="font-semibold">{s.style}</p>
                  <p>{s.text}</p>
                  <p className="text-xs text-white/70">{s.why}</p>
                  <Button className="mt-2" onClick={() => navigator.clipboard.writeText(s.text)}>복사</Button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="md:col-span-2 text-sm">
            <p>정확도(신뢰도): {(result.confidence.overall * 100).toFixed(0)}%</p>
            <p>{result.confidence.why}</p>
            {result.clarificationQuestions.length > 0 && <ul className="list-disc pl-4">{result.clarificationQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>}
            <p className="mt-2 text-xs text-yellow-300">{result.safetyNote}</p>
          </Card>
        </div>
      )}
    </main>
  );
}
