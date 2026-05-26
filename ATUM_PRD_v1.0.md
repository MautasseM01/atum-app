# ATUM — The Root of All Words
## Product Requirements Document | v1.0 | May 2026

> أتوم · بول · طور — Every Word Has a Root

---

## 1. Executive Summary

ATUM is a unified web application that teaches users to recognize the three electromagnetic roots (ATUM, BULL, TOR) underlying all world languages, as theorized by Santos Bonacci and validated by cross-referencing with Arabic etymological research spanning 5 primary academic sources.

**Consolidated from three existing projects:**
- `source-of-all-language` — 5,083 classified words
- `sacred-word-flow` — 96 scientifically documented Arabic etymologies  
- `abjad` — 28 Arabic letter visualizations with DNA data

**Core value proposition:**
A user who understands ATUM/BULL/TOR can decode patterns in any language — just as understanding Arabic verb weights (أوزان الأفعال) allows generating thousands of words from one pattern.

---

## 2. Vision & Mission

### 2.1 Vision Statement
To make linguistic pattern recognition accessible to everyone — students, researchers, and curious minds — by showing that language is not arbitrary but follows discoverable electromagnetic principles.

### 2.2 Core Thesis

| Root | Principle | Energy |
|------|-----------|--------|
| 🟢 ATUM / أتوم | Unity · Inwardness · Beginning | Inertia |
| 🔴 BULL / بول | Radiation · Expansion · Outward | Radiation |
| 🔵 TOR / طور | Structure · Rotation · Cycles | Gravitation |

> Arabic preserves these patterns most clearly — losing 0 sounds vs Greek (−5) and Latin (−12).

---

## 3. Target Users

| User Type | Goal | Primary Feature |
|-----------|------|-----------------|
| Language Learner | Decode multiple languages via patterns | /patterns — Learn Mode |
| Academic Researcher | Access validated statistical data | /research + Kaggle |
| General Curious | Discover surprising word origins | /explorer + Word of Day |
| Educator | Teach etymology interactively | /patterns — Practice Mode |

---

## 4. Feature Specification

### 4.1 Core Features (MVP)

#### 4.1.1 Etymology Explorer
- Search 5,083 classified words + 96 scientifically documented etymologies
- Filter by root: ATUM / BULL / TOR
- Each result: Arabic root + transformation rule + confidence level + sources
- Confidence: 🔬 Proven | 🧩 Probable | 🔍 Exploratory | ❓ Speculative

#### 4.1.2 Pattern Learning System
- **LEARN**: 3 root cards + 5 flip-card examples each
- **PRACTICE**: word shown → guess root → score tracking
- **EXPLORE**: browse 5,083 words by root with confidence filter
- Metaphor: ATUM/BULL/TOR = Arabic أوزان الأفعال

#### 4.1.3 Letters (28 Arabic Letters)
- Phoenician symbol + Arabic + Gematria value + sound
- DNA panel: CNN confirmed 🔬, Bonacci energy type, phonosemantic verdict
- Key findings: Lam (ل) contraction p<0.0001 🔬, Ra (ر) expansion p=0.028 🧩

#### 4.1.4 Research Dashboard
- Stats: r=−0.693, p<0.0001, CNN 99.7%
- Network: 102 nodes (3 roots + words)
- Timeline: 8 historical milestones
- 5 primary sources

#### 4.1.5 Homepage
- Word of the Day (8 strongest etymologies)
- Quick search + suggestions
- 3 root cards (🟢🔴🔵)
- Stats: 5,000+ words · 96 documented · 5 sources

### 4.2 Secondary Features
- **World Map**: Three Fathers (SAR/MAR/RAB) + alphabet spread
- **Library**: 5 primary sources + batch_01 articles
- **Blog**: "Why Does Athena Sound Arabic?" (ready)

### 4.3 Future (Roadmap)
- 🚧 Crossword game
- 🚧 Cosmic/3D (Three.js)
- 🚧 Community
- 🚧 NotebookLM integration

---

## 5. Technical Architecture

### 5.1 Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| i18n | next-intl — AR + EN + FR |
| 3D | React Three Fiber (lazy) |
| Data | JSON files |
| Deploy | Vercel |

### 5.2 Data Files
```
atum-app/data/
  etymologies.json   ← 181 etymologies (85 documented + 96 classified)
  letters.json       ← 22 letters + DNA
  rootPatterns.json  ← 3 roots + 85 classifications
  ibdalRules.json    ← 75 phonetic rules
  timeline.json      ← 8 milestones
  sources.json       ← 5 primary sources
```

### 5.3 Repository Structure
```
app/[locale]/
  page.tsx             ← Homepage
  explorer/            ← Etymology Explorer
  patterns/            ← Pattern Learning
  letters/             ← 28 Arabic Letters
  research/            ← Research Dashboard
  etymology/[word]/    ← Individual etymology
  map/                 ← World Map
  library/             ← Sources + Articles
  blog/                ← Blog
  crossword/           ← 🚧 Coming soon
  cosmic/              ← 🚧 Coming soon
components/
data/
messages/              ← ar.json, en.json, fr.json
lib/
```

---

## 6. Design System

### 6.1 Colors
| Element | Hex | Usage |
|---------|-----|-------|
| ATUM | `#22C55E` | Green — unity, nature, beginning |
| BULL | `#EF4444` | Red — fire, radiation, expansion |
| TOR | `#3B82F6` | Blue — water, structure, rotation |
| Background | `#0d1117` | Dark mode primary |
| Surface | `#161b22` | Cards and panels |
| Accent | `#f39c12` | Highlights and CTAs |
| 🔬 Proven | `#2ecc71` | Scientifically validated |
| 🧩 Probable | `#f39c12` | Probable |
| 🔍 Exploratory | `#3498db` | Needs verification |

### 6.2 Typography
- **EN/FR**: Cinzel (display) + Source Serif 4 (body)
- **Arabic**: Amiri — RTL, minimum 18px, natural phrasing
- **European words**: text-3xl font-bold on etymology cards
- **Arabic roots**: text-2xl text-amber-400 on etymology cards

### 6.3 UX Principles
1. New visitor understands concept in 30 seconds
2. Every technical term has plain-language explanation
3. Confidence badges always visible — no hidden uncertainty
4. Mobile-first: all features work on 375px
5. Performance: Three.js lazy loaded

---

## 7. Migration Plan

| Source | What to Migrate | Status |
|--------|----------------|--------|
| source-of-all-language | 5,083 words | 🟢 In data/etymologies.json |
| sacred-word-flow | 96 etymologies + components | 🟡 Adapt |
| abjad | Letters + DNA + Cosmic | 🟡 Adapt |
| Obsidian CSVs | All research data | 🟢 Sync script ready |

**After migration:** Archive repos on GitHub, remove from Vercel.

---

## 8. Agent Tasks

| Agent | Responsibility |
|-------|---------------|
| **Claude** | PRD · Data prep · Architecture · Quality review |
| **Anti-Gravity/Gemini** | Next.js scaffold · Arabic UI · Three.js · i18n Arabic |
| **Open Code** | Migration scripts · API routes · Testing |

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Concept understood | < 30 seconds |
| Etymology accuracy | 96 words return 🔬 |
| Pattern quiz completion | > 60% |
| Lighthouse score | > 85 |
| i18n coverage | 100% AR/EN/FR |

---

## 10. Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Phase 0 | 1 day | Data migration + JSON consolidation |
| Phase 1 | 3 days | Next.js scaffold + i18n + Homepage + Explorer |
| Phase 2 | 3 days | Patterns + Letters + Research |
| Phase 3 | 2 days | Map + Library + Blog + Etymology pages |
| Phase 4 | 1 day | Three.js Cosmic + performance |
| Phase 5 | 1 day | QA + deploy + archive old repos |

**Total: ~11 days with parallel agents**

---

## Appendix — Live URLs

| Resource | URL / Path |
|----------|-----------|
| API | https://etymology-nexus-api.mautassem.workers.dev |
| Research App | https://sacred-word-flow-dna.vercel.app |
| Letters App | https://abjad-dna.vercel.app |
| Old Etymology | https://source-of-all-language.vercel.app |
| Research Data | `Obsidian Vault\Language\Language-Datasets\` |
