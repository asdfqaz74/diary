create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    display_name,
    avatar_url
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1),
      '기록자'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  timezone text not null default 'Asia/Seoul',
  locale text not null default 'ko-KR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mood_catalog (
  code text primary key,
  label text not null,
  emoji text not null,
  trend_score smallint not null check (trend_score between 0 and 100),
  display_order integer not null,
  is_active boolean not null default true
);

create table if not exists public.weather_catalog (
  code text primary key,
  label text not null,
  icon text not null,
  display_order integer not null,
  is_active boolean not null default true
);

create table if not exists public.paper_tint_catalog (
  code text primary key,
  label text not null,
  swatch_token text not null,
  paper_surface_token text not null,
  display_order integer not null,
  is_active boolean not null default true
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null,
  title text not null,
  body text not null,
  mood_code text not null references public.mood_catalog (code),
  mood_label_snapshot text not null,
  mood_score_snapshot smallint not null,
  weather_code text not null references public.weather_catalog (code),
  weather_label_snapshot text not null,
  paper_tint_code text not null references public.paper_tint_catalog (code),
  paper_tint_label_snapshot text not null,
  location_name text,
  is_favorite boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entries_user_id_entry_date_key unique (user_id, entry_date)
);

create table if not exists public.entry_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null default current_date,
  title text not null default '',
  body text not null default '',
  mood_code text not null references public.mood_catalog (code),
  mood_label_snapshot text not null,
  mood_score_snapshot smallint not null,
  weather_code text not null references public.weather_catalog (code),
  weather_label_snapshot text not null,
  paper_tint_code text not null references public.paper_tint_catalog (code),
  paper_tint_label_snapshot text not null,
  location_name text,
  is_active boolean not null default true,
  published_entry_id uuid references public.entries (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_autosaved_at timestamptz not null default now()
);

create unique index if not exists entry_drafts_one_active_per_user
  on public.entry_drafts (user_id)
  where is_active = true;

create index if not exists entries_user_published_at_idx
  on public.entries (user_id, published_at desc);

create index if not exists entries_user_entry_date_idx
  on public.entries (user_id, entry_date desc);

create index if not exists entry_drafts_user_updated_at_idx
  on public.entry_drafts (user_id, updated_at desc);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  constraint tags_user_id_slug_key unique (user_id, slug)
);

create table if not exists public.entry_tags (
  entry_id uuid not null references public.entries (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (entry_id, tag_id)
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_entries_updated_at on public.entries;
create trigger set_entries_updated_at
before update on public.entries
for each row
execute function public.set_updated_at();

drop trigger if exists set_entry_drafts_updated_at on public.entry_drafts;
create trigger set_entry_drafts_updated_at
before update on public.entry_drafts
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.calculate_current_streak(
  p_user_id uuid,
  p_as_of date default current_date
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  streak integer := 0;
  cursor_date date := p_as_of;
begin
  loop
    if exists (
      select 1
      from public.entries
      where user_id = p_user_id
        and entry_date = cursor_date
    ) then
      streak := streak + 1;
      cursor_date := cursor_date - 1;
    else
      exit;
    end if;
  end loop;

  return streak;
end;
$$;

create or replace function public.publish_entry_from_draft(p_draft_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  draft_row public.entry_drafts%rowtype;
  entry_id uuid;
begin
  select *
  into draft_row
  from public.entry_drafts
  where id = p_draft_id
    and user_id = auth.uid()
    and is_active = true;

  if not found then
    raise exception 'active draft not found';
  end if;

  insert into public.entries (
    user_id,
    entry_date,
    title,
    body,
    mood_code,
    mood_label_snapshot,
    mood_score_snapshot,
    weather_code,
    weather_label_snapshot,
    paper_tint_code,
    paper_tint_label_snapshot,
    location_name
  )
  values (
    draft_row.user_id,
    draft_row.entry_date,
    draft_row.title,
    draft_row.body,
    draft_row.mood_code,
    draft_row.mood_label_snapshot,
    draft_row.mood_score_snapshot,
    draft_row.weather_code,
    draft_row.weather_label_snapshot,
    draft_row.paper_tint_code,
    draft_row.paper_tint_label_snapshot,
    draft_row.location_name
  )
  returning id into entry_id;

  update public.entry_drafts
  set
    is_active = false,
    published_entry_id = entry_id
  where id = draft_row.id;

  return entry_id;
exception
  when unique_violation then
    raise exception using
      errcode = '23505',
      message = '이미 해당 날짜의 기록이 존재합니다.';
end;
$$;

insert into public.mood_catalog (
  code,
  label,
  emoji,
  trend_score,
  display_order,
  is_active
)
values
  ('meditative', '명상하는 마음', '🧘', 92, 1, true),
  ('calm', '평온함', '🙂', 74, 2, true),
  ('foggy', '복잡함', '😶‍🌫️', 41, 3, true),
  ('quiet', '차분함', '😌', 62, 4, true)
on conflict (code) do update
set
  label = excluded.label,
  emoji = excluded.emoji,
  trend_score = excluded.trend_score,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

insert into public.weather_catalog (
  code,
  label,
  icon,
  display_order,
  is_active
)
values
  ('sunny', '맑은 하늘', 'wb_sunny', 1, true),
  ('cloud', '흐림', 'cloud', 2, true),
  ('rainy', '비 오는 날', 'rainy', 3, true),
  ('snow', '눈 오는 날', 'ac_unit', 4, true)
on conflict (code) do update
set
  label = excluded.label,
  icon = excluded.icon,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

insert into public.paper_tint_catalog (
  code,
  label,
  swatch_token,
  paper_surface_token,
  display_order,
  is_active
)
values
  ('mist', '안개빛 종이', 'surface-container-lowest', 'paper-mist', 1, true),
  ('rose', '장밋빛 종이', 'rose-100', 'paper-rose', 2, true),
  ('sage', '세이지 종이', 'emerald-100', 'paper-sage', 3, true),
  ('sky', '하늘빛 종이', 'sky-100', 'paper-sky', 4, true)
on conflict (code) do update
set
  label = excluded.label,
  swatch_token = excluded.swatch_token,
  paper_surface_token = excluded.paper_surface_token,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

alter table public.profiles enable row level security;
alter table public.mood_catalog enable row level security;
alter table public.weather_catalog enable row level security;
alter table public.paper_tint_catalog enable row level security;
alter table public.entries enable row level security;
alter table public.entry_drafts enable row level security;
alter table public.tags enable row level security;
alter table public.entry_tags enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "catalog_read_mood" on public.mood_catalog;
create policy "catalog_read_mood"
on public.mood_catalog
for select
to authenticated
using (true);

drop policy if exists "catalog_read_weather" on public.weather_catalog;
create policy "catalog_read_weather"
on public.weather_catalog
for select
to authenticated
using (true);

drop policy if exists "catalog_read_paper_tint" on public.paper_tint_catalog;
create policy "catalog_read_paper_tint"
on public.paper_tint_catalog
for select
to authenticated
using (true);

drop policy if exists "entries_select_own" on public.entries;
create policy "entries_select_own"
on public.entries
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "entries_insert_own" on public.entries;
create policy "entries_insert_own"
on public.entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "entries_update_own" on public.entries;
create policy "entries_update_own"
on public.entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "entries_delete_own" on public.entries;
create policy "entries_delete_own"
on public.entries
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "drafts_select_own" on public.entry_drafts;
create policy "drafts_select_own"
on public.entry_drafts
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "drafts_insert_own" on public.entry_drafts;
create policy "drafts_insert_own"
on public.entry_drafts
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "drafts_update_own" on public.entry_drafts;
create policy "drafts_update_own"
on public.entry_drafts
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "drafts_delete_own" on public.entry_drafts;
create policy "drafts_delete_own"
on public.entry_drafts
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "tags_select_own" on public.tags;
create policy "tags_select_own"
on public.tags
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "tags_insert_own" on public.tags;
create policy "tags_insert_own"
on public.tags
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "tags_update_own" on public.tags;
create policy "tags_update_own"
on public.tags
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "tags_delete_own" on public.tags;
create policy "tags_delete_own"
on public.tags
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "entry_tags_select_own" on public.entry_tags;
create policy "entry_tags_select_own"
on public.entry_tags
for select
to authenticated
using (
  exists (
    select 1
    from public.entries
    where entries.id = entry_tags.entry_id
      and entries.user_id = auth.uid()
  )
);

drop policy if exists "entry_tags_insert_own" on public.entry_tags;
create policy "entry_tags_insert_own"
on public.entry_tags
for insert
to authenticated
with check (
  exists (
    select 1
    from public.entries
    where entries.id = entry_tags.entry_id
      and entries.user_id = auth.uid()
  )
  and exists (
    select 1
    from public.tags
    where tags.id = entry_tags.tag_id
      and tags.user_id = auth.uid()
  )
);

drop policy if exists "entry_tags_delete_own" on public.entry_tags;
create policy "entry_tags_delete_own"
on public.entry_tags
for delete
to authenticated
using (
  exists (
    select 1
    from public.entries
    where entries.id = entry_tags.entry_id
      and entries.user_id = auth.uid()
  )
);
