# English Derivational Suffixes Carry POS-Independent Semantic Cohesion

## A Distributional-Semantic Test of -tion, -tor, and -ble

**Draft — COLING/ACL Workshop target**

**Date:** 2026-06-12

---

### Abstract

Are English derivational suffixes mere grammatical markers, or do they carry independent semantic content? We test this by measuring the pairwise cosine similarity (cohesion) of words sharing the same suffix in the GloVe-50d embedding space. Across three suffixes (-tion, n=200; -tor, n=137; -ble, n=200), all show cohesion significantly exceeding part-of-speech-matched random baselines (p<0.001, 1000-iteration permutation tests). The effect is suffix-specific: -tion (0.330) outranks -ment (0.166) and -tor (0.106) within noun-only vocabulary. A cross-linguistic extension to French -tion/-cion finds no signal (cohesion 0.085 vs null 95th 0.100, p=0.336), likely reflecting the non-productive status of -tion in French. The pattern holds across three English derivational suffixes and survives POS controls, but does not generalize cross-linguistically within this test. We interpret the finding as evidence for suffix-level semantic clustering in English derivational morphology, bounded by morphological productivity. **(150 words)**

---

### 1. Background

Derivational morphemes sit at the boundary between syntax and lexicon. Traditional accounts treat derivational suffixes primarily as category-changing devices: -tion nominalizes verbs, -tor derives agentive nouns, -ble derives adjectives (Aronoff, 1976; Lieber, 2004). While individual suffixed words have idiosyncratic meanings (e.g., *dictator* is not simply "one who dictates"), the suffix itself is generally considered a grammatical operator rather than a semantic primitive.

Distributional semantics offers a quantitative window into this question. Word embeddings (Mikolov et al., 2013; Pennington et al., 2014) represent lexical semantics as dense vectors, and cosine similarity between word pairs reflects semantic relatedness. If suffixes carry systematic semantic content, words sharing the same suffix should cluster more tightly in embedding space than chance — even after controlling for part-of-speech.

Previous work has examined affix-level semantics via compositional approaches (Lazaridou et al., 2013; Marelli and Baroni, 2015) and morphological decomposition (Cotterell and Schütze, 2015; Vylomova et al., 2017). These studies typically model the affix as a vector transformation. Our question is simpler and more direct: do suffixed words occupy a non-random region of semantic space, relative to their POS class?

We focus on English because of its rich derivational morphology and availability of high-quality embeddings. We test two noun-forming suffixes (-tion, -tor) and one adjective-forming suffix (-ble), with French -tion/-cion as a cross-linguistic control. Our French test is explicitly exploratory: French -tion is a learned borrowing from Latin (*-tionem*) that is no longer fully productive in spoken French, whereas English -tion is fully productive (e.g., *Glockenspielify* → *Glockenspielification* is a transparent, if jocular, derivation). The English/French asymmetry provides a natural test of whether suffix-semantic clustering tracks morphological productivity.

---

### 2. Method

**2.1 Data and Embeddings**

All English tests use the 50-dimensional GloVe vectors trained on Wikipedia 2014 + Gigaword 5 (Pennington et al., 2014; `glove-wiki-gigaword-50` via Gensim, 400,000 word vocabulary). French tests use ConceptNet Numberbatch 17-06 (Speer et al., 2017), a 300-dimensional multilingual embedding dataset. French word vectors are extracted by reading the gzip file line-by-line and retaining keys matching the pattern `/c/fr/word` (296,986 French entries).

Word frequency is controlled by restricting to the first 50,000 entries of the GloVe vocabulary, which are sorted by descending frequency. The French frequency dimension cannot be controlled the same way (ConceptNet does not sort words by frequency), which we flag as a limitation.

**2.2 Word Lists**

Suffix words are filtered by part of speech using WordNet 3.0 (Miller, 1995):
- **-tion**: Words ending in *tion* that are present in the WordNet noun set (n=200, from top 400 candidates)
- **-tor**: Words ending in *tor* that are present in the WordNet noun set (n=137, from top 50K in vocabulary; all 146 available words that meet POS and length criteria, of which 137 survive all filters)
- **-ble**: Words ending in *ble* that are present in the WordNet adjective set (n=200, from top 50K)
- **-ment**: Words ending in *ment* that are present in the WordNet noun set (n=200, from the full 400K vocabulary — added to establish the within-noun ranking; POS-isolation test only)

French: French *-tion* and *-cion* words from ConceptNet Numberbatch (n=214 combined, from top 200 of each pattern, 3,861 available French candidates).

Filters: lowercase, length > 4 characters (except -tor: length > 4), no multiword entries, alphanumeric words only. Word lists are ordered by decreasing frequency (GloVe's native order) and truncated at the test size.

**2.3 Cohesion Metric**

Cohesion is the mean pairwise cosine similarity among a set of N word vectors. Given N unit-normalized vectors v₁, v₂, …, v_N:

```
cohesion = mean (v_i · v_j)  for all 1 ≤ i < j ≤ N
```

We compute this via the upper triangle of the dot-product matrix of the normalized vector array. For N=200, each cohesion value averages 19,900 pairwise similarities.

**2.4 Null Distribution and Significance**

For each suffix test, a null distribution of 1,000 cohesion values is generated:
1. Sample N random words from the POS-matched vocabulary (WordNet nouns for -tion/-tor/-ment, WordNet adjectives for -ble, all French words for French)
2. Exclude the suffix test words themselves
3. Compute cohesion of the random sample
4. Repeat 1,000 times

The null vocabulary is built from GloVe's top 100,000 entries matching the target POS class. For -tion and -tor, the null vocabulary contains 24,547 nouns. For -ble, it contains 9,662 adjectives. For French, the null vocabulary contains ~235,000 single-word lowercase French entries from ConceptNet.

The p-value is the proportion of null iterations with cohesion ≥ the observed suffix cohesion. Significance threshold: p < 0.05 (one-tailed, as we only test whether suffix cohesion exceeds chance).

A frequency-banded null is also computed for the -tion test (POS-isolation experiment), where random nouns are drawn from the same frequency band (indices 20,000–40,000) rather than the full top 100K, to verify the effect is not driven by frequency differences.

**2.5 Pre-registration**

All verdict criteria were fixed before observing results:
- **SIGNAL**: suffix cohesion > 95th percentile of matched null (p < 0.05)
- **SURVIVES**: -tion > 95th percentile of noun-only null → proceed to expansion
- **BROADENS**: ≥2 new suffix tests pass → suffix-semantic generalization supported
- **FAILS**: new suffixes within null range → -tion was an isolated case

---

### 3. Results

**3.1 Pilot and POS-Isolation (replication)**

The initial -tion test against a general-word null showed cohesion = 0.245 vs null mean 0.118, with none of 1,000 null iterations exceeding the observed value (p < 0.001, 2.07× baseline). This confirms that -tion words are substantially more similar to each other than random same-frequency words.

The POS-controlled (noun-only) null tightened the comparison: random nouns (n=200 per iteration, 24,547-noun pool) showed mean cohesion 0.129, 95th percentile 0.143, and maximum 0.158. The -tion cohesion (0.330) remains far above the noun-null 95th percentile (p < 0.001, 2.57× baseline). The signal survives POS control: suffix words are more similar to each other than expected for random words of the same part of speech.

Within the noun-only framework, three noun-forming suffixes form a stable ranking by cohesion:

| Suffix | Cohesion | N |
|--------|----------|---|
| -tion  | 0.330    | 200 |
| -ment  | 0.166    | 200 |
| -tor   | 0.106    | 200 (full vocab) / 0.106 (top 50K, n=137) |

This ranking is stable across different subsets of the vocabulary: -tion > -ment > -tor regardless of whether -tor is drawn from the full 400K vocabulary or the top 50K.

**3.2 Expansion to -tor and -ble**

Both additional English suffixes show significant cohesion against their POS-matched nulls:

| Suffix | POS | N | Cohesion | Null mean | Null 95th | Max | p |
|--------|-----|---|----------|-----------|-----------|-----|---|
| -tor   | noun | 137 | 0.106 | 0.033 | 0.043 | 0.053 | <0.001 |
| -ble   | adj  | 200 | 0.251 | 0.093 | 0.105 | 0.118 | <0.001 |

The -tor cohesion (0.106) exceeds the noun-null 95th percentile (0.043) by a factor of 2.5×; -ble (0.251) exceeds the adjective-null 95th (0.105) by 2.4×. Both are significant at p < 0.001 with 0 of 1,000 null iterations exceeding the observed value. The English suffix-semantic effect generalizes beyond -tion.

**3.3 French -tion/-cion (Cross-Linguistic Control)**

The French test shows no significant effect:

| Suffix | N | Cohesion | Null mean | Null 95th | Max | p |
|--------|---|----------|-----------|-----------|-----|---|
| -tion/-cion | 214 | 0.085 | 0.081 | 0.100 | 0.119 | 0.336 |

French cohesion (0.085) is below the null 95th percentile (0.100). The distribution overlaps nearly completely with the French null. This is a clear negative result.

We interpret the English/French asymmetry as consistent with a productivity-based explanation. English -tion is fully productive (it applies freely to Latinate and novel verbal bases), whereas French -tion is largely a learned/borrowing suffix (non-productive in spoken registers). A productive derivational suffix may organize around a semantic prototype (e.g., -tion as "process/state"), while a non-productive suffix is frozen in individual lexicalizations. However, we cannot rule out language-specific embedding differences (GloVe vs ConceptNet, 50d vs 300d) as alternative explanations.

**3.4 Summary Table**

| Test | Architecture | Signal? | Effect size |
|------|-------------|---------|-------------|
| -tion vs general null | GloVe-50d | YES (p<0.001) | 2.07× null mean |
| -tion vs noun-only null | GloVe-50d | YES (p<0.001) | 2.57× noun-null mean |
| -tor vs noun-only null | GloVe-50d | YES (p<0.001) | 2.5× null 95th |
| -ble vs adj-only null | GloVe-50d | YES (p<0.001) | 2.4× null 95th |
| French -tion/-cion | ConceptNet 300d | NO (p=0.336) | 0.85× null 95th |

---

### 4. Discussion

We find that English derivational suffixes -tion, -tor, and -ble each form semantically coherent clusters in distributional space, with cohesion 2–3× above POS-matched baselines. The effect is suffix-specific: within the noun class, the ranking -tion > -ment > -tor is consistent across vocabulary subsets. This demonstrates that derivational suffixes carry measurable semantic content beyond their category-changing function.

The French negative result is equally informative. If the effect were a universal property of suffixes (or of the *-tion* form itself), French -tion/-cion would also show signal. The asymmetry suggests that morphological productivity is a precondition: English *-tion* is fully productive, French *-tion* is not. This aligns with accounts that productive morphology organizes category structure around semantic prototypes (Bybee, 1985; Hay and Baayen, 2005), while non-productive suffixes are lexically frozen.

**What this does NOT show:**

1. **Not cross-linguistic.** The French negative limits any universality claim. The effect is documented for English, not for morphology-in-general.
2. **Not diachronic.** We do not show that suffixes *cause* semantic organization, only that it correlates with suffix membership. Direction of causality is unknown.
3. **Not a deep-root or esoteric pattern.** The effect is consistent with known properties of derivational morphology and distributional semantics. There is no mystical or panchronic claim here.
4. **Not benchmark-beating.** Cohesion values remain modest in absolute terms (0.1–0.3 on a [-1, 1] scale). The signal is statistical, not categorical.

**Relationship to broader questions.** This finding is compatible with the hypothesis that derivational morphology tracks category structure in predictable ways. It does not support strong claims about *a priori* semantic primes, "frozen phonosemantic laws," or any trans-linguistic archetype.

---

### 5. Limitations

1. **Single embedding model.** All English results use GloVe-50d. Results may differ with contextual embeddings (BERT, ELMo) or higher-dimensional static embeddings.
2. **Single language (English).** The effect is confirmed for English only. The French negative is informative but uses a different embedding model (300d ConceptNet vs 50d GloVe), confounding the language comparison with a model change.
3. **Frequency matching.** The -tor and -ble null distributions sample uniformly from the POS-matched top 100K vocabulary, not from a tight frequency band. Because suffix words tend to be high-frequency, the null may include rarer (more diverse) words, potentially inflating the effect. The -tion POS-isolation test addresses this with a frequency-banded null and survives; -tor and -ble should be tested with frequency-banded nulls in future work.
4. **No causal or diachronic story.** We measure correlation, not causation. The suffix-specific cohesion could reflect shared bases (e.g., many -tion words derive from Latinate -ate verbs), shared register (Latinate vocabulary clusters stylistically), or semantic inheritance, rather than suffix *contribution*.
5. **French embedding difference.** ConceptNet Numberbatch uses a different training regime, dimensionality (300 vs 50), and vocabulary than GloVe. The negative French result could partly reflect these methodological differences rather than a true linguistic asymmetry.
6. **WordNet coverage.** WordNet does not exhaustively tag all English words for POS. Some -tor words (e.g., technical terms) may be absent from WordNet even if they function as nouns in text, reducing the -tor count from ~146 candidates to 137 usable words.
7. **Suffix count imbalance.** -tor is tested with 137 words vs 200 for -tion and -ble. The -tor cohesion estimate is based on fewer pairwise comparisons (9,316 vs 19,900), making it noisier.

---

### Acknowledgments and Data

All experiments are scripted in Python using Gensim, NLTK/WordNet, and NumPy. Full replication scripts at `scripts/suffix/` in the project repository.

- GloVe-6B-50d: https://nlp.stanford.edu/projects/glove/
- ConceptNet Numberbatch: https://github.com/commonsense/conceptnet-numberbatch
- WordNet 3.0: https://wordnet.princeton.edu/
- Replication: `scripts/suffix/suffix_expand.py`, `suffix_pilot.py`, `suffix_pos_isolate.py`

---

### Figure Stubs

**Figure 1.** Cohesion comparison for three English suffixes against POS-matched null distributions. Bar chart showing -tion (0.330), -tor (0.106), -ble (0.251) against their respective null 95th percentiles. Error bars not applicable (single observed value per test). Caption: *Mean pairwise cosine similarity (cohesion) for suffix word groups vs. 95th percentile of 1,000 POS-matched random word groups. All three English suffixes exceed chance at p < 0.001.*

**Figure 2.** French -tion/-cion null distribution histogram with observed cohesion (0.085) as vertical line. Caption: *French -tion/-cion cohesion falls within the null range (p = 0.336). The dashed vertical line marks the observed value; shading indicates the 95th percentile.*

**Figure 3.** Within-noun suffix ranking: -tion, -ment, -tor cohesion values. Horizontal bar chart. Caption: *Three noun-forming suffixes ranked by cohesion. The ranking -tion (0.330) > -ment (0.166) > -tor (0.106) is stable across vocabulary subsets, confirming suffix-specific semantics beyond part-of-speech.*
