# 한발짝 (hanbaljjak)

AI 기반 작업 분해 도구.

## 아키텍처 한눈에

| 레이어 | 기술 | 로컬 포트 | 배포 |
| --- | --- | --- | --- |
| Frontend | React 18 + Vite 5 + TypeScript | `localhost:5173` | Vercel |
| Backend | Express + TypeScript | `localhost:4000` | Railway |
| AI | Anthropic Claude Haiku 4.5 | — | (Backend에서 호출) |
| DB / Auth / Storage | Supabase (PostgreSQL) | — | Supabase Cloud |
| 코드 저장소 | GitHub | — | `git push` → 자동 배포 |

흐름: `사용자 → HTTPS → React (Vercel) → REST → Express (Railway) → Supabase / Anthropic`

## 폴더 구조

```
hanbaljjak/
├── frontend/        React 18 + Vite 5 (TS)
├── backend/         Express (TS)
├── 다이어그램/       아키텍처 SVG
├── package.json     workspaces 루트
└── .gitignore
```

## 개발 환경 준비

요구사항: Node.js 20 이상 (`.nvmrc` 참고), npm 10 이상.

```bash
# 의존성 설치 (한 번에)
npm install

# 프론트 + 백 동시 실행
npm run dev

# 개별 실행
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:4000
```

## 환경변수

각 워크스페이스의 `.env.example`을 `.env`로 복사한 뒤 채워 넣는다.

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## 팀원 온보딩

```bash
# 1. 클론
git clone https://github.com/<owner>/hanbaljjak.git
cd hanbaljjak

# 2. 의존성
npm install

# 3. 환경변수 (값은 팀 공유 채널에서 받기 — git에 절대 X)
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 4. 실행
npm run dev   # http://localhost:5173
```

## 협업 규약

- **브랜치**: `feat/<기능>`, `fix/<버그>`, `chore/<잡일>` 접두로 만든다. 예: `feat/home-input`.
- **main에 직접 push 금지** — 반드시 PR을 거친다 (1명 이상 approve).
- **커밋 메시지**: `<type>: <한 줄 설명>` (Conventional Commits). type은 `feat / fix / chore / docs / refactor / style`.
- **PR**: 작게, 자주. 화면 변경이면 스크린샷 포함. 템플릿(`.github/pull_request_template.md`) 따라 작성.
- **충돌 줄이기**: `VIBE_CODING_PLAN.md`의 Phase 단위로 누가 뭘 할지 미리 분담.

## 다음 단계

- Supabase 클라이언트 + 스키마 연결
- Anthropic SDK 라우트 (`/api/decompose` 등)
- Vercel · Railway 배포 설정
