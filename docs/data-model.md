# 데이터 모델 설명

이 앱은 `일기 작성 경험` 기준으로 테이블을 최소 구성합니다.  
핵심은 다음 4가지입니다.

- 사용자는 자기 데이터만 본다.
- 작성 중인 초안은 1개만 유지한다.
- 발행된 일기는 하루 1개만 허용한다.
- 기분/날씨/종이색은 고정 카탈로그를 쓰되, entry 에 snapshot 도 같이 저장한다.

## 핵심 테이블

### `profiles`

- `auth.users` 와 1:1
- 사용자 표시 이름, 타임존, 로케일 저장
- Google 로그인 직후 trigger 로 자동 생성

### `mood_catalog`

- 기분 선택지 목록
- label, emoji, trend_score 보관
- 감정 흐름 차트는 `trend_score` 를 사용

### `weather_catalog`

- 날씨 선택지 목록
- 외부 날씨 API가 아니라 사용자가 선택한 메타데이터

### `paper_tint_catalog`

- 종이 tint 선택지 목록
- UI 색상 토큰과 연결할 수 있게 `swatch_token`, `paper_surface_token` 보관

### `entry_drafts`

- 작성 중 초안
- 사용자당 active draft 1개만 허용
- autosave 대상
- publish 되면 `is_active=false`, `published_entry_id` 연결

### `entries`

- 최종 저장된 기록
- 사용자당 날짜별 1개만 허용
- 대시보드의 최근 기록, 달력 점, streak, 감정 흐름이 여기서 나온다

### `tags`, `entry_tags`

- 사용자별 태그
- 일기와 태그의 다대다 연결

## 왜 catalog + snapshot 구조인가

기분/날씨/종이색은 catalog 테이블에서 선택하지만, `entries` 와 `entry_drafts` 에도 snapshot 필드를 같이 저장합니다.

이유:

1. 나중에 catalog label 이 바뀌어도 과거 기록 표현을 유지할 수 있습니다.
2. 대시보드 쿼리에서 join 없이 바로 최근 감정 흐름을 읽기 쉽습니다.
3. UI 렌더링이 단순해집니다.

예시:

- `mood_code = 'calm'`
- `mood_label_snapshot = '평온함'`
- `mood_score_snapshot = 74`

## 왜 하루 1개 entry 인가

현재 제품 규칙이 `하루 1개 발행` 이기 때문입니다.

DB 레벨에서는:

- `entries(user_id, entry_date)` unique

앱 레벨에서는:

- publish RPC 가 중복 생성 시 실패
- UI 에서는 "오늘 기록은 이미 저장되었습니다." 메시지 표시

## 왜 active draft 1개인가

이 화면은 `오늘 쓰는 기록 한 장` 경험에 맞춰져 있습니다.

DB 레벨에서는:

- partial unique index  
  `entry_drafts_one_active_per_user`

앱 레벨에서는:

- `/entries/new` 진입 시 active draft 가 있으면 재사용
- 없으면 새로 생성

## RLS 정책 개요

owner-only 정책입니다.

- `profiles`: 본인만 read/update
- `entries`: 본인 것만 read/write/delete
- `entry_drafts`: 본인 것만 read/write/delete
- `tags`: 본인 것만 read/write/delete
- `entry_tags`: 연결된 entry owner 기준 접근
- catalog 3종: 로그인 사용자 read-only

즉 앱 코드에서 별도 user_id 필터를 빼먹어도 DB 가 1차로 막아줍니다.

## 대시보드가 만드는 쿼리

### 최근 기록

- `entries`
- `user_id = current user`
- `order by entry_date desc`
- `limit 2`

### 캘린더 점 표시

- 현재 달 기준 앞뒤 month 범위의 `entry_date` 조회
- 앱이 day grid 로 변환

### 최근 기분 흐름

- 최근 7개 `entries`
- `mood_label_snapshot`, `mood_score_snapshot` 사용

### streak

- `calculate_current_streak(user_id, as_of_date)` 함수 호출

## publish 흐름

`publish_entry_from_draft(draft_id)` 함수가 한 번에 처리합니다.

1. draft owner 확인
2. `entries` insert
3. draft 를 inactive 로 전환
4. `published_entry_id` 연결
5. 생성된 entry id 반환

이렇게 한 이유는 프런트에서 insert/update 두 번을 따로 처리하면 중간 실패 상태를 만들기 쉽기 때문입니다.
