# Slovo

Slovo is a Ukrainian flashcard site. It uses Supabase Auth and Postgres.

## Run the site

Copy `.env.example` to `.env`. Add the Supabase project URL and public publishable key to `.env`. Then build and serve the site:

```sh
cp .env.example .env
node build.mjs
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`.

Run the database migration in `supabase/migrations/20261114000000_initial_schema.sql` first. Read [the Supabase setup guide](supabase/README.md) to create the first admin code and configure Google sign-in.

## Publish with GitHub Pages

1. Add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` as repository Actions variables.
2. Push this project to the `main` branch.
3. Open the repository settings.
4. Open **Pages**.
5. Set the source to **GitHub Actions**.
6. Open the **Actions** page and wait for **Publish site** to finish.

The workflow builds the static site and publishes the `dist/` folder. The site uses relative paths, so it works at a project URL such as `https://username.github.io/repository/`.

The publishable key is visible in the site. It is safe to use in the browser. Never add a Supabase service-role key to `.env`, GitHub variables, or the site.
