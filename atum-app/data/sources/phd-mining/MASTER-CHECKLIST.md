# MASTER CHECKLIST — ATUM Research Execution Plan

**Last updated:** 2026-06-11
**Source:** RESEARCH-ROADMAP.md (التحديث الثالث)
**Scope:** All publishable projects, visualizations, and data validation

---

## Phase 0: Foundation (Q2 2026)

### 0.1 Data Validation
- [ ] **0.1.1** Design stratified random sample of 357 words from 5,083 (by root)
- [ ] **0.1.2** Create audit form: `word | root_claimed | root_1 | root_2 | root_3 | consensus | confidence`
- [ ] **0.1.3** Recruit 3 independent auditors (Arabic native speakers + linguistics background)
- [ ] **0.1.4** Run audit — calculate Cohen's Kappa ≥ 0.80
- [ ] **0.1.5** Compute classifier accuracy vs human gold standard
- [x] **0.1.6** Extract actual letter frequencies from Leipzig ara_wikipedia_2021_100K (7.58M letters)
- [x] **0.1.7** Recompute r = −0.693 (Abjad × Frequency) on real frequencies → **COLLAPSES** (see Results below)
- [x] **0.1.8** Apply Bonferroni correction to all statistical tests
- [ ] **0.1.9** Write AI methodology section (models, sample size, accuracy, limitations)

### 0.2 Infrastructure
- [ ] **0.2.1** Set up project repo structure (`/ccm/`, `/suffix/`, `/toponymic/`, `/hamim/`, `/visuals/`)
- [ ] **0.2.2** Initialize Python venv + dependencies (numpy, scipy, pandas, sklearn, networkx)
- [ ] **0.2.3** Set up D3.js / Observable for visualizations
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
- [ ] **P3.1** Extract all words ending in -tion/-ble/-tor from 5 language dictionaries (EN, ES, IT, FR, PT)
- [ ] **P3.2** Generate Word Embeddings (fastText / mBERT) — mean vector per suffix group
- [ ] **P3.3** Cluster analysis: are suffix groups closer than random suffix groups?
- [ ] **P3.4** Repeat across 5 languages — is the pattern stable?
- [ ] **P3.5** Silhouette score analysis
- [ ] **P3.6** Statistical significance testing (permutation test)
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
- [ ] **V1.1** Parse `ibdalRules.json` (75 rules)
- [ ] **V1.2** Build 28-node / 75-edge graph
- [ ] **V1.3** Color by articulation point (makhraj)
- [ ] **V1.4** Add interactivity (hover → rule details)
- [ ] **V1.5** Add narrative: "68% of substitutions between adjacent articulation points"
- [ ] **V1.6** Deploy on app

### 3.2 [V2] Abjad × Frequency Scatter Plot
- [ ] **V2.1** Load `letters.json` (28 letters with abjad values)
- [ ] **V2.2** Merge with real frequency data (from 0.1.6)
- [ ] **V2.3** Scatter plot + regression line
- [ ] **V2.4** Color by articulation point
- [ ] **V2.5** Add narrative: "The holier the letter, the rarer — r = −0.693"
- [ ] **V2.6** Deploy on app

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

## Quick-Start: First 2 Weeks (what to do NOW)

- [x] **Done:** CCM classes + AR-HE test (P1.1–P1.5) → RETIRED, use for Ibḍāl encoding paper instead
- [x] **Done:** Abjad × Frequency real corpus gate (0.1.6–0.1.8) → COLLAPSED, removed from publish track
- [x] **Done:** Repo structure — `scripts/ccm/`, `scripts/abjad/`, `data/sources/phd-mining/`
- [ ] **Next:** Open Airtable/Google Sheets for 357-word audit form
- [ ] **Next:** V1 Ibdal Network Graph (basic layout)
- [ ] **Next:** Ha-Mim Monte Carlo (P5.1–P5.4)
- [ ] **Next:** Semantic Suffix Clustering (P3.1–P3.6)
- [ ] **Next:** Toponymic 80-10-10 Rule (P4.1–P4.4)

---

*Checklist generated 2026-06-11 from RESEARCH-ROADMAP.md (التحديث الثالث)*
