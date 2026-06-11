---
last_updated: 2026-06-10
owner: MautasseM
scope: session
---

# CONTEXT.md — Today's Working Context

> Today's specific goals, current focus, and tribal knowledge for THIS session.
> Short-lived. Overwrite freely. The durable record lives in MEMORY.md.

## Today's goal

Stand up the context-engineering system and the skills library, then begin
executing the 22 ROADMAP ideas — starting with the highest-leverage ones.

## Active focus

1. Context files (AGENTS.md / MEMORY.md / CONTEXT.md) + `skills/` — DONE when committed.
2. Open skills system synced via n8n + Obsidian (see `skills/SKILL-SYSTEM.md`).
3. Idea execution: begin with CCM Algorithm (rank 🥇, shortest path to publication).

## Tribal knowledge (things not obvious from the repo)

- PowerShell: use separate lines, NOT `&&` (invalid separator on the user's machine).
- Vercel deploy produces a new URL each time — always re-alias to atum-app-dna.vercel.app.
- The Obsidian Vault folder is NOT git-tracked; its CLAUDE.md updates on disk only.
- mapConfidence once crashed on numeric 0.72 (.normalize on a number) — guard types.
- Account 2 NotebookLM needs the explicit --storage flag or it silently reads Account 1.
- Cursor must NOT touch app code; Open Code must NOT touch data/sources/. Collisions waste a session.

## Definition of done for this session

- All context files saved in atum-app/ root and committed.
- skills/ directory populated and committed.
- A clear execution plan for the 22 ideas exists (this is the deliverable Claude returns).
