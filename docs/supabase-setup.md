# Supabase 설정 가이드

이 문서는 `Supabase를 처음 쓰는 사람` 기준으로 작성했습니다.  
로컬 Docker Supabase는 쓰지 않고, `클라우드 프로젝트 + CLI link + db push` 흐름만 다룹니다.

## 1. Supabase 프로젝트 만들기

1. [https://supabase.com](https://supabase.com) 에 로그인합니다.
2. `New project` 를 누릅니다.
3. 조직, 프로젝트 이름, 리전을 정합니다.
4. 비밀번호를 정하고 생성이 끝날 때까지 기다립니다.

생성이 끝나면 다음 두 값을 복사합니다.

- `Project URL`
- `publishable key`

위치는 `Project Settings > API Keys` 또는 프로젝트의 `Connect` 대화상자입니다.

참고:

- 최신 Supabase 기준 공개 키는 `publishable key` 입니다.
- `anon key` 는 legacy 키이며, 이 프로젝트에서는 fallback 호환용으로만 봅니다.

## 2. Google OAuth 준비

공식 참고: [Login with Google | Supabase Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)

### Google Cloud Console

1. Google Cloud Console 에서 새 프로젝트를 만듭니다.
2. OAuth 동의 화면을 설정합니다.
3. `Web application` 타입 OAuth Client 를 생성합니다.
4. 승인된 Redirect URL 에 아래 URL 을 추가합니다.

```text
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### Supabase 쪽 설정

1. Supabase Dashboard > `Authentication > Providers > Google`
2. Google provider 를 활성화합니다.
3. Google Client ID / Client Secret 을 입력합니다.
4. 저장합니다.

## 3. Redirect URL 정리

앱에서 실제로 쓰는 callback 은 다음입니다.

```text
http://localhost:3000/auth/callback
```

브라우저 OAuth 흐름은:

1. 앱이 Google 로그인 시작
2. Google 이 Supabase Auth 로 복귀
3. Supabase 가 세션을 발급
4. 앱의 `/auth/callback` 이 코드 교환 후 `/` 로 이동

따라서 아래 값들을 같이 확인해야 합니다.

- Google OAuth client: Supabase callback URL 등록
- Supabase Site URL: `http://localhost:3000`
- 앱 env: `NEXT_PUBLIC_APP_URL=http://localhost:3000`

## 4. `.env.local` 만들기

루트에 `.env.local` 파일을 만들고 아래 값을 채웁니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

주의:

- `service_role` 또는 `secret` 키는 이 앱 런타임에 넣지 않습니다.
- 런타임은 `publishable key + user session + RLS` 기준으로만 동작합니다.
- 기존 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 는 legacy fallback 으로만 읽습니다.

## 5. Supabase CLI 설치

공식 설치 문서: [Supabase CLI](https://supabase.com/docs/guides/cli)

Windows 예시:

```bash
winget install Supabase.CLI
```

설치 확인:

```bash
supabase --version
```

## 6. CLI 로그인 + 프로젝트 연결

### 로그인

```bash
supabase login
```

브라우저가 열리면 토큰 인증을 마칩니다.

### 프로젝트 ref 확인

프로젝트 ref 는 `https://<project-ref>.supabase.co` 의 `<project-ref>` 부분입니다.

### link

```bash
supabase link --project-ref <your-project-ref>
```

성공하면 현재 로컬 폴더와 Supabase 프로젝트가 연결됩니다.

## 7. 마이그레이션 적용

```bash
supabase db push
```

이 명령으로 아래가 같이 들어갑니다.

- profiles
- mood_catalog
- weather_catalog
- paper_tint_catalog
- entry_drafts
- entries
- tags
- entry_tags
- trigger / function / RLS
- catalog seed 데이터

## 8. 앱 실행

```bash
yarn dev
```

이후 브라우저에서:

1. `/login` 접속
2. `Google로 시작하기`
3. 로그인 완료 후 `/`
4. `/entries/new` 에서 임시저장 / 저장 흐름 확인

## 9. 타입 재생성

현재 프로젝트에는 시작용 `Database` 타입 파일이 들어 있습니다.  
실제 프로젝트에 맞춰 Supabase에서 다시 생성하려면 아래 명령을 사용합니다.

```bash
supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

주의:

- 이 명령은 현재 linked 된 프로젝트 기준으로 타입을 덮어씁니다.
- migration 을 먼저 반영한 뒤 실행해야 타입이 맞습니다.

## 10. 자주 막히는 지점

### Redirect URL mismatch

증상:

- Google 로그인 후 redirect mismatch 오류

확인할 것:

- Google OAuth Client 의 redirect URL
- Supabase Provider 설정
- `NEXT_PUBLIC_APP_URL`

### env 누락

증상:

- `/login` 에서 환경변수 경고가 보임
- 보호된 페이지 접근 시 `/login?error=missing_env` 로 감

확인할 것:

- `.env.local` 파일 존재 여부
- 변수 이름 오탈자
- 개발 서버 재시작 여부

우선 확인할 표준 변수:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

### `supabase db push` 실패

확인할 것:

- `supabase login` 완료 여부
- `supabase link --project-ref ...` 완료 여부
- 다른 프로젝트에 잘못 link 되어 있지 않은지

### 로그인은 되는데 데이터가 비어 있음

확인할 것:

- `auth.users` 생성 후 `profiles` row 가 trigger 로 생겼는지
- RLS 정책이 migration 그대로 들어갔는지
- catalog seed 데이터가 들어갔는지

## 11. 추천 확인 순서

작업 중 막히면 아래 순서로 확인하는 게 가장 빠릅니다.

1. `supabase link` 가 현재 프로젝트를 가리키는지
2. `supabase db push` 가 성공했는지
3. `.env.local` 값이 맞는지
4. Google OAuth redirect URL 이 맞는지
5. Supabase Dashboard 에서 `auth.users`, `profiles`, `mood_catalog` 데이터가 실제로 있는지
