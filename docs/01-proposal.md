# Proposal

## What SipCount is

SipCount is a small app for logging drinks, both alcoholic and
non-alcoholic. A single user can log a drink in a few taps, see roughly
how many calories it has, and check how their week and month are going.

## Who it is for

One person: me, as someone who drinks socially or moderately and wants a
faster way to track it than a general calorie app. There is no
multi-user or social layer. The one exception is the Games page (see
below), which keeps a list of names for a party game.

## Core features (what is built today)

- **Home.** Month calendar. Days with logged drinks are marked. Tapping a
  day shows that day's entries with a running total. Entries, including
  their notes, can be edited or deleted inline.
- **Add.** Log a drink from a preset or as a custom drink. Fields: name,
  size, volume (ml), ABV (optional), calories, date, and a note.
- **Monitoring.** Current week with a chart / numbers toggle. A 12-tile
  month picker shows a week-by-week breakdown, with a toggle between
  calories and grams of alcohol.
- **Drinks.** Built-in presets plus the user's own custom presets
  (add, edit, delete). Built-in presets cannot be edited or deleted.
- **Games.** A "posse" list with a drink counter per person, a spin-the-wheel
  picker, and a random prompt from four categories (40 prompts, hardcoded).
- **Password gate.** A password screen in front of the whole app, checked on
  the server.
- **Persistence.** All entries, presets and posse names are stored in
  Supabase (PostgreSQL).

## Stretch goals and cut features

Nothing is deleted from this list; each item says what happened to it.

| Item | Status | When and why |
| --- | --- | --- |
| Data only in `localStorage` | Replaced | 2026-09-27. Data was not shared, not backed up, and disappeared if browser storage was cleared. Moved to Supabase. |
| Alcohol shown as "standard drinks" | Replaced | 2026-10-03. The unit differs by country and looked confusing next to the drink count. Replaced with grams of alcohol (volume x ABV x 0.789). |
| Year-at-a-glance line chart | Not built | 2026-10-03. Considered and decided against: the weekly and monthly bar charts already answer the same questions. |
| Client-side password screen (`WelcomeGate`) | Removed | 2026-10-05. The password was hardcoded in source and only hid the interface. Replaced on 2026-10-07 by a server-checked password. |
| Cloudflare Zero Trust in front of the app | Not used | 2026-10-07. Needs a domain. Used a server-side app password instead. |
| Delete confirmation for entries and presets | Not built | Listed as "left" in the weekly reports of 2026-09-22 and 2026-09-27. Still not done. |
| Clearer form validation messages | Not built | Forms rely on the browser's `required` attribute only. |
| Per-user accounts / login | Not built | Single-user app. Access is one shared password. |
| Server-side validation of drink data | Not built | Validation only happens in the React forms.  |
| Games page | Added | 2026-10-04. Not in the original four-screen plan. Added after suggestions. |
| Monthly view and alcohol grams in Monitoring | Added | 2026-10-03. Not in the original weekly-only Monitoring screen. |

## Where each piece is hosted

| Piece | Host | Catch of the free tier |
| --- | --- | --- |
| Client (React, built with Vite) | Render Web Service, served by the Express server in `server/` | Render free web services spin down after about 15 minutes without traffic, so the first request after that is slow (a cold start). |
| Password gate (Express, `server/server.js`) | Same Render Web Service | Same as above. It is the same process. |
| Database (PostgreSQL) | Supabase, free plan | Supabase free projects are paused after about a week of inactivity and must be restored by hand. |

Live URL: https://sipcount.onrender.com/login


## Demo mode

SipCount has no demo mode. Nothing in the code switches on sample data or
a time limit, so there is no date for it to go off.

## Risks

| Risk | What I thought at the start | Where it is now |
| --- | --- | --- |
| Data lost when the browser is cleared | Real risk with `localStorage` | Gone. Data is in Supabase. |
| Cold starts | Not expected | Real. First load after idle is slow on Render's free tier. |
| Supabase project pausing | Not expected | Possible if the app is unused for a week. |
| Old hardcoded password in git history | Did not exist yet | Still in history (commit `a767cf1`); the old value was `admin`. History has not been rewritten. This only matters if the real `SITE_PASSWORD` on Render is also `admin`, but it's not |
| No rate limit on the login form | Did not exist yet | Open. Someone could try many passwords. |
