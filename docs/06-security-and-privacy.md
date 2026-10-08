# Security and privacy checklist

## Before the first push

- [x] `.gitignore` includes `.env`, and `git check-ignore -v .env` confirms it.
      `.gitignore` lists `.env` 
- [x] `git ls-files | grep -iE '\.env$|\.pem$|id_rsa'` prints nothing.
      `git ls-files` shows only `.env.example` 
- [x] `.env.example` is committed, with **placeholder** values only. It holds
      placeholder values for `VITE_SUPABASE_URL` and
      `VITE_SUPABASE_PUBLISHABLE_KEY`, plus
      `SITE_PASSWORD=change-this-password` and a placeholder `COOKIE_SECRET`
- [x] No connection string, key or password anywhere in the repository,
      including in a screenshot. Current source is clean 
      but git history still holds `const SITE_PASSWORD = 'admin';` in commit
      `a767cf1`, from the old client-side `WelcomeGate.jsx` 
- [x] No `student.json`, and no name, student number or email of yours or
      anyone else's.  No personal email, phone number or home
      address is in the repository, 

The one credential that was ever committed was the old test password
`admin`. It was replaced, and the real `SITE_PASSWORD` is set only as an
environment variable on the host. The commit that holds the old value
has not been removed from history.

## The application

- [x] Every SQL query is parameterised. The app has no raw SQL. The three repo
      files use the Supabase client's query builder (`.eq()`, `.insert()`,
      `.update()`), which parameterises values.
- [ ] Input is validated **on the server**, not only in React. Length limits on
      every text field. The Express server only checks the login
      password. Drink, preset and posse fields are validated only in the React
      forms. 
- [ ] **N/A** `cors({ origin: allowedOrigins })` names your origins. The
      Express server has no data routes and does not use `cors`. All data calls
      go straight to Supabase, whose CORS is set in the Supabase project
      settings.
- [ ] `NODE_ENV=production` on the host, and no stack trace in any response
      body. Stack traces: the repo functions re-throw only `error.message`, and
      the server sends short responses with no stack trace.
      `NODE_ENV`.
- [x] `helmet` installed. which is one line for several real protections
- [x] Anything that costs money or accepts a password is rate limited. Added a simple 
      rate limiter to server.js
- [ ] **N/A** Passwords, if you have accounts, are hashed with bcrypt and never logged.
      There are no user accounts. Access is one shared app password
      read from an environment variable 
- [ ] **N/A** Every route that touches somebody's data has the ownership check **in the
      query**.  It is a single-user app with no login and no per-user
      rows 
- [x] `npm audit` run once, and the easy fixes taken. 

## Privacy

- [x] **No real classmates' names, numbers, emails or photos**, anywhere. The
      README, `AI-USAGE.md` and the licence contain only my own name.
- [x] Seed data is invented. It is generic drink presets such as Lager, IPA
      and Margarita
- [x] If real people tested your app, even three friends, their data is
      deleted before you submit. 
- [ ] **N/A** If your app collects anything about anyone, the app says what it
      collects. The app stores drink entries, presets, and the
      names typed into the Games "posse" list.
- [ ] **N/A** Any face in a screenshot is stock, generated, or yours. 
      The SipCount logo is my own work, made in Canva 

## Journal paragraph

The riskiest thing about SipCount is that the database is open by design. Row
Level Security is on for `entries`, `presets` and `posse`, but each policy
allows everything (`using (true)`), because the app has no per-user login, and
the password gate only controls who can open the app from my server. It does
not sit in front of Supabase, so anyone who has the publishable key could
still call the Supabase API directly  What I did about it: I turned
on RLS for every table, kept the service-role key out of the app, replaced a
hardcoded client-side password with a server-side check whose secrets are only
environment variables, and wrote the audit down. What I knowingly accepted: the
permissive policies for a single-user app, the lack of server-side validation
for drink data, and the old test password `admin` that still sits in an
old commit in git history.
