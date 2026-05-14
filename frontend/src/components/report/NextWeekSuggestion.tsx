import type { ProjectReport, WeekData } from "../../services/report";

type Props = { weeks: WeekData[]; projects: ProjectReport[] };

function getSuggestions(weeks: WeekData[], projects: ProjectReport[]): string[] {
  const suggestions: string[] = [];
  const thisWeek = weeks[3] ?? { mins: 0, done: 0 };

  // 집중 시간이 적으면 작게 시작 제안
  if (thisWeek.mins < 30) {
    suggestions.push("10분짜리 작은 단계부터 시작해보세요");
  }

  // 마감 임박 프로젝트가 있으면 먼저 제안
  const urgentProj = projects.find((p) => {
    if (!p.due) return false;
    const daysLeft = Math.ceil((new Date(p.due).getTime() - Date.now()) / 86_400_000);
    return daysLeft >= 0 && daysLeft <= 7 && p.progress < 100;
  });
  if (urgentProj) {
    suggestions.push(`${urgentProj.title} 마감이 임박했어요. 이번 주 우선순위로 잡아보세요`);
  }

  // 손 못 댄 프로젝트가 있으면 제안
  const stalledProj = projects.find((p) => p.timeSpent === 0 && p.totalCount > 0);
  if (stalledProj) {
    suggestions.push(`${stalledProj.title}의 첫 단계만 열어봐요. 시작이 가장 어렵거든요`);
  }

  // 완료 단계가 없으면 2차 분해 제안
  if (thisWeek.done === 0 && projects.some((p) => p.totalCount > 0)) {
    suggestions.push("단계가 너무 크다면 '2단계 쪼개기'로 더 작게 나눠보세요");
  }

  if (suggestions.length === 0) {
    suggestions.push("지금 흐름 그대로 유지해봐요");
  }

  return suggestions.slice(0, 3);
}

export default function NextWeekSuggestion({ weeks, projects }: Props) {
  const suggestions = getSuggestions(weeks, projects);

  return (
    <div className="bg-sf border border-bd2 rounded-[20px] shadow-[0_2px_6px_rgba(180,110,70,0.06)] px-[18px] py-4">
      <p className="text-[11px] font-bold text-mu tracking-[0.5px] mb-3">다음 주 제안</p>
      <div className="flex flex-col gap-2.5">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-ac-s flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-black text-ac">{i + 1}</span>
            </div>
            <p className="text-[12.5px] font-medium text-tx leading-snug">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
