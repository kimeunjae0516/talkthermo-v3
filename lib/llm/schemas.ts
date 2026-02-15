import { z } from "zod";

export const situationSchema = z.object({
  relationshipType: z.enum(["친구", "가족", "선생님", "팀", "연인", "기타"]).optional(),
  goal: z.enum(["사과", "거절", "요청", "서운함", "조율", "감사", "기타"]).optional(),
  myEmotion: z.enum(["서운함", "화남", "불안", "혼란", "중립"]).optional(),
  keyMessage: z.string().max(400).optional(),
  lastMessage: z.string().max(400).optional()
});

export const analyzeInputSchema = z
  .object({
    mode: z.enum(["text", "ocr", "voice"]),
    language: z.enum(["ko", "en"]),
    rawText: z.string().max(10000).optional(),
    situation: situationSchema.optional(),
    options: z.object({ saveEnabled: z.boolean().optional(), personId: z.string().optional() }).optional()
  })
  .refine((v) => Boolean(v.rawText?.trim()) || Boolean(v.situation?.keyMessage?.trim()) || Boolean(v.situation?.lastMessage?.trim()), {
    message: "rawText 또는 situation keyMessage/lastMessage 필요"
  });

export const normalizeOutputSchema = z.object({
  detectedLanguage: z.enum(["ko", "en"]),
  cleanedText: z.string(),
  extractedContext: z.object({
    relationshipType: z.enum(["친구", "가족", "선생님", "팀", "연인", "기타"]).nullable(),
    goal: z.enum(["사과", "거절", "요청", "서운함", "조율", "감사", "기타"]).nullable(),
    myEmotion: z.enum(["서운함", "화남", "불안", "혼란", "중립"]).nullable(),
    keyMessage: z.string().nullable(),
    lastMessage: z.string().nullable()
  }),
  conversationTurns: z.array(z.object({ speaker: z.enum(["me", "other", "A", "B", "unknown"]), text: z.string() })),
  confidence: z.object({ context: z.number(), speakers: z.number(), overall: z.number() }),
  clarificationQuestions: z.array(z.string()).max(3)
});

export const analyzeOutputSchema = z.object({
  summary: z.string(),
  toneLabel: z.string(),
  toneScore: z.number(),
  misunderstandings: z.array(z.object({ quote: z.string().max(20), reason: z.string() })).max(3),
  conflictSignals: z.array(z.object({ tag: z.string(), evidence: z.string().max(20) })).max(6),
  replySuggestions: z.tuple([
    z.object({ style: z.literal("soft"), text: z.string(), why: z.string() }),
    z.object({ style: z.literal("clear"), text: z.string(), why: z.string() }),
    z.object({ style: z.literal("short"), text: z.string(), why: z.string() })
  ]),
  safetyNote: z.string(),
  confidence: z.object({ overall: z.number(), why: z.string() }),
  clarificationQuestions: z.array(z.string()).max(3)
});
