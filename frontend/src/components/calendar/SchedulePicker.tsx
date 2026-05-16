// 캘린더 탭 날짜 배정 바텀 시트.
// 프로젝트별로 모든 미완료 단계를 펼쳐서 선택.
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { listProjects, type ProjectSummary } from "../../services/projects";
import { createAssignment, type CalendarAssignment } from "../../services/calendar";
import LoadingState from "../LoadingState";

type Props = {
  date: string;
  dateLabel: string;
  existingAssignments: CalendarAssignment[];
  onClose: () => void;
  onAssigned: () => void;
};

function dDayLabel(due: string): { text: string; color: string } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(due + "T00:00:00");
  const diff = Math.round((dueDate.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { text: `D+${Math.abs(diff)}`, color: "#E74C3C" };
  if (diff === 0) return { text: "D-Day", color: "#E74C3C" };
  if (diff <= 3) return { text: `D-${diff}`, color: "#E67E22" };
  return { text: `D-${diff}`, color: "#22A560" };
}

export default function SchedulePicker({ date, dateLabel, existingAssignments, onClose, onAssigned }: Props) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listProjects()
      .then((data) => setProjects(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const assignedOnDate = new Set(
    existingAssignments.filter((a) => a.date === date).map((a) => a.step.id),
  );

  const schedulable = projects.filter((p) => p.schedulableSteps.length > 0);

  function toggle(stepId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  }

  async function handleConfirm() {
    if (selected.size === 0) return;
    setSaving(true);
    try {
      await Promise.all([...selected].map((stepId) => createAssignment(stepId, date)));
      onAssigned();
      onClose();
    } catch {
      alert("배정에 실패했어요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-sf rounded-t-2xl px-[18px] pt-5 pb-8 max-h-[75vh] flex flex-col shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-base font-black text-tx">{dateLabel}</p>
          <button type="button" onClick={onClose} className="p-1 text-mu hover:text-tx transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs font-bold text-mu mb-4">할 일을 선택하세요</p>

        {/* 리스트 */}
        <div className="overflow-y-auto flex-1 -mx-1 px-1">
          {loading ? (
            <LoadingState title="할 일을 불러오고 있어요" className="max-w-[360px]" />
          ) : schedulable.length === 0 ? (
            <p className="text-center py-10 text-sm text-mu">진행 중인 할 일이 없어요</p>
          ) : (
            <div className="space-y-3.5">
              {schedulable.map((p) => {
                const color = p.color ?? "var(--color-ac)";
                const dd = p.due ? dDayLabel(p.due) : null;

                return (
                  <div key={p.id}>
                    {/* 프로젝트 헤더 (isSingle이면 숨김) */}
                    {!p.isSingle && (
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color, boxShadow: `0 0 0 3px ${color}22` }}
                        />
                        <span className="flex-1 min-w-0 text-[12.5px] font-black text-tx truncate">
                          {p.title}
                        </span>
                        {dd && (
                          <span
                            className="text-[11px] font-black shrink-0"
                            style={{ color: dd.color }}
                          >
                            {dd.text}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 하위 항목들 */}
                    <div className={p.isSingle ? "" : "pl-1 space-y-1.5"}>
                      {p.schedulableSteps.map((step) => {
                        const already = assignedOnDate.has(step.id);
                        const sel = selected.has(step.id);

                        return (
                          <button
                            key={step.id}
                            type="button"
                            disabled={already}
                            onClick={() => !already && toggle(step.id)}
                            className={[
                              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-[1.5px] text-left transition-all",
                              already
                                ? "opacity-50 border-bd2 bg-fa cursor-not-allowed"
                                : sel
                                ? "border-ac bg-ac-s"
                                : "border-bd2 bg-sf hover:border-bd",
                            ].join(" ")}
                          >
                            {/* 체크 */}
                            <span
                              className={[
                                "w-4 h-4 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all",
                                sel ? "border-ac bg-ac" : "border-bd bg-sf",
                              ].join(" ")}
                            >
                              {sel && (
                                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                                  <path d="M2.5 6.2l2.3 2.3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>

                            {/* isSingle일 때만 색상 점 */}
                            {p.isSingle && (
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: color, boxShadow: `0 0 0 3px ${color}22` }}
                              />
                            )}

                            <span className="flex-1 min-w-0 text-[12.5px] font-semibold text-tx truncate">
                              {step.title}
                              {already && (
                                <span className="ml-1.5 text-[10px] text-mu2 font-semibold">(이미 추가됨)</span>
                              )}
                            </span>

                            {/* isSingle + due인 경우 D-Day 표시 */}
                            {p.isSingle && dd && (
                              <span className="text-[11px] font-black shrink-0" style={{ color: dd.color }}>
                                {dd.text}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2.5 mt-4 pt-3 border-t border-bd2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-bd bg-sf py-3 text-sm font-black text-mu hover:bg-fa transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={selected.size === 0 || saving}
            className="flex-1 rounded-xl bg-ac text-white py-3 text-sm font-black hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {saving ? "추가 중..." : `추가하기${selected.size > 0 ? ` (${selected.size})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
