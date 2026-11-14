# Slovo

Slovo is a Ukrainian flashcard site. This first version is a static demo.

## Open the demo

Start a local web server in this folder:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

The demo has a teacher view and three student views. Use the **Preview as** menu to change the user. Add words, make packs, assign packs, and study cards. The demo saves changes in the current browser with local storage.

The demo does not use Supabase. It does not sign users in. It does not share changes between browsers. Browser audio may not include a Ukrainian voice.

## Publish with GitHub Pages

1. Push this project to the `main` branch of a GitHub repository.
2. Open the repository settings.
3. Open **Pages**.
4. Set the source to **GitHub Actions**.
5. Open the **Actions** page and wait for **Publish site** to finish.

The action copies the static site files to a clean folder and publishes that folder. The site uses relative paths, so it works at a project URL such as `https://username.github.io/repository/`.

## Demo data

The site stores demo users, words, packs, assignments, invites, and progress in local storage. Select **Reset demo data** from the help menu to clear saved data and reload the original demo.

## Next step

Replace local demo data with Supabase Auth and database access. Add Supabase policies before using real student data.
