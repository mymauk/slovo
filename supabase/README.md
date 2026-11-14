# Supabase setup

## Database migration

This migration creates tables, roles, functions, and Row Level Security policies. It does not add an admin, invite, student, word, pack, or assignment.

The Supabase CLI config is in `supabase/config.toml`. Run these commands from the repository root:

```sh
supabase link --project-ref YOUR_PROJECT_REF
supabase db push --remote --dry-run
supabase db push --remote
```

If you already linked this folder to your Supabase project, skip `supabase link`. Check the target shown by the dry run before you apply the migration. The migration does not add app records. It only creates the database objects and policies.

You can also run the migration SQL in the Supabase SQL Editor. Use the CLI method when possible. The CLI records the migration as applied. A manual SQL Editor run does not update the CLI migration history.

## Create the first admin code

Run this query in the Supabase SQL Editor after you apply the migration. It creates one invite for the first admin. It returns the code once. Save the code and share it with the admin user.

```sql
with generated as (
  select 'SL-' || upper(encode(extensions.gen_random_bytes(12), 'hex')) as code
), saved as (
  insert into public.invites (code_hash, label, note, role, expires_at)
  select
    private.hash_invite_code(generated.code),
    'Initial admin',
    'First admin account',
    'admin',
    now() + interval '7 days'
  from generated
  returning id
)
select generated.code
from generated
cross join saved;
```

The database stores a hash of the code. It does not store the code itself. The code does not have an email address. Any Google account can redeem it once. The profile stores the email from that Google account after redemption.

## Google sign-in

1. Enable Google in **Authentication → Sign In / Providers**.
2. Add the Google OAuth client ID and client secret in Supabase.
3. Set the Supabase **Site URL** to `https://mymauk.github.io/slovo/`.
4. Add `http://localhost:8000/` and `https://mymauk.github.io/slovo/` to the Supabase redirect URL allow list.
5. Add the Supabase callback URL to the Google OAuth client in Google Cloud. Supabase shows this URL in the Google provider settings. It has the form `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.

Use the redirect URL shown in the Supabase Auth provider settings. For this repository, the GitHub Pages URL uses the `mymauk.github.io/slovo` path.

## Invite details

An invite has a label and a note. Use the label to identify the intended learner. Do not enter an email address in the label or note unless you want to store it. The code itself is not bound to an email address.

An admin can create student codes in the site. Each code expires after 30 days by default. The admin sees the code once after creation. The database stores only its hash.
