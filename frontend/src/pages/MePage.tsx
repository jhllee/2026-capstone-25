import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getMeStats, getUserInfo, type MeStats } from "../services/me";
import { listProjects, type ProjectSummary } from "../services/projects";
import StatsCard from "../components/me/StatsCard";
import CompletedProjectList from "../components/me/CompletedProjectList";
import LoadingState from "../components/LoadingState";

export default function MePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<MeStats | null>(null);
  const [completed, setCompleted] = useState<ProjectSummary[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMeStats(), listProjects(), getUserInfo()])
      .then(([s, projects, info]) => {
        setStats(s);
        setCompleted(projects.filter((p) => p.progress >= 100));
        setEmail(info.email);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="px-[18px] py-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-[22px] font-bold text-tx tracking-[-0.3px]">나</h1>
        {email && (
          <p className="text-sm text-mu mt-0.5">{email}</p>
        )}
      </div>

      {loading ? (
        <LoadingState title="내 정보를 불러오고 있어요" className="max-w-[520px]" />
      ) : (
        <>
          {/* 통계 카드 */}
          {stats && (
            <StatsCard
              totalMins={stats.totalMins}
              doneCount={stats.doneCount}
              streak={stats.streak}
            />
          )}

          {/* 완료된 프로젝트 */}
          <div>
            <p className="text-xs font-bold text-mu mb-3 px-1">완료한 프로젝트</p>
            <CompletedProjectList projects={completed} />
          </div>

          {/* 로그아웃 */}
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex items-center gap-1.5 rounded-xl border border-bd px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}
