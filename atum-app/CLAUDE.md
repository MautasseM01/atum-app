# ATUM — The Root of All Words

A unified web application teaching users to recognize the three electromagnetic roots (ATUM, BULL, TOR) underlying all world languages.

## Project Structure

```
atum-app/
├── app/
│   ├── [locale]/                   # Internationalized routes
│   │   ├── page.tsx                # Homepage
│   │   ├── explorer/               # Etymology Explorer (client, fetches API)
│   │   ├── patterns/               # Pattern Learning System
│   │   ├── letters/                # 28 Arabic Letters with DNA
│   │   ├── research/               # Research Dashboard
│   │   └── etymology/[word]/       # Deep word pages (new)
│   └── api/                        # API routes
│       ├── etymology/search/       # Search + filter + paginate
│       ├── concepts/               # Serve concepts.json
│       ├── dna/stats/              # DNA statistics
│       └── stats/                  # General stats
├── components/
│   ├── Navigation.tsx              # Global nav with brand mark
│   ├── NavShell.tsx                # Layout wrapper (HexGrid + Nav)
│   ├── HomePage.tsx                # Homepage UI
│   ├── ExplorerPage.tsx            # Search/filter results grid
│   ├── PatternsPage.tsx            # Learn/Practice/Explore modes
│   ├── LettersPage.tsx             # Letter selector + detail panel
│   ├── ResearchPage.tsx            # Stats + network graph + timeline
│   ├── EtymologyPage.tsx           # Deep word page (7-section layout)
│   ├── EtymologyCard.tsx           # Word card with root + confidence
│   ├── Pronunciation.tsx           # IPA display + Web Speech API
│   ├── RootBadge.tsx               # ATUM/BULL/TOR colored pill
│   ├── ConfidenceBadge.tsx         # Proven/Strong/Moderate/Emerging
│   ├── SearchBar.tsx               # Gold-focus search input
│   ├── SectionHeader.tsx           # Title + subtitle
│   ├── StatCard.tsx                # Animated count-up card
│   ├── Footer.tsx                  # Global footer
│   ├── TorusCanvas.tsx             # Canvas torus animation (lazy)
│   └── HexGrid.tsx                 # SVG hex background pattern
├── data/
│   ├── etymologies.json            # 5,168 word entries (85 bridge + 5,083 database)
│   ├── letters.json                # 28 Arabic letters with DNA data
│   ├── ibdalRules.json             # 75 phonetic rules (unused)
│   ├── rootPatterns.json           # Root classification patterns (unused)
│   ├── supabase-export.json        # Old Supabase export (archive)
│   └── sources/
│       └── concepts.json           # 18 concept chunks from NotebookLM PDFs
├── lib/
│   └── data.ts                     # Data type definitions + loaders
├── messages/                       # i18n: en.json, ar.json, fr.json
└── public/                         # Static assets
```

## Data Files

| File | Records | Purpose |
|------|---------|---------|
| `etymologies.json` | 85 bridge + 5,083 database | Main etymology corpus |
| `letters.json` | 28 | Arabic letter DNA + Abjad + Phoenician |
| `sources/concepts.json` | 18 | Concept chunks from NotebookLM sources |

## How to Add New Words

1. Add entry to `data/etymologies.json`:
   - **Bridge entry** (documented): has `arabicRoot`, `modernWord`, `transformationRule`, `targetLanguage`, `confidence`
   - **Database entry** (classified): has `word`, `root`, `meaning`, `confidence`, `source`

2. ID format: bridge entries use string IDs (e.g. E001), database use numeric IDs

3. Confidence values: number 0-1, or string like "🔬 عالي", "🧩 محتمل", "🔍 استكشافي"

4. Run `npm run build` to verify

## Agent Workflow

1. Read CLAUDE.md first
2. Each change → `git add && git commit`
3. No origin remote — deploy directly with `npx vercel --prod`
4. Custom domain: `atum-app-dna.vercel.app`
5. Large changes → consult MASTER_PLAN.md and ATUM_PRD_v1.0.md

## Build & Deploy

```bash
cd atum-app
npm run build          # Verify compilation
npx vercel --prod      # Deploy to Vercel
npx vercel alias <url> atum-app-dna.vercel.app  # Update alias
```

## Key Technical Decisions

- Server-side search API (`/api/etymology/search`) — client never loads all 5,168 words
- Direct JSON imports for build-time bundling (not fs.readFileSync)
- All page components are `'use client'` — route pages are thin server shims
- Confidence mapping: `String(c).normalize('NFD')` handles both numeric and string values
- Root mapping: ATOM→ATUM, BULL→BULL, TOR→TOR
- Language detection: from `targetLanguage` field (bridge) or default 'EN'
- Phoenician symbols: stored per-letter in `letters.json`
- PDFs scanned without text layer — OCR needed for full text extraction
