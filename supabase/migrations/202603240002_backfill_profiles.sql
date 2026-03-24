insert into public.profiles (
  id,
  display_name,
  avatar_url
)
select
  users.id,
  coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name',
    split_part(users.email, '@', 1),
    '기록자'
  ),
  users.raw_user_meta_data ->> 'avatar_url'
from auth.users as users
left join public.profiles as profiles
  on profiles.id = users.id
where profiles.id is null;
