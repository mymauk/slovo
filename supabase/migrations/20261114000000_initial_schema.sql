create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;

create type public.app_role as enum ('admin', 'student');
create type public.word_status as enum ('known', 'learning');

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique check (length(code_hash) = 64),
  label text not null check (length(trim(label)) between 1 and 120),
  note text check (note is null or length(note) <= 500),
  role public.app_role not null default 'student',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  redeemed_by uuid unique references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  check (redeemed_by is null or redeemed_at is not null)
);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  invite_id uuid not null unique references public.invites(id) on delete restrict,
  role public.app_role not null,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table public.words (
  id uuid primary key default gen_random_uuid(),
  ukrainian text not null check (length(trim(ukrainian)) between 1 and 200),
  english text not null check (length(trim(english)) between 1 and 300),
  example_ukrainian text,
  audio_path text,
  created_by uuid not null references public.profiles(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index words_ukrainian_english_unique on public.words (lower(ukrainian), lower(english));

create table public.packs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 120),
  description text,
  level text not null default 'Starter',
  created_by uuid not null references public.profiles(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pack_words (
  pack_id uuid not null references public.packs(id) on delete cascade,
  word_id uuid not null references public.words(id) on delete cascade,
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  primary key (pack_id, word_id),
  unique (pack_id, position)
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(user_id) on delete cascade,
  pack_id uuid not null references public.packs(id) on delete cascade,
  assigned_by uuid not null references public.profiles(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (student_id, pack_id)
);

create table public.student_word_progress (
  student_id uuid not null references public.profiles(user_id) on delete cascade,
  word_id uuid not null references public.words(id) on delete cascade,
  status public.word_status not null,
  updated_at timestamptz not null default now(),
  primary key (student_id, word_id)
);

create index assignments_student_id_idx on public.assignments (student_id);
create index assignments_pack_id_idx on public.assignments (pack_id);
create index pack_words_word_id_idx on public.pack_words (word_id);
create index progress_word_id_idx on public.student_word_progress (word_id);
create index invites_redeemed_by_idx on public.invites (redeemed_by);

create function private.hash_invite_code(p_code text)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select encode(extensions.digest(upper(regexp_replace(trim(p_code), '\s+', '', 'g')), 'sha256'), 'hex');
$$;

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'::public.app_role
  );
$$;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger words_set_updated_at
before update on public.words
for each row execute function private.set_updated_at();

create trigger packs_set_updated_at
before update on public.packs
for each row execute function private.set_updated_at();

create trigger progress_set_updated_at
before update on public.student_word_progress
for each row execute function private.set_updated_at();

create function public.create_student_invite(
  p_label text,
  p_note text default null,
  p_expires_at timestamptz default null
)
returns table (invite_id uuid, code text, label text, expires_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text;
  v_invite_id uuid;
  v_expires_at timestamptz;
begin
  if auth.uid() is null or not private.is_admin() then
    raise exception 'Only an admin can create an invite';
  end if;

  if p_label is null or length(trim(p_label)) not between 1 and 120 then
    raise exception 'The invite label must have 1 to 120 characters';
  end if;

  if p_note is not null and length(p_note) > 500 then
    raise exception 'The invite note must have 500 characters or less';
  end if;

  v_expires_at := coalesce(p_expires_at, now() + interval '30 days');

  if v_expires_at <= now() then
    raise exception 'The expiry time must be in the future';
  end if;

  v_code := 'SL-' || upper(encode(extensions.gen_random_bytes(12), 'hex'));

  insert into public.invites (code_hash, label, note, role, created_by, expires_at)
  values (private.hash_invite_code(v_code), trim(p_label), nullif(trim(p_note), ''), 'student', auth.uid(), v_expires_at)
  returning id into v_invite_id;

  return query select v_invite_id, v_code, trim(p_label), v_expires_at;
end;
$$;

create function public.redeem_invite(p_code text)
returns setof public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_invite_id uuid;
  v_role public.app_role;
  v_email text;
  v_name text;
  v_profile public.profiles%rowtype;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Sign in before you use an invite code';
  end if;

  select * into v_profile from public.profiles where user_id = v_user_id;

  if found then
    return next v_profile;
    return;
  end if;

  if p_code is null or length(trim(p_code)) < 8 then
    raise exception 'The invite code is not valid';
  end if;

  update public.invites
  set redeemed_by = v_user_id, redeemed_at = now()
  where code_hash = private.hash_invite_code(p_code)
    and redeemed_by is null
    and (expires_at is null or expires_at > now())
  returning id, role into v_invite_id, v_role;

  if v_invite_id is null then
    raise exception 'The invite code is invalid, expired, or already used';
  end if;

  v_email := auth.jwt() ->> 'email';
  v_name := coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'full_name', ''),
    nullif(auth.jwt() -> 'user_metadata' ->> 'name', ''),
    nullif(v_email, ''),
    'Student'
  );

  insert into public.profiles (user_id, invite_id, role, full_name, email)
  values (v_user_id, v_invite_id, v_role, v_name, coalesce(v_email, ''))
  returning * into v_profile;

  return next v_profile;
end;
$$;

alter table public.invites enable row level security;
alter table public.profiles enable row level security;
alter table public.words enable row level security;
alter table public.packs enable row level security;
alter table public.pack_words enable row level security;
alter table public.assignments enable row level security;
alter table public.student_word_progress enable row level security;

create policy profiles_read_own_or_admin
on public.profiles for select to authenticated
using (user_id = auth.uid() or private.is_admin());

create policy invites_read_admin
on public.invites for select to authenticated
using (private.is_admin());

create policy words_read_admin_or_assigned
on public.words for select to authenticated
using (
  private.is_admin()
  or exists (
    select 1
    from public.pack_words pw
    join public.assignments a on a.pack_id = pw.pack_id
    where pw.word_id = words.id and a.student_id = auth.uid()
  )
);

create policy words_manage_admin
on public.words for all to authenticated
using (private.is_admin())
with check (private.is_admin() and created_by = auth.uid());

create policy packs_read_admin_or_assigned
on public.packs for select to authenticated
using (
  private.is_admin()
  or exists (
    select 1 from public.assignments a
    where a.pack_id = packs.id and a.student_id = auth.uid()
  )
);

create policy packs_manage_admin
on public.packs for all to authenticated
using (private.is_admin())
with check (private.is_admin() and created_by = auth.uid());

create policy pack_words_read_admin_or_assigned
on public.pack_words for select to authenticated
using (
  private.is_admin()
  or exists (
    select 1 from public.assignments a
    where a.pack_id = pack_words.pack_id and a.student_id = auth.uid()
  )
);

create policy pack_words_manage_admin
on public.pack_words for all to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy assignments_read_own_or_admin
on public.assignments for select to authenticated
using (student_id = auth.uid() or private.is_admin());

create policy assignments_manage_admin
on public.assignments for all to authenticated
using (private.is_admin())
with check (private.is_admin() and assigned_by = auth.uid());

create policy progress_read_own_or_admin
on public.student_word_progress for select to authenticated
using (student_id = auth.uid() or private.is_admin());

create policy progress_insert_own
on public.student_word_progress for insert to authenticated
with check (
  student_id = auth.uid()
  and exists (
    select 1
    from public.pack_words pw
    join public.assignments a on a.pack_id = pw.pack_id
    where pw.word_id = student_word_progress.word_id
      and a.student_id = auth.uid()
  )
);

create policy progress_update_own
on public.student_word_progress for update to authenticated
using (
  student_id = auth.uid()
  and exists (
    select 1
    from public.pack_words pw
    join public.assignments a on a.pack_id = pw.pack_id
    where pw.word_id = student_word_progress.word_id
      and a.student_id = auth.uid()
  )
)
with check (
  student_id = auth.uid()
  and exists (
    select 1
    from public.pack_words pw
    join public.assignments a on a.pack_id = pw.pack_id
    where pw.word_id = student_word_progress.word_id
      and a.student_id = auth.uid()
  )
);

grant usage on schema public to authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

revoke all on table public.invites from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.words from anon, authenticated;
revoke all on table public.packs from anon, authenticated;
revoke all on table public.pack_words from anon, authenticated;
revoke all on table public.assignments from anon, authenticated;
revoke all on table public.student_word_progress from anon, authenticated;

grant select on table public.invites to authenticated;
grant select on table public.profiles to authenticated;
grant select, insert, update, delete on table public.words to authenticated;
grant select, insert, update, delete on table public.packs to authenticated;
grant select, insert, update, delete on table public.pack_words to authenticated;
grant select, insert, update, delete on table public.assignments to authenticated;
grant select, insert, update, delete on table public.student_word_progress to authenticated;

revoke all on function private.hash_invite_code(text) from public, anon, authenticated;
revoke all on function private.is_admin() from public, anon;
revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function public.create_student_invite(text, text, timestamptz) from public, anon;
revoke all on function public.redeem_invite(text) from public, anon;

grant execute on function public.create_student_invite(text, text, timestamptz) to authenticated;
grant execute on function public.redeem_invite(text) to authenticated;

