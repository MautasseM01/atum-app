# CCM Algorithm — Consonant Class Matching

## Phases 1–3 Results

9 classes from 75 ibdal rules (Al-Qubaysi). CCM rule: first 2 consonants in same classes, in order.

## Phase 3 Enrichment: Etymological Wordnet Ingest

**Source:** Etymological Wordnet (etymwn, de Melo 2013, CC-BY-SA), 6M edges, 5,977 Arabic-bridged lines.

### Data Growth

| Pair | Before (bridge only) | After (bridge + etymwn) |
|------|---------------------|------------------------|
| Arabic-Hebrew | 19 | 68 (49 from etymwn) |
| Arabic-Latin | 52 | 101 (50 from etymwn) |
| Arabic-Greek | 36 | 102 (67 from etymwn) |
| Arabic-English | 45 | 690 (646 from etymwn) |
| Arabic-Persian | 17 | 17 (0 from etymwn) |

### CCM vs Levenshtein (same-representation romanization)

| Pair | N(all) | N(cog) | CCM all | CCM cog | Lev(same) | Δ | CCM wins? |
|------|--------|--------|---------|---------|-----------|---|-----------|
| ar-he | 68 | 19 | 36.8% | 10/19 | 55.7% | −18.9pp | NO |
| ar-la | 101 | 7 | 51.5% | 5/7 | 32.4% | +19.1pp | YES |
| ar-gr | 102 | 0 | 24.5% | — | 25.3% | −0.8pp | NO |
| ar-en | 690 | 6 | 44.1% | 4/6 | 48.3% | −4.3pp | NO |
| ar-fa | 17 | 0 | 82.4% | — | 63.2% | +19.1pp | YES |

### Key Findings

1. **Arabic↔Greek/Latin cognate N ≥ 30?** NO. Latin=7, Greek=0. Neither deep-roots pair has sufficient cognate data.
2. **CCM beats Levenshtein on 2/5 pairs** (Latin +19.1pp, Persian +19.1pp). **Loses on 3/5** (Hebrew −18.9pp, English −4.3pp, Greek −0.8pp).
3. **Largest sample (English N=690): CCM loses to Levenshtein** (−4.3pp). This is the most statistically robust result.
4. **Persian** has the highest absolute CCM rate (82.4%) but all entries are modern loanwords — this tests borrowing detection, not deep relationships.

### Seed Validation
- Etymological Wordnet auto-tagged all 812 entries as "borrowed" — it doesn't distinguish cognate from loanword in its relation types.
- No etymwn entries matched hand-tagged Hebrew/Persian seeds (different transliterations).
- Hebrew seeds: 7/15 CCM match (47%); Persian seeds: 14/17 CCM match (82%).

### Files Added
- `etymwn_pairs.json` — 812 parsed Arabic-bridged etymological pairs
- `_process_etymwn.py` — extraction script (requires etymwn.tsv from archive.org)
- `ccm_etymwn_run.py` — CCM+Levenshtein run on merged data
- `relation_map.json` — per-entry relation tags (cognate|loanword|unknown)

### Guard
Results remain **🔍 exploratory**. CCM's Latin signal (+19.1pp over Lev) is promising but the English failure on 690 entries is a strong caution. Publishable claims require the cognate N problem to be resolved (Latin=7, Greek=0).

---

## 🔴 FINAL VERDICT: CCM retired as similarity method (2026-06-11)

**Test:** lexibank/kitchensemitic (Kitchen et al. 2009), expert Arabic-Hebrew cognates.
**Pre-registered rule:** CCM ≥ Lev on expert gold cognates → method survives; CCM < Lev → retired.

| Dataset | N(gold) | CCM% | Lev(same-rep)% | Δ | CCM ≥ Lev? |
|---------|---------|------|----------------|---|------------|
| Kitchen Semitic Ar-He | 63 | 39.7% | 59.8% | −20.1pp | NO |

**Rule applied:** CCM (39.7%) < Lev (59.8%) → **CCM RETIRED AS SIMILARITY METHOD**.

**Absolute rate:** 39.7% on known cognates is POOR — not reliable for cognate detection.

**What this means:**
- CCM's 9-class phonetic abstraction discards too much signal even between closely related Semitic languages
- First-2-consonant matching on phonetic classes loses →60% of expert-verified cognates
- A literal Levenshtein on the same 2-character strings outperforms CCM by 20.1pp
- CCM can still be used as a **weak filter** or **exploratory tool** within a wider pipeline, but cannot stand alone as a cognate similarity method

**Files:**
- `ccm-verdict-kitchen.txt` in `data/sources/phd-mining/` — full per-cogset breakdown
- `ccm_kitchen_verdict.py` (temp) — reproduction script with complete IPA→CCM mapping

Updated: 2026-06-11
