import { supabase } from "../lib/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("로그인이 필요해요.");
  return { Authorization: `Bearer ${token}` };
}

export type MeStats = {
  totalMins: number;
  doneCount: number;
  streak: number;
};

export async function getMeStats(): Promise<MeStats> {
  const response = await fetch(`${API_BASE_URL}/api/me/stats`, {
    headers: await authHeaders(),
  });
  if (!response.ok) throw new Error("통계를 불러오지 못했어요.");
  return (await response.json()) as MeStats;
}

export async function getUserInfo(): Promise<{ id: string; email: string }> {
  const response = await fetch(`${API_BASE_URL}/api/me`, {
    headers: await authHeaders(),
  });
  if (!response.ok) throw new Error("사용자 정보를 불러오지 못했어요.");
  return (await response.json()) as { id: string; email: string };
}
