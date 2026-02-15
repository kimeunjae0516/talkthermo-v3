import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <main className="grid gap-4">
      <Card>
        <h2 className="text-2xl font-bold">개인정보 & 안전 정책</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/85">
          <li>기본값은 저장 OFF이며, 분석 시 원문 대화 텍스트를 서버/클라이언트에 저장하지 않습니다.</li>
          <li>Save ON일 때도 toneScore, 태그 같은 메타데이터만 저장하고 원문/긴 인용문은 저장하지 않습니다.</li>
          <li>결과는 치료/진단이 아닌 커뮤니케이션 코칭 참고용입니다.</li>
          <li>실명/민감정보 입력을 피해주세요.</li>
        </ul>
      </Card>
    </main>
  );
}
