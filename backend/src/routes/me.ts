import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { supabase } from "../lib/supabase.js";

// 사용자 계정 관련 API.
const router = Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({
    id: req.userId,
    email: req.userEmail,
  });
});

// GET /api/me/today-minutes — 오늘(자정 기준) timer_sessions 합산.
router.get("/today-minutes", authMiddleware, async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: sessions, error } = await supabase
    .from("timer_sessions")
    .select("mins")
    .eq("user_id", req.userId)
    .gte("started_at", todayStart.toISOString());

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const total = (sessions ?? []).reduce((sum, s) => sum + (s.mins ?? 0), 0);
  res.json({ minutes: total });
});

// GET /api/me/stats — 총 완료 단계 수 · 총 집중 시간 · 연속 집중일
router.get("/stats", authMiddleware, async (req, res) => {
  const userId = req.userId;

  // 총 집중 시간 (timer_sessions 합산)
  const { data: sessions } = await supabase
    .from("timer_sessions")
    .select("mins")
    .eq("user_id", userId);
  const totalMins = (sessions ?? []).reduce((sum: number, s: { mins: number | null }) => sum + (s.mins ?? 0), 0);

  // 완료된 1차 단계 수 — 프로젝트 → 최신 decomposition → done=true 단계
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId);

  const projectIds = (projects ?? []).map((p: { id: string }) => p.id);
  let doneCount = 0;

  if (projectIds.length > 0) {
    const { data: decomps } = await supabase
      .from("decompositions")
      .select("id, project_id, round")
      .in("project_id", projectIds)
      .order("round", { ascending: false });

    const latestDecompByProject = new Map<string, string>();
    for (const d of (decomps ?? []) as { id: string; project_id: string; round: number }[]) {
      if (!latestDecompByProject.has(d.project_id)) {
        latestDecompByProject.set(d.project_id, d.id);
      }
    }

    const latestDecompIds = [...latestDecompByProject.values()];
    if (latestDecompIds.length > 0) {
      const { data: steps } = await supabase
        .from("steps")
        .select("id")
        .in("decomposition_id", latestDecompIds)
        .is("parent_step_id", null)
        .eq("done", true);
      doneCount = steps?.length ?? 0;
    }
  }

  // 연속 집중일 (streak) — timer_sessions 날짜 기준
  const { data: timerRows } = await supabase
    .from("timer_sessions")
    .select("started_at")
    .eq("user_id", userId);

  const activeDates = new Set(
    (timerRows ?? []).map((s: { started_at: string }) => s.started_at.slice(0, 10)),
  );

  let streak = 0;
  const cursor = new Date();
  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10);
    if (!activeDates.has(dateStr)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  res.json({ totalMins, doneCount, streak });
});

export default router;
