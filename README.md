# SchemeSetu (স্কিমসেতু / स्कीमसेतु)

> **Civic Welfare Discovery & Eligibility Engine for Indian Citizens**  
> *100% Client-Side • Zero Data Tracking • Indic Multilingual • Offline-Ready PWA*

SchemeSetu simplifies the discovery of government welfare schemes and benefits by evaluating individual circumstances through a fast, transparent, 60-second questionnaire.

---

## 🏛️ Project Directory Structure

```text
promptwar/
├── public/                     # Static assets & public security descriptors
│   ├── .well-known/security.txt# Vulnerability reporting metadata
│   ├── favicon.svg             # Vector glyph favicon
│   ├── manifest.webmanifest    # PWA install specification
│   └── robots.txt              # Search engine crawler policies
├── scripts/                    # Automated testing & verification scripts
│   ├── audit-security.js       # Automated XSS, protocol, and storage security suite
│   └── validate-data.js        # Dataset integrity & staleness auditor
├── src/
│   ├── components/             # Reusable UI & layout components
│   │   ├── CategoryGrid.jsx    # Category discovery cards
│   │   ├── DocumentChecklist.jsx # Master document checklist with checklist state
│   │   ├── Filters.jsx         # Category, level, and window filters
│   │   ├── Footer.jsx          # Civic navigation & disclaimer footer
│   │   ├── Header.jsx          # Tricolor banner, font scaler, dark mode, i18n
│   │   ├── ProgressBar.jsx     # Responsive quiz progress indicator
│   │   ├── QuestionCard.jsx    # Voice-enabled interactive quiz card
│   │   ├── SchemeCard.jsx      # Scheme cards with deadline & benefit badges
│   │   ├── SchemeDetail.jsx    # Complete scheme breakdown with verified dual links
│   │   └── SearchBar.jsx       # Voice-enabled fuzzy search input
│   ├── data/                   # Git-versioned verified datasets
│   │   ├── schemes/
│   │   │   ├── assam.json      # 12 Assam State Welfare Schemes
│   │   │   └── central.json    # 30 Central Government Welfare Schemes
│   │   ├── documents.json      # 21 Master document definitions & procurement guides
│   │   └── questions.json      # 8 Canonical citizen questionnaire items
│   ├── engine/                 # Deterministic client-side evaluation engine
│   │   ├── evaluate.js         # all/any/none rule evaluator & score generator
│   │   ├── explain.js          # Human-readable rule translator (EN/HI/AS)
│   │   ├── operators.js        # Pure comparison operators (eq, in, gte, between, etc.)
│   │   └── rank.js             # Scheme partitioner (Eligible, Maybe, Not Eligible)
│   ├── i18n/                   # Indic translation dictionaries
│   │   ├── as.json             # অসমীয়া (Assamese)
│   │   ├── en.json             # English
│   │   └── hi.json             # हिन्दी (Hindi)
│   ├── pages/                  # Route views
│   │   ├── About.jsx           # Mission, privacy controls & verification
│   │   ├── Browse.jsx          # Live search & filtered scheme catalogue
│   │   ├── DocumentChecklistPage.jsx # Consolidated master document view
│   │   ├── Home.jsx            # Hero, 3-step guide & featured schemes
│   │   ├── Quiz.jsx            # 8-question step-by-step citizen survey
│   │   ├── Results.jsx         # Ranked results with transparent explanations
│   │   ├── Saved.jsx           # Offline bookmarks & combined checklist export
│   │   └── SchemeDetailPage.jsx# Dedicated scheme route
│   ├── store/
│   │   └── profile.js          # Reactive state store via @preact/signals + storage
│   ├── utils/
│   │   ├── i18n.js             # Internationalization loader & interpolator
│   │   ├── pdf.js              # Print-ready sanitized document checklist generator
│   │   ├── search.js           # MiniSearch fuzzy client-side search index
│   │   ├── security.js         # Input sanitization, safe URL validator, and storage schema
│   │   └── speech.js           # Web Speech API recognition & speech synthesis
│   ├── App.jsx                 # Client router & high-contrast theme coordinator
│   ├── index.css               # Base Tailwind styles & high-contrast overrides
│   └── main.jsx                # Application root mount
├── index.html                  # HTML5 shell with CSP & security headers
├── package.json                # Project dependencies & automated scripts
├── SECURITY.md                 # Security policy, threat model, and disclosure protocol
├── tailwind.config.js          # Tailwind CSS design system config
└── vite.config.js              # Vite bundler configuration & security headers
```

---

## 🔒 Security & Privacy Guarantees

- **Zero-Knowledge Computation**: All scheme evaluation executes entirely within the browser. No profile answers, income levels, or document records leave the device.
- **Strict Content Security Policy (CSP)**: Locks script, style, and frame execution to prevent injection attacks and clickjacking.
- **XSS & Link Hardening**: Dynamic strings in printable checklists pass through `escapeHtml`; all outbound government portal links use `sanitizeUrl` and enforce `rel="noopener noreferrer"`.
- **LocalStorage Validation**: `validateStorageData` validates types, bounded ranges, and ID patterns for all locally persisted records.
- **Privacy Controls**: 1-click **"Clear My Saved Data"** control in the About page immediately flushes all client storage keys.

---

## 🚀 Development & Testing Commands

```bash
# Start development server with LAN host exposure
npm run dev

# Run automated data integrity + security audit test suite
npm run test

# Run security test suite exclusively
npm run audit:security

# Run dataset audit (staleness, missing translations, dead links)
npm run audit:data

# Production build
npm run build

# Preview production build locally
npm run preview
```
