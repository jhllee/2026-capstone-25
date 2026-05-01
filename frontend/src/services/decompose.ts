// AI 분해 mock — 백엔드 /api/decompose 구현 전까지 사용하는 placeholder

export type DecomposeInput = {
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  files: File[];
  wantSplit: boolean;
};

export type DecomposeChunk = {
  title: string;
  detail?: string;
};

export type DecomposeResult = {
  summary: string;
  chunks: DecomposeChunk[];
};

export function decompose(input: DecomposeInput): Promise<DecomposeResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: `"${input.title}"을(를) 4단계로 정리했어요.`,
        chunks: [
          { title: "1. 자료 모으기", detail: "참고 문헌·이전 작업물 정리" },
          { title: "2. 초안 잡기", detail: "큰 흐름과 목차 작성" },
          { title: "3. 본문 작성", detail: "구체적인 내용 채우기" },
          { title: "4. 검토·마무리", detail: "오탈자·형식 점검 후 제출" },
        ],
      });
    }, 1000);
  });
}
