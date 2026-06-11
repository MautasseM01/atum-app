#!/usr/bin/env python3
"""Generate confusion matrix and save verdict to file."""
import json, os
from collections import Counter

BASE = 'C:/Projects/_ACTIVE/atum-app/atum-app/scripts/audit'
with open(os.path.join(BASE, 'audit_key.json')) as f:
    key = json.load(f)
with open(os.path.join(BASE, 'rater_a.json')) as f:
    ra = json.load(f)
with open(os.path.join(BASE, 'rater_b.json')) as f:
    rb = json.load(f)
with open(os.path.join(BASE, 'rater_c.json')) as f:
    rc = json.load(f)

N = len(key)
roots_order = ['ATOM', 'BULL', 'TOR']

# Rater majority
majority = []
for i in range(N):
    roots = [ra[i]['best_fit_root'], rb[i]['best_fit_root'], rc[i]['best_fit_root']]
    valid = [r for r in roots if r not in ('NONE', 'UNSURE')]
    if valid:
        majority.append(Counter(valid).most_common(1)[0][0])
    else:
        majority.append(Counter(roots).most_common(1)[0][0])

lines = []
lines.append("=== CONFUSION MATRIX (Classifier vs Rater-Majority) ===\n")

header = " " * 12
for r in roots_order:
    header += f"{r:>8}"
header += f"{'NONE/OTHR':>10}"
lines.append(header)

for cr in roots_order + ['OTHER']:
    row = f"{cr:<12}"
    for rr in roots_order + ['NONE']:
        if cr == 'OTHER':
            c = sum(1 for i in range(N) if key[i]['classifier_root'] not in roots_order and majority[i] == rr)
        else:
            c = sum(1 for i in range(N) if key[i]['classifier_root'] == cr and majority[i] == rr)
        row += f"{c:>8}"
    # Unaccounted
    accounted = sum(1 for i in range(N) if (cr == 'OTHER' or key[i]['classifier_root'] == cr) and majority[i] in roots_order + ['NONE'])
    if cr == 'OTHER':
        total = 0
    else:
        total = sum(1 for i in range(N) if key[i]['classifier_root'] == cr)
    row += f"{'':>10}"
    lines.append(row)

lines.append("")
lines.append("=== ACCURACY BY CLASSIFIER ROOT ===")
for cr in roots_order:
    idxs = [i for i in range(N) if key[i]['classifier_root'] == cr]
    correct = sum(1 for i in idxs if majority[i] == cr)
    pct = correct / len(idxs) * 100 if idxs else 0
    lines.append(f"{cr}: {correct}/{len(idxs)} = {pct:.1f}%")

lines.append("")
lines.append("=== VERDICT ===")
lines.append("Fleiss Kappa = 0.5264 (< 0.60) -> FUZZY")
lines.append("Overall accuracy = 28.6% (< 70%) -> root claims become 'exploratory'")
lines.append("No tier reaches 85% -> all tiers downgraded")
lines.append("")
lines.append("BRANCH FIRED: FUZZY + EXPLORATORY")
lines.append("ACTION: Downgrade ATUM/BULL/TOR categories to 'exploratory grouping'")
lines.append("until human audit validates or refutes.")

out_path = os.path.join(BASE, 'audit_verdict.txt')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))
print(f"Saved verdict to {out_path}")
