---
name: skill-system
description: How the open-skills system works, and how it syncs via n8n + Obsidian. Read when setting up, syncing, or adding skills.
---

# Skill System — Open, Synced, Self-Hosted

We use the open-skills pattern (not a paid SaaS): skills are plain markdown in
`skills/`, version-controlled in git, read by every agent at session start.
No third-party data dependency. Two integrations make it durable:

## How agents use skills (progressive disclosure)

1. At session start, the agent reads only skill NAMES + DESCRIPTIONS (the frontmatter).
2. When a task matches a skill's description, the agent loads that SKILL.md's full body.
3. Supplementary files load only when needed.
This keeps context lean until detail is required (avoids context rot).

## n8n integration (automation layer)

n8n (running locally via Docker) keeps skills + memory in sync without manual work:

- **Skill sync workflow:** on git push to `skills/`, n8n pulls and mirrors the
  folder to each agent's skills directory (Open Code, Cursor, Gemini CLI).
  "Install once, sync everywhere."
- **Memory rollup workflow:** nightly, n8n appends session summaries to MEMORY.md
  and trims CONTEXT.md, preventing the files from rotting.
- **Switch n8n LLM calls to Gemini** (gemini-flash-latest) to save Claude budget
  for conducting; use free models for mechanical sync.

## Obsidian integration (knowledge layer)

The Obsidian Vault is the research brain. Bridge it to skills:

- Skills that need research facts link to vault notes by path (read-only).
- New concepts distilled from sources live in BOTH `data/sources/concepts/`
  (for the app) AND can be mirrored to the vault for human browsing.
- Obsidian's graph view = human-readable map of how concepts link to roots/words.
- Keep the vault as the canonical academic record; the app reads distilled copies.

## Adding a new skill

Create `skills/<name>/SKILL.md` with frontmatter:
```
---
name: <short-id>
description: <one line — when should an agent load this?>
---
```
Body: procedural, decision-oriented, copy-pasteable commands. Under ~150 lines.
Commit. n8n syncs it to all agents on push.

## Rules

- Skills are written for agents, not humans (readability is a side effect).
- One capability per skill. Don't make a mega-skill.
- If two skills overlap, merge or cross-link with a typed reference.
