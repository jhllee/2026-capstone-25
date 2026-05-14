-- 005_report.sql — 리포트 탭을 위한 스키마 추가
-- 1. steps.updated_at  : 단계 완료 시점 추적 (주차별 완료 수 집계)
-- 2. timer_sessions    : 타이머 세션 기록 (주차별 집중 시간 집계)

-- ── 1. steps.updated_at ─────────────────────────────────────────────────────
alter table public.steps
  add column if not exists updated_at timestamptz not null default now();

-- done 토글 또는 time_spent 갱신 시 updated_at 자동 갱신 트리거
create or replace function public.set_steps_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger steps_updated_at_trigger
  before update on public.steps
  for each row execute function public.set_steps_updated_at();

-- ── 2. timer_sessions 테이블 ─────────────────────────────────────────────────
create table if not exists public.timer_sessions (
  id         uuid        primary key default gen_random_uuid(),
  step_id    uuid        not null references public.steps(id) on delete cascade,
  user_id    uuid        not null references public.users(id) on delete cascade,
  mins       integer     not null,
  started_at timestamptz not null default now(),
  constraint timer_sessions_mins_positive check (mins > 0)
);

create index timer_sessions_user_started_idx
  on public.timer_sessions(user_id, started_at);

-- ── 3. RLS ───────────────────────────────────────────────────────────────────
alter table public.timer_sessions enable row level security;

create policy "Authenticated users can read own timer sessions"
  on public.timer_sessions for select to authenticated
  using (user_id = auth.uid());

create policy "Authenticated users can insert own timer sessions"
  on public.timer_sessions for insert to authenticated
  with check (user_id = auth.uid());

create policy "Authenticated users can delete own timer sessions"
  on public.timer_sessions for delete to authenticated
  using (user_id = auth.uid());

-- ── 4. GRANT (Supabase Data API 접근 — 5/30 정책 대응) ──────────────────────
grant select, insert, delete
  on public.timer_sessions
  to authenticated;

grant select, insert, update, delete
  on public.timer_sessions
  to service_role;
