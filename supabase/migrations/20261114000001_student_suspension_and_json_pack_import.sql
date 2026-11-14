alter table public.profiles
add column suspended_at timestamptz;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid()
      and role = 'admin'::public.app_role
      and suspended_at is null
  );
$$;

create or replace function private.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and suspended_at is null
  );
$$;

create or replace function public.set_student_suspended(
  p_student_id uuid,
  p_suspended boolean
)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_suspended_at timestamptz;
begin
  if auth.uid() is null or not private.is_admin() then
    raise exception 'Only an active admin can change student access';
  end if;

  if p_student_id = auth.uid() then
    raise exception 'An admin cannot suspend their own account';
  end if;

  update public.profiles
  set suspended_at = case when p_suspended then now() else null end
  where user_id = p_student_id and role = 'student'::public.app_role
  returning suspended_at into v_suspended_at;

  if not found then
    raise exception 'Student account was not found';
  end if;

  return v_suspended_at;
end;
$$;

drop policy if exists words_read_admin_or_assigned on public.words;
create policy words_read_admin_or_assigned
on public.words for select to authenticated
using (
  private.is_admin()
  or (
    private.is_active_user()
    and exists (
      select 1
      from public.pack_words pw
      join public.assignments a on a.pack_id = pw.pack_id
      where pw.word_id = words.id and a.student_id = auth.uid()
    )
  )
);

drop policy if exists packs_read_admin_or_assigned on public.packs;
create policy packs_read_admin_or_assigned
on public.packs for select to authenticated
using (
  private.is_admin()
  or (
    private.is_active_user()
    and exists (
      select 1 from public.assignments a
      where a.pack_id = packs.id and a.student_id = auth.uid()
    )
  )
);

drop policy if exists pack_words_read_admin_or_assigned on public.pack_words;
create policy pack_words_read_admin_or_assigned
on public.pack_words for select to authenticated
using (
  private.is_admin()
  or (
    private.is_active_user()
    and exists (
      select 1 from public.assignments a
      where a.pack_id = pack_words.pack_id and a.student_id = auth.uid()
    )
  )
);

drop policy if exists assignments_read_own_or_admin on public.assignments;
create policy assignments_read_own_or_admin
on public.assignments for select to authenticated
using (
  private.is_admin()
  or (student_id = auth.uid() and private.is_active_user())
);

drop policy if exists progress_read_own_or_admin on public.student_word_progress;
create policy progress_read_own_or_admin
on public.student_word_progress for select to authenticated
using (
  private.is_admin()
  or (student_id = auth.uid() and private.is_active_user())
);

drop policy if exists progress_insert_own on public.student_word_progress;
create policy progress_insert_own
on public.student_word_progress for insert to authenticated
with check (
  student_id = auth.uid()
  and private.is_active_user()
  and exists (
    select 1
    from public.pack_words pw
    join public.assignments a on a.pack_id = pw.pack_id
    where pw.word_id = student_word_progress.word_id
      and a.student_id = auth.uid()
  )
);

drop policy if exists progress_update_own on public.student_word_progress;
create policy progress_update_own
on public.student_word_progress for update to authenticated
using (
  student_id = auth.uid()
  and private.is_active_user()
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
  and private.is_active_user()
  and exists (
    select 1
    from public.pack_words pw
    join public.assignments a on a.pack_id = pw.pack_id
    where pw.word_id = student_word_progress.word_id
      and a.student_id = auth.uid()
  )
);

create function public.import_pack_json(p_pack jsonb)
returns table (pack_id uuid, word_count integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pack_id uuid;
  v_title text;
  v_description text;
  v_level text;
  v_item jsonb;
  v_ukrainian text;
  v_english text;
  v_example text;
  v_audio_path text;
  v_word_id uuid;
  v_position integer := 0;
  v_word_ids uuid[] := array[]::uuid[];
begin
  if auth.uid() is null or not private.is_admin() then
    raise exception 'Only an active admin can import a pack';
  end if;

  if jsonb_typeof(p_pack) is distinct from 'object' then
    raise exception 'The JSON file must contain one pack object';
  end if;

  v_title := nullif(trim(p_pack ->> 'title'), '');
  v_description := nullif(trim(p_pack ->> 'description'), '');
  v_level := coalesce(nullif(trim(p_pack ->> 'level'), ''), 'Starter');

  if v_title is null or length(v_title) > 120 then
    raise exception 'The pack title must have 1 to 120 characters';
  end if;

  if v_description is not null and length(v_description) > 2000 then
    raise exception 'The pack description must have 2000 characters or less';
  end if;

  if length(v_level) > 40 then
    raise exception 'The pack level must have 40 characters or less';
  end if;

  if jsonb_typeof(p_pack -> 'words') is distinct from 'array' then
    raise exception 'The pack must include a words array';
  end if;

  if jsonb_array_length(p_pack -> 'words') not between 1 and 5000 then
    raise exception 'A pack must include from 1 to 5000 words';
  end if;

  insert into public.packs (title, description, level, created_by)
  values (v_title, v_description, v_level, auth.uid())
  returning id into v_pack_id;

  for v_item in select value from jsonb_array_elements(p_pack -> 'words')
  loop
    if jsonb_typeof(v_item) is distinct from 'object' then
      raise exception 'Each word must be a JSON object';
    end if;

    v_ukrainian := nullif(trim(v_item ->> 'ukrainian'), '');
    v_english := nullif(trim(v_item ->> 'english'), '');
    v_example := nullif(trim(v_item ->> 'example_ukrainian'), '');
    v_audio_path := nullif(trim(v_item ->> 'audio_path'), '');

    if v_ukrainian is null or length(v_ukrainian) > 200 then
      raise exception 'Each Ukrainian word must have 1 to 200 characters';
    end if;

    if v_english is null or length(v_english) > 300 then
      raise exception 'Each English meaning must have 1 to 300 characters';
    end if;

    select id into v_word_id
    from public.words
    where lower(ukrainian) = lower(v_ukrainian)
      and lower(english) = lower(v_english);

    if v_word_id is null then
      insert into public.words (ukrainian, english, example_ukrainian, audio_path, created_by)
      values (v_ukrainian, v_english, v_example, v_audio_path, auth.uid())
      on conflict do nothing
      returning id into v_word_id;

      if v_word_id is null then
        select id into v_word_id
        from public.words
        where lower(ukrainian) = lower(v_ukrainian)
          and lower(english) = lower(v_english);
      end if;
    end if;

    if v_word_id is null then
      raise exception 'The word could not be saved';
    end if;

    if not (v_word_id = any(v_word_ids)) then
      insert into public.pack_words (pack_id, word_id, position)
      values (v_pack_id, v_word_id, v_position);
      v_word_ids := array_append(v_word_ids, v_word_id);
      v_position := v_position + 1;
    end if;
  end loop;

  return query select v_pack_id, cardinality(v_word_ids);
end;
$$;

revoke all on function private.is_active_user() from public, anon;
grant execute on function private.is_active_user() to authenticated;
revoke all on function public.set_student_suspended(uuid, boolean) from public, anon;
revoke all on function public.import_pack_json(jsonb) from public, anon;
grant execute on function public.set_student_suspended(uuid, boolean) to authenticated;
grant execute on function public.import_pack_json(jsonb) to authenticated;
