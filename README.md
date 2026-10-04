# SipCount

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

## 1. Overview

SipCount is a small app for logging drinks, both alcoholic and
non-alcoholic. It lets a single user log a drink in a few taps and see
roughly how many calories it has. It also lets the user check how their
week is going, in total drinks and total calories. It is for people who
drink socially or moderately and want a faster way to track this than a
general calorie app.

**Live site:** 
WIP - Security features needed first resolved

## 2. Setup and installation

**What to install first**

- [Node.js](https://nodejs.org) version 18 or newer (this also installs
  npm).
- A code editor, for example [VS Code](https://code.visualstudio.com).
- A free [Supabase](https://supabase.com) account, for the database.

**How to get the code**

```
git clone https://github.com/gabluigi/SipCount-Project.git
cd SipCount-Project
```

The app lives inside the `client/` folder. The commands below are run from
the repository root unless noted otherwise.

**How to install dependencies**

Run this from the repository root (the folder containing `client/`):

```
npm --prefix client install
```

This installs React, `react-router-dom` (for the four screens),
`recharts` (for the chart on the Monitoring screen), and
`@supabase/supabase-js` (to connect to the database).

**Database setup**

SipCount now uses [Supabase](https://supabase.com) (a hosted PostgreSQL
database) for persistent storage, instead of only saving data in the
browser.

1. Create a free project at supabase.com.
2. Open the SQL Editor and run the schema script in `docs/supabase-schema.sql`.
   This creates the `entries` and `presets` tables, sets basic access
   rules, and fills in the built-in drink presets.
3. Go to **Settings > API Keys** and copy your **Project URL** and your
   **Publishable key** (`sb_publishable_...`). Use the new key system, not
   the older `anon` key, since Supabase is phasing that one out.

**Environment and configuration**

Copy `.env.example` to `.env` in the repository root and fill in your own values:

| Name | What it is |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project's base URL, for example `https://your-project-ref.supabase.co` (no extra path after `.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your project's publishable key from Settings > API Keys |

Vite is configured to load environment variables from the repository root.
`.env` is never committed. Only `.env.example`, with placeholder values,
is kept in the repository.

## 3. How to run it

From the repository root, start the app with:

```
npm --prefix client run dev
```

Then open the address shown in the terminal, usually:

```
http://localhost:5173
```

When it works, you should see the Home screen: a month calendar, with
today's date marked, and a panel below it showing that day's logged
drinks. If you already added presets through the SQL script, the Drinks
screen should also show them right away.

## 4. Features and usage - WIP

**Home (`/`)**
Shows a month calendar. Days with logged drinks are marked. Tapping a day
opens a panel below the calendar with that day's entries and a running
total. Each entry can be edited or deleted right there, inline. A
"+ Add drink" button opens the Add screen, already set to the day you
picked.

**Add (`/add`)**
A form to log a new drink. You can either search and pick a drink from
the presets, or switch to "Custom" and type your own. Fields include
size, ABV (optional), date, and an optional note. Calories fill in
automatically when you pick a preset, but you can always change the
number by hand. Saving writes the entry to Supabase and returns you to
Home, with the new entry visible.

**Monitoring (`/history`)**
Shows the current week's totals: number of drinks and total calories.
You can switch between a chart view and a plain numbers view for the
day-by-day breakdown.

**Drinks (`/drinks`)**
A list of preset drinks (beer, wine, cocktails/spirits, and other drinks
like juice or soda), with calorie and ABV estimates. You can search and
filter by category. You can also add your own custom presets, and edit
or delete the ones you added. Built-in presets cannot be edited or
deleted.

SipCount does not have its own backend server. The React app talks
directly to Supabase's built-in API, using the publishable key and the
access rules set up in the schema script.

## 5. Project structure - WIP

```
SipCount-Project/
├── client/                the SipCount React app (this is what runs)
│   ├── index.html
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           routes and providers
│       ├── tokens.css        design system tokens (color, type, spacing)
│       ├── lib/
│       │   └── supabaseClient.js   connects to Supabase
│       ├── context/          shared state: entries and presets (Supabase-backed)
│       ├── data/              category list for the Drinks filter
│       ├── utils/             date helper functions
│       ├── components/
│       │   ├── atoms/         e.g. Button
│       │   ├── molecules/     e.g. EntryRow, TogglePill, CalendarCell
│       │   └── organisms/     e.g. NavBar, CalendarGrid, SelectedDayPanel
│       └── pages/             Home, Add, Monitoring, Drinks
├── server/                 not used — see note below
└── docs/                    planning documents, weekly reports, and the
                             Supabase schema script (supabase-schema.sql)
```

**A note on the `server/` folder:** this project does not use a custom
backend. SipCount talks to Supabase's own built-in API directly from the
React app, so there is no separate Express server to write. The `server/`
folder is left empty on purpose.

## 6. Screenshots - WIP

Screenshots are not included yet. 


## Author

Louis Gabriel Malig 2215-6APSI CS403


**AI usage:** 

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

This project was built with Claude as an AI development assistant. Claude was used heavily for the frontend, including UI design, page structure, styling, animations, and feature implementation. I was mainly responsible for the backend and data layer, including designing the Supabase database schema, Row Level Security (RLS) policies, and the main database logic. I also reviewed, changed, and tested AI-generated code when needed.

For the full record of how AI was used, what was kept or changed, and where the AI made mistakes, see [AI-USAGE.md](AI-USAGE.md).


# Licence

MIT, see [LICENSE](LICENSE.txt). 
