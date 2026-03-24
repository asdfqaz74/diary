drop index if exists public.entry_drafts_one_active_per_user;

create unique index if not exists entry_drafts_one_active_per_date
  on public.entry_drafts (user_id, entry_date)
  where is_active = true;

create or replace function public.save_entry_from_draft(p_draft_id uuid)
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

  if draft_row.published_entry_id is not null then
    update public.entries
    set
      entry_date = draft_row.entry_date,
      title = draft_row.title,
      body = draft_row.body,
      mood_code = draft_row.mood_code,
      mood_label_snapshot = draft_row.mood_label_snapshot,
      mood_score_snapshot = draft_row.mood_score_snapshot,
      weather_code = draft_row.weather_code,
      weather_label_snapshot = draft_row.weather_label_snapshot,
      paper_tint_code = draft_row.paper_tint_code,
      paper_tint_label_snapshot = draft_row.paper_tint_label_snapshot,
      location_name = draft_row.location_name
    where id = draft_row.published_entry_id
      and user_id = auth.uid()
    returning id into entry_id;
  end if;

  if entry_id is null then
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
  end if;

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
      message = 'entry already exists for this date';
end;
$$;

create or replace function public.publish_entry_from_draft(p_draft_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
begin
  return public.save_entry_from_draft(p_draft_id);
end;
$$;

create or replace function public.delete_entry_for_date(p_entry_date date)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  delete from public.entry_drafts
  where user_id = auth.uid()
    and entry_date = p_entry_date;

  delete from public.entries
  where user_id = auth.uid()
    and entry_date = p_entry_date;
end;
$$;
