import { NextRequest, NextResponse } from "next/server";
import { analyzeInputSchema, analyzeOutputSchema, normalizeOutputSchema } from "@/lib/llm/schemas";
import { buildAnalyzePrompt, buildNormalizePrompt, ANALYZE_SYSTEM_PROMPT, NORMALIZE_SYSTEM_PROMPT } from "@/lib/llm/prompts";
import { requestJson } from "@/lib/llm/client";
import { parseWithRetry } from "@/lib/llm/json";

const fallback = {
  summary: "입력 내용을 바탕으로 오해 가능성이 있는 표현을 중심으로 다시 확인해보는 것이 좋아요.",
  toneLabel: "재확인 필요",
  toneScore: 46,
  misunderstandings: [],
  conflictSignals: [],
  replySuggestions: [
    { style: "soft", text: "혹시 제가 이해한 게 맞는지 먼저 확인해도 될까요?", why: "해석 차이를 줄여 오해를 예방해요." },
    { style: "clear", text: "제 의도는 비난이 아니라 상황을 정리하려는 거예요.", why: "의도를 명시해 방어 반응을 줄여요." },
    { style: "short", text: "내 요점만 짧게 다시 말할게요.", why: "핵심 전달로 감정 확산을 줄여요." }
  ],
  safetyNote: "이 결과는 커뮤니케이션 코칭 참고용이며 치료/진단이 아니에요.",
  confidence: { overall: 0.45, why: "입력 정보가 제한적이라 보수적으로 분석했어요." },
  clarificationQuestions: ["상대와의 관계를 알려주실 수 있나요?"]
};

function clip20(v: string) {
  return v.length > 20 ? `${v.slice(0, 20)}` : v;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = analyzeInputSchema.parse(json);

    console.info("[analyze] request", {
      mode: parsed.mode,
      language: parsed.language,
      hasRawText: Boolean(parsed.rawText),
      saveEnabled: Boolean(parsed.options?.saveEnabled)
    });

    const normalizedObj = await parseWithRetry(async () => {
      return requestJson(NORMALIZE_SYSTEM_PROMPT, buildNormalizePrompt(parsed));
    });
    const normalized = normalizeOutputSchema.parse(normalizedObj);

    const analyzedObj = await parseWithRetry(async () => {
      return requestJson(ANALYZE_SYSTEM_PROMPT, buildAnalyzePrompt(normalized));
    });

    const analyzed = analyzeOutputSchema.parse(analyzedObj);
    analyzed.toneScore = Math.max(0, Math.min(100, analyzed.toneScore));
    analyzed.misunderstandings = analyzed.misunderstandings.slice(0, 3).map((m) => ({ ...m, quote: clip20(m.quote) }));
    analyzed.conflictSignals = analyzed.conflictSignals.slice(0, 6).map((c) => ({ ...c, evidence: clip20(c.evidence) }));

    if ((parsed.rawText ?? "").match(/(자해|죽고 싶|kill myself|suicide)/i)) {
      analyzed.safetyNote = "위험하거나 압도되는 감정이 들면, 가까운 신뢰 인물·지역 응급/상담 도움을 즉시 요청하세요.";
    }

    return NextResponse.json({ normalized, analysis: analyzed });
  } catch (error) {
    console.error("[analyze] failed", { message: (error as Error).message });
    return NextResponse.json({ normalized: null, analysis: fallback, error: "safe_fallback" }, { status: 200 });
  }
}
