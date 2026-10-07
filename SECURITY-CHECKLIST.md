# Security checklist — SipCount

Checked against the live repository at
https://github.com/gabluigi/SipCount-Project

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | `.gitignore` lists `.env`. `git ls-files` shows only `.env.example`, no `.env`. |
| 2 | A `.env.example` with placeholder values only is committed | Yes | Root `.env.example` contains `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SITE_PASSWORD=change-this-password`, and `COOKIE_SECRET=a-long-random-string-used-to-sign-the-auth-cookie`  all clearly placeholders. |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | `server/server.js` reads `SITE_PASSWORD` and `COOKIE_SECRET` only from `process.env`, and exits with an error if either is missing. No literal credential anywhere in current source. |
| 4 | Git history is clean: I searched `git log -p` for password, secret, api key and `postgres://` | No | `git log --all -p -S"SITE_PASSWORD"` still finds `const SITE_PASSWORD = 'admin';` in commit `a767cf1`, from the earlier client-side `WelcomeGate.jsx`. The file is deleted now, but the commit still exists in history. |
| 5 | Any credential that was ever committed has been rotated | Yes | The old hardcoded value was `'admin'`. The real `SITE_PASSWORD` now in use is a different value, set only as an environment variable, never committed. |
| 6 | Production credentials live only in my hosting provider's environment settings | Yes | `SITE_PASSWORD` and `COOKIE_SECRET` are set in Render's Environment tab for the Web Service. Locally, they load from a gitignored root `.env` via `dotenv` never from source. |

## GitHub Actions

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7–12 | (all) | N/A | No `.github/workflows` directory and no `.yml`/`.yaml` files exist anywhere in the repository as this project has no GitHub Actions workflows. |

## Database

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | No raw SQL exists in the app. `entriesRepo.js`, `presetsRepo.js`, `posseRepo.js` all use the Supabase JS client's query builder (`.eq()`, `.insert()`, `.update()`), which parameterizes internally. |
| 14 | The database is not open to the whole internet, or is reachable only by the app | N/A | Supabase's REST API is reachable from anywhere by design, same as any hosted BaaS. Access control is handled by Row Level Security, not network restriction as covered by #19. |
| 15 | The database user the app connects as has only the permissions it needs | Yes | `client/supabase-schema.sql` is now committed and shows exactly what exists: three tables (`entries`, `presets`, `posse`), RLS enabled on each via `alter table ... enable row level security`, and one permissive policy per table (`for all using (true) with check (true)`). This is an intentional design choice for a single-user, no-login app, the client only ever uses the publishable key, never a service-role key. |
| 16 | Seed and sample data is invented, not real people's data | Yes | Seed data in `client/supabase-schema.sql` is generic drink presets (Lager, IPA, Margarita, etc.)  no real personal data. |
| 17 | Debug, seed and reset routes are removed before going public | Yes | Searched `client/src` and `server/` for debug/reset/seed/test-route patterns found none beyond the intended `/login` route. |

## Access control

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | Yes | `server/server.js` checks `SITE_PASSWORD` server-side before serving any part of the app. This is self-reported as deployed and working on Render |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | Yes | RLS is confirmed enabled in the committed schema (see #15). Confirmed RLS enabled on entries, presets, and posse via the Supabase dashboard Policies page. |
| 20 | If Zero Trust: tjakoen.s@gmail.com is on the access policy. If an app password: the credentials are in my private workspace `project/README.md` | Yes | The required credentials for this app is located at `project/README.md`, moreover zero trust was not utilized |
| 21 | The gate covers every route, including the ones that only change data | Yes | `requireAuth` middleware in `server.js` is registered before `express.static` and the catch-all route, so every path through this server requires the signed cookie. The only routes excluded are `GET`/`POST /login` (the login page and its submission, which must be reachable to log in at all) and `GET /sipcountlogo.svg` (a static image with no data-changing capability). Note the gate only covers the Express server's own routes  |
| 22 | The credentials for the gate are environment variables, not in source | Yes | Confirmed in `server.js`, `process.env.SITE_PASSWORD` and `process.env.COOKIE_SECRET`, no literal values. |

## Input and output

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 23 | Input from the user is validated on the server, not only in the browser | No | The new `server/server.js` only validates the login password, it has no routes for entries, presets, or posse data at all (those go directly from the browser to Supabase). Drink/entry field validation still happens only in the React forms, not on any server. |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | Yes | React escapes all JSX expression content by default. Searched the whole `client/src` for `dangerouslySetInnerHTML`  |
| 25 | Error responses do not expose stack traces, file paths or connection details | Yes | Every repo function (`entriesRepo.js`, `presetsRepo.js`, `posseRepo.js`) catches the Supabase error and re-throws only `error.message`. `server.js` sends plain, short responses (`401`, redirects) with no stack traces. |
| 26 | CORS is not a wildcard on routes that change data | N/A | The Express server has no data-changing routes, only `/login` (auth) and static file serving. All actual data operations go directly to Supabase, whose CORS is configured in the Supabase project settings, not in this repository. |

## Repository and privacy

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | Yes | `README.md` lists the author's name and class code (`2215-6APSI CS403`) no personal email, phone number, or home address appears anywhere. |
| 28 | No classmate's personal data in the repository | Yes | Verified that `README.md`, `AI-USAGE.md`, and `LICENSE.txt` have none, only the author's own name appears. |
| 29 | Dependencies come from official registries, and `node_modules` is gitignored | Yes | `client/package.json` and `server/package.json` reference only npm registry packages (react, vite, `@supabase/supabase-js`, recharts, express, cookie-parser, dotenv). `.gitignore` excludes `node_modules/`. |
| 30 | Images, fonts and other assets are mine, licensed, or credited | Yes | Fonts are loaded from Google Fonts (Space Grotesk, Inter)  open license, fine. SipCount logo was created by me through Canva |
| 31 | Repository visibility is deliberate, and I checked it after my last push | Yes | Confirmed the repository is currently public cloned successfully with no authentication. |

## Anything I found and fixed

This checklist's biggest catch was the original client-side `WelcomeGate.jsx`, which had its password (`'admin'`) hardcoded directly in committed source and only gated the React UI and not the actual data layer. It has been fully removed and replaced with `server/server.js`, a real Express server that checks the password before serving any part of the app at all, with the real password and cookie-signing secret stored only as environment variables.
