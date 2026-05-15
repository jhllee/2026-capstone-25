import { useState } from "react";
import type { RefineMode } from "../../schemas/decompose";

// §3.3 ③ 재분해 블록 — "더 잘게/더 크게/AI에게 직접 얘기" + 이전 버전 히스토리 복원.
type RefineOption = { id: RefineMode; label: string; hint: string };

const REFINE_OPTIONS: RefineOption[] = [
  { id: "smaller", label: "더 잘게", hint: "" },
  { id: "larger", label: "더 크게", hint: "" },
  { id: "feedback", label: "💬 AI에게 직접 얘기", hint: "" },
];

// 히스토리 항목 한 줄에 표시할 미리보기. 가장 오래된 버전이 index 0.
export type HistoryPreview = { stepCount: number; firstTitle: string };

type Props = {
  onRefine: (mode: RefineMode, feedback?: string) => void;
  busy: boolean;
  history: HistoryPreview[];
  onRevert: () => void;
  onRestoreVersion: (index: number) => void;
  // 현재 결과에 2차 분해 자식이 하나라도 있을 때 true — 헤더 아래 사전 안내 노출용.
  hasSubSteps: boolean;
};

export default function RefineBlock({
  onRefine,
  busy,
  history,
  onRevert,
  onRestoreVersion,
  hasSubSteps,
}: Props) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  function handleChipClick(mode: RefineMode) {
    if (busy) return;
    if (mode === "feedback") {
      setFeedbackOpen((v) => !v);
      return;
    }
    onRefine(mode);
  }

  function handleSendFeedback() {
    const text = feedbackText.trim();
    if (!text || busy) return;
    onRefine("feedback", text);
    setFeedbackText("");
    setFeedbackOpen(false);
  }

  const historyCount = history.length;

  return (
    <div className="mb-4">
      <div className="text-[12px] font-bold text-tx2">💫 이렇게 다시 나눠볼까요?</div>
      {hasSubSteps && (
        <div className="text-[11px] text-mu mt-[2px] mb-[8px]">
          ※ 다시 나누면 직접 만든 하위 단계는 사라져요 (돌리기로 되돌릴 수 있어요)
        </div>
      )}
      <div className={`flex flex-wrap gap-2 ${hasSubSteps ? "" : "mt-[10px]"}`}>
        {REFINE_OPTIONS.map((opt) => {
          const active = opt.id === "feedback" && feedbackOpen;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleChipClick(opt.id)}
              disabled={busy}
              title={opt.hint}
              className={[
                "inline-flex items-center gap-1 px-[14px] py-[9px] rounded-full",
                "border text-[12.5px] font-bold cursor-pointer",
                "hover:bg-ac-s hover:text-ac-d hover:border-ac-s",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                active
                  ? "bg-ac-s text-ac-d border-ac-s"
                  : "bg-sf text-tx2 border-bd2",
              ].join(" ")}
            >
              {opt.label}
              <span className="text-[10px] text-mu font-medium">{opt.hint}</span>
            </button>
          );
        })}
      </div>

      {feedbackOpen && (
        <div className="mt-3 bg-sf border border-bd2 rounded-[12px] p-3">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            disabled={busy}
            maxLength={2000}
            placeholder="예: 자료 수집은 이미 완료했으니 그 부분은 건너뛰고 쪼개줘.  /  3번째 단계가 너무 추상적이야. 구체적인 행동으로 바꿔줘."
            className="w-full min-h-[72px] resize-y bg-transparent text-[13px] text-tx outline-none placeholder:text-mu"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-mu">{feedbackText.length}/2000</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFeedbackOpen(false);
                  setFeedbackText("");
                }}
                disabled={busy}
                className="bg-transparent border border-bd2 text-tx2 rounded-[10px] px-3 py-[7px] text-[12.5px] font-bold cursor-pointer disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSendFeedback}
                disabled={busy || !feedbackText.trim()}
                className="bg-ac text-white border-none rounded-[10px] px-3 py-[7px] text-[12.5px] font-extrabold cursor-pointer disabled:opacity-50"
              >
                보내기
              </button>
            </div>
          </div>
        </div>
      )}

      {historyCount > 0 && (
        <div className="mt-3 bg-ac-s2 border border-bd2 rounded-[10px] px-3 py-[10px]">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span className="flex-1 text-[12.5px] text-tx2">
              이전 버전이 더 나았나요? 최근 {historyCount}개 결과를 보관 중이에요.
            </span>
            <button
              type="button"
              onClick={onRevert}
              disabled={busy}
              className="bg-transparent border-none text-ac-d text-[12.5px] font-extrabold cursor-pointer disabled:opacity-50"
            >
              돌리기
            </button>
            {historyCount > 1 && (
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                disabled={busy}
                className="bg-transparent border-none text-tx2 text-[12.5px] font-bold cursor-pointer disabled:opacity-50"
              >
                {historyOpen ? "접기 ▲" : "더 보기 ▼"}
              </button>
            )}
          </div>

          {historyOpen && historyCount > 1 && (
            <ul className="mt-2 border-t border-bd2 pt-2 space-y-1">
              {history.map((h, i) => {
                // 가장 최근 버전이 배열 끝.
                const revIndex = historyCount - i;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        onRestoreVersion(i);
                        setHistoryOpen(false);
                      }}
                      disabled={busy}
                      className="w-full text-left flex items-center gap-2 px-2 py-[7px] rounded-[8px] hover:bg-fa text-[12.5px] text-tx2 disabled:opacity-50"
                    >
                      <span className="text-mu font-bold text-[11px] shrink-0">
                        버전 {revIndex}
                      </span>
                      <span className="text-mu shrink-0">·</span>
                      <span className="shrink-0">단계 {h.stepCount}개</span>
                      <span className="text-mu truncate">— (1) {h.firstTitle}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
