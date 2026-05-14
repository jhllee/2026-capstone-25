import { useEffect, useState } from "react";
import { getWeeklyReport, type WeeklyReport } from "../services/report";
import AutoComment from "../components/report/AutoComment";
import WeeklySummary from "../components/report/WeeklySummary";
import ProjectBreakdown from "../components/report/ProjectBreakdown";
import UserTypeCard from "../components/report/UserTypeCard";
import NextWeekSuggestion from "../components/report/NextWeekSuggestion";

export default function ReportPage() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    getWeeklyReport()
      .then((data) => { setReport(data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-bg px-[22px] pt-6 pb-6 gap-4">
      <span className="text-[22px] font-bold text-tx tracking-[-0.3px]">리포트</span>

      {status === "loading" && (
        <p className="text-center text-mu text-sm mt-6">불러오는 중...</p>
      )}
      {status === "error" && (
        <p className="text-center text-red-400 text-sm mt-6">리포트를 불러오지 못했어요.</p>
      )}
      {status === "ready" && report && (
        <>
          <AutoComment weeks={report.weeks} projects={report.projects} />
          <UserTypeCard userType={report.userType} />
          <WeeklySummary weeks={report.weeks} />
          <ProjectBreakdown projects={report.projects} />
          <NextWeekSuggestion weeks={report.weeks} projects={report.projects} />
        </>
      )}
    </div>
  );
}
