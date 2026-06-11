#!/usr/bin/env python3
"""
STEP 2-3: Stratified sample 357 words from the 5,083-entry database.
Stratification: ROOT (ATOM/BULL/TOR) x CONFIDENCE TIER (proven/strong/moderate).
Outputs:
  - strata counts table (stdout)
  - audit_blind.json  (for raters — no classifier pick, no confidence tier)
  - audit_key.json    (ground truth for computing accuracy later)
"""
import json, random, sys, os
from collections import Counter

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'etymologies.json')
OUT_BLIND = os.path.join(os.path.dirname(__file__), 'audit_blind.json')
OUT_KEY   = os.path.join(os.path.dirname(__file__), 'audit_key.json')

TIER_CUTOFFS = [
    ('proven',    lambda c: c >= 0.9),
    ('strong',    lambda c: 0.7 <= c < 0.9),
    ('moderate',  lambda c: c < 0.7),
]

def assign_tier(conf):
    if isinstance(conf, str):
        try:
            conf = float(conf)
        except (ValueError, TypeError):
            return 'moderate'
    for name, fn in TIER_CUTOFFS:
        if fn(conf):
            return name
    return 'moderate'

def main():
    random.seed(20260611)
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    db = data['database']
    N = len(db)
    print(f"Total database entries: {N}\n")

    # Assign tiers
    for e in db:
        e['tier'] = assign_tier(e['confidence'])
        e['root_norm'] = e.get('root', 'UNKNOWN')

    # Count strata
    roots = sorted(set(e['root_norm'] for e in db))
    tiers = ['proven', 'strong', 'moderate']
    strata_counts = {}
    for r in roots:
        for t in tiers:
            strata_counts[(r, t)] = sum(1 for e in db if e['root_norm'] == r and e['tier'] == t)

    print("=== STRATA COUNTS (before sampling) ===")
    print(f"{'Root':<10} {'Proven':>8} {'Strong':>8} {'Moderate':>10} {'Total':>8}")
    print("-" * 48)
    tot_row = {t: 0 for t in tiers}
    for r in roots:
        row = [strata_counts.get((r, t), 0) for t in tiers]
        print(f"{r:<10} {row[0]:>8} {row[1]:>8} {row[2]:>10} {sum(row):>8}")
        for i, t in enumerate(tiers):
            tot_row[t] += row[i]
    print(f"{'TOTAL':<10} {tot_row[tiers[0]]:>8} {tot_row[tiers[1]]:>8} {tot_row[tiers[2]]:>10} {N:>8}")
    print()

    TARGET = 357
    # Proportional allocation
    strata_sample = {}
    total_assigned = 0
    print(f"Target sample: {TARGET}")
    print(f"Sampling rate: {TARGET/N:.4f}\n")

    # Compute allocation
    for (r, t), count in sorted(strata_counts.items()):
        if count == 0:
            strata_sample[(r, t)] = 0
            continue
        raw = count * TARGET / N
        floored = int(raw)
        strata_sample[(r, t)] = floored
        total_assigned += floored

    # Distribute remainder
    remainder = TARGET - total_assigned
    # Sort by fractional part descending
    fractions = []
    for (r, t), count in sorted(strata_counts.items()):
        if count == 0:
            continue
        raw = count * TARGET / N
        frac = raw - int(raw)
        fractions.append((frac, r, t))
    fractions.sort(key=lambda x: -x[0])
    for i in range(remainder):
        _, r, t = fractions[i]
        strata_sample[(r, t)] = strata_sample.get((r, t), 0) + 1

    print("=== ALLOCATION ===")
    print(f"{'Root':<10} {'Proven':>8} {'Strong':>8} {'Moderate':>10} {'Total':>8}")
    print("-" * 48)
    for r in roots:
        row = [strata_sample.get((r, t), 0) for t in tiers]
        print(f"{r:<10} {row[0]:>8} {row[1]:>8} {row[2]:>10} {sum(row):>8}")
    tot_sampled = sum(strata_sample.values())
    print(f"{'TOTAL':<10} {sum(strata_sample.get((r,'proven'),0) for r in roots):>8} "
          f"{sum(strata_sample.get((r,'strong'),0) for r in roots):>8} "
          f"{sum(strata_sample.get((r,'moderate'),0) for r in roots):>10} {tot_sampled:>8}")
    print()

    # Draw sample
    sampled = []
    for (r, t), n in sorted(strata_sample.items()):
        if n == 0:
            continue
        pool = [e for e in db if e['root_norm'] == r and e['tier'] == t]
        chosen = random.sample(pool, min(n, len(pool)))
        sampled.extend(chosen)

    random.shuffle(sampled)
    print(f"Actual sample size: {len(sampled)}")

    # Build blind entries (no classifier root, no confidence)
    blind = []
    for i, e in enumerate(sampled):
        # Language: extract from etymology or infer from word
        word = e.get('word', '')
        lang_hints = ['Arabic', 'Hebrew', 'Latin', 'Greek', 'English', 'French',
                      'Spanish', 'German', 'Persian', 'Turkish', 'Aramaic', 'Akkadian',
                      'Syriac', 'Amharic', 'Somali', 'Berber', 'Maltese', 'Armenian',
                      'Sanskrit', 'Hindi', 'Urdu', 'Swahili', 'Hausa', 'Indonesian']
        lang_detected = 'Unknown'
        etymology = e.get('etymology', '') or ''
        for h in lang_hints:
            if h.lower() in etymology.lower():
                lang_detected = h
                break
        if not etymology:
            lang_detected = word[:3].upper() if word else 'Unknown'

        blind.append({
            'id': i + 1,
            'word': word,
            'language': lang_detected,
            'meaning': etymology[:200] if etymology else word,
        })

    # Build key (ground truth)
    key = []
    for i, e in enumerate(sampled):
        key.append({
            'id': i + 1,
            'word': e.get('word', ''),
            'classifier_root': e['root_norm'],
            'confidence': e['confidence'],
            'tier': assign_tier(e['confidence']),
        })

    with open(OUT_BLIND, 'w', encoding='utf-8') as f:
        json.dump(blind, f, ensure_ascii=False, indent=2)
    print(f"Wrote {OUT_BLIND} ({len(blind)} entries, no classifier info)")

    with open(OUT_KEY, 'w', encoding='utf-8') as f:
        json.dump(key, f, ensure_ascii=False, indent=2)
    print(f"Wrote {OUT_KEY} ({len(key)} entries, classifier ground truth)")

if __name__ == '__main__':
    main()
