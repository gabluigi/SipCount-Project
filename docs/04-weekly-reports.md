# Week of: September 27, 2026

## What changed this week

- Created a Supabase project with two tables: `entries` and `presets`.
- Added Row Level Security policies so the app can read and write to
  these tables.
- Connected the app to Supabase using `@supabase/supabase-js`, with the
  new publishable API key (not the legacy anon/service_role keys, since
  those are being phased out).
- Rewrote `EntriesContext.jsx` and `PresetsContext.jsx` to load and save
  data through Supabase instead of `localStorage`.
- Moved the project into the `client/` folder inside the GitHub
  repository, to match the structure the repository expects.
- Removed `node_modules` from Git tracking (it had been committed before
  `.gitignore` was set up correctly).
- Set up hosting for the client on Render (build command, publish
  folder, and environment variables) and got the app successfully
  deployed. It is now live at
  <https://sipcount-project.onrender.com/>.

## Why

Last week's version only saved data in the browser, which meant the data
was not shared, not backed up, and disappeared if the browser storage was
cleared. Moving to Supabase gives the app real, persistent storage.
Hosting on Render is the next piece: it turns the project from something
that only runs on my computer into something with a real, shareable link.

## What broke or what I got stuck on

- **Folder confusion.** My local project did not match the folder
  structure the GitHub repository expected. I did not have a `client/`
  folder at first, which caused problems both with pushing the code
  correctly and with setting up Render (Render needs to know which
  folder holds the app). This took a while to sort out, but it is
  resolved now.
- **Render deployment error.** When trying to deploy, the build failed
  with the error `sh: 1: vite: Permission denied`. The cause was that
  `node_modules` had been committed to GitHub before it was properly
  ignored. Render was trying to run a Vite binary from that committed
  folder, and the file permissions did not work correctly on Render's
  Linux servers. The fix was to remove `node_modules` from Git tracking,
  keep it in `.gitignore`, and let Render install its own copy from
  `package-lock.json` before running the build. After this fix, the
  deploy succeeded. The live site is now up at
  <https://sipcount-project.onrender.com/>.

## What is left

- Improve the styling drastically — right now the app uses the design
  system's colors and spacing, but the overall look still needs more
  visual polish.
- Add basic security, since right now anyone with the Supabase
  publishable key could read or write any row (there is no login or
  per-user access control yet).
- Fix and improve the forms — add clearer validation messages, and check
  edge cases like empty fields or unusual number values.
- Add delete confirmation for entries and presets.
- Take real screenshots of the app for the documentation.
- Decide whether the empty `server/` folder in the repository needs an
  explanation, since SipCount uses Supabase directly and does not have a
  custom backend.


# Week of: September 22, 2026

## What changed this week

- Set up the SipCount project with Vite and React.
- Added `react-router-dom` and connected the four routes: `/` (Home),
  `/add` (Add Entry), `/history` (Monitoring), and `/drinks` (Drinks).
- Added `recharts` and used it for the bar chart on the Monitoring screen.
- Created the folder structure for components: `atoms`, `molecules`, and
  `organisms`, matching the component tree from the wireframes.
- Turned the design system into a `tokens.css` file with the color, type,
  and spacing variables, so the app uses the same values everywhere.
- Built the Home screen: month calendar, day selection, and a panel that
  shows that day's entries with inline edit and delete.
- Built the Add screen: a form to log a drink, with a toggle between
  choosing a preset drink or typing a custom one. Calories fill in
  automatically from a preset but can still be changed by hand.
- Built the Monitoring screen: current week totals (drinks and calories),
  with a toggle between a chart view and a plain numbers view.
- Built the Drinks screen: a searchable, filterable list of preset drinks,
  with a form to add custom presets and edit or delete them.
- Added data storage with `localStorage`, so logged drinks and custom
  presets stay saved between visits.
a
## Why

These changes turn the earlier planning documents (proposal, wireframes,
design system) into a real, working app. The goal for this stage was to
get all four screens on screen and connected, using real data, before
adding smaller details and polish later.

## What broke or what I got stuck on

- Nothing broke in a big way, but I had very little time this week because
  I was preparing for my thesis defense. Most of my week went to that, not
  to this project.
- Because of the limited time, some smaller features are still missing:
  there is no confirmation step before deleting an entry or a preset, and
  form validation is only basic (for example, it checks that a name and a
  calorie value exist, but not much more than that).
- The project is only a draft right now. It still lives on my local
  machine — I have not pushed it to GitHub or deployed it anywhere yet.

## What is left

- Push the project to GitHub and set up the repository properly (with the
  README and AI-USAGE files described in the documentation guide).
- Add delete confirmation for entries and presets.
- Add clearer form validation and error messages.
- Take real screenshots of each screen for the documentation.
- Test the app more carefully on phone-sized screens, since the design
  system's responsive plan (640px breakpoint) has not been fully checked
  in the real app yet, only in the wireframe and design system files.
- Decide if the app needs a backend later, or if `localStorage` is enough
  for a single-user app like this.
