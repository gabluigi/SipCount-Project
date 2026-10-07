# SipCount

[![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)](AI-USAGE.md)

## Overview

SipCount is a small app for logging drinks, both alcoholic and
non-alcoholic. It lets a single user log a drink in a few taps and see
roughly how many calories it has. It also lets the user check how their
week is going, in total drinks and total calories. It is for people who
drink socially or moderately and want a faster way to track this than a
general calorie app.

**Live site:**
WIP 

![SipCount Home Page](docs/screenshots/home.png)

## Setup and installation

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

This installs React, `react-router-dom` (for the five screens),
`recharts` (for the charts on the Monitoring screen), and
`@supabase/supabase-js` (to connect to the database).

**Database setup**

SipCount now uses [Supabase](https://supabase.com) (a hosted PostgreSQL
database) for persistent storage, instead of only saving data in the
browser.

1. Create a free project at supabase.com.
2. Open the SQL Editor and run the schema script in
   `client/supabase-schema.sql`. This creates the `entries`, `presets`, and
   `posse` tables, enables Row Level Security on each, and fills in the
   built-in drink presets.
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

## How to run it

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

## Features and usage

**Home (`/`)**
Shows a month calendar. Days with logged drinks are marked. Tapping a day
opens a panel below the calendar with that day's entries, each entry's
note, and a running total. Each entry (including its note) can be edited
or deleted right there, inline. A "+ Add drink" button opens the Add
screen, already set to the day you picked.

**Add (`/add`)**
A form to log a new drink. You can either search and pick a drink from
the presets, or switch to "Custom" and type your own. Fields include
size, volume in millilitres, ABV (optional), date, and an optional note.
Calories fill in automatically when you pick a preset, but you can always
change the number by hand. Saving writes the entry to Supabase and
returns you to Home, with the new entry visible.

**Monitoring (`/history`)**
Shows the current week's totals (drinks and calories), with a chart or
plain-numbers toggle for the day-by-day breakdown. Below that, a 12-tile
month picker shows a week-by-week breakdown for whichever month you
select, with a toggle between total calories and grams of alcohol
(calculated from volume × ABV, not just raw ABV percentage).

**Drinks (`/drinks`)**
A list of preset drinks (beer, wine, cocktails/spirits, and other drinks
like juice or soda), with calorie and ABV estimates. You can search and
filter by category. You can also add your own custom presets, and edit
or delete the ones you added. Built-in presets cannot be edited or
deleted.

**Games (`/games`)**
A lighthearted extra page, not part of the core tracking: add people to a
"posse" list with an individual drink counter, spin a wheel to randomly
pick someone from that list, and pull a random prompt from four
categories (Never Have I Ever, Kings Cup, Truth or Drink, Most Likely
To). The posse list is saved to Supabase; the prompts themselves are
hardcoded in the app, not stored in the database.

SipCount does not have its own backend server. The React app talks
directly to Supabase's built-in API, using the publishable key and the
Row Level Security policies set on each table.

## Project structure

```
SipCount-Project/
├── README.md
├── SECURITY-CHECKLIST.md   audit of secrets, access control, and data handling
├── AI-USAGE.md             record of how AI assistance was used
├── client/                 the SipCount React app (this is what runs)
│   ├── index.html
│   ├── package.json
│   ├── .env.example
│   ├── supabase-schema.sql   run once in the Supabase SQL Editor to set up
│   │                         the entries, presets, and posse tables + RLS
│   └── src/
│       ├── main.jsx
│       ├── App.jsx           routes, providers, and the WelcomeGate wrapper
│       ├── tokens.css        design system tokens (color, type, spacing)
│       ├── lib/
│       │   ├── supabaseClient.js   connects to Supabase
│       │   ├── entriesRepo.js      Supabase calls for drink entries
│       │   ├── presetsRepo.js      Supabase calls for drink presets
│       │   └── posseRepo.js        Supabase calls for the Games posse list
│       ├── context/           shared React state: entries, presets, posse
│       │                      (each calls its matching repo file above)
│       ├── data/               category list for Drinks, and the hardcoded
│       │                      scenario prompts for Games
│       ├── utils/              date helpers and the alcohol-grams formula
│       ├── components/
│       │   ├── atoms/          e.g. Button, WelcomeGate
│       │   ├── molecules/      e.g. EntryRow, TogglePill, PosseRow
│       │   └── organisms/      e.g. NavBar, CalendarGrid, SpinWheel,
│       │                      ScenarioPicker
│       └── pages/              Home, Add, Monitoring, Drinks, Games
├── server/                 not used — see note below
└── docs/                    planning documents and weekly reports. A
                             Supabase schema script is planned here
                             (`supabase-schema.sql`) but not committed yet —
                             see SECURITY-CHECKLIST.md, item 15.
```

**A note on the `server/` folder:** this project does not use a custom
backend. SipCount talks to Supabase's own built-in API directly from the
React app, so there is no separate Express server to write. The `server/`
folder is left empty on purpose.

## Screenshots 

### Home 

![SipCount Home Page](docs/screenshots/home.png)


### Add

![SipCount Add Page](docs/screenshots/add.png)


### Monitoring

![SipCount Monitoring Page](docs/screenshots/monitor.png)


### Drinks

![SipCount Drinks Page](docs/screenshots/drinks.png)


### Games

![SipCount Games Page](docs/screenshots/games.png)


## Architecture  - WIP 
Three or four sentences, or a small diagram. Which piece talks to which, and where each one is hosted.


## What I would do next - WIP
Three honest bullets. This paragraph is worth more than it looks.


## Author

Louis Gabriel Malig 2215-6APSI CS403


## AI use

![Claude](https://img.shields.io/badge/claude-%23D97757.svg?style=for-the-badge&logo=claude&logoColor=white)

This project was built with Claude as an AI development assistant. Claude was used heavily for the frontend, including UI design, page structure, styling, animations, and feature implementation. I was mainly responsible for the backend and data layer, including designing the Supabase database schema, Row Level Security (RLS) policies, and the main database logic. I also reviewed, changed, and tested AI-generated code when needed.

For the full record of how AI was used, what was kept or changed, and where the AI made mistakes, see [AI-USAGE.md](AI-USAGE.md).


## Licence

MIT, see [LICENSE](LICENSE.txt). 
