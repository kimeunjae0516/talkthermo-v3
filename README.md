# TalkThermo v3

대화 온도 체크 & 복기 코치. 텍스트/캡쳐(OCR)/음성(STT) 입력을 정리해 오해 가능성과 답장 제안을 제공합니다.

## Tech
- Next.js 14 App Router + TypeScript
- TailwindCSS + lightweight shadcn-style UI components
- Zustand, Recharts, Zod
- tesseract.js (client OCR)
- Web Speech API (browser STT)
- OpenAI API server-side (`/api/analyze`)

## Setup
```bash
npm install
npm run dev
```

### Environment variables
`.env.local`
```bash
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
```

## 주요 기능
- `/analyze`: 3개 입력 모드(텍스트/캡쳐/음성), 편집 가능한 transcript, 2단계(normalize → analyze) 분석
- `/history`: 저장 ON으로 저장된 메타데이터 목록/필터
- `/patterns`: 톤 추세/충돌 태그/제안 스타일 차트
- `/privacy`: 개인정보 및 안전 정책

## Privacy guarantees
- 기본값 저장 OFF
- 원문 대화 텍스트는 저장하지 않음
- Save ON 이어도 `AnalysisRecord`, `PersonProfile` 메타데이터만 저장
- 인용문/근거 텍스트는 최대 20자 제한

## Deploy (Vercel)
1. Vercel에 프로젝트 연결
2. `OPENAI_API_KEY`, `OPENAI_MODEL` 환경변수 등록
3. Build command: `npm run build`

## STT 지원 브라우저
- Web Speech API는 크롬 계열 브라우저에서 주로 동작합니다.
- 미지원 브라우저에서는 fallback 안내가 표시됩니다.
