#!/usr/bin/env python3
"""
Suffix expansion: -ble (adjective-controlled) + -tor (noun-controlled) + French -tion/-cion.
Pre-registered verdict:
  BROADENS: >=2 new tests beat matched-null 95th pct -> suffix-semantics generalizes
  PARTIAL:  only -tion-class holds -> narrow claim
  FAILS:    new suffixes within matched-null range -> -tion was special
"""
import json, os, sys, time, random, gzip, pickle
import numpy as np
import gensim.downloader as api
from nltk.corpus import wordnet as wn

BASE = os.path.dirname(__file__)
OUT = os.path.join(BASE, 'suffix_verdict.txt')
SEED = 20260612
random.seed(SEED); np.random.seed(SEED)
EN_MODEL = 'glove-wiki-gigaword-50'
N_NULL = 1000
N_WORDS = 200
CONCEPTNET_CACHE = os.path.join(os.path.expanduser('~'), 'gensim-data',
    'conceptnet-numberbatch-17-06-300', 'fr_vectors.pkl')
CONCEPTNET_GZ = os.path.join(os.path.expanduser('~'), 'gensim-data',
    'conceptnet-numberbatch-17-06-300', 'conceptnet-numberbatch-17-06-300.gz')

def cohesion(vecs):
    N = len(vecs)
    if N <= 1: return 0.0
    norms = np.linalg.norm(vecs, axis=1, keepdims=True)
    norms[norms == 0] = 1
    sims = (vecs / norms) @ (vecs / norms).T
    return float(np.mean(sims[np.triu_indices(N, k=1)]))

def get_pos_words(model, suffix, wn_set, n=N_WORDS):
    words = [w for w in model.index_to_key[:50000]
             if w.endswith(suffix) and w.islower() and len(w) > 4 and w in wn_set]
    words.sort(key=lambda w: model.key_to_index[w])
    words = words[:n]
    if len(words) < n:
        print(f"    WARNING: only {len(words)} words for suffix '{suffix}' (need {n})")
    return words

def build_pos_vocab(model, wn_set, top_k=100000):
    vocab = []
    for w in model.index_to_key[:top_k]:
        if w.islower() and len(w) > 2 and w in wn_set:
            vocab.append(w)
    return vocab

def null_distribution(model, pos_vocab, exclude_set, n_words, n_iter=N_NULL):
    null_c = []
    for i in range(n_iter):
        if i % 200 == 0:
            print(f"      Null iteration {i}/{n_iter}")
        cand = [w for w in pos_vocab if w not in exclude_set]
        if len(cand) < n_words:
            continue
        rwords = random.sample(cand, n_words)
        rvecs = np.array([model[w] for w in rwords])
        null_c.append(cohesion(rvecs))
    return np.array(null_c)

def test_suffix(model, suffix, pos_name, pos_set):
    print(f"\n  --- {suffix} ({pos_name}) ---")
    words = get_pos_words(model, suffix, pos_set)
    if len(words) < 50:
        print(f"    TOO FEW WORDS ({len(words)}), skipping")
        return None, None, None, None, None

    vecs = np.array([model[w] for w in words])
    c = cohesion(vecs)
    print(f"    Found {len(words)} words, cohesion={c:.6f}")

    pos_vocab = build_pos_vocab(model, pos_set)
    print(f"    {pos_name} vocab in GloVe top 100K: {len(pos_vocab):,}")

    null_arr = null_distribution(model, pos_vocab, set(words), min(N_WORDS, len(words)))
    null_mean = float(np.mean(null_arr))
    null_95 = float(np.percentile(null_arr, 95))
    null_max = float(np.max(null_arr))
    p = float(np.mean(null_arr >= c))

    print(f"    Null mean={null_mean:.6f}, 95th={null_95:.6f}, max={null_max:.6f}")
    print(f"    p={p:.4f} {'SIGNAL' if p < 0.05 else 'NO SIGNAL'}")

    return c, null_arr, null_mean, null_95, p

def load_french_vectors():
    if os.path.exists(CONCEPTNET_CACHE):
        print(f"\nLoading cached French vectors from pickle...")
        t0 = time.time()
        with open(CONCEPTNET_CACHE, 'rb') as f:
            return pickle.load(f)
        print(f"  Loaded in {time.time()-t0:.1f}s")
    return None

def main():
    print("=" * 72)
    print("  SUFFIX EXPANSION -- English -ble/-tor + French -tion/-cion")
    print("=" * 72)
    print()

    # Load WordNet
    print("Loading WordNet...")
    t0 = time.time()
    wn_nouns = set(wn.all_lemma_names('n'))
    wn_adjs = set(wn.all_lemma_names('a'))
    wn_adjs.update(wn.all_lemma_names('s'))
    print(f"  {len(wn_nouns):,} nouns, {len(wn_adjs):,} adjectives loaded in {time.time()-t0:.1f}s")

    # Load English model
    print(f"\nLoading English model ({EN_MODEL})...")
    t0 = time.time()
    en_model = api.load(EN_MODEL)
    print(f"  Loaded in {time.time()-t0:.1f}s, vocab={len(en_model.index_to_key):,}")

    # ===========
    # ENGLISH SUFFIXES
    # ===========
    print("\n" + "=" * 72)
    print("ENGLISH SUFFIX TESTING")
    print("=" * 72)

    results = {}

    # -tion (noun-controlled, from previous test)
    print("\n--- -tion (noun) ---")
    tion_words = [w for w in en_model.index_to_key[:50000]
                  if w.endswith('tion') and w.islower() and len(w) > 4 and w in wn_nouns]
    tion_words.sort(key=lambda w: en_model.key_to_index[w])
    tion_words = tion_words[:N_WORDS]
    tvecs = np.array([en_model[w] for w in tion_words])
    tc = cohesion(tvecs)
    print(f"    Found {len(tion_words)} words, cohesion={tc:.6f}")

    noun_vocab = build_pos_vocab(en_model, wn_nouns)
    print(f"    Noun vocab: {len(noun_vocab):,}")
    null_noun = null_distribution(en_model, noun_vocab, set(tion_words), N_WORDS)
    null_n_mean = float(np.mean(null_noun))
    null_n_95 = float(np.percentile(null_noun, 95))
    null_n_max = float(np.max(null_noun))
    p_tion = float(np.mean(null_noun >= tc))
    results['-tion'] = {'cohesion': tc, 'null_95': null_n_95, 'p': p_tion, 'pos': 'noun'}
    print(f"    -tion cohesion={tc:.6f}, noun-null 95th={null_n_95:.6f}, p={p_tion:.4f}")

    # -tor (noun-controlled)
    tc_tor, _, _, nt_95, p_tor = test_suffix(en_model, 'tor', 'noun', wn_nouns)
    if tc_tor is not None:
        results['-tor'] = {'cohesion': tc_tor, 'null_95': nt_95, 'p': p_tor, 'pos': 'noun'}

    # -ble (adjective-controlled)
    tc_ble, _, _, nb_95, p_ble = test_suffix(en_model, 'ble', 'adjective', wn_adjs)
    if tc_ble is not None:
        results['-ble'] = {'cohesion': tc_ble, 'null_95': nb_95, 'p': p_ble, 'pos': 'adjective'}

    # ===========
    # FRENCH
    # ===========
    print("\n" + "=" * 72)
    print("FRENCH -tion/-cion TEST")
    print("=" * 72)

    fr_model = load_french_vectors()
    if fr_model is None:
        print("\nBuilding French vectors from conceptnet gzip...")
        t0 = time.time()
        fr_model = {}
        with gzip.open(CONCEPTNET_GZ, 'rt', encoding='utf-8') as f:
            header = f.readline()
            for line in f:
                if line.startswith('/c/fr/'):
                    parts = line.strip().split(' ')
                    word = parts[0]
                    vec = np.array([float(x) for x in parts[1:]])
                    fr_model[word] = vec
        print(f"  Loaded {len(fr_model):,} French vectors in {time.time()-t0:.1f}s")

    def fr_strip(w):
        return w.split('/')[-1]

    fr_raw = {w: fr_strip(w) for w in fr_model if '_' not in fr_strip(w)
              and fr_strip(w).islower() and len(fr_strip(w)) > 2}
    print(f"  French single lowercase words: {len(fr_raw):,}")

    fr_tion = [w for w, word in fr_raw.items()
               if word.endswith('tion') and len(word) > 5]
    fr_tion.sort(key=lambda w: list(fr_model.keys()).index(w))
    fr_tion = fr_tion[:N_WORDS]
    print(f"  French -tion words: {len(fr_tion)}")

    fr_cion = [w for w, word in fr_raw.items()
               if word.endswith('cion') and len(word) > 5]
    fr_cion.sort(key=lambda w: list(fr_model.keys()).index(w))
    fr_cion = fr_cion[:N_WORDS]
    print(f"  French -cion words: {len(fr_cion)}")

    fr_suffix = fr_tion + fr_cion
    if len(fr_suffix) < 50:
        print(f"    TOO FEW French suffix words ({len(fr_suffix)}), skipping")
        fr_passed = False
    else:
        fr_vecs = np.array([fr_model[w] for w in fr_suffix])
        fr_c = cohesion(fr_vecs)
        print(f"    French -tion/-cion cohesion: {fr_c:.6f} (n={len(fr_suffix)})")

        fr_exclude = set(fr_suffix)
        fr_null = []
        n_fr = min(N_WORDS, len(fr_suffix))
        fr_candidates = [w for w in fr_raw if w not in fr_exclude]
        print(f"    French null candidates: {len(fr_candidates):,}")

        for i in range(N_NULL):
            if i % 200 == 0:
                print(f"    French null iteration {i}/{N_NULL}")
            rwords = random.sample(fr_candidates, n_fr)
            rvecs = np.array([fr_model[w] for w in rwords])
            fr_null.append(cohesion(rvecs))

        fr_null_arr = np.array(fr_null)
        fr_null_mean = float(np.mean(fr_null_arr))
        fr_null_95 = float(np.percentile(fr_null_arr, 95))
        fr_null_max = float(np.max(fr_null_arr))
        p_fr = float(np.mean(fr_null_arr >= fr_c))

        print(f"    French null mean={fr_null_mean:.6f}, 95th={fr_null_95:.6f}, max={fr_null_max:.6f}")
        print(f"    p_fr={p_fr:.4f} {'SIGNAL' if p_fr < 0.05 else 'NO SIGNAL'}")
        results['French -tion/-cion'] = {'cohesion': fr_c, 'null_95': fr_null_95, 'p': p_fr, 'pos': '--'}
        fr_passed = p_fr < 0.05

    # ===========
    # VERDICT
    # ===========
    print("\n" + "=" * 72)
    print("VERDICT")
    print("=" * 72)

    total_new = 3
    passed = sum(1 for k, v in results.items() if k != '-tion' and v['p'] < 0.05)

    print(f"\n  Summary:")
    for name, r in results.items():
        sig = "SIGNAL" if r['p'] < 0.05 else "NO SIGNAL"
        print(f"    {name:25s} {sig:12s}  p={r['p']:.4f}  cohesion={r['cohesion']:.4f}  null-95th={r['null_95']:.4f}")

    print(f"\n  New tests beating null-95th: {passed}/{total_new}")

    if passed >= 2:
        branch = "BROADENS"
        print(f"\n  BRANCH: {branch} (>=2 new tests pass)")
    elif passed >= 1:
        branch = "PARTIAL"
        print(f"\n  BRANCH: {branch} (only -tion-class holds)")
    else:
        branch = "FAILS"
        print(f"\n  BRANCH: {branch} (new suffixes within matched-null range)")

    print(f"\n  French confound: French -tion/-cion words are shared Latin borrowings")
    print(f"  with English. High French cohesion may partly reflect shared etymology")
    print(f"  rather than an independent cross-linguistic phonological-semantic pattern.")
    print(f"  French model: conceptnet-numberbatch-17-06-300 (multilingual, ConceptNet)")
    print(f"  English model: {EN_MODEL}")
    print(f"  WordNet: {len(wn_nouns):,} nouns, {len(wn_adjs):,} adjectives")
    print(f"  Date: 2026-06-12")

    lines = [
        "=" * 72,
        "  SUFFIX EXPANSION -- English -ble/-tor + French -tion/-cion",
        "=" * 72,
        "",
        f"  English model: {EN_MODEL}",
        f"  French model: conceptnet-numberbatch-17-06-300 (ConceptNet multilingual)",
        f"  WordNet: {len(wn_nouns):,} nouns, {len(wn_adjs):,} adjectives",
        f"  Null iterations per test: {N_NULL}",
        "",
        "  Results:",
    ]
    for name, r in results.items():
        sig = "SIGNAL" if r['p'] < 0.05 else "NO SIGNAL"
        lines.append(f"    {name:25s} cohesion={r['cohesion']:.6f}  null-95th={r['null_95']:.6f}  p={r['p']:.4f}  {sig}")

    passed_str = f"{passed}/{total_new}"
    lines.append("")
    lines.append(f"  New tests beating null-95th: {passed_str}")
    lines.append(f"  BRANCH: {branch}")
    lines.append("")
    lines.append("  French confound: shared Latin borrowings with English.")
    lines.append("  French -tion/-cion cohesion may partly reflect shared etymology,")
    lines.append("  not necessarily an independent cross-linguistic pattern.")
    lines.append(f"  Date: 2026-06-12")

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"\n  Saved: {OUT}")

if __name__ == '__main__':
    main()
