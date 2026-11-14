insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'word-audio',
  'word-audio',
  false,
  10485760,
  array['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-wav']
)
on conflict (id) do update
set name = excluded.name,
    public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists word_audio_read_admin_or_assigned on storage.objects;
create policy word_audio_read_admin_or_assigned
on storage.objects for select to authenticated
using (
  bucket_id = 'word-audio'
  and (
    private.is_admin()
    or (
      private.is_active_user()
      and exists (
        select 1
        from public.words w
        join public.pack_words pw on pw.word_id = w.id
        join public.assignments a on a.pack_id = pw.pack_id
        where w.audio_path = storage.objects.name
          and a.student_id = auth.uid()
      )
    )
  )
);

drop policy if exists word_audio_insert_admin on storage.objects;
create policy word_audio_insert_admin
on storage.objects for insert to authenticated
with check (bucket_id = 'word-audio' and private.is_admin());

drop policy if exists word_audio_update_admin on storage.objects;
create policy word_audio_update_admin
on storage.objects for update to authenticated
using (bucket_id = 'word-audio' and private.is_admin())
with check (bucket_id = 'word-audio' and private.is_admin());

drop policy if exists word_audio_delete_admin on storage.objects;
create policy word_audio_delete_admin
on storage.objects for delete to authenticated
using (bucket_id = 'word-audio' and private.is_admin());
