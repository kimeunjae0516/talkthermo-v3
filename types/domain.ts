export type InputMode = "text" | "ocr" | "voice";

export interface AnalysisRecord {
  id: string;
  createdAt: number;
  mode: InputMode;
  personId?: string;
  relationshipType?: string;
  goal?: string;
  userFeeling?: string;
  toneScore: number;
  toneLabel: string;
  conflictTags: string[];
  selectedSuggestionStyle?: "soft" | "clear" | "short";
}

export interface PersonProfile {
  id: string;
  nickname: string;
  createdAt: number;
}

export interface AnalyzeOutput {
  summary: string;
  toneLabel: string;
  toneScore: number;
  misunderstandings: { quote: string; reason: string }[];
  conflictSignals: { tag: string; evidence: string }[];
  replySuggestions: { style: "soft" | "clear" | "short"; text: string; why: string }[];
  safetyNote: string;
  confidence: { overall: number; why: string };
  clarificationQuestions: string[];
}
