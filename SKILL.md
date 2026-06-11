---
name: ccm-algorithm
description: Consonant Class Matching — the original publishable methodology. Load when implementing, testing, or writing the CCM paper.
---

# CCM — Consonant Class Matching

The hidden gem from Atomology v1. An original method to measure genetic
relatedness between languages by matching the first two consonants of a root
across 9 phonetic classes. This is the SHORTEST path to academic publication
because it's a METHOD, not a claim.

## The idea

- Every root has consonants. Group consonants into 9 articulatory classes
  (derive the classes from `data/ibdalRules.json` — 68% of ibdal rules already
  fall between articulatorily-adjacent sounds, so the classes are data-grounded).
- Two words "match" under CCM if their first two consonants fall in the same
  classes, in order.
- Measure: across language pairs, does CCM match rate exceed a random baseline?

## Why it's defensible (academic framing)

- It's a falsifiable methodology, comparable against null models.
- Pair it with the 75 ibdal rules → a system for modeling linguistic distance.
- Research question: "Can CCM + ibdal rules model linguistic distance between
  Arabic and Indo-European languages comparably to traditional phylogenetic models?"

## Implementation phases

```
Phase 1  Encode the 9 phonetic classes from ibdalRules.json (Python).
Phase 2  Run CCM on 5 language pairs (Arabic-Hebrew, Arabic-Latin, ...).
         Data: WALS, Lexibank, ASJP (thousands of languages, open).
Phase 3  Baseline: Levenshtein distance + random consonant-class assignment.
         Compute p-value that CCM match rate beats random.
Phase 4  Write short paper → Journal of Quantitative Linguistics.
```

## Guards

- Avoid circular reasoning: test CCM on held-out language pairs not used to tune classes.
- Apply Bonferroni correction across all pairwise tests.
- Report match rate vs baseline with confidence intervals, not just point estimates.
- Mark every claim 🔬/🧩. If CCM only weakly beats baseline, say so — that's still a result.

## Output location

- Code → `atum-app/atum-app/scripts/ccm/` or a separate research repo.
- Paper draft → `marketing/product/` is wrong; use a `research/papers/` folder.
