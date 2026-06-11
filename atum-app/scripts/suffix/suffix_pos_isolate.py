#!/usr/bin/env python3
"""
Suffix pilot — POS-controlled ISOLATION test.
Pre-registered (fixed before seeing results):
  SURVIVES:  -tion > 95th pct of NOUN-only null (p_noun < 0.05) -> proceed to expand
  COLLAPSES: -tion within noun-only null range -> POS artifact, shelve
"""
import json, os, sys, time, random
import numpy as np
import gensim.downloader as api
from nltk.corpus import wordnet as wn

BASE = os.path.dirname(__file__)
OUT = os.path.join(BASE, 'suffix_verdict.txt')
SEED = 20260612
random.seed(SEED); np.random.seed(SEED)

MODEL_NAME = 'glove-wiki-gigaword-50'
N_WORDS = 200
N_NULL = 1000

def cohesion(vecs):
    N = len(vecs)
    if N <= 1: return 0.0
    norms = np.linalg.norm(vecs, axis=1, keepdims=True)
    norms[norms == 0] = 1
    sims = (vecs / norms) @ (vecs / norms).T
    return float(np.mean(sims[np.triu_indices(N, k=1)]))

def main():
    print("=" * 72)
    print("  SUFFIX CLUSTERING — POS-CONTROLLED ISOLATION TEST")
    print("=" * 72)
    print()

    # Load model
    print("Loading model...")
    t0 = time.time()
    model = api.load(MODEL_NAME)
    print(f"  Model loaded in {time.time()-t0:.1f}s, vocab={len(model.index_to_key):,}")

    # Load WordNet nouns
    print("Loading WordNet noun set...")
    t0 = time.time()
    wn_nouns = set(wn.all_lemma_names('n'))
    print(f"  {len(wn_nouns):,} noun lemmas loaded in {time.time()-t0:.2f}s")

    # Build noun-only subset of GloVe vocabulary (first 100K most common)
    print("Building noun-only vocabulary from GloVe...")
    t0 = time.time()
    noun_vocab = []
    for w in model.index_to_key[:100000]:
        if w.islower() and len(w) > 2 and w in wn_nouns:
            noun_vocab.append(w)
    print(f"  {len(noun_vocab):,} nouns found in top 100K GloVe words ({time.time()-t0:.1f}s)")

    # -----
    # 1. Load -tion words (same 200 as original pilot)
    # -----
    print("\n1. -tion word group")
    all_tion = [w for w in model.index_to_key if w.endswith('tion') and w.islower() and len(w) > 4 and w in wn_nouns]
    random.shuffle(all_tion)
    # Take top 200 to match original (most common -tion words)
    all_tion.sort(key=lambda w: model.key_to_index[w])
    tion_words = all_tion[:N_WORDS]
    tvecs = np.array([model[w] for w in tion_words])
    tc = cohesion(tvecs)
    print(f"    -tion words: {len(tion_words)}")
    print(f"    -tion cohesion: {tc:.6f}")

    # -----
    # 2. NOUN-only null distribution
    # -----
    print(f"\n2. NOUN-only null ({N_NULL} iterations, noun-limited, frequency-banded)")

    # Determine freq band of -tion words
    k2i = model.key_to_index
    tion_indices = [k2i[w] for w in tion_words]
    avg_band = int(np.mean(tion_indices) / 20000) if tion_indices else 0
    print(f"    Avg -tion freq band: ~{avg_band*20000:,}-{(avg_band+1)*20000:,}")

    exclude = set(tion_words)
    null_cohesions = []

    for i in range(N_NULL):
        if i % 200 == 0:
            print(f"    Iteration {i}/{N_NULL}")

        # Sample from same freq band, noun-only
        band_start = avg_band * 20000
        band_end = min((avg_band + 1) * 20000, len(model.index_to_key))
        candidates = [w for w in model.index_to_key[band_start:band_end]
                     if w in wn_nouns and w not in exclude and w.islower() and len(w) > 2]
        if len(candidates) < N_WORDS:
            # Widen: use full noun vocab
            candidates = [w for w in noun_vocab if w not in exclude and w.islower() and len(w) > 2]
        if len(candidates) < N_WORDS:
            continue

        rwords = random.sample(candidates, N_WORDS)
        rvecs = np.array([model[w] for w in rwords])
        null_cohesions.append(cohesion(rvecs))

    null_arr = np.array(null_cohesions)
    null_mean = float(np.mean(null_arr))
    null_95pct = float(np.percentile(null_arr, 95))
    null_99pct = float(np.percentile(null_arr, 99))
    null_max = float(np.max(null_arr))
    null_std = float(np.std(null_arr))
    p_noun = float(np.mean(null_arr >= tc))

    print(f"\n3. Results")
    print(f"    -tion cohesion:      {tc:.6f}")
    print(f"    Noun-null mean:      {null_mean:.6f}")
    print(f"    Noun-null 95th pct:  {null_95pct:.6f}")
    print(f"    Noun-null 99th pct:  {null_99pct:.6f}")
    print(f"    Noun-null max:       {null_max:.6f}")
    print(f"    Noun-null std:       {null_std:.6f}")
    print(f"    p_noun:              {p_noun:.4f}")
    print(f"    Significant?         {'YES (p_noun < 0.05)' if p_noun < 0.05 else 'NO (p_noun >= 0.05)'}")

    # -----
    # 3. Within-noun suffix ranking
    # -----
    print(f"\n4. Suffix ranking (noun-only pipeline)")
    suffix_groups = {
        '-tion': [w for w in all_tion if w in wn_nouns],
        '-ment': [w for w in model.index_to_key if w.endswith('ment') and w.islower() and len(w) > 4 and w in wn_nouns],
        '-tor':  [w for w in model.index_to_key if w.endswith('tor') and w.islower() and len(w) > 3 and w in wn_nouns],
    }
    rankings = {}
    for suffix, words in suffix_groups.items():
        words.sort(key=lambda w: model.key_to_index[w])
        words = words[:N_WORDS]
        if len(words) >= N_WORDS:
            vecs = np.array([model[w] for w in words])
            c = cohesion(vecs)
            rankings[suffix] = c
            print(f"    {suffix:>6} (n={len(words)}): {c:.6f}")
        else:
            print(f"    {suffix:>6} (n={len(words)}: too few, skipping)")
            rankings[suffix] = None

    # Check ranking stability
    valid = {k: v for k, v in rankings.items() if v is not None}
    ranked = sorted(valid.items(), key=lambda x: -x[1])
    ranking_str = " > ".join([f"{s}={v:.4f}" for s, v in ranked])
    print(f"\n    Ranking: {ranking_str}")

    # -----
    # 5. Pre-registered verdict
    # -----
    print(f"\n5. VERDICT")
    if p_noun < 0.05:
        print(f"    BRANCH: SURVIVES (p_noun={p_noun:.4f} < 0.05)")
        print(f"    -tion cohesion ({tc:.6f}) > 95th pct of noun-null ({null_95pct:.6f})")
        print(f"    -> suffix carries a real semantic signal beyond POS")
        print(f"    -> proceed to expand (-ble/-tor + French)")
        branch = "SURVIVES"
    else:
        print(f"    BRANCH: COLLAPSES (p_noun={p_noun:.4f} >= 0.05)")
        print(f"    -tion cohesion ({tc:.6f}) within noun-only null range")
        print(f"    -> effect was POS all along")
        print(f"    -> report as POS artifact, shelve suffix-specific claim")
        branch = "COLLAPSES"

    print(f"\n    Embedding model: {MODEL_NAME}")
    print(f"    WordNet noun set: {len(wn_nouns):,} lemmas")
    print(f"    Noun vocab in GloVe top 100K: {len(noun_vocab):,}")
    print(f"    Date: 2026-06-12")
    print()

    # Save
    lines = [
        "=" * 72,
        "  SUFFIX CLUSTERING — POS-CONTROLLED ISOLATION TEST",
        "=" * 72,
        "",
        f"  Embedding model: {MODEL_NAME} (GloVe 50d, Wiki+Gigaword)",
        f"  POS resource: WordNet ({len(wn_nouns):,} noun lemmas)",
        f"  Noun vocab in GloVe top 100K: {len(noun_vocab):,}",
        f"  -tion words: {len(tion_words)} (noun-filtered)",
        f"  Null iterations: {len(null_cohesions)}",
        "",
        f"  -tion cohesion:         {tc:.6f}",
        f"  Noun-null mean:         {null_mean:.6f}",
        f"  Noun-null 95th pct:     {null_95pct:.6f}",
        f"  Noun-null 99th pct:     {null_99pct:.6f}",
        f"  Noun-null max:          {null_max:.6f}",
        f"  Noun-null std:          {null_std:.6f}",
        f"  p_noun:                 {p_noun:.4f}",
        f"  Significant:            {'YES (p_noun < 0.05)' if p_noun < 0.05 else 'NO (p_noun >= 0.05)'}",
        "",
        f"  Suffix ranking (within-noun pipeline): {ranking_str}",
        "",
        f"  BRANCH: {branch}",
        f"  Date: 2026-06-12",
    ]
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"  Saved: {OUT}")

if __name__ == '__main__':
    main()
