---

## last_updated: 2026-06-12

owner: MautasseM
scope: memory

# MEMORY.md — Decisions & State

> Historical decisions + where the last session ended. Update at end of each session.
> This replaces scattered STATUS / MASTER_PLAN / TASK_BOARD files — single source of truth.

## Where we are (2026-06-11)

- App live with 7 pages + deep word pages + 24 concepts shown with trust badges.
- Source extraction COMPLETE for research-relevant notebooks (15 of them).
- Deep mining done → `data/sources/phd-mining/RESEARCH-ROADMAP.md` (22 testable ideas ranked).
- 3 external PhD evaluations synthesized → `marketing/product/SYNTHESIS_phd.md`.
- Context-engineering system live (AGENTS.md + this file + CONTEXT.md + skills/).
- **Parallel run #1 returned (2026-06-11): CCM Phase 1–3 + MVP package both delivered and reviewed.** Details below.

## Key decisions (chronological, don't relitigate)

- Consolidated 3 old apps (source-of-all-language, sacred-word-flow, abjad) → one Next.js app `atum-app`.
- Tech: Next.js 14 + Tailwind + next-intl (ar/en/fr) + JSON data (no DB yet; Supabase/Convex later if needed).
- Deploy on Vercel (Hostinger needed paid Node, Netlify hit limits).
- Data: JSON files. etymologies.json ≈ 5,168 words. ibdalRules 75. letters 28. 3 roots.
- Excluded notebooks (out of scope): astronomy (baee1960), Pythagoras (7af5873a), animation (4379a172), astrology (f9cf5937).
- BULL Series (c1606170) = marketing content, not research.
- Excluded claims (never in thesis): flat earth, Allah=Baal, "English=angels", reversal rule, conspiracy framings — see RESEARCH-ROADMAP §0.
- **9 phonetic classes (G1–G9) are the CCM encoding.** Split the 5-makhraj system at articulatory boundaries: G1 Laryngeal · G2 Pharyngeal Fricative · G3 Palatal · G4 Uvular · G5 Dental Plosive · G6 Dental Fricative · G7 Sibilant · G8 Liquid · G9 Labial. Derived from all 75 ibdal rules. Committed 2b415d4 / 56d7469.
- **"CCM beats random" is NOT the claim.** With 9 classes the random baseline ≈ 1.2% (1/81), so 47–82% beats it trivially. Never cite p=0.0000 as evidence for the hypothesis. The real test is CCM vs Levenshtein — pending.
- **Loanwords ≠ cognates in the CCM dataset.** Hebrew expansion (Semitic cognates) = valid. Persian expansion (Arabic→Persian loanwords) = measures borrowing, not deep roots; it inflates the rate. Every bridge entry must be tagged before any pair-level claim stands.

## Strongest assets (defensible)

- r = −0.693 abjad × frequency (p<0.0001) — link to Shannon theory. 15/15 notebooks support, 0 contradict.
- Lām = contraction (z=4.92, p<0.0001). Only Kuhn dissents (weak source).
- 68% ibdal between articulatorily-adjacent sounds. Full consensus.
- CCM Algorithm (from Atomology v1) — original publishable methodology, now with first empirical numbers (Phase 1–3). Defensible ONLY after Levenshtein baseline + loanword/cognate tagging land. Until then: promising, not proven.

## CCM results so far (2026-06-11, PROVISIONAL — vs random only)


| Pair           | Observed | N   | Note                                            |
| -------------- | -------- | --- | ----------------------------------------------- |
| Arabic–Persian | 82.4%    | 17  | ⚠ loanwords — inflated, re-report after tagging |
| Arabic–Hebrew  | 52.6%    | 19  | cognates — sound                                |
| Arabic–Latin   | 51.9%    | 52  | bridge cognates                                 |
| Arabic–English | 47.7%    | 44  | English ≈ Greek = within noise                  |
| Arabic–Greek   | 47.2%    | 36  |                                                 |


- Predicted ordering Latin > English > Greek survived (51.9 ≥ 47.7 ≥ 47.2). English vs Greek gap (0.5% on N~40) is noise, not signal.
- All p=0.0000 vs random — trivial (see decision above). NOT a result yet.
- Bridge entries used by CCM ≈ 85 (subset of etymologies.json), not the full 5,168.

## MVP "Root Code Starter Pack" (2026-06-11, content-complete, UNSHIPPED)

- 20 words across 3 roots: ATUM 7 (atom, athena, alpha, mother, abyss, human, machine) / BULL 7 (europe, baal, vision, telephone, radio, wine, bull) / TOR 6 (caesar, paradise, isis, tour, tower, jordan).
- Files: root-code-playbook.md (529 lines) · masterclass-outline.md (5-seg, 60-min) · masterclass-script.md (full) · masterclass-landing-page.md (8 sections) · mvp-brief.md (funnel + projection).
- Blocker: not shipped. Single action = publish Carrd landing + ConvertKit capture → post r/etymology + 1 linguistics Discord.
- Keep 🔬/🧩 clean: 🧩 "aha" words OK in the FREE masterclass; the PAID playbook leans 🔬.

## Known risks (carry forward)

- Of 5,083 words, ~1 human-validated. MUST audit random n=357 before any quantitative claim.
- CNN 99.7% on 27 letters — needs baseline + cross-validation + held-out test (circular-reasoning risk).
- ROADMAP over-ambitious (10 papers). Start with ONE (CCM/Ibdal). Resist scatter.
- NotebookLM queries hit all sources collectively, not per-source — accept for now, re-query later.
- **CCM circular-reasoning trap:** Persian loanwords counted as evidence. Tag loanword vs cognate; cognate-only is the headline number.
- **CCM baseline gap:** "beats random" is meaningless at 9 classes. No publishable claim until CCM > Levenshtein is shown — or honestly reported if it isn't.

## Deferred (do NOT push prematurely)

- Book update (`arabic_linguistic_dna_book.md`) — wait until sources fully mined + reviewed.
- Kaggle dataset publish — repeatedly deferred.
- Domain purchase (Namecheap) — explicitly the LAST phase.
- Per-source NotebookLM re-query — precision pass, later.
- n8n automation — only when work repeats enough (daily skill sync, nightly memory rollup). For now Obsidian + Composer handle sync manually.
- MVP payment / PDF design / Gumroad — pending email list first (per mvp-brief.md).

## Where we left off / next (2026-06-11)

- Parallel run #1 reviewed and logged. Both streams advanced one full step.
- NEXT research step (Open Code) — close CCM Phase 3 properly:
(a) run the Levenshtein baseline already stubbed in baseline_ccm.py;
(b) tag every bridge entry loanword vs cognate, re-report Persian + overall cognate-only.
This is the real finish line for the CCM mini-project.
- NEXT product step (user, no agent): publish the Carrd landing page today; content is ready.
- Do NOT start a new ROADMAP idea until the CCM baseline lands. Finish one before scatter.

## CCM Phase 3 close-out (2026-06-11, commit d66447e)

- CCM beats Levenshtein on ALL 5 pairs: +7.6pp (Hebrew) … +24.9pp (Latin). First
NON-TRIVIAL signal — phonetic encoding captures structure raw edit distance misses.
- BUT cognate-only N collapsed: Latin=7 (5/7), English=6 (4/6), Greek=0, Persian=0,
Hebrew=19. "Latin>English>Greek on cognate-only" is NOT real (Greek empty; 5/7 vs 4/6
flips on one word). Small-N → report as fractions, never ranked percentages.
- OPEN CAVEAT: confirm Lev computed on SAME representation as CCM, not cross-script raw
(Persian Lev=63.2%, Hebrew=45% high due to script proximity). Same-rep rerun = Stage 2.

## New decision — external data enrichment (2026-06-11)

- Bottleneck is DATA, not method: Arabic↔Greek/Latin cognate evidence near-empty.
- Three open, citable sources adopted, staged:
  1. Etymological Wordnet (etymwn) — archive.org/details/etymwn-20130208 — auto-expand
    bridge entries + auto-tag loanword/cognate. STAGE 1 (now).
  2. ASJP — [asjp.clld.org](http://asjp.clld.org) / github.com/lexibank/asjp — common-transcription basic vocab;
    borrowing-resistant genetic test + fair CCM-vs-Lev. STAGE 2.
  3. Lexibank — github.com/lexibank — expert cognate benchmark. STAGE 3.
- PRE-COMMITMENT (integrity): Arabic (Semitic) vs Greek/Latin/English (Indo-European)
not mainstream-related at demonstrable depth. Likely honest finding: matches are
loanwords/Wanderwörter, not inherited cognates. Report whatever data shows. CCM as a
METHOD (beats Lev) stands regardless of deep-roots interpretation. Method ≠ claim.
- Anti-scatter: Stage 1 (etymwn) only; finish before Stage 2.

## CCM enrichment Stage 1 — NEGATIVE RESULT (2026-06-11, commit cda8204)

- Same-representation Levenshtein (the fair test) REVERSES the earlier win.
CCM wins only 2/5 (Latin +19.1pp, Persian +19.1pp), LOSES/ties on 3/5:
English N=690 −4.3pp (largest sample!), Greek N=102 −0.8pp, Hebrew N=68 −18.9pp.
- Weighted by N, naive baseline ties-or-beats CCM on ~88% of sampled data.
- The earlier d66447e "+7.6…+24.9 on all 5" was largely a CROSS-SCRIPT ARTIFACT. Retired.
- Diagnostic pattern: CCM wins on loanword-heavy pairs (Latin, Persian = phonetically
preserved), loses on genuinely-related Hebrew → 9-class abstraction too LOSSY for true
cognate detection. CCM detects BORROWING, not deep cognation — reverse of deep-roots need.
- etymwn FAILED as a tagger: all 812 entries tagged "borrowed"; cannot distinguish
cognate from loanword. Auto-tagging approach is dead. Greek cognates still 0, Latin 7.
- Deep-roots (Arabic→Greek/Latin) remains UNTESTED for lack of cognate data — not supported,
not disproven.

## Decisions (2026-06-11)

- NO MORE data-fishing. Pre-register one decision rule, run one clean test, then close CCM.
- Final CCM test = lexibank/kitchensemitic (Kitchen et al. 2009), expert Arabic-Hebrew
cognates. Rule: CCM ≥ same-rep Lev → narrowed method claim; CCM < Lev → retire CCM.
- Even a win here is Semitic-internal; does NOT revive the European-roots thesis.
- After closing CCM: pivot research program to abjad×frequency (r=−0.693) / Shannon line —
the project's actually-strongest, already-supported asset.

## Reprioritization after CCM retirement (2026-06-11)

- CCM retired (e437482). Lesson: a negative result can mean the QUESTION was wrong, not
the data. CCM was too lossy AND conflated borrowing with inheritance. Conductor's job =
reframing the question. Pre-registration gate is the tool that catches wrong questions early.
- New priority (CCM off critical path):
  1. Abjad × Frequency — PROMOTED to lead paper, CONDITIONAL on Phase-0 CODA recompute.
  2. Ibdal encoding + network (68% adjacency) — robust, data ready.
  3. Semantic Suffix Clustering — falsifiable; parallel (no dependence on 5,083 dataset).
  4. Pruvost lexical-borrowing statistics — documented, mainstream-safe.
- Speculative tier (Planetary Octaves, Atomic Summation 22, Ha-Mim 19, Yardstick,
Physiognomy) → BOOK / "later" (recurring-pattern + Bouba-Kiki system), NOT first wave.
- CCM → optional negative-result methods note (work already done).

## Pre-registered gate test — abjad × frequency (rule fixed 2026-06-11)

- Replace expert-estimated freqs with real CODA/TenTen counts.
- Primary = Spearman ρ (guards against high-value letters faking the pattern); also
Pearson raw + log10; robustness = leave-one-out + exclude high-value letters; Bonferroni.
- SURVIVES |ρ|≥0.5 & p<0.01 & LOO-stable → lead paper. COLLAPSES |ρ|<0.3 / n.s. / ≤2 letters
→ retire, pivot to Ibdal+Suffix+Pruvost. GRAY 0.3–0.5 stable → exploratory only.

## Abjad × Frequency — COLLAPSED (2026-06-11, commit 5efc3f0)

- Real corpus (Leipzig ara_wikipedia, 7.58M letters): Spearman ρ=−0.5145, p=0.0051,
FAILS Bonferroni (α=0.00333) → COLLAPSE per pre-registered rule.
- Within 18 common letters (abjad<100): ρ=−0.09 (zero). Entire effect = 10 rare
high-abjad letters (ث ذ ظ ض غ خ…) that are intrinsically rare consonants. Artifact of
abjad assignment, not a Shannon law. Original −0.693 (expert estimates) NOT reproduced.
- Removed from publication track.

## Strategic note — 3 kills share a shape

- CCM(sim), CCM(cognate), Abjad×Freq all = "found a number, tested vs chance" → fragile
(artifact / outliers / post-hoc selection). SURVIVORS have a MECHANISM (ibdal=articulation,
suffix=derivational semantics, Pruvost=documented contact). PRIORITIZE mechanism claims.
- Defensible pillars now: 68% ibdal adjacency (solid). Lām=contraction (provisional,
single-source, Kuhn dissent — needs own gate). Untested: suffix clustering (best positive
bet), Pruvost borrowings (safe, not novel).
- Ha-Mim Code 19 → BOOK/exploratory tier ONLY (highest post-hoc-selection risk). Not pub track.

## Next

- V1 Ibdal viz (frontend agent) + 357-word human audit (user-driven) in parallel.
- Then: Semantic Suffix Clustering as a cheap pre-registered PILOT (not full build).

## V1 Ibdal viz — DONE (commit d62234b)

- Self-recompute: 65.3% adjacency (not 68%), honest caption, deployed. First clean asset.

## Phase-0 audit DESIGN — question reframed (2026-06-11)

- Audit tests INTERNAL validity (do humans apply the project's OWN root rule consistently?)
  = Fleiss' Kappa. NOT etymological-descent (that question would nuke the data for a claim
  the project no longer makes). External contradictions logged as flags only.
- High Kappa = "categories well-defined & consistently applied," NOT "roots etymologically true."
- Auditor judgment per word (BLIND to classifier pick, other auditors, confidence tier):
  best_fit_root [ATUM/BULL/TOR/NONE/UNSURE] + strength 0-3 + basis [sound/meaning/both] +
  optional known_contradiction. NONE & UNSURE options are mandatory.
- Sample 357 stratified by ROOT × CONFIDENCE TIER (not blended) → accuracy PER TIER.
- Stat fix: 3 raters → Fleiss' Kappa (not Cohen's).
- PRE-REGISTERED RULE:
  · Fleiss κ ≥0.80 proceed; 0.60-0.80 proceed w/ caveat; <0.60 → categories fuzzy →
    whole dataset = "exploratory grouping," not "validated roots."
  · Classifier accuracy vs human consensus, per tier. Overall <70% → claims "exploratory";
    BUT any tier ≥85% stays "validated."
- Auditors: real (publication-grade) vs 3-LLM proxy (exploratory only). Recommend proxy
  first as cheap signal, then humans for the real gate.
- TODO: paste actual ATUM/BULL/TOR definitions into the auditor brief (from methodology).

## STANDING RULE (all agents, every step) — 2026-06-11

- Every agent task MUST end by updating [MASTER-CHECKLIST.md](http://MASTER-CHECKLIST.md): tick [x] done, record verdict,
  refresh a top "Progress Snapshot" (✅done/🟢live/💀dead/⏭️next + counts). No exceptions.
- Claude bakes this instruction into every future agent prompt.

## Phase-0 audit — proxy-first decision (2026-06-11)

- Lowest-effort path chosen: 3-LLM proxy audit BEFORE human recruitment. ~1 day, autonomous.
- Tests INTERNAL validity (category consistency), not etymological descent.
- EPISTEMIC CAVEAT: proxy gives a decision-grade NEGATIVE signal (LLMs disagree → categories
  fuzzy → stop). A POSITIVE signal is WEAK / possibly circular (auditor LLMs may share bias
  with the GPT classifier) → does NOT validate; only licenses investing in real human auditors.
- Pre-registered rule: Fleiss κ ≥0.80 → humans next; 0.60-0.80 caveat; <0.60 → dataset =
  "exploratory grouping." Overall acc <70% → claims exploratory; any tier ≥85% stays validated.
- Agent pulls real ATUM/BULL/TOR definitions itself; no manual step for user.

## Phase-0 proxy audit — RED/RED (2026-06-11, commit cd0ef53)

- Fleiss κ=0.53 (<0.60 FUZZY) AND overall accuracy 28.6% (<70% EXPLORATORY). Both branches fired.
- ROOT CAUSE: the 5,083-word DB was assigned by an external AI of UNKNOWN criteria; the
  documented rootPatterns.json cannot reproduce its picks. The root classification is a
  BLACK BOX, currently unjustifiable. 🔬-tier accuracy only 37.9% → confidence tiers don't
  track accuracy either.
- Proxy was 1 model family → positive would've been circular, but result is NEGATIVE =
  decision-grade. Human audit (0.1.3-0.1.5) now ESSENTIAL before ANY claim using the 5,083 DB.
- FROZEN until human audit: anything consuming the root classification (app root pages,
  book root chapters as "validated", etymology-bridge claims tied to roots).

## Status after 4 kills

- 💀 CCM(sim), CCM(cognate), Abjad×Freq, Root-classification validity (frozen pending humans).
- 🟢 Ibdal network 65.3% (independent of the black box).
- ⏭️ Untested & black-box-independent: Semantic Suffix Clustering (mechanism-based, best
  positive bet), Pruvost borrowings (documented, safe).
- Next: Suffix clustering CHEAP PILOT (1 lang, 1 suffix, pre-registered). Human root audit
  in parallel (user-driven).

## Suffix pilot — FIRST POSITIVE SIGNAL (2026-06-11, commit b4fea3b)

- -tion cohesion 0.245 vs null mean 0.118, 0/1000 null exceeded it, p<0.001, 2.07× null.
- Mechanism-class finding (suffix = derivational semantics) → trustworthy family, unlike
  the dead "number vs chance" findings. Independent of the frozen 5,083 black box.
- CAVEAT (agent-flagged): POS is a confound — noun suffixes vary (-tion>-ment>-tor), so not
  PURE POS, but the suffix effect is NOT yet isolated from "they're all nouns."
- Model: glove-wiki-gigaword-50.

## Next — isolate before expand

- Pre-registered: re-test -tion vs a NOUN-ONLY null. SURVIVES (p_noun<0.05) → real suffix
  signal → expand to -ble/-tor + French. COLLAPSES → POS artifact, shelve honestly.
- Do NOT expand to other suffixes/languages until the POS confound test passes.

## Balance shift

- 🟢 Ibdal 65.3% (descriptive) + Suffix signal (positive, pending POS isolation).
- 💀 CCM×2, Abjad×Freq, Root validity (frozen).
- First publishable-POSITIVE candidate in the project. Mechanism-class. Guard it with the
  same rigor that killed the others.

## Suffix signal — SURVIVES POS isolation (2026-06-11, commit 17f71dd)

- -tion vs NOUN-ONLY null: cohesion 0.330 vs 0.129, p_noun<0.001, 2.57×. Ranking
  -tion>-ment>-tor stable → suffix-specific semantics beyond POS. CONFIRMED positive.
- Limit: 1 language, 1 suffix, GloVe-50d. Not yet cross-linguistic.

## Next — expand with confound guards

- 2nd English suffix (-ble/-tor, POS-matched null) + French (-tion/-cion, French model).
- FLAG for French: shared-Latin-borrowing is an alt explanation to independent pattern.
- Verdict: ≥2 new tests pass → lead positive paper candidate. Only -tion → narrow claim.
  New suffixes fail → -tion was special, report limit.

## Suffix expansion — BROADENS (2026-06-12)

- **-tor** (noun-controlled, 137 words): cohesion=0.1056 vs noun-null 95th=0.0430, **p<0.001 SIGNAL**.
- **-ble** (adjective-controlled, 200 words): cohesion=0.2505 vs adj-null 95th=0.1053, **p<0.001 SIGNAL**.
- **French -tion/-cion** (ConceptNet Numberbatch, 214 words): cohesion=0.0849 vs Fr-null 95th=0.1001, **p=0.336 NO SIGNAL**.
- **BRANCH: BROADENS** (2/3 new tests pass). Full pre-registered verdict fired.
- English suffix-semantics generalization confirmed across 3 suffixes (-tion, -tor, -ble). Cross-linguistic generalization NOT confirmed (French no signal). Narrow claim: *English derivational suffixes form semantically coherent clusters; this is not a cross-linguistic law.*
- French confound: shared Latin borrowings with English — French -tion/-cion words are largely the same etymological stock, so high/default similarity is expected regardless.
- Model: glove-wiki-gigaword-50 (English), conceptnet-numberbatch-17-06-300 (French, streamed gzip).
- Commit: next commit.

## Surviving core (all independent of frozen root DB)

- 🟢 Suffix clustering (BROADENS, English 3 suffixes confirmed) · Ibdal 65.3% (descriptive, live) ·
  Pruvost borrowings (documented, unbuilt).
- 💀 CCM×2, Abjad×Freq · ✋ Root validity frozen pending human audit.

## Suffix expansion — BROADENS (English), French NEGATIVE (2026-06-11, commit 5a1acc1)

- -tor: 0.106 vs noun-null95 0.043, p<0.001 ✓ · -ble: 0.251 vs adj-null95 0.105, p<0.001 ✓

- French -tion/-cion: 0.085 vs Fr-null95 0.100, p=0.336 ✗ NO SIGNAL.

- READING: signal is a robust ENGLISH phenomenon across 3 suffixes; NOT cross-linguistic.

  French silence likely = borrowed/non-productive morphology. The cross-linguistic bridge

  is NOT built on borrowed suffixes — note for the big-thesis reframing later.

- Decision: STOP expanding (further languages = post-hoc fishing). Harvest the clean English

  claim now.

## Next

- Step 1 (agent): draft [paper-suffix-semantics.md](http://paper-suffix-semantics.md) — English-only claim, French reported as

  honest negative, bounded limitations. First POSITIVE publishable result in the project.

- Step 2 (user): human root audit (357) — still the frozen gate for everything root-based.

## Standing agreement (user, 2026-06-11)

- "Finish all tasks, THEN ask the questions with a data-scientist's eyes." Bonacci's

  cross-language word sets (Heb→Japanese/Latin/Greek) enter the LATER reframing session as

  HYPOTHESES to be tested (deep-cognate vs documented-borrowing), NOT as evidence. Eye-seen

  patterns are the family we've killed 4×; they get pre-registered tests, not a free pass.

