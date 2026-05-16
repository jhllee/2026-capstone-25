import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProjectSummary } from "../../services/projects";
import EmptyState from "../EmptyState";

type Props = {
  projects: ProjectSummary[];
};

export default function CompletedProjectList({ projects }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (projects.length === 0) {
    return <EmptyState emoji="🎯" title="완료한 프로젝트가 없어요" />;
  }

  return (
    <ul className="space-y-2">
      {projects.map((p) => {
        const color = p.color ?? "var(--color-ac)";
        const isOpen = openId === p.id;

        return (
          <li key={p.id} className="bg-sf border border-bd2 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : p.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color, boxShadow: `0 0 0 3px ${color}25` }}
              />
              <span className="flex-1 min-w-0 text-sm font-bold text-tx truncate">{p.title}</span>
              {p.due && (
                <span className="text-[11px] text-mu shrink-0">{p.due}</span>
              )}
              <ChevronDown
                size={16}
                className={["text-mu transition-transform", isOpen ? "rotate-180" : ""].join(" ")}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-bd2">
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 flex-1 rounded-full bg-fa overflow-hidden">
                    <div className="h-full rounded-full w-full" style={{ backgroundColor: color }} />
                  </div>
                  <span className="text-xs font-black text-tx2">100%</span>
                </div>
                <p className="text-[11px] text-mu mt-2">
                  {p.totalCount}단계 완료 · {new Date(p.createdAt).toLocaleDateString("ko-KR")} 시작
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
