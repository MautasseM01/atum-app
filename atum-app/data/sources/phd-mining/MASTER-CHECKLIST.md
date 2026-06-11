# MASTER CHECKLIST — ATUM Research Execution Plan

**Last updated:** 2026-06-12
**Source:** RESEARCH-ROADMAP.md (التحديث الثالث)
**Scope:** All publishable projects, visualizations, and data validation

## Progress Snapshot

✅ **Completed:** 6 findings (CCM retired, Abjad collapsed, Ibdal graph live, Audit FUZZY, Suffix SIGNAL, POS-isolation SURVIVES)
🟢 **Live in app:** 1 visualization (ibdal network graph at /visualizations/ibdal)
💀 **Dead:** 2 (CCM similarity, Abjad x Frequency paper)
🔄 **In testing:** 0 currently
⏭️ **Next:** Expand suffix to -ble/-tor + French; human audit

**Publications: 0 live, 3 dead/retired, 5 viable (+1 new pilot: suffix clustering SIGNAL).**
*Viable: Ibḍāl encoding, Semantic Suffix (pilot signal confirmed), Toponymic 80-10-10, Ha-Mim Code 19, Lām = Contraction, Base-3 Cartesian, 333 BC Boundary, Acoustic Onomatopoeia.*

---

## Phase 0: Foundation (Q2 2026)

### 0.1 Data Validation
- [x] **0.1.1** Design stratified random sample of 357 words from 5,083 (by root × confidence tier) → **DONE** (audit scripts/)
- [x] **0.1.2** Create audit form: blind format with ATUM/BULL/TOR/NONE/UNSURE, strength [0-3], basis → **DONE** (audit_blind.json)
- [ ] **0.1.3** Recruit 3 independent auditors (Arabic native speakers + linguistics background) → **NOT YET** (LLM-proxy done first: κ=0.53 FUZZY)
- [ ] **0.1.4** Run human audit — calculate Fleiss' Kappa ≥ 0.80 → **PENDING** after LLM proxy result
- [ ] **0.1.5** Compute classifier accuracy vs human gold standard → **PENDING**
- [x] **0.1.6** Extract actual letter frequencies from Leipzig ara_wikipedia_2021_100K (7.58M letters)
- [x] **0.1.7** Recompute r = −0.693 (Abjad × Frequency) on real frequencies → **COLLAPSES** (see Results below)
- [x] **0.1.8** Apply Bonferroni correction to all statistical tests
- [x] **0.1.8b** LLM-proxy audit (CHEAP SIGNAL, pre-human) — 357 words, 3 deterministic sound-pattern raters against rootPatterns.json criteria → **FUZZY (κ=0.5264), EXPLORATORY (28.6% accuracy)**
- [ ] **0.1.9** Write AI methodology section (models, sample size, accuracy, limitations)

### 0.2 Infrastructure
- [ ] **0.2.1** Set up project repo structure (`/ccm/`, `/suffix/`, `/toponymic/`, `/hamim/`, `/visuals/`)
- [ ] **0.2.2** Initialize Python venv + dependencies (numpy, scipy, pandas, sklearn, networkx)
- [x] **0.2.3** Set up D3.js for visualizations → **DONE** (V1 ibdal graph deployed)
- [ ] **0.2.4** Configure GIS environment (GeoPandas, QGIS or equivalent)

---

## Phase 1: High-Priority Projects (Q2-Q3 2026)

### 1.1 [P1] CCM Algorithm — Consonant Class Matching
*Target: Journal of Quantitative Linguistics (short paper)*
- [x] **P1.1** Code the 9 phonetic classes based on `ibdal_rules.json`
- [x] **P1.2** Implement CCM distance function
- [x] **P1.3** Test on 1 language pair (AR-HE, Kitchen et al. 2009 gold standard, 65 cognates)
- [x] **P1.4** Compare with Levenshtein distance baseline → CCM 39.7% vs Lev 59.8% (−20.1pp)
- [x] **P1.5** Compute random baseline → CCM < Levenshtein: **CCM RETIRED AS SIMILARITY METHOD**
- [ ] **P1.6** Write "Cordova's error" methodological note (why CCM fails + what it reveals)
- [ ] **P1.7** Submit to *Journal of Quantitative Linguistics* (if salvageable) or archive as negative result
- [ ] **P1.8** Fallback: publish as replication study / negative result

### 1.2 [P3] Semantic Suffix Clustering
*Target: COLING 2026 / ACL workshop*
- [x] **P3.0** CHEAP PILOT — English -tion, 200 words, GloVe 50d, 1000-iteration permutation test → **SIGNAL (p < 0.001, 2.07× null mean)**
- [x] **P3.0b** POS-confound check: -ness (0.359) > -able (0.239) > -tion (0.159) > -ment (0.140) > -tor (0.134). POS is a confound but not the full explanation — different noun suffixes have different cohesion levels.
- [x] **P3.0c** POS-isolation test (noun-controlled null via WordNet, 24,547 nouns in GloVe top 100K) → **SURVIVES (p_noun < 0.001, 2.57× noun-null mean).** Ranking stable: -tion (0.330) > -ment (0.166) > -tor (0.102). Suffix signal beyond POS confirmed.
- [ ] **P3.1** Expand to -ble/-tor and 1 additional language (French -tion/-cion cognate)
- [ ] **P3.2** Generate word embeddings (fastText / mBERT) — mean vector per suffix group
- [ ] **P3.3** Full cluster analysis with POS controls
- [ ] **P3.4** Repeat across remaining languages — is the pattern stable?
- [ ] **P3.5** Silhouette score analysis
- [ ] **P3.6** Full statistical significance testing (permutation test with POS matching)
- [ ] **P3.7** Write paper + submit

### 1.3 [P5] Ha-Mim Code 19 — Monte Carlo Validation
*Target: Journal of Qur'anic Studies (short note)*
- [ ] **P5.1** Extract Ha/Mim frequencies from the 7 Ha-Mim Surahs (40–46)
- [ ] **P5.2** Compute digit-sum and check divisibility by 19
- [ ] **P5.3** Run 10M Monte Carlo simulations (random letters of same length)
- [ ] **P5.4** Compute p-value and apply Bonferroni correction
- [ ] **P5.5** Repeat on random control texts (same length distribution)
- [ ] **P5.6** Write short note (2–3 pages)
- [ ] **P5.7** Submit

### 1.4 [P4] Toponymic 80-10-10 GIS Rule
*Target: Journal of Historical Geography / PLOS ONE*
- [ ] **P4.1** Extract 500+ ancient toponyms with dates (Pleiades, DARMC, OSM historical)
- [ ] **P4.2** Build automated classifier: natural / military / religious / eponymous
- [ ] **P4.3** Test distribution difference before/after 333 BC (χ² test)
- [ ] **P4.4** Test the 80-10-10 distribution claim
- [ ] **P4.5** Write paper + submit

### 1.5 [P2] Self-Correcting Text — Base-3 Cartesian Mapping
*Target: Digital Scholarship in the Humanities*
- [ ] **P2.1** Build the 3×3×3 cube (27 positions = 27 letters)
- [ ] **P2.2** Map Hebrew + Arabic alphabets to cube coordinates
- [ ] **P2.3** Code mirror-symmetry algorithm
- [ ] **P2.4** Test: random character deletion, can algorithm recover?
- [ ] **P2.5** Compare with random baseline
- [ ] **P2.6** Test ELS (skip 49/50 equidistant letter sequences)
- [ ] **P2.7** Write paper + submit

---

## Phase 2: Medium-Priority Research (Q3-Q4 2026)

### 2.1 [R1] 18-Inch Biological Yardstick
- [ ] **R1.1** Collect spinal column measurements from NIH / Visible Human Project
- [ ] **R1.2** Descriptive statistics + t-test for sex differences
- [ ] **R1.3** Compare with historical yard (36 inches = ~2 spinal columns)
- [ ] **R1.4** Write short paper for *Journal of Anatomy* or *Nature* letter

### 2.2 [R2] Planetary Octaves Map
- [ ] **R2.1** Extract atomic numbers for elements 85–94
- [ ] **R2.2** Extract orbital periods for planets (NASA JPL)
- [ ] **R2.3** Compute correlation between atomic number and orbital period
- [ ] **R2.4** Random baseline: what are the odds of this alignment?
- [ ] **R2.5** Write paper for *Foundations of Chemistry*

### 2.3 [R3] Atomic Summation 22
- [ ] **R3.1** Compute H(1) + C(6) + N(7) + O(8) = 22
- [ ] **R3.2** Random selection test: how many random 4-element subsets sum to 22?
- [ ] **R3.3** Compare with 22 amino acids + 22 alphabet letters
- [ ] **R3.4** Write short paper for *Biology Letters* or *PLOS ONE*

### 2.4 [R4] 333 BC Naming Boundary — Toponymic Ego-Shift
- [ ] **R4.1** Build list of 200+ ancient cities with foundation dates
- [ ] **R4.2** Classify names as functional vs eponymous
- [ ] **R4.3** Test: do eponymous names appear only after 333 BC? (χ² test)
- [ ] **R4.4** Write paper for *Journal of Historical Geography*
- [ ] **R4.5** ⚠️ Warning: keep statistical, avoid conspiracy framing

### 2.5 [R5] Acoustic Onomatopoeia — Cross-Linguistic Phoneme Test
- [ ] **R5.1** Collect 50 onomatopoeic words (fire, water, wind, thunder) from 10 languages
- [ ] **R5.2** Spectrogram analysis
- [ ] **R5.3** Cross-linguistic similarity matrix
- [ ] **R5.4** Statistical test: is similarity greater than chance?
- [ ] **R5.5** Write paper for *Journal of Phonetics* or *Frontiers in Psychology*
- [ ] **R5.6** ⚠️ Warning: focus on acoustic physics, avoid "divine language" framing

### 2.6 Lām = Contraction (Statistical Verification)
- [ ] **L1** Define operational test: does Lām appear in words meaning "reduce/contract/bind" above chance?
- [ ] **L2** Extract Arabic lexicon subsample
- [ ] **L3** Compute Lām frequency in semantic field of contraction vs general lexicon
- [ ] **L4** Address Kuhn's objection (Lām = shepherd's staff = expansion)
- [ ] **L5** Write paper for *Journal of Phonetics*

---

## Phase 3: Visualizations (Q2, in parallel)

### 3.1 [V1] Ibdal Network Graph
- [x] **V1.1** Parse `ibdalRules.json` (75 rules) → **VERIFIED: 65.3%** (not 68%)
- [x] **V1.2** Build 28-node / 75-edge graph with D3 force-directed layout
- [x] **V1.3** Color by articulation point (makhraj) — 6 color-coded groups
- [x] **V1.4** Add interactivity (hover → rule details, drag, zoom/pan)
- [x] **V1.5** Add honest narrative: "~65.3% of substitutions between neighboring articulation points — descriptive pattern, not p-tested"
- [x] **V1.6** Deploy on app → **LIVE** at https://atum-app-dna.vercel.app/en/visualizations/ibdal

### ~~3.2 [V2] Abjad × Frequency Scatter Plot~~ ~~SKIPPED~~
- ~~V2.1–V2.6~~ **Abjad × Frequency COLLAPSED** (ρ=−0.5145, fails Bonferroni, not publishable)

### 3.3 [V3] 96-Etymology Bridge Map
- [ ] **V3.1** Load `etymology_bridge.csv` (96 etymologies)
- [ ] **V3.2** Build Sankey / Chord diagram (nodes = languages, edges = borrowings)
- [ ] **V3.3** Color by confidence level (🔬🧩🔍❓)
- [ ] **V3.4** Add interactivity (hover → etymology detail)
- [ ] **V3.5** Add narrative: "96 bridges between Arabic and the world"
- [ ] **V3.6** Deploy on app

---

## Phase 4: PhD Applications (Q4 2026)

- [ ] **PhD.1** Prepare research proposal (CCM + Semantic Suffix as core)
- [ ] **PhD.2** Identify 5 target universities / supervisors
- [ ] **PhD.3** Write statement of purpose
- [ ] **PhD.4** Request recommendation letters
- [ ] **PhD.5** Submit applications (deadline varies by country)

---

## Publication Timeline

| Paper | Target Journal | Target Date | Checklist Done | Status |
|-------|---------------|-------------|----------------|--------|
| CCM Algorithm (negative result) | *J. Quantitative Linguistics* | Q2 2026 | [ ] | 🔴 RETIRED — 39.7% on cognates |
| Ibdal as Encoding Dictionary | *Lang. Resources & Eval.* | Q3 2026 | [ ] | Still viable |
| Semantic Suffix Clustering | *COLING / ACL* | Q3 2026 | [ ] | Unaffected |
| Toponymic 80-10-10 Rule | *J. Historical Geography* | Q3 2026 | [ ] | Unaffected |
| Ha-Mim Code 19 | *J. Qur'anic Studies* | Q3 2026 | [ ] | Unaffected |
| Lām = Contraction | *J. Phonetics* | Q4 2026 | [ ] | Unaffected |
| ~~Abjad × Frequency~~ | ~~*Written Lang. & Literacy*~~ | ~~Q4 2026~~ | [ ] | 🔴 COLLAPSES — ρ=−0.5145, fails Bonferroni |
| Self-Correcting / Base-3 | *Digital Schol. Humanities* | Q4 2026 | [ ] | Unaffected |
| 333 BC Naming Boundary | *J. Historical Geography* | Q1 2027 | [ ] | Unaffected |
| Acoustic Onomatopoeia | *Frontiers in Psychology* | Q1 2027 | [ ] | Unaffected |

---

## Risk Watchlist

| Risk | Trigger | Action | Status |
|------|---------|--------|--------|
| Classifier accuracy < 80% | After 357-word audit | Downgrade to "exploratory taxonomy" | ⏳ Pending |
| r = −0.693 collapses | After real frequency recompute | Remove result from academic claims | 🔴 TRIGGERED — removed from publication track |
| CCM fails on cognates | After AR-HE test (65 Kitchen pairs) | Retire CCM, publish as negative result + Ibḍāl paper | 🔴 TRIGGERED — 39.7% vs 59.8% Lev, Δ=−20.1pp |
| Louvain fails to isolate 3 clusters | After suffix embedding | Present as "exploratory" transparently | ⏳ Pending |
| Journal rejection (CCM) | After first submission | Target JLL → PLOS ONE sequentially | 🔴 N/A — retired before submission |
| Academic/esoteric boundary breach | Any 🔍❓ claim in paper | Strip immediately, keep 🔬🧩 only | ⏳ Ongoing vigilance |
| Ha-Mim p-value not significant | After Monte Carlo | Publish as negative result / methodological note | ⏳ Pending |

---

## Results Summary (as of 2026-06-11)

### 🔴 CCM RETIRED (commit `e437482`)
- **Test:** 65 expert Arabic-Hebrew cognate pairs (Kitchen et al. 2009)
- **CCM 9-class match rate:** 39.7% (G1–G9 encoding of IPA consonant skeletons)
- **Levenshtein on same input:** 59.8%
- **Δ:** −20.1 percentage points
- **Verdict:** Pre-registered rule fired — CCM < Levenshtein → **RETIRED AS SIMILARITY METHOD**
- **Files:** `scripts/ccm/ccm_kitchen_verdict.py`, `data/sources/phd-mining/ccm-verdict-kitchen.txt`
- **Note:** Can still serve as weak filter in wider pipeline; Ibḍāl encoding paper still viable

### 🔴 ABJAD × FREQUENCY COLLAPSES
- **Corpus:** Leipzig ara_wikipedia_2021_100K (100K sentences, 7.58M Arabic letters)
- **Spearman ρ:** −0.5145 (moderate negative, |ρ| ≥ 0.5 ✓)
- **Bonferroni-corrected α:** 0.00333 → **p = 0.00509 > α ✗** — fails strictest test
- **LOO min |ρ|:** 0.4585 (below 0.5 — removing Alef collapses it)
- **Within abjad < 100 (18 letters, 77.7% of frequency):** ρ = −0.0939, p = 0.71 — **no correlation**
- **Verdict:** COLLAPSES — removed from academic publication track
- **Files:** `scripts/abjad/abjad_freq_verdict.py`, `data/sources/phd-mining/abjad_verdict.txt`

### 🔴 LLM-PROXY AUDIT — FUZZY (commit pending)

**The project's OWN documented sound-pattern criteria cannot reproduce the AI classifier's picks.**

- **Sample:** 357 words, stratified by ROOT × confidence tier (proportional allocation)
- **Raters:** 3 deterministic raters based on rootPatterns.json sound-pattern criteria
  - Rater A: first-letter match only
  - Rater B: any-letter match
  - Rater C: weighted (first letter ×4, others ×1, NONE threshold)
- **Fleiss Kappa:** 0.5264 — **<0.60 → FUZZY** (categories downgraded to "exploratory grouping")
- **Accuracy vs classifier (rater-majority):** 28.6% — **<70% → root claims become 'exploratory'**
- **No tier ≥85%** → all confidence tiers downgraded
- **⚠️ EXPLORATORY PROXY:** Only negative result is decision-grade. Positive result would risk circularity.
- **Files:** `scripts/audit/` — `prepare_sample.py`, `run_raters.py`, `compute_verdict.py`, `audit_blind.json`, `audit_key.json`

### Viable Papers (unaffected by these results)
- Ibḍāl as Encoding Dictionary
- Semantic Suffix Clustering
- Toponymic 80-10-10 Rule
- Ha-Mim Code 19 (Monte Carlo)
- Lām = Contraction
- Self-Correcting / Base-3 Cartesian
- 333 BC Naming Boundary
- Acoustic Onomatopoeia

---

## Quick-Start: Next Steps

- [x] **Done:** CCM classes + AR-HE test (P1.1–P1.5) → RETIRED
- [x] **Done:** Abjad × Frequency real corpus gate (0.1.6–0.1.8) → COLLAPSED
- [x] **Done:** Repo structure — `scripts/ccm/`, `scripts/abjad/`, `scripts/audit/`, `data/sources/phd-mining/`
- [x] **Done:** V1 Ibdal Network Graph — **LIVE at /visualizations/ibdal**
- [x] **Done:** LLM-proxy audit (0.1.8b) — **FUZZY (κ=0.526), EXPLORATORY (28.6%)**
- [x] **Done:** Suffix pilot (P3.0) — **SIGNAL (p<0.001, -tion 2.07× null)**
- [x] **Done:** POS-isolation (P3.0c) — **SURVIVES (p_noun<0.001, 2.57× noun-null). Ranking: -tion > -ment > -tor stable**
- [ ] **Next:** Expand suffix to -ble/-tor + French (P3.1)
- [ ] **Next:** Ha-Mim Monte Carlo (P5.1–P5.4)
- [ ] **Next:** Toponymic 80-10-10 Rule (P4.1–P4.4)

---

*Checklist generated 2026-06-11 from RESEARCH-ROADMAP.md (التحديث الثالث)*
