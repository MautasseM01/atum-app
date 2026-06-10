# CCM Algorithm — Consonant Class Matching

## Phase 1: Phonetic Classes

9 classes derived from 75 ibdal rules (Al-Qubaysi, 800-page philology text):

| Class | Name | Letters | Makhraj Origin |
|-------|------|---------|----------------|
| G1 | Laryngeal | hamza, alef, haa, ayn | throat (deep) |
| G2 | Pharyngeal Fricative | khaa, ghayn, haa2 | throat (upper) |
| G3 | Palatal | jeem, yaa, sheen, kaf | palate |
| G4 | Uvular | qaf | uvula |
| G5 | Dental Plosive | taa, dal, taa2 | dental stop |
| G6 | Dental Fricative | thaa, dhal, dhaa, dhad | dental fricative |
| G7 | Sibilant | seen, zay, sad | sibilant |
| G8 | Liquid | raa, lam, noon | liquid/nasal |
| G9 | Labial | baa, faa, meem, waw | lip |

**Derivation:** Traditional 5-makhraj system split at articulatory boundaries. Dental group (14 letters) subdivided into 5 subgroups by manner of articulation.

**Intra-class ibdal:** 28% of 75 rules fall within same 9-class group.

## Phase 2: CCM Match Rates

CCM rule: two roots "match" if their first 2 consonants are in same classes, in order.

**Data source:** `etymologies.json` bridge entries (85 research-grade etymologies), supplemented with 20 documented Arabic-Hebrew cognates + 17 documented Arabic→Persian loanwords.

## Phase 3: Baseline Results

**Permutation test (1000 iterations):** Shuffle Arabic letter→class assignments, recompute CCM rate. Null distribution = ~1.2% (1/9 × 1/9 = 1/81 theoretical chance match).

### Pre-registered verdict rule (set before running):
- 🔬 p < 0.01 (Bonferroni: α = 0.05 / 5 pairs = 0.01)
- 🧩 p < 0.10 (suggestive)
- ❓ p ≥ 0.10 (no better than chance)

### Results

| Pair | N | Observed | Random Ø | p-value | 95% CI | Lev | Verdict |
|------|---|----------|----------|---------|--------|-----|---------|
| Arabic-Hebrew | 19 | 52.6% | 1.2% | 0.0000 | 31.6–73.7% | 0.68 | 🔬 |
| Arabic-Latin | 52 | 51.9% | 1.3% | 0.0000 | 38.5–65.4% | 0.65 | 🔬 |
| Arabic-Greek | 36 | 47.2% | 1.4% | 0.0000 | 30.6–63.9% | 0.64 | 🔬 |
| Arabic-English | 44 | 47.7% | 1.3% | 0.0000 | 34.1–61.4% | 0.73 | 🔬 |
| Arabic-Persian | 17 | 82.4% | 1.1% | 0.0000 | 64.7–100.0% | 0.35 | 🔬 |

All 5 pairs beat random at p<0.01 (survives Bonferroni). Note: p=0.0000 because with 9 classes, random expected match rate is ~1.2% and observed rates (47–82%) never occur in 1000 null permutations.

### Ordering Test
Latin (51.9%) > English (47.7%) > Greek (47.2%): **YES** — ordering survived baseline.

## Key Caveats
- Latin→English→Greek ordering has very narrow margins (51.9% → 47.7% → 47.2%); differences may not be statistically significant between pairs.
- Arabic-Persian N=17 and Arabic-Hebrew N=19 are modest supplemental samples; results are suggestive but need larger ASJP/Lexibank validation.
- CCM with 9 classes is so specific that random matches are extremely rare (~1.2%). All pairs trivially beat this baseline. The real test is whether CCM outperforms simpler models (e.g., 5-makhraj, voicing-based) — deferred to future work.

## Guard
Results are **🔍 exploratory** until peer-reviewed. No academic claims.

Created: 2026-06-10
