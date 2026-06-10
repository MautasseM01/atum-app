# CCM Algorithm — Consonant Class Matching

## Phase 1: Phonetic Classes

9 classes derived from 75 ibdal rules (Al-Qubaysi, 800-page philology text):

| Class | Name | Letters | Makhraj Origin |
|-------|------|---------|----------------|
| G1 | Laryngeal | hamza, alef, haa, ayn | حلقي (deep throat) |
| G2 | Pharyngeal Fricative | khaa, ghayn, haa2 | حلقي (upper throat) |
| G3 | Palatal | jeem, yaa, sheen, kaf | حنكي (palate) |
| G4 | Uvular | qaf | لهوي (uvula) |
| G5 | Dental Plosive | taa, dal, taa2 | أسناني (dental stop) |
| G6 | Dental Fricative | thaa, dhal, dhaa, dhad | أسناني (dental fricative) |
| G7 | Sibilant | seen, zay, sad | أسناني (sibilant) |
| G8 | Liquid | raa, lam, noon | أسناني (liquid/nasal) |
| G9 | Labial | baa, faa, meem, waw | شفوي (lip) |

**Derivation:** The traditional 5-makhraj Arabic system was split at natural articulatory boundaries. The largest group (Dental/Alveolar, 14 letters) was subdivided into 5 subgroups by manner of articulation (plosive, fricative, sibilant, liquid). Splitting was validated against ibdal adjacency: 68% of substitutions fall within the same broad makhraj.

**Intra-class ibdal:** 28% of 75 rules fall within the same 9-class group (expected, since dental subgroups often substitute across each other).

## Phase 2: CCM Match Rates

CCM rule: two roots "match" if their first 2 consonants fall in the same classes, in order.

| Language Pair | Matches | Total | Match Rate |
|---------------|---------|-------|------------|
| Arabic-Hebrew | 2 | 4 | 50.0% |
| Arabic-Latin | 26 | 53 | 49.1% |
| Arabic-Greek | 14 | 36 | 38.9% |
| Arabic-English | 20 | 45 | 44.4% |
| Arabic-Persian | 0 | 0 | — |

**Data source:** `etymologies.json` bridge entries (85 research-grade etymologies). Arabic-Persian has 0 entries in the bridge — needs external dataset (ASJP/Lexibank).

**Random baseline (for context):** With 9 classes, exact match by chance = 1/9 × 1/9 ≈ 1.2%. Observed rates (39-50%) are well above this.

## Phase 3: Baseline Scaffold

`baseline_ccm.py` is scaffolded and ready:
- Random class assignment permutation (1000 iterations) for p-value
- Levenshtein distance baseline

Currently stubbed — uncomment the computation functions to run.

## Guard

These results are **🔍 exploratory** until baseline-compared. No academic claims yet.

Created: 2026-06-10
