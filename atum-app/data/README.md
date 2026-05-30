# Data Directory

| File | Size | Records | Description |
|------|------|---------|-------------|
| `etymologies.json` | 2.2 MB | 85 bridge + 5,083 database | Main etymology corpus |
| `letters.json` | 14 KB | 28 | Arabic letters with DNA, Abjad, Phoenician |
| `ibdalRules.json` | 49 KB | 75 | Phonetic transformation rules (unused) |
| `rootPatterns.json` | 7 KB | 3 | Root classification patterns (unused) |
| `sources/concepts.json` | 9 KB | 18 | Concept chunks from NotebookLM PDFs |
| `_archive/` | — | — | Legacy/orphaned data files |

## Etymology Data Format

**Bridge entries** (documented etymologies):
- `id`, `arabicRoot`, `modernWord`, `modernMeaning`, `targetLanguage`
- `transformationRule`, `confidence`, `notes`
- Have full Arabic root data and phonetic rules

**Database entries** (AI-classified):
- `id`, `word`, `root`, `meaning`, `confidence`, `source`
- No `arabicRoot` field — root determined by `root` field mapping

## Root Mapping

- `ATOM` → `ATUM`
- `BULL` → `BULL`  
- `TOR` → `TOR`

Case-insensitive. Unknown roots default to ATUM.

## Adding New Data

Follow the format of existing entries. Run `npm run build` to verify.
