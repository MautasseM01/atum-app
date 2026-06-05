# ATUM — Project Status

> **One file to rule them all.** Replaces MASTER_PLAN.md, TASK_BOARD.md, NOTEBOOKLM_SETUP.md, and ATUM_PRD_v1.0.* (now in `_archive/`).

---

## Live URLs

| What | URL |
|------|-----|
| **Production (custom domain)** | https://atum-app-dna.vercel.app |
| Production (auto) | https://atum-app.vercel.app |
| **Vercel project** | https://vercel.com/mautassem01s-projects/atum-app |
| **GitHub repo** | https://github.com/MautasseM01/atum-app |
| **Domain alias target** | `atum-1jvrrucc4-mautassem01s-projects.vercel.app` (current prod deployment) |

---

## Folder Structure

```
C:\Projects\_ACTIVE\atum-app\
│
├── atum-app/                  ◄── THE LIVE NEXT.JS APP (do not touch structure)
│   ├── app/                   Next.js App Router (api/, [locale]/...)
│   ├── components/            React components
│   ├── lib/                   Server-only data loaders + client-safe constants
│   ├── messages/              i18n JSON (ar / en / fr)
│   ├── data/                  Runtime data (etymologies, ibdalRules, letters, rootPatterns, sources/)
│   ├── i18n/                  next-intl routing
│   ├── public/                Static assets
│   ├── public/, scripts/      Build/utility scripts
│   ├── AGENTS.md              Agent rules (Next.js 16 conventions)
│   ├── CLAUDE.md              Project conventions
│   ├── README.md
│   ├── components.json        shadcn config
│   ├── eslint.config.mjs
│   ├── middleware.ts          Next.js middleware (locale routing)
│   ├── next.config.ts
│   ├── package.json           Next.js 16.2.6, React 19, Tailwind v4, next-intl
│   ├── postcss.config.mjs
│   └── tsconfig.json
│
├── marketing/                 ◄── All marketing materials (consolidated)
│   ├── strategy/              Prompts + strategy PDFs
│   │   ├── Prompts-for-marketing.md
│   │   ├── digital_product_language_prompts.pdf
│   │   └── digital_product_strategy_guide.pdf
│   ├── content/               Generated content (caption / carousel / reel)
│   │   ├── E001_*.md
│   │   ├── EB_077_*.md
│   │   ├── EB_078_*.md
│   │   ├── EB_081_*.md
│   │   ├── proto_MA_*.md
│   │   └── templates/         article / caption / carousel / reel templates
│   └── product/               (empty — for MVP strategy outputs)
│
├── research/                  ◄── Read-only references (no files copied)
│   └── README.md              Documents where the 15 CSVs + book live in Obsidian
│
├── Design/                    ◄── Design reference (uploads, mockups)
│
├── _archive/                  ◄── Duplicates + superseded planning
│   ├── app_duplicate/         Old top-level app/ (2 stale API routes)
│   ├── data_duplicate/        Old top-level data/ (7 files, all in atum-app/data/)
│   ├── scripts_old/           Old top-level scripts/ (export-supabase.js, sync-data.py)
│   ├── MASTER_PLAN.md         Replaced by STATUS.md
│   ├── TASK_BOARD.md          Replaced by STATUS.md
│   ├── NOTEBOOKLM_SETUP.md    Replaced by STATUS.md
│   ├── ATUM_PRD_v1.0.md       Replaced by STATUS.md
│   ├── ATUM_PRD_v1.0.docx     Replaced by STATUS.md
│   ├── PRD_old.pdf            Older PRD (4.4 MB)
│   └── atum-app.pdf           App's PDF export snapshot
│
├── .gitignore                 Top-level ignores (atum-app/node_modules, .next, etc.)
└── SOUL.MD                    Agent identity charter (behavior rules)
```

---

## What Works (Deployed & Live)

### Pages (all 3 locales: ar / en / fr)
- **Home** `/` — 3-father roots explainer with Cinzel Decorative + Amiri RTL
- **Explorer** `/explorer` — search 5,168 words server-side (27 KB initial), filters by root + language, infinite scroll, random word button
- **Etymology** `/etymology/[word]` — 7-section deep word page (hero · simplified explanation · phonetic transformation · across languages · physics · daily life · sources · related words) with breadcrumb
- **Concepts** `/concepts` — 13 concepts in 4 groups (Foundations, Theory, Evidence, Deep Sources) with topic pills, root accents, related-words badges
- **Concepts detail** `/concepts/[id]` — client-rendered, falls back to notFound() for invalid IDs
- **Learn** `/learn` — scroll-driven primer (4 steps) with progress dots, "Ready to explore?" CTA
- **Patterns** `/patterns` — Arabic root pattern training (learn / practice / explore modes)
- **Letters** `/letters` — 28-letter Abjad index with Phoenician + Proto-Sinaitic symbols, DNA profile
- **Research** `/research` — CNN accuracy, p-value, correlation, dataset sources, root network

### API Routes
- `GET /api/etymology/search?q=&root=&lang=&page=&limit=` — paginated server-side search
- `GET /api/etymology/random?root=&lang=` — random word with FEATURED priority list
- `GET /api/word-insight?word=&locale=&root=` — markdown insight (file or auto-generated fallback)
- `GET /api/concepts` — full concepts list
- `GET /api/concepts/related?root=&word=` — top 3 scored concepts
- `GET /api/concept-content?id=&locale=` — concept markdown body
- `GET /api/concept-index` — INDEX.json wrapper
- `GET /api/dna/stats` — DNA statistics
- `GET /api/stats` — overall counts

### i18n
- 3 locales: **ar** (RTL, Amiri font), **en**, **fr**
- `WordPage`, `Concepts`, `Learn` namespaces complete
- All section headers parameterized with `{root}` and `{word}`

### Data
- 5,168 words analyzed (ATUM=1707, BULL=1617, TOR=1844)
- 20 concepts in INDEX.json (13 wired into UI groups, 7 added later)
- 37 word-insights × 3 locales = 111 markdown files
- 75 ibdal rules (Al-Qubaysi)
- 28 letters with Phoenician + Proto-Sinaitic + Abjad values

---

## What's Pending

### In Progress
- 7 new concepts in INDEX.json not yet wired into `CONCEPT_GROUPS` (`atum-etymology-map`, `electromagnetic-source`, `cosmic-symbols`, `seven-patterns-deep`, `dawood-method`, `qubaysi-ibdal`, `kuhn-consciousness`)
- 3 untracked files: `atum-app/data/sources/concepts/{ar,en,fr}/atomology-original.md` (new concept, not in INDEX yet)

### Backlog
- Tesseract OCR for the 6 scanned PDFs in Obsidian (`Sources/Other Sources/`)
- More word pages with deeper concept linking
- Site search / better cross-linking
- SEO: structured data (JSON-LD), OG image variants
- Analytics

---

## Where Each Type of File Lives

| Type | Location |
|------|----------|
| Next.js app code | `atum-app/atum-app/{app,components,lib,messages,i18n}/` |
| Runtime data (JSON) | `atum-app/atum-app/data/*.json` |
| Runtime data (MD sources) | `atum-app/atum-app/data/sources/{concepts,word-insights}/*` |
| Source CSVs (15 files) | `C:\Projects\_ACTIVE\Obsidian Vault\Language\Language-Datasets\*.csv` (read-only ref) |
| Linguistic DNA book | `C:\Projects\_ACTIVE\Obsidian Vault\Language\Language-Datasets\arabic_linguistic_dna_book.md` |
| Marketing prompts + strategy | `marketing/strategy/` |
| Generated social content | `marketing/content/` |
| Content templates | `marketing/content/templates/` |
| Design reference | `Design/` |
| Agent identity | `SOUL.MD` (top-level) |
| Agent conventions | `atum-app/atum-app/AGENTS.md` + `CLAUDE.md` |
| Archived / superseded | `_archive/` |
| Old project planning | `_archive/{MASTER_PLAN,TASK_BOARD,NOTEBOOKLM_SETUP,ATUM_PRD_v1.0}.md` |

---

## Tech Stack

- **Next.js** 16.2.6 (Turbopack)
- **React** 19
- **TypeScript** 5.x
- **Tailwind CSS** v4 (with `@theme inline`)
- **next-intl** 4.x (en/ar/fr)
- **Fonts:** Cinzel Decorative (display), Source Serif 4 (body), Amiri (Arabic), JetBrains Mono (mono)
- **Vercel** for hosting + CI
- **GitHub** `MautasseM01/atum-app` for source

---

## Recent Activity (2026-06-04)

- `70f3286` — fix(concepts): convert /concepts/[id] to client component to fix 500
- `4af4fa0` — add Mareting folder (typo preserved in original)
- `7759cfc` — feat: Natural Arabic + torus + visual polish
- `29093a2` — feat: Extract Account 1 notebooks — etymology map, EM source, Dawood, Qubaysi, Kuhn
- `48f1868` — feat: Concepts browser + Learn primer pages
