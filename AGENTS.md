---
last_updated: 2026-06-10
owner: MautasseM
scope: global
reviewed_by: Claude (conductor)
---

# AGENTS.md — ATUM Project

> Read this file first, every session. It is written for AI agents, not humans.
> Keep it under 200 lines. If it grows, move detail into `skills/`.

## What this project is

ATUM — "The Root of All Words." A computational-linguistics research project +
trilingual web app testing the hypothesis that three roots (ATUM / BULL / TOR)
underlie cross-language vocabulary, validated against Arabic etymology.

- Live app: https://atum-app-dna.vercel.app
- Thesis framing: **measurable phonosemantic patterns**, NOT "Arabic is the origin of all languages."
- Confidence system (use on EVERY claim): 🔬 proven · 🧩 probable · 🔍 exploratory · ❓ speculative

## The golden rule (non-negotiable)

**Never mix the academic layer (🔬🧩) with the metaphysical layer (🔍❓) in the same output.**
- Thesis / papers / academic claims → draw ONLY from 🔬🧩.
- 🔍❓ content stays in the public app for general audiences, never in academic claims.
- The real evidence is the statistics, not the number of agreeing sources.

## Commands

```bash
# App (Next.js) — run from atum-app/atum-app/
npm run dev                  # dev server
npm run build                # production build — MUST pass before deploy
npm run lint                 # lint
npx vercel --prod            # deploy
npx vercel alias [url] atum-app-dna.vercel.app   # point alias to new deploy

# NotebookLM CLI
notebooklm list                                              # Account 1 (default)
notebooklm --storage "$env:USERPROFILE\.notebooklm\account2.json" list   # Account 2
```

## Folder ownership (avoid collisions — agents work in parallel)

| Path | Owner | Notes |
|------|-------|-------|
| `atum-app/atum-app/app/`, `components/`, `lib/` | App agent | Next.js code |
| `atum-app/atum-app/data/sources/` | Research agent | concepts, insights, NotebookLM output |
| `atum-app/atum-app/messages/` | i18n agent | ar/en/fr translations |
| `atum-app/marketing/` | product work | strategy, content, MVP |
| `atum-app/research/` | reference only | points to Obsidian datasets |
| `Obsidian Vault/Language/` | research source | academic data, book, sources |

## Choose the agent by task, not by habit

- Heavy execution, data pipelines, app pages, scripts → **Open Code** (free, fast).
- Source extraction, NotebookLM, synthesis, judgment calls → **Cursor (Claude)**.
- Natural Arabic, RTL, visuals, animation → **Anti-Gravity (Gemini)** — but use sparingly; quota-limited on strong models.
- No bias toward any agent. Pick the best fit; any agent can pick up any task via this file.

## Skills (load on demand)

Check `skills/*/SKILL.md` BEFORE planning a task. Load a skill's full body
ONLY when its description matches the task. Available:
- `ccm-algorithm` — Consonant Class Matching: the publishable methodology
- `notebooklm-extraction` — querying notebooks, personas, where to save
- `data-visualization` — the 3 core visualizations (Ibdal / Abjad / etymology)
- `app-pages` — building/editing Next.js pages in this repo
- `research-writing` — drafting papers from 🔬🧩 evidence only
- `idea-execution` — turning a ROADMAP idea into a runnable mini-project

## Workflow rules

1. Read `MEMORY.md` (where we left off) + `CONTEXT.md` (today's goal) after this file.
2. git: commit + push after each completed track. Clear messages.
3. Context rot is real — compact past ~60% fill. Don't trust a 1M window to save you.
4. Copy-pasteable commands beat vague descriptions. Real snippets beat prose.
5. When done with ALL your tracks, update `MEMORY.md`, then report. Don't return mid-way.
6. Search the web with today's date for anything that may have changed since training.
