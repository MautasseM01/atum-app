# ATUM Research

> **Read-only references** — no files are copied here.
> The actual research materials live in the Obsidian Vault.
> This file documents where to find them.

## Primary Location

All research materials are in the Obsidian Vault at:

```
C:\Projects\_ACTIVE\Obsidian Vault\Language\
```

The ATUM app only **consumes** the outputs (etymologies, ibdal rules, letters, roots) — it never modifies the originals.

## What's Where

### Datasets (CSVs)
**Path:** `C:\Projects\_ACTIVE\Obsidian Vault\Language\Language-Datasets\`

The active CSVs (loaded by `atum-app/app/api/etymology/search/route.ts`):

| File | Purpose | Size |
|------|---------|------|
| `etymology_bridge.csv` | 5,168 word mappings (Arabic root → European form) | 28 KB |
| `ibdal_rules.csv` | 75 Al-Qubaysi phonetic substitution rules | 17 KB |
| `abjad_statistical.csv` | 28-letter frequency + confidence | 11 KB |
| `alphabet_genealogy.csv` | Script evolution chain (Phoenician → Ar → Gr → La) | 7 KB |
| `arabic_evolution.csv` | Arabic script changes over time | 2 KB |
| `chladni_mode_map_v2.csv` | Sound → geometric pattern mapping | 1 KB |
| `cymatics_mapping.csv` | Cymatics shapes per frequency | 21 KB |
| `geometric_3d.csv` | 3D letter forms | 17 KB |
| `phonosemantic_corpus.csv` | Phonosemantic test corpus | 7 KB |
| `phonosemantic_features.csv` | Per-letter feature vectors | 4 KB |
| `phonosemantic_matrix.csv` | Phonosemantic similarity matrix | 7 KB |
| `proto_world_roots.csv` | Proto-world root candidates (847+ languages) | 15 KB |
| `semantic_field.csv` | Semantic field clusters | 26 KB |
| `three_fathers_map.csv` | Three-fathers language genealogy | 8 KB |
| `writing_evolution.csv` | Script evolution timeline | 14 KB |

(The Obsidian folder has additional CSVs and PNGs used in the book — not all are loaded by the app.)

### Book (Reference)
**Path:** `C:\Projects\_ACTIVE\Obsidian Vault\Language\Language-Datasets\arabic_linguistic_dna_book.md`

- **Latest:** `arabic_linguistic_dna_book.md` (70 KB, 2026-04-26)
- **Older draft:** `arabic_linguistic_dna_book-origin-.md` (110 KB, 2026-05-02)
- **PDF:** `arabic_linguistic_dna_book.pdf` (901 KB, 2026-04-27)
- **Data paper:** `arabic_linguistic_dna_data_paper.docx` (22 KB)

### Sources (Notebooks / NotebooksLM)
**Path:** `C:\Projects\_ACTIVE\Obsidian Vault\Language\Sources\`

Authored notebooks (some extracted into concept primers shipped in the app):

- `Al-Qubaysi/` — 75 ibdal rules
- `Dawood/` — Three Fathers Theory
- `Kuhn/` — Consciousness & paradigms
- `Tawfiq_Al-Mutaqadat(Syncretism)/` — Syncretism
- `Tenen/` — Sacred geometry
- `Other Sources/` — Dawood, Qubaysi, electromagnetism

### Extracted Concept Content
**Path:** `C:\Projects\_ACTIVE\Obsidian Vault\Language\extracted\`

Trilingual primers (ar/en/fr) extracted from the above sources — these are what `atum-app/data/sources/concepts/{ar,en,fr}/*.md` were built from.

## How the App Consumes This

```
Obsidian Vault/Language/Language-Datasets/*.csv
            ↓ (manual export / sync)
atum-app/atum-app/data/{etymologies,ibdalRules,letters,rootPatterns}.json
            ↓ (loaded by API routes)
app/api/etymology/search  →  /api/etymology/search
app/api/word-insight      →  /api/word-insight
app/api/concept-content   →  /api/concept-content
```

The exported JSONs in `atum-app/data/` are the working copy used at runtime.
The CSVs in Obsidian are the source of truth — re-export to refresh.

## Active Workspace (Live App)

The deployed app's data lives in:
- `atum-app/atum-app/data/` — runtime JSONs (etymologies, ibdalRules, letters, rootPatterns)
- `atum-app/atum-app/data/sources/` — concept MDs + INDEX.json (20 concepts, 37 word-insights)
- `atum-app/atum-app/data/_archive/` — historical snapshots (e.g. `supabase-export.json`)

## See Also

- `STATUS.md` — current structure of the whole project
- `marketing/` — strategy + generated content
- `_archive/` — duplicates and superseded planning files
