# SchemeSetu: Government Scheme Discovery Platform
*(working name; swap freely)*

**Domain:** Public Services  
**Problem:** Citizens are unaware of government welfare schemes, and eligibility rules are confusing and scattered across portals.  
**Goal:** A lightweight, mobile-first web app where a person answers a few simple questions and instantly sees the schemes they likely qualify for, the documents needed, and how to apply — with **no login**, **no personal data leaving the device**, and **no backend required** for the core flow.

---

## 1. Product Vision

| Principle | What it means in practice |
|---|---|
| **Lightweight** | ≤ 100 KB JS gzipped; loads < 2 s on 3G; works on low-end Android phones |
| **Zero-friction** | No login/signup. Nothing personal leaves the device. No tracking |
| **Plain language** | Class 8 reading level. English, Hindi, Assamese at launch (extensible) |
| **Trustworthy** | Every scheme links to its official source and shows a "last verified" date and verifier |
| **Offline-capable** | Installable PWA; scheme data and eligibility engine work offline |
| **No-backend core** | Scheme data lives in Git as JSON; updates via pull requests; CI validates and deploys |

### Target users
- Rural and semi-urban citizens with low digital literacy (voice + simple UI)
- Students, farmers, women, senior citizens, persons with disabilities, unemployed youth, BPL families
- Volunteers, CSC operators, NGO workers helping others apply

---

## 2. Core Features (MVP)

### 2.1 Smart Eligibility Finder (hero feature)
Step-by-step questionnaire, one question per screen, progress bar:
- State / UT, rural or urban
- Age, gender
- Annual family income range
- Category (General / OBC / SC / ST / EWS)
- Occupation (farmer, student, self-employed, salaried, unemployed, etc.)
- Special status (disability, widow, minority, BPL card holder, etc.)
- Education level / currently studying

**Output:** ranked schemes split into:
- ✅ **Eligible** — all criteria match
- 🟡 **Maybe eligible** — some info missing or borderline, with "what to confirm"
- ❌ **Not eligible** — hidden by default, expandable, with the *reason*

Every answer is skippable ("Prefer not to say").

### 2.2 Search and Browse
- Full-text, typo-tolerant client-side search (MiniSearch / Fuse.js)
- Filters: level (Central / State), state, category (education, health, agriculture, housing, employment, women & child, pension, skill development), beneficiary type, benefit type (cash, subsidy, loan, insurance, in-kind)
- Sort: relevance, newest, highest benefit

### 2.3 Scheme Detail Page
- Plain-language one-paragraph summary
- Benefits (amount, type, frequency)
- Eligibility checklist (✓/✗ against the user's answers)
- Documents required (tickable checklist)
- Step-by-step application process, online/offline mode indicator
- Official links, helpline numbers, nearest CSC/office guidance
- Deadlines (if any), "last verified on" date, verifier name
- Share (WhatsApp / copy link) and print-friendly view
- "Report incorrect info" button

### 2.4 Document Checklist Generator
Combines required documents across matched schemes into one deduplicated list ("Get these 6 documents and apply to 9 schemes"). Printable / savable as PDF.

### 2.5 Multilingual and Accessibility
- English, Hindi, Assamese at launch; i18n via JSON dictionaries, lazy-loaded language packs
- Voice input and read-aloud via Web Speech API **with text-input fallback** (voice is inconsistent on low-end devices)
- High-contrast mode, large-text toggle, keyboard navigable, WCAG 2.1 AA target
- Icons plus short text on category chips (supports low literacy)

### 2.6 Saved Profile and Bookmarks (local only)
- Profile and saved schemes in `localStorage` / IndexedDB
- "Export my results" as link, PDF, or QR code so a CSC operator or family member can open the same results

### 2.7 Feedback and Reporting
- "Report incorrect info" → pre-filled GitHub issue or serverless form
- Thumbs up/down on result usefulness

---

## 3. Nice-to-Have (Post-MVP)

| Feature | Value |
|---|---|
| Family mode (spouse, parents, children in one go) | Multiplies discovery |
| "What if" simulator (income threshold testing) | Helps understand thresholds |
| Deadline reminders (web push / WhatsApp share) | Prevents missed windows |
| Chatbot / natural-language query | Lower barrier |
| Nearby CSC / office finder (OpenStreetMap, no API cost) | Closes the "how to apply" gap |
| Admin CMS to add and edit schemes | Only if update volume outgrows Git workflow |
| Anonymous analytics dashboard | Insight for policy and NGOs |
| Application status tracker links | Continuity |
| WhatsApp / SMS bot front-end reusing the engine | Reaches non-smartphone users |

---

## 4. Architecture (Lightweight by Design)

**Principle: static-first, no backend needed for the core flow. Scheme data is versioned in Git.**

```
Browser (PWA)
├─ UI (Preact / Svelte)  ←→  Rules Engine (JS)
├─ i18n JSON              schemes.json (+search index)
├─ localStorage / IndexedDB (profile, saves)
└─ Service Worker (offline cache)
     │
     └─ static hosting (CDN): GitHub Pages / Netlify / Cloudflare Pages
            │
            └─ (optional, later) Serverless function + small DB:
               feedback, admin CMS, analytics
```

### Why no backend for MVP
- The full scheme dataset is small (a few hundred schemes ≈ 1–2 MB JSON, compresses to a few hundred KB).
- Eligibility matching is pure JavaScript → no server cost, no latency, no privacy risk, works offline.
- Hosting is free (GitHub Pages / Netlify / Cloudflare Pages).
- Data updates happen through Git pull requests, not a database UI.

---

## Repository Rules and Constraints

The following hard constraints apply to the GitHub repository submission:

| Rule | Requirement |
|---|---|
| **Submission attempts** | Maximum of 2 attempts. Prepare and verify locally before pushing. |
| **Repository size** | Must be less than 10 MB. Do not commit `node_modules/`, `dist/`, build artifacts, large images, or binaries. |
| **Repository visibility** | Must be **Public**. |
| **Branches** | Only **one branch** is allowed (no multiple branches). Use a single branch (e.g., `main`) and do not create `develop`, `feature/`, or any other branches. |

**Before pushing:**
1. Add a `.gitignore` excluding `node_modules/`, `dist/`, `.env`, logs, and OS files.
2. Verify the local folder size is well under 10 MB.
3. Initialize with a single branch only (`git init` → `git add .` → `git commit` → one `git push`).
4. Create the GitHub repo as **Public** with no extra branches, README, or template files.

### Recommended Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Preact + Vite (or SvelteKit static) | ~4 KB runtime, fast builds |
| Styling | Tailwind CSS (purged) | Tiny output, design system |
| Search | MiniSearch / Fuse.js | Client-side fuzzy search |
| Rules engine | Custom JSON-rule evaluator | Transparent, testable, tiny |
| i18n | Custom JSON loader (language packs lazy-loaded) | Small, dependency-free |
| State | Preact signals / Zustand | Minimal |
| PWA | vite-plugin-pwa (Workbox) | Offline and installable |
| Voice | Web Speech API + fallback | Free, in-browser |
| PDF export | jsPDF (lazy-loaded) or browser print CSS | Loaded only when needed |
| Hosting | GitHub Pages / Netlify / Cloudflare Pages | Free, CDN |
| Backend (optional, later) | Supabase / Firebase free tier | Only if admin CMS becomes necessary |
| Testing | Vitest + Playwright | Rules engine unit tests, e2e flows |

---

## 5. Data Model and Rules Engine

### 5.1 Scheme schema (`schemes.json`)

```json
{
  "id": "pm-kisan",
  "name": { "en": "PM-KISAN", "hi": "पीएम-किसान", "as": "পিএম-কিষাণ" },
  "level": "central",
  "state": "ALL",
  "category": ["agriculture", "income-support"],
  "summary": { "en": "₹6,000 per year income support for farmer families." },
  "benefit": { "type": "cash", "amount": "₹6,000/year" },
  "eligibility": {
    "all": [
      { "field": "occupation", "op": "in", "value": ["farmer"] },
      { "field": "landOwner", "op": "eq", "value": true }
    ],
    "any": [],
    "none": [
      { "field": "incomeTaxPayer", "op": "eq", "value": true }
    ]
  },
  "documents": ["aadhaar", "land-record", "bank-passbook"],
  "howToApply": [
    { "step": 1, "text": { "en": "Visit pmkisan.gov.in or nearest CSC" } }
  ],
  "links": { "official": "https://pmkisan.gov.in", "helpline": "155261" },
  "applyOnline": true,
  "deadline": null,
  "lastVerified": "2026-11-01",
  "verifiedBy": "scheme-setu-maintainer",
  "status": "active",
  "source": "https://..."
}
```

### 5.2 Rule evaluation
- Operators: `eq, neq, in, nin, gte, lte, between, exists`
- Combinators: `all` (AND), `any` (OR), `none` (NOT)
- Each rule → `true`, `false`, or `unknown` (question skipped)
  - Any `false` in `all` → **Not eligible**
  - No `false` but ≥1 `unknown` → **Maybe eligible**, unknown fields listed as "To confirm"
  - All `true` → **Eligible**
- Returns a **reason trace** per rule so UI explains why ("Your income ₹4.5L exceeds the ₹3L limit")
- Ranking score = match strength × benefit value × deadline urgency

### 5.3 Data sourcing and Git-based update workflow

**Primary sources:** official portals (myScheme, data.gov.in, india.gov.in, state portals)  
**Start:** ~60–100 high-impact schemes (~40 central + ~30 per pilot state; suggest **Assam** as pilot)

**Every entry needs:** `source`, `lastVerified`, `verifiedBy`, and `status` (`active` / `expired` / `archived`).

#### Contributor workflow (no admin CMS needed)

1. **Fork the data repo** (or clone if they have write access).
2. **Edit `schemes.json`** (or add a state file like `assam.json`) to add, correct, or retire a scheme.
3. **Open a pull request** with a description of what changed and which official source confirms it.
4. **Maintainers review** the PR:
   - Check that `lastVerified` and `verifiedBy` are filled in.
   - Confirm the official link is real and the scheme still exists.
   - Run the CI validation (see below).
5. **Merge** → GitHub Actions auto-deploys to hosting; users get the new data on next load.

#### CI pipeline (`.github/workflows/`)

On every push and PR:
- **JSON Schema validation** – every scheme object must match the schema.
- **Duplicate-ID check** – no two schemes share the same `id`.
- **Broken-link check** – verify `links.official` returns 200 (or flag for manual review).
- **Staleness flag** – if `lastVerified` is older than 6 months, fail the build or add a "needs review" label.
- **Build & deploy** – if all checks pass, build the site and deploy to GitHub Pages / Netlify / Cloudflare Pages.

#### How users get updates
- **PWA + Service Worker:** caches scheme data offline; checks for a new version on load.
- **Data versioning:** bump a `dataVersion` in `schemes.json` when content changes so browsers re-fetch.
- **Staleness UI:** schemes not verified in 6 months show a "⚠️ Data may be outdated" badge.
- **"Report incorrect info" button:** citizens flag outdated schemes → opens a pre-filled GitHub issue → maintainer reviews via the same PR workflow.

> **Legal and trust note:** show a clear disclaimer that results are *indicative* and the official portal gives the final say. Do not scrape in violation of terms of use; prefer open data and manual curation.

---

## 6. UX and Screen Flow

```
Landing ──► "Find my schemes" ──► Questionnaire (6–9 quick steps)
   │                                      │
   ├─► Search / Browse                    ▼
   │                               Results (Eligible / Maybe / Not)
   │                                      │
   └─► Language switch              Scheme Detail ──► Apply (official link)
                                           │
                                           ▼
                                    Document Checklist (merged, printable)
```

**Screens (MVP):** Home · Questionnaire · Results · Scheme Detail · Browse/Search · My Saved · Document Checklist · About/Disclaimer · Language & Accessibility settings

**Design notes:**
- Mobile-first, single-column, thumb-reachable buttons, big tap targets (≥ 48 px)
- Icons plus short text on category chips (supports low literacy)
- Instant local render (no skeleton loaders needed)
- Skippable questions so users never feel forced
- Voice input with text-input fallback for unreliable Web Speech API on low-end devices

---

## 7. Performance and Lightness Budget

| Metric | Target |
|---|---|
| Initial JS (gzipped) | ≤ 100 KB |
| Total first load (incl. data index) | ≤ 300 KB |
| LCP on 3G | < 2.5 s |
| Lighthouse (Perf / A11y / PWA / SEO) | ≥ 95 / 95 / 100 / 95 |
| Language packs | Lazy-loaded, ~10 KB each |
| Scheme data | Split by state/category; lazy-fetch detail; small search index in memory |
| Images | None or inline SVG only; system fonts, or one subset font for Indic scripts |

**Tactics:** code-splitting per route, Brotli compression, service-worker caching, avoid heavy UI libraries, lazy-load jsPDF and voice modules.

---

## 8. Privacy and Security
- **No PII leaves the device** in the core flow; profile stays in local storage
- No login, no functional cookies beyond what's needed; no third-party trackers
- Optional anonymous analytics (self-hosted Plausible/Umami) with clear opt-in
- CSP headers, SRI for any external scripts, dependency audit in CI
- Never ask for Aadhaar numbers or sensitive identifiers; only categorical answers

---

## 9. Development Roadmap

| Phase | Duration | Deliverables |
|---|---|---|
| **0. Research and data** | Week 1 | Finalise scheme list, define schema, curate 40–60 schemes, write rule definitions, list maintainers, set up Git repo + CI (public repo, single branch, < 10 MB) |
| **1. Core engine** | Week 2 | Rules evaluator + unit tests, questionnaire logic, ranking, reason traces |
| **2. UI MVP** | Weeks 3–4 | Home, questionnaire, results, detail, search/browse, responsive layout |
| **3. Polish** | Week 5 | i18n (EN/HI/AS), voice + read-aloud with fallback, accessibility pass, document checklist + PDF |
| **4. PWA and performance** | Week 6 | Offline mode, Lighthouse tuning, bundle budget enforcement |
| **5. Pilot and feedback** | Week 7 | Test with 10–20 real users (family, village, CSC); fix confusing questions and data errors |
| **6. Launch** | Week 8 | Deploy, publish data repo for contributions, announce |

**Hackathon compressed version (24–48 hrs):** Phase 0 with 25 schemes → Phase 1 engine → minimal questionnaire and results → scheme detail → deploy. Add multilingual toggle and document checklist as stretch goals.

---

## 10. Suggested Project Structure

```
schemesetu/
├── public/
│   ├── manifest.webmanifest
│   └── icons/
├── src/
│   ├── components/        # Questionnaire, SchemeCard, Filters, Checklist…
│   ├── pages/             # Home, Results, SchemeDetail, Browse, Saved
│   ├── engine/            # evaluate.js, rank.js, operators.js, explain.js
│   ├── data/
│   │   ├── schemes/       # central.json, assam.json, …
│   │   ├── documents.json # doc id → label, where to get it
│   │   └── schema.json    # JSON Schema for validation
│   ├── i18n/              # en.json, hi.json, as.json
│   ├── store/             # profile and bookmarks
│   └── utils/             # search, pdf, speech
├── tests/                 # unit (engine) + e2e (flows)
├── scripts/               # validate-data.js, check-links.js, build-index.js
├── .github/workflows/     # CI: lint, test, validate data, deploy
├── CONTRIBUTING.md        # how to submit scheme updates via PR
└── README.md
```

---

## 11. Testing and Quality
- **Engine unit tests:** persona → expected scheme list table (e.g., "28-year-old SC woman farmer, Assam, income ₹1.2L")
- **Data CI:** JSON Schema validation, duplicate-ID check, broken-link check, staleness flag (`lastVerified` > 6 months)
- **E2E (Playwright):** full questionnaire → results → detail → checklist flow, mobile viewport
- **Usability tests:** 5 non-technical users; observe where they hesitate
- **Accessibility:** axe-core in CI + manual screen-reader pass

---

## 12. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Outdated or incorrect scheme data | `lastVerified` + `verifiedBy` + `status`, 6-month re-verification cadence, community "report" button, CI staleness alerts, official source links |
| Eligibility rules too complex to encode | Start with clear-cut criteria; mark the rest "Maybe eligible: confirm at office" |
| Low digital literacy | Voice support, local languages, icon-driven UI, CSC-operator mode, text-input fallback |
| Voice API unreliable on low-end phones | Text-input fallback always available; consider SMS/USSD bot later |
| Data maintenance burden | Open Git repo, contributor guide, named maintainers, PR review workflow |
| User trust | Disclaimer, official-only links, no data collection, transparent reasoning |
| Scope creep | Hold to MVP; nice-to-haves wait until pilot validates the core |

---

## 13. Success Metrics
- % of users who complete the questionnaire
- Average number of eligible schemes found per user
- Click-through to official application pages
- Share / export actions (proxy for word-of-mouth)
- Data accuracy: reported-error rate < 2% of views
- Lighthouse and bundle-size budgets met on every release
- PR merge time for data corrections (target: < 7 days)

---

## 14. One-Line Pitch
> *"Answer 8 simple questions, and discover every government scheme you may qualify for, with the documents you need and exactly how to apply. Fast, free, private, in your language."*

---

## 15. Immediate Next Steps
1. Pick pilot scope (Central + Assam) and list top 40–60 schemes.
2. Finalise scheme JSON schema and questionnaire fields.
3. Scaffold Vite + Preact project; build rules engine with tests first.
4. Set up GitHub repo + CI workflow (schema validation, link check, deploy) — public repo, single branch only, < 10 MB, max 2 submission attempts.
5. Build questionnaire → results flow end to end with 10 schemes, then scale data.
6. Add i18n, PWA setup, and deploy a first public preview.
7. Name at least two data maintainers and write `CONTRIBUTING.md` for scheme updates.