#!/usr/bin/env python3
"""
Semantic Suffix Clustering — CHEAP PILOT
Tests whether English words sharing the suffix "-tion" sit closer together
in semantic embedding space than random same-size word groups.

Pre-registered verdict (fixed before seeing results):
  SIGNAL:  -tion cohesion > 95th pct of null (p < 0.05) AND not trivially POS-driven
  NO SIGNAL: within null range -> shelve
"""
import json, os, sys, time, random
import numpy as np
from scipy.spatial.distance import pdist, squareform
import gensim.downloader as api

BASE = os.path.dirname(__file__)
OUT = os.path.join(BASE, 'suffix_verdict.txt')

MODEL_NAME = 'glove-wiki-gigaword-50'
N_SAMPLE = 200       # -tion words to sample
N_NULL = 1000        # null iterations
SEED = 20260612

def load_model():
    print(f"Loading {MODEL_NAME}...")
    t0 = time.time()
    model = api.load(MODEL_NAME)
    print(f"  Loaded in {time.time()-t0:.1f}s, vocab={len(model.index_to_key):,}")
    return model

def get_tion_words(model, n=N_SAMPLE):
    """Find common -tion words in the model vocabulary."""
    all_tion = [w for w in model.index_to_key if w.endswith('tion') and w.islower() and len(w) > 4]
    # Filter to likely frequency-ordered first N
    # model.index_to_key is frequency-ordered (most frequent first)
    # So the first ones in the list are most common
    print(f"  Found {len(all_tion)} -tion words in vocabulary")
    # Limit to a random ~200 from the most common ~400
    # (taking from the top to ensure they're recognizable common words)
    common = all_tion[:400]
    random.seed(SEED)
    chosen = random.sample(common, min(n, len(common)))
    print(f"  Sampled {len(chosen)} -tion words (from top {len(common)})")
    return chosen

def get_random_words(model, n, exclude_set=set(), freq_band=None, band_width=20000):
    """
    Get random words from the model vocabulary.
    If freq_band is given, sample from the same band.
    """
    # Partition vocabulary into bands of band_width
    if freq_band is not None:
        band_start = freq_band * band_width
        band_end = band_start + band_width
        candidates = [w for w in model.index_to_key[band_start:band_end]
                     if w not in exclude_set and w.islower() and len(w) > 2]
    else:
        candidates = [w for w in model.index_to_key if w not in exclude_set and w.islower() and len(w) > 2]
    
    if len(candidates) < n:
        return None
    return random.sample(candidates, n)

def cohesion(vectors):
    """Mean pairwise cosine similarity for a set of vectors."""
    N = len(vectors)
    if N <= 1:
        return 0.0
    # Normalize to unit vectors
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    norms[norms == 0] = 1
    normalized = vectors / norms
    # Pairwise cosine similarities
    sims = normalized @ normalized.T
    # Upper triangle (excluding diagonal)
    triu = np.triu_indices(N, k=1)
    return float(np.mean(sims[triu]))

def main():
    print("=" * 72)
    print("  SEMANTIC SUFFIX CLUSTERING — CHEAP PILOT")
    print("=" * 72)
    print()
    
    model = load_model()
    
    # ----
    # 1. Get -tion words and their embeddings
    # ----
    print("\n1. -tion words")
    tion_words = get_tion_words(model)
    tion_vecs = np.array([model[w] for w in tion_words])
    tion_cohesion = cohesion(tion_vecs)
    print(f"    -tion cohesion: {tion_cohesion:.6f}")
    
    # ----
    # 2. Null distribution: random words (frequency-matched)
    # ----
    print(f"\n2. Null distribution ({N_NULL} iterations, frequency-banded)")
    random.seed(SEED)
    np.random.seed(SEED)
    
    # Determine freq band of the -tion words
    # (average index in the vocabulary — lower = more frequent)
    k2i = model.key_to_index
    tion_indices = [k2i[w] for w in tion_words if w in k2i]
    avg_band = int(np.mean(tion_indices) / 20000) if tion_indices else 0
    print(f"    Average -tion word freq band: ~{avg_band * 20000:,}-{(avg_band+1) * 20000:,} in vocab")
    print(f"    (Lower index = more frequent; 0 is most frequent)")
    
    null_cohesions = []
    exclude = set(tion_words)
    band = avg_band
    
    for i in range(N_NULL):
        if i % 200 == 0:
            print(f"    Null iteration {i}/{N_NULL}")
        # Try same band, widen if needed
        rwords = None
        for b_attempt in range(5):
            trial_band = band + b_attempt * (-1 if b_attempt % 2 else 1)
            if trial_band < 0:
                continue
            end = min((trial_band + 1) * 20000, len(model.index_to_key))
            if end - trial_band * 20000 < N_SAMPLE * 2:
                continue
            rwords = get_random_words(model, len(tion_words), exclude_set=exclude, freq_band=trial_band)
            if rwords is not None:
                break
        if rwords is None:
            rwords = get_random_words(model, len(tion_words), exclude_set=exclude, freq_band=None)
        if rwords is None:
            continue
        
        rvecs = np.array([model[w] for w in rwords])
        c = cohesion(rvecs)
        null_cohesions.append(c)
    
    null_arr = np.array(null_cohesions)
    null_mean = float(np.mean(null_arr))
    null_95pct = float(np.percentile(null_arr, 95))
    null_99pct = float(np.percentile(null_arr, 99))
    null_max = float(np.max(null_arr))
    null_std = float(np.std(null_arr))
    
    # p-value
    p_val = float(np.mean(null_arr >= tion_cohesion))
    
    print(f"\n3. Results")
    print(f"    -tion cohesion:   {tion_cohesion:.6f}")
    print(f"    Null mean:        {null_mean:.6f}")
    print(f"    Null 95th pct:    {null_95pct:.6f}")
    print(f"    Null 99th pct:    {null_99pct:.6f}")
    print(f"    Null max:         {null_max:.6f}")
    print(f"    Null std:         {null_std:.6f}")
    print(f"    p-value:          {p_val:.4f}")
    print(f"    Significant?      {'YES (p < 0.05)' if p_val < 0.05 else 'NO (p >= 0.05)'}")
    
    # ----
    # 4. POS-confound check
    # ----
    # All -tion words are nouns. That's a confound. The question is whether
    # the cohesion is MORE than expected for random nouns.
    # Let's check: of the random null groups, how many are pure nouns?
    # We can't know from the embedding alone, but we can note the confound.
    
    pos_note = "CONFOUND: All -tion words are nouns. Random groups mix POS. If signal exists, part of it is just 'noun-ness'. Need -ment comparison to isolate the suffix effect."
    print(f"\n4. POS confound: {pos_note}")
    
    # ----
    # 5. Pre-registered verdict
    # ----
    print(f"\n5. VERDICT")
    if p_val < 0.05:
        print(f"    BRANCH: SIGNAL (p={p_val:.4f} < 0.05)")
        print(f"    -tion cohesion ({tion_cohesion:.6f}) > 95th pct ({null_95pct:.6f})")
        pos_gap = "POS-drive: plausible (all nouns). Expand to -ble/-tor to isolate suffix effect."
        print(f"    Caveat: {pos_gap}")
        branch = "SIGNAL (p < 0.05) — expand to -ble/-tor and 2nd language"
    else:
        print(f"    BRANCH: NO SIGNAL (p={p_val:.4f} >= 0.05)")
        print(f"    -tion cohesion ({tion_cohesion:.6f}) within null range")
        branch = "NO SIGNAL — shelve suffix clustering"
    
    print(f"\n    Embedding model: {MODEL_NAME}")
    print(f"    -tion words: {len(tion_words)}")
    print(f"    Null iterations: {len(null_cohesions)}")
    print()
    
    # Save
    lines = [
        "=" * 72,
        "  SEMANTIC SUFFIX CLUSTERING — CHEAP PILOT VERDICT",
        "=" * 72,
        "",
        f"  Embedding model: {MODEL_NAME} (50d, GloVe Wiki+Gigaword)",
        f"  -tion words sampled: {len(tion_words)}",
        f"  Null iterations: {len(null_cohesions)}",
        "",
        f"  -tion cohesion:    {tion_cohesion:.6f}",
        f"  Null mean:         {null_mean:.6f}",
        f"  Null 95th pct:     {null_95pct:.6f}",
        f"  Null 99th pct:     {null_99pct:.6f}",
        f"  Null max:          {null_max:.6f}",
        f"  Null std:          {null_std:.6f}",
        f"  Cohesion - Null:   {tion_cohesion - null_mean:+.6f}",
        f"  p-value:           {p_val:.4f}",
        f"  Significant:       {'YES (p < 0.05)' if p_val < 0.05 else 'NO (p >= 0.05)'}",
        "",
        f"  POS-confound: {pos_note}",
        "",
        f"  BRANCH: {branch}",
        "",
        f"  Date: 2026-06-12",
    ]
    
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"  Saved: {OUT}")

if __name__ == '__main__':
    main()
