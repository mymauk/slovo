# Codex Project Instructions: Ukrainian Flashcard Site

## Project goal

Build a simple site that helps students learn Ukrainian words.

The site has two roles:

- The admin manages students, words, packs, and assignments.
- A student studies the packs that the admin assigns to that student.

The site must work on GitHub Pages. Supabase must store the data and manage sign-in.

## Writing rules

- Write all project plans, code comments, interface text, and help text in the ASD-STE100 style.
- Use short sentences. Use one instruction in each sentence.
- Use active voice. Use present tense where possible.
- Use common words. Use a technical term only when the project needs it.
- Use the same term for the same thing each time.
- Explain a new technical term the first time that it appears.
- Use a list for steps or groups of items.
- Keep each paragraph about one subject.
- Do not use idioms, slang, or unclear short forms.
- Check each new word against the ASD-STE100 dictionary when strict compliance is required. If a word is not approved, use an approved alternative or define the technical term.

## Product rules

- Keep the first version small and easy to use.
- Make the student view work well on a phone and a computer.
- Show only the student's assigned packs to that student.
- Let the admin control student access and pack assignments.
- Store user data in Supabase. Do not store private keys in the site code.
- Enforce access rules in Supabase. Do not rely on the browser to protect data.
- Use clear empty states. Tell the user what to do next.

## Project rules

- Do not add comments to code.
- Keep the application source code in the project source folders.
- Keep Supabase database schema changes in versioned SQL files in `supabase/migrations/`.
- Do not make database schema changes only in the Supabase dashboard.
- Store local secrets and credentials in `.env`.
- Keep `.env` ignored by Git. Never commit it.
- Do not put a Supabase service role key or another private key in client code.
- Treat values that the site bundles into its public build as public, even when they come from `.env`.
- Use only the Supabase public URL and anon key in the client. Protect data with Row Level Security.

## Users and access

### Admin

The admin can:

- Sign in with a Google account that has admin access.
- Create a student invite code.
- Give a code to one student.
- See whether the student used the code.
- Add, edit, and remove Ukrainian-English word entries.
- Create and edit flashcard packs.
- Add words to a pack.
- Assign a pack to one or more students.
- Suspend and restore student access without deleting student records or progress.
- Import a flashcard pack and its words from one JSON file.
- Remove a pack assignment.

### Student

A student can:

- Sign in with Google after the student uses a valid invite code.
- See assigned packs only.
- Open a pack and study its words.
- See the Ukrainian word and its English meaning.
- Turn over a card to see the other side.
- Play Ukrainian pronunciation audio when it is available.
- Mark a word as known or still learning.
- See basic progress for each pack.

## Main user flows

### Student access

1. The admin creates a one-use invite code.
2. The admin adds a label and an optional note to identify the intended student.
3. The admin sends the code to the student outside the site.
4. The student enters the code and signs in with any Google account.
5. Supabase checks the code and links it to the signed-in account.
6. The student sees the assigned packs.

Invite codes must be hard to guess. Each code must have an expiry date and a use limit. Each code must work for one account and one use. The label and note help the admin identify the intended student. Do not bind the code to an email address. A database function must validate and redeem the code. The database must store a hash of the code. Show the code to the admin only once.

### Word and pack management

1. The admin adds a word with its Ukrainian text and English meaning.
2. The admin can add an example sentence and audio.
3. The admin creates a pack and adds words to it.
4. The admin assigns the pack to students.

The admin can import a pack from a JSON file. The file has a `title`, an optional `description`, an optional `level`, and a `words` list. Each word has `ukrainian` and `english` text. Each word may have `example_ukrainian` and `audio_path` values. Reuse a word when its Ukrainian text and English meaning already exist. Add each word to the new pack in file order. Ignore repeated words in the same file after the first item.

When the admin edits a pack, provide a search field for Ukrainian and English words. Load 40 word choices at a time. Load the next choices when the admin scrolls to the end of the list. Keep selected words selected when the admin searches.

### Study session

1. The student opens an assigned pack.
2. The site shows one flashcard at a time.
3. The student turns the card over to see the translation.
4. The student can play audio for the Ukrainian word.
5. The student marks the word as known or still learning.
6. The site saves progress and shows the next card.

## First version scope

Build these parts first:

1. Google sign-in through Supabase Auth.
2. Admin-only access for one configured admin account.
3. Single-use student invite codes.
4. Admin pages for words, packs, and assignments.
5. Student page with assigned packs.
6. Flashcards with Ukrainian and English text.
7. Audio playback for each word.
8. Basic progress: known words and total words in each pack.
9. Supabase Row Level Security policies for every table that the site can access.
10. A responsive layout with clear loading, error, and empty states.

Do not add a class system, payments, public profiles, chat, leaderboards, or complex spaced repetition to the first version.

## Simple study behavior

- Show cards in the order set by the admin.
- Let the student reveal the translation.
- Let the student mark a word as known or still learning.
- Save one status per student and word.
- Show pack progress as known words divided by total words.
- Let the student study the full pack again at any time.

Do not add an algorithm that schedules review dates in the first version. Add that feature only after students use the basic study flow.

## Audio

Use an audio file for each word when the admin provides one. Store audio files in a private or public Supabase Storage bucket, based on the access policy. Save the file path on the word record.

If no audio file exists, the site may use browser text-to-speech as a fallback. Set the speech language to Ukrainian. The browser may not have a Ukrainian voice. Show a clear message if speech is not available.

## Suggested data model

Use these tables in Supabase:

- `profiles`: one row per signed-in user; store the user ID and role.
- `invites`: store a hashed invite code, role, expiry time, redemption state, learner label, and optional admin note.
- `words`: store Ukrainian text, English meaning, optional example text, and optional audio path.
- `packs`: store a title, description, and creator ID.
- `pack_words`: connect words to packs and store their order.
- `assignments`: connect a pack to a student and store who made the assignment.
- `student_word_progress`: connect a student to a word and store known or learning status and update time.

Use Supabase Auth user IDs as user IDs in these tables. Add created and updated times where they help with support or sorting. Add unique constraints to prevent duplicate pack-word pairs and duplicate student-pack assignments.

## Security and privacy

- Turn on Row Level Security for all tables that the site can read or change.
- Allow the admin role to manage words, packs, pack contents, invites, and assignments.
- Allow a student to read only their own profile, assignments, assigned pack contents, and progress.
- Allow a student to add or update only their own progress.
- Do not allow a student to change their role.
- Do not put the Supabase service role key in the site code or in a public environment variable.
- Use protected database functions for invite creation and redemption.
- Store only the information needed to provide the service. Do not collect student data that the site does not need.
- Allow app data access only for Google accounts with an approved profile.

GitHub Pages serves public files. It cannot protect secrets or enforce access. Supabase must enforce all data access rules.

## Technical plan

- Use a small single-page web app.
- Host the built site on GitHub Pages.
- Use Supabase Auth for Google sign-in.
- Use Supabase Postgres for app data.
- Use Supabase Storage for audio files.
- Use Supabase Row Level Security for data access.
- Use protected Postgres functions for invite creation and redemption.
- Keep the Supabase project URL and anon key in the public site configuration. These values are public. Protect data with Row Level Security.
- Add the GitHub Pages site URL to the Supabase Auth redirect allow list.
- Configure Google OAuth in Google Cloud and Supabase before launch.

Pick the web framework and build tool before implementation. Keep the tool set small. Use a static build that GitHub Pages can serve.

## Pages

### Sign-in page

- Explain that a student needs an invite code.
- Provide a field for the invite code.
- Provide a button to continue with Google.
- Show clear error text for an invalid, expired, or used code.

### Student home

- Show the student's assigned packs.
- Show the number of known words for each pack.
- Show a clear message when the student has no assigned packs.

### Study page

- Show one card at a time.
- Show Ukrainian text first.
- Provide a control to reveal the English meaning.
- Provide an audio control when audio exists.
- Provide known and still-learning controls.
- Show current card position and pack progress.

### Admin area

- Show links for students, words, packs, and assignments.
- Use simple forms with clear labels.
- Confirm before removing a word or pack that is in use.
- Show invite status without showing stored invite secrets.

## Delivery steps

1. Create the Supabase project and configure Google sign-in.
2. Create the database tables, constraints, and Row Level Security policies.
3. Build and check invite creation and redemption.
4. Build the admin word and pack tools.
5. Build pack assignment and student access.
6. Build flashcard study, audio playback, and progress saving.
7. Publish the static site with GitHub Pages.
8. Test the main flows with one admin and two student accounts.

## Decisions to keep simple

- Use one admin role and one student role.
- Require an invite code for each new account. Allow an existing approved account to sign in without a new code.
- Use one-use invite codes. Do not bind a code to an email address.
- Use one word list that the admin can reuse in many packs.
- Track progress by student and word. This keeps progress when a word appears in more than one pack.
- Use audio files as the preferred pronunciation source.
- Keep the first version focused on assigned packs and simple progress.

## Initial admin setup

- Do not insert sample users, words, packs, assignments, or invites in a migration.
- Let the admin create the first admin invite by hand in the Supabase SQL Editor.
- Make the first invite a one-use admin invite.
- Let the first user who redeems that invite become the admin.
- Allow later admin-created invite codes to create student accounts only.
- Use an optional learner label and note to help the admin identify each invite.
- Do not ask the admin for a learner email when the admin creates a code.
