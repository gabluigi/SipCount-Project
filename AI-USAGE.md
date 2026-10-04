# AI usage

This project was built with AI assistance. This file is the record of it.

## 1. How I used AI

### 2026-09-26 - First draft of the app

- **Tool:** Claude
- **What I asked for:** Asked Claude to help put together the first working version of SipCount, based on my app proposal document. I uploaded my design system and wireframes for context and asked to create most of the frontend of the app.
- **What it gave back:** A bare React project with pages for Home, Add, Monitoring, and Drinks, using local component state only (no database yet).
- **What I kept, what I changed, and why:** I kept the page structure and the atomic component folders (atoms, molecules, organisms), since it matched my proposal's sections. This was the starting point before any backend work.
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/3906462c4cde91e12647d23d5cb6d0bfa78a4758

### 2026-09-27 - Connecting to Supabase

- **Tool:** Claude
- **What I asked for:** Asked Claude to help connect the app to a real Supabase database, so entries and drink presets are saved instead of lost on refresh.
- **What it gave back:** A Supabase client setup and direct Supabase calls added inside the Context files (EntriesContext, PresetsContext).
- **What I kept, what I changed, and why:** I wrote the actual Supabase table schema and the CRUD logic myself. Claude helped me wire the calls into the existing Context state. I kept this structure for about a week before refactoring it (see next entry). Initially also, early instructions asked me to use legacy credentials, instead I used non-legacy since it is more safer and preferable.
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/78561be0a7e070e60d504d5037a938dc5f835530

### 2026-10-03 - Splitting data access from state

- **Tool:** Claude
- **What I asked for:** My Context files were mixing two jobs, first is calling Supabase and managing React state. I asked Claude to help me separate these.
- **What it gave back:** New repo files (entriesRepo.js, presetsRepo.js) that only talk to Supabase, with the Context files calling those instead. 
- **What I kept, what I changed, and why:** I kept this new structure, since it fixed a real problem before this, a failed Supabase call failed silently with nothing shown to the user. I then updated the loading/error branches to the respective pages because Claude's output lacked it.
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/7a1a68b802a3590279e4e0882d94f2a4abcbf15c

### 2026-10-03 - Fixing a CSS overflow bug and improving the Drinks page

- **Tool:** Claude
- **What I asked for:** The input fields on Home were overflowing outside their box. I also wanted the edit form on Drinks to scroll into view when clicked. So I asked Claude to resolve these frontend issues.
- **What it gave back:** A CSS Grid fix (`min-width: 0` on the grid items and inputs) and a `window.scrollTo()` call added to the edit button.
- **What I kept, what I changed, and why:** I kept both fixes as given. The CSS bug was a real, specific cause (grid items don't shrink below their content size by default), not a guess.
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/9ad18981022d17291fec465230409c30006b533a

### 2026-10-03 - Alcohol intake monitoring

- **Tool:** Claude
- **What I asked for:** Claude initially misinterpreted what I want in the monitoring page, so I asked Claude assistance on a way to monitor alcohol intake per month, not just calories.
- **What it gave back:** A new `alcohol.js` helper using the standard formula (volume × ABV% × ethanol density) using standard uinit drinks, and a toggle on the Monitoring page to switch between calories and grams of alcohol.
- **What I kept, what I changed, and why:** I kept the ui implementations however I opted and implemented a more simpler alcohol intake computation. I replaced standard unit drinks which varied by country (Claude used UK units) and used grams alcohol instead (simpler and direct). Felt like the initial formula was way to complex for an app this silly so I had that changed.
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/ddba30c11063a85848b2ee07c1f1c20b13ed9c57

### 2026-10-04 - Drinking games feature

- **Tool:** Claude
- **What I asked for:** Aid me in making a new page which is intended as a party trick (Games in navbar), asked Claude to make me a spin-the-wheel type randomizer and also a scenario picker (Never Have I Ever, Kings Cup, Truth or Drink, Most Likely To) to be hardcoded instead of uploading to Supabase.
- **What it gave back:** Three new components (PosseRow, SpinWheel, ScenarioPicker) plus 40 different scenarios (scenarios.js) 
- **What I kept, what I changed, and why:** I kept all structure except the spin-the-wheel, Claude returned a plain circle that reiterates over the posse table to look randomized, later asked Claude to simulate/animate a physically working spin the wheel. Felt that the initial spin-the-wheel felt bland/not fitting, so I asked Claude to redo this.
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/7ef24d2bd6bc444950d6c47094cb70a8fe20a936


## 2. Where the AI got it wrong

### Case 1 - Bugged Input Fields

- **What it gave me:** Upon the first draft of the app, the input fields for adding a drink went beyond its intended place.
- **What was wrong with it:** `.entry-edit-grid` uses `display: grid` with `repeat(4, 1fr)`, but grid items default to `min-width: auto` meaning a grid cell won't shrink smaller than its content's natural minimum size. A `type="number"` input has a browser-default intrinsic width that can be wider than its assigned `1fr` column, so it pushes past its column and overflows the card.
- **What I did instead:** I asked Claude to apply the necessary code changes to fix this visual bug, Claude returned with a CSS Grid fix (`min-width: 0` on the grid items and inputs)
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/9ad18981022d17291fec465230409c30006b533a

### Case 2 - The spin wheel text disappeared

- **What it gave me:** A CSS fix meant to center the player names on the spinning wheel more precisely, using `height: 0` combined with `overflow: hidden` on the label element.
- **What was wrong with it:** `overflow: hidden` on a zero-height box hides everything inside it, including the actual text. The fix for centering accidentally deleted the visible names from the wheel.
- **What I did instead:** I reported that the names were missing. Claude split the label into two parts: an outer wrapper (kept at `height: 0`, used only for position) and an inner span that holds the real text and is not zero-height, so nothing gets clipped.
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/623312b478682c6a83a7a69c4d38dc0d14437a99

### Case 3 - Bugged Mobile Refresh

- **What it gave me:** When in mobile, refreshing in home works fine, but in everywhere else when refreshing the app returns a black screen and `Not Found` text. 
- **What was wrong with it:**  The likely cause is that the app uses BrowserRouter, but the deployed host may not be configured to serve the app for direct requests to routes like `/history` or `/games`. May also be a frontend issue
- **What I did instead:** No code changes yet. The deployment needs an SPA fallback that serves `index.html` for app routes.
- **Commit:** n/a since not yet resolved

## 3. Who wrote what

### Written by me

- **File:** Supabase table schema (entries, presets tables, plus Row Level Security policies)
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/78561be0a7e070e60d504d5037a938dc5f835530
- **What it does and why it is built this way:** I designed the table columns myself based on my app proposal, and I set the RLS policies so the app's data is actually protected, not open to anyone with the public key.

- **File:** `Add.jsx`, `Monitoring.jsx`, and `Home.jsx`
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/3906462c4cde91e12647d23d5cb6d0bfa78a4758
- **What it does and why it is built this way:** These files handle the main user functions for recording and monitoring drinking activity. `Home.jsx` serves as the main page where users can view their information and access the app's main features. `Add.jsx` allows users to add new drink entries and save their information. `Monitoring.jsx` displays the user's recorded drinking activity so they can monitor their progress and consumption. I built these components to use the data from the application's contexts and repository files instead of directly connecting to Supabase. This keeps the frontend interface separate from the database logic and makes the code easier to maintain and update.

- **File:** `EntriesContext.jsx`, `PresetsContext.jsx`, and `PosseContext.jsx`
- **Commit:** added here https://github.com/gabluigi/SipCount-Project/commit/3906462c4cde91e12647d23d5cb6d0bfa78a4758
and https://github.com/gabluigi/SipCount-Project/commit/7ef24d2bd6bc444950d6c47094cb70a8fe20a936
- **What it does and why it is built this way:** These files manage the data after it is retrieved from Supabase and make it available to different parts of the application. They also handle loading states and errors, and update the screen after adding, editing, or deleting data. I separated the application state from the database functions so each part has a clear purpose. The repository files handle Supabase, while the context files handle the data used by the React components. This makes the backend and frontend easier to maintain and reduces repeated code.

- **File:** `posseRepo.js`, `PosseContext.jsx`, and `Games.jsx`
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/7ef24d2bd6bc444950d6c47094cb70a8fe20a936
- **What it does and why it is built this way:** These files handle the data used by the drinking games feature. posseRepo.js connects to the Supabase posse table and handles adding, updating, and deleting people. PosseContext.jsx manages this data inside the React app and keeps the screen updated after a database change. I built it this way so the drinking game feature can save its data instead of only keeping it temporarily in the browser. It also keeps the database code separate from the game interface.



### The AI-written part I understand best

- **File:** `entriesRepo.js` and `presetsRepo.js`
- **Commit:** https://github.com/gabluigi/SipCount-Project/commit/7a1a68b802a3590279e4e0882d94f2a4abcbf15c
- **What it does and why we kept it:** These files handle the database operations for drink entries and drink presets using Supabase. They allow the app to add, get, update, and delete data from the database. I understand these files best because they contain the main database functions used by the app. Kept this code because is essential and separating the database operations from the UI makes the project more organized and easier to maintain. It also allows other parts of the app to reuse the same functions instead of writing the same Supabase queries again.
