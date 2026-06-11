#!/usr/bin/env python3
"""
STEP 5-6: Compute Fleiss' Kappa + per-tier accuracy + apply pre-registered verdict.
"""
import json, os, sys
from collections import Counter
from itertools import combinations

BASE_DIR = os.path.dirname(__file__)
KEY_PATH = os.path.join(BASE_DIR, 'audit_key.json')

RATER_FILES = [
    os.path.join(BASE_DIR, 'rater_a.json'),
    os.path.join(BASE_DIR, 'rater_b.json'),
    os.path.join(BASE_DIR, 'rater_c.json'),
]
RATER_NAMES = ['rater_a (first-letter)', 'rater_b (any-letter)', 'rater_c (weighted)']

def fleiss_kappa(ratings):
    """
    Compute Fleiss' Kappa for multiple raters on nominal categories.
    ratings: list of lists, where ratings[i][j] = category assigned by rater j to item i
    Returns: (kappa, se)
    """
    N = len(ratings)          # number of subjects
    n_raters = len(ratings[0]) if ratings else 0
    if N == 0 or n_raters <= 1:
        return 0.0, 0.0

    # Get all categories
    cats = set()
    for row in ratings:
        for r in row:
            cats.add(r)
    cats = sorted(cats)
    k = len(cats)
    if k <= 1:
        return 1.0, 0.0  # perfect agreement (trivial)

    # Build agreement matrix
    # n_ij = number of raters who assigned category j to subject i
    n_ij = [[0] * k for _ in range(N)]
    for i, row in enumerate(ratings):
        for r in row:
            j = cats.index(r)
            n_ij[i][j] += 1

    # Pi_i: proportion of agreement for subject i
    pi_i = []
    for i in range(N):
        total = sum(n_ij[i])
        if total == 0:
            pi_i.append(0)
        else:
            agreement = sum(n_ij[i][j] * (n_ij[i][j] - 1) for j in range(k))
            pi_i.append(agreement / (total * (total - 1)) if total > 1 else 1.0)

    P_bar = sum(pi_i) / N  # mean agreement

    # p_j: proportion of all assignments to category j
    p_j = []
    total_assignments = N * n_raters
    for j in range(k):
        s = sum(n_ij[i][j] for i in range(N))
        p_j.append(s / total_assignments)

    P_e = sum(p ** 2 for p in p_j)  # expected agreement by chance

    if P_e >= 1.0:
        kappa = 1.0
    else:
        kappa = (P_bar - P_e) / (1 - P_e)

    # Standard error
    var_P_bar = (2 / (N * n_raters * (n_raters - 1))) * (
        (P_bar * (1 - P_bar)) / (1 - P_e) ** 2
    ) if abs(1 - P_e) > 1e-10 else 0
    se = var_P_bar ** 0.5 if var_P_bar > 0 else 0

    return kappa, se

def main():
    # Load ratings
    all_ratings = []
    for fname in RATER_FILES:
        with open(fname, 'r', encoding='utf-8') as f:
            all_ratings.append(json.load(f))

    with open(KEY_PATH, 'r', encoding='utf-8') as f:
        key = json.load(f)

    N = len(key)
    print("=" * 72)
    print("  PHASE 0 AUDIT — INTERNAL CONSISTENCY CHECK")
    print("  Pre-registered: Fleiss Kappa + per-tier accuracy")
    print("=" * 72)
    print()
    print(f"  Sample: {N} words")
    print(f"  Raters: {', '.join(RATER_NAMES)}")
    print(f"  Models: 3 deterministic raters (rootPatterns.json sound-pattern criteria)")
    print(f"  ⚠️  NEAR-CIRCULARITY: All 3 raters are from the SAME algorithm family.")
    print(f"     This tests the project's OWN classification criteria, NOT LLM reproducibility.")
    print(f"     Only a NEGATIVE result (low agreement) is decision-grade.")
    print()

    # Build ratings matrix (for Fleiss)
    ratings_matrix = []
    for i in range(N):
        row = []
        for r_idx, ratings in enumerate(all_ratings):
            root = ratings[i]['best_fit_root']
            row.append(root)
        ratings_matrix.append(row)

    # Fleiss Kappa
    kappa, se = fleiss_kappa(ratings_matrix)
    print(f"  FLEISS' KAPPA")
    print(f"    κ = {kappa:.4f}")
    if se > 0:
        print(f"    SE = {se:.4f}")
    print(f"    Interpret: ", end='')
    if kappa >= 0.80:
        print("≥0.80 → Categories SOLID")
    elif kappa >= 0.60:
        print("0.60-0.80 → Categories MARGINAL")
    else:
        print("<0.60 → Categories FUZZY")
    print()

    # Pairwise agreement
    print(f"  PAIRWISE AGREEMENT")
    for (i1, n1), (i2, n2) in combinations(enumerate(RATER_NAMES), 2):
        agree = sum(1 for i in range(N) if all_ratings[i1][i]['best_fit_root'] == all_ratings[i2][i]['best_fit_root'])
        pct = agree / N * 100
        print(f"    {n1} vs {n2}: {agree}/{N} = {pct:.1f}%")
    # All 3 agree
    all_agree = sum(1 for i in range(N) if len(set(ratings_matrix[i])) == 1)
    print(f"    All 3 agree: {all_agree}/{N} = {all_agree/N*100:.1f}%")
    print()

    # Classifier ground truth distribution
    key_roots = [k['classifier_root'] for k in key]
    kc = Counter(key_roots)
    print(f"  CLASSIFIER GROUND TRUTH")
    for r, c in sorted(kc.items()):
        print(f"    {r}: {c} ({c/N*100:.1f}%)")
    print(f"    NONE/UNSURE: 0 (classifier always assigns a root)")
    print()

    # Per-tier accuracy
    print(f"  ACCURACY vs CLASSIFIER (RATER-MAJORITY)")
    # Rater-majority: for each word, take the most common root across 3 raters
    rater_majority = []
    for i in range(N):
        roots = [all_ratings[r][i]['best_fit_root'] for r in range(3)]
        # Filter out NONE/UNSURE for majority
        valid = [r for r in roots if r not in ('NONE', 'UNSURE')]
        if valid:
            mc = Counter(valid).most_common(1)[0][0]
        else:
            mc = Counter(roots).most_common(1)[0][0] if roots else 'NONE'
        rater_majority.append(mc)

    # Overall
    overall_correct = sum(1 for i in range(N) if rater_majority[i] == key[i]['classifier_root'])
    print(f"    Overall: {overall_correct}/{N} = {overall_correct/N*100:.1f}%")
    print()

    # Per tier
    tiers = ['proven', 'strong', 'moderate']
    print(f"    {'Tier':<12} {'Correct':>8} {'Total':>6} {'Acc%':>6}")
    print(f"    {'-'*36}")
    for t in tiers:
        idxs = [i for i in range(N) if key[i]['tier'] == t]
        correct = sum(1 for i in idxs if rater_majority[i] == key[i]['classifier_root'])
        print(f"    {t:<12} {correct:>8} {len(idxs):>6} {correct/len(idxs)*100:>5.1f}%" if idxs else f"    {t:<12} {'N/A':>8} {'0':>6} {'N/A':>6}")

    # Overall accuracy for the pre-registered rule
    overall_acc = overall_correct / N * 100
    print()
    print(f"  PRE-REGISTERED VERDICT")
    print(f"  =====================")
    print(f"  Criteria:")
    print(f"    Fleiss Kappa ≥0.80 → categories solid, proceed to human audit")
    print(f"    0.60-0.80 → proceed with caveat")
    print(f"    <0.60 → categories FUZZY → downgrade to 'exploratory grouping'")
    print(f"    Overall accuracy <70% → root claims become 'exploratory'")
    print(f"    But ANY tier with ≥85% stays 'validated'")
    print()

    # Apply Kappa branch
    if kappa >= 0.80:
        kappa_branch = "SOLID"
        print(f"  Kappa branch: κ={kappa:.4f} ≥ 0.80 → SOLID (proceed to human audit)")
    elif kappa >= 0.60:
        kappa_branch = "MARGINAL"
        print(f"  Kappa branch: 0.60 ≤ κ={kappa:.4f} < 0.80 → MARGINAL (proceed with caveat)")
    else:
        kappa_branch = "FUZZY"
        print(f"  Kappa branch: κ={kappa:.4f} < 0.60 → FUZZY (downgrade to 'exploratory grouping')")

    # Apply accuracy branch
    if overall_acc < 70:
        acc_branch = "EXPLORATORY"
        print(f"  Accuracy branch: {overall_acc:.1f}% < 70% → root claims become 'exploratory'")
    else:
        acc_branch = "OK"
        print(f"  Accuracy branch: {overall_acc:.1f}% ≥ 70% → root claims survive this test")

    # Check per-tier exceptions
    print(f"  Per-tier exception check:")
    tier_exceptions = []
    for t in tiers:
        idxs = [i for i in range(N) if key[i]['tier'] == t]
        if idxs:
            correct = sum(1 for i in idxs if rater_majority[i] == key[i]['classifier_root'])
            tier_acc = correct / len(idxs) * 100
            if tier_acc >= 85:
                tier_exceptions.append(t)
                print(f"    {t}: {tier_acc:.1f}% ≥ 85% → stays 'validated'")
            else:
                print(f"    {t}: {tier_acc:.1f}% < 85% → downgraded")

    print()
    print(f"  FINAL VERDICT:")
    print(f"    Kappa: {kappa_branch}")
    print(f"    Accuracy: {acc_branch}")
    if tier_exceptions:
        print(f"    Tier exceptions: {', '.join(tier_exceptions)} stay validated")
    print()
    print(f"  ⚠️  EXPLORATORY PROXY — measures sound-pattern reproducibility of classifier")
    print(f"     picks, NOT human validation. A positive result does NOT validate the")
    print(f"     categories (possible shared-criteria circularity); only a negative result")
    print(f"     is decision-grade.")
    print(f"     Models: deterministic sound-pattern raters (rootPatterns.json rules)")
    print(f"     Not LLM-based: only one model family available, flagged near-circularity.")
    print()

    # Save verdict
    out_path = os.path.join(BASE_DIR, 'audit_verdict.txt')
    with open(out_path, 'w', encoding='utf-8') as f:
        # Re-route prints to file
        pass

if __name__ == '__main__':
    main()
