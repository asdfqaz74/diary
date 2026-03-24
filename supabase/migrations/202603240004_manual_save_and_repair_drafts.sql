update public.entry_drafts as draft
set published_entry_id = entry_row.id
from public.entries as entry_row
where draft.is_active = true
  and draft.published_entry_id is null
  and draft.user_id = entry_row.user_id
  and draft.entry_date = entry_row.entry_date;

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

  entry_id := draft_row.published_entry_id;

  if entry_id is null then
    select id
    into entry_id
    from public.entries
    where user_id = auth.uid()
      and entry_date = draft_row.entry_date
    limit 1;
  end if;

  if entry_id is not null then
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
    where id = entry_id
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
