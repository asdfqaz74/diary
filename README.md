# Diary Starter

Next.js 16 App Router 기반 명상 다이어리 앱입니다.  
현재 버전은 `Supabase(Postgres + Auth)` 를 기준으로 `Google OAuth`, `RLS`, `draft + publish` 흐름까지 연결하도록 구성되어 있습니다.

## Stack

- Next.js 16 App Router with `src/`
- React 19 + TypeScript
- Tailwind CSS 4
- Jotai
- TanStack Query
- Supabase SSR + Google OAuth
- Vitest + React Testing Library

## Prerequisites

이 프로젝트는 Volta 버전을 고정합니다.

```bash
volta install node@22.17.0
volta install yarn@1.22.22
```

## 10분 빠른 시작

### 1. 의존성 설치

```bash
yarn install
```

### 2. Supabase 프로젝트 생성

1. Supabase에서 새 프로젝트를 만듭니다.
2. Project Settings > API 에서 `Project URL`, `publishable key` 를 확인합니다.

### 3. Google OAuth 연결

1. Google Cloud Console 에서 OAuth Client 를 만듭니다.
2. Supabase Auth > Providers > Google 을 활성화합니다.
3. Redirect URL 을 Supabase와 Google 양쪽에 모두 등록합니다.

상세 절차는 [docs/supabase-setup.md](/c:/code/sideproject/diary/docs/supabase-setup.md) 에 정리되어 있습니다.

### 4. 환경변수 작성

`.env.example` 을 기준으로 `.env.local` 을 만듭니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

참고:

- 최신 기준 표준 공개 키는 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 입니다.
- 기존 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 는 legacy fallback 으로만 읽습니다.

### 5. Supabase CLI 로그인 + 프로젝트 연결

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

이 단계에서 `supabase/migrations/202603230001_initial_schema.sql` 이 적용됩니다.

### 6. 앱 실행

```bash
yarn dev
```

브라우저에서 `http://localhost:3000` 을 열면 로그인 페이지가 먼저 보입니다.

## Scripts

- `yarn dev`
- `yarn build`
- `yarn start`
- `yarn lint`
- `yarn typecheck`
- `yarn test`

## 문서

- Supabase 설정 상세 가이드: [docs/supabase-setup.md](/c:/code/sideproject/diary/docs/supabase-setup.md)
- 데이터 모델 설명: [docs/data-model.md](/c:/code/sideproject/diary/docs/data-model.md)

## 현재 동작 방식

- 인증되지 않은 사용자는 `/login` 으로 이동합니다.
- 로그인 후 `/` 대시보드에서 최근 기록, 달력, streak, 감정 흐름을 읽습니다.
- `/entries/new` 는 날짜별 active draft 를 확보한 뒤 편집 화면으로 이동합니다.
- 편집 화면은 `임시저장` 과 `저장하기` 를 분리해, draft 저장과 최종 저장을 나눕니다.
- 날짜별 최종 기록은 사용자당 1개만 유지됩니다.
