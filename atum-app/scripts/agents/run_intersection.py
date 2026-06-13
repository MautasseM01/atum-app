#!/usr/bin/env python3
"""
run_intersection.py — Master runner for the three-agent pipeline.

1. Runs all three agents (phonetic, semantic, etymological)
2. Applies intersection logic:
   - ≥2 agents agree → assign that root
   - Phonetic alone never assigns (needs ≥1 other agent)
   - NONE is a valid output
   - Multi-root allowed if two roots each get ≥2 support
3. Produces per-word table + summary statistics

Usage:
    python scripts/agents/run_intersection.py

Output:
    - scripts/agents/intersection_report.txt  (human-readable)
    - scripts/agents/intersection_results.json (machine-readable)
"""
import json, os, sys, time

BASE_DIR = os.path.dirname(__file__)
AUDIT_DIR = os.path.join(BASE_DIR, '..', 'audit')

ROOTS = ['ATUM', 'BULL', 'TOR']
ROOTS_DISPLAY = {'ATUM': 'ATUM', 'ATOM': 'ATUM'}  # normalize ATOM→ATUM


def load_agents():
    """Import and run the three agents, returning per-word dicts keyed by id."""
    from agent_phonetic import classify as phonetic_classify
    from agent_semantic import classify as semantic_classify
    from agent_etymological import classify as etymological_classify

    blind_path = os.path.join(AUDIT_DIR, 'audit_blind.json')
    with open(blind_path, 'r', encoding='utf-8') as f:
        blind_data = {w['id']: w for w in json.load(f)}

    disputed_path = os.path.join(AUDIT_DIR,
                                 'multi_llm_combined_disagreement.json')
    with open(disputed_path, 'r', encoding='utf-8') as f:
        disputed = json.load(f)

    phonetic = {}
    semantic = {}
    etymological = {}

    for w in disputed:
        wid = w['id']
        word = w['word']
        entry = blind_data.get(wid, {})

        # Phonetic
        p_root, p_reason = phonetic_classify(word)
        phonetic[wid] = {'root': p_root, 'reason': p_reason, 'word': word}

        # Semantic (needs meaning from blind_data)
        s_root, s_reason = semantic_classify(entry.get('meaning', ''))
        semantic[wid] = {'root': s_root, 'reason': s_reason, 'word': word}

        # Etymological
        e_root, e_reason = etymological_classify(
            entry.get('meaning', ''), entry.get('language', 'Unknown'))
        etymological[wid] = {'root': e_root, 'reason': e_reason, 'word': word}

    return disputed, phonetic, semantic, etymological


def intersection(phonetic_root, semantic_root, etymological_root):
    """
    Apply intersection logic.
    Returns (assigned_roots: list, vote_counts: dict, method: str).
    """
    votes = {'ATUM': 0, 'BULL': 0, 'TOR': 0}
    vote_source = {'ATUM': [], 'BULL': [], 'TOR': []}

    # Phonetic contributes ONLY if another agent also matches (rule: phonetic alone never assigns)
    # So we'll track it but only count if it has company

    agents = [
        ('phonetic', phonetic_root),
        ('semantic', semantic_root),
        ('etymological', etymological_root),
    ]

    for agent_name, root in agents:
        if root in votes:
            votes[root] += 1
            vote_source[root].append(agent_name)

    # Find roots with ≥2 votes
    assigned = []
    for root in ROOTS:
        if votes[root] >= 2:
            # Check: if all votes come from phonetic alone, reject
            vote_names = vote_source[root]
            if set(vote_names) == {'phonetic'}:
                continue  # phonetic alone never assigns
            assigned.append(root)

    if not assigned:
        return ([], dict(votes), 'NONE')

    return (assigned, dict(votes),
            'MULTI' if len(assigned) > 1 else f'{assigned[0]}')


def count_gold(disputed):
    """Count gold root distribution across disputed words."""
    counts = {'ATUM': 0, 'BULL': 0, 'TOR': 0, 'NONE': 0, 'ATOM': 0}
    for w in disputed:
        g = w['gold_root']
        counts[g] = counts.get(g, 0) + 1
    return counts


def format_table(results, disputed_lookup):
    """Format per-word results as a text table."""
    lines = []
    lines.append(f"{'ID':>4s} {'WORD':30s} {'PHON':6s} {'SEM':6s} "
                 f"{'ETYM':6s} {'INTERSECT':12s} {'GOLD':8s} {'TIER':10s}")
    lines.append('-' * 90)

    correct = 0
    total = 0

    for wid in sorted(results):
        r = results[wid]
        entry = disputed_lookup[int(wid)]
        gold = entry['gold_root']
        gold_tier = entry['gold_tier']
        gold_norm = ROOTS_DISPLAY.get(gold, gold)

        intersect_str = ', '.join(r['assigned']) if r['assigned'] else 'NONE'
        correct_flag = '*' if (intersect_str == gold_norm or
                               (intersect_str != 'NONE' and
                                intersect_str == gold_norm)) else ''
        if correct_flag == '*':
            correct += 1
        total += 1

        lines.append(
            f"{wid:>4d} {r['word'][:29]:30s} "
            f"{r['phonetic']:6s} {r['semantic']:6s} "
            f"{r['etymological']:6s} {intersect_str:12s} "
            f"{gold_norm:8s} {gold_tier:10s} {correct_flag}")

    lines.append('-' * 90)
    lines.append(f"Accuracy: {correct}/{total} = {correct/total:.1%} "
                 f"(intersection vs gold)")
    lines.append('')
    return '\n'.join(lines)


def main():
    print("=" * 64)
    print("THREE-AGENT INTERSECTION PIPELINE")
    print("=" * 64)

    # Load and run agents
    t0 = time.time()
    disputed, phonetic, semantic, etymological = load_agents()
    load_t = time.time() - t0
    print(f"Agents loaded/run in {load_t:.2f}s ({len(disputed)} words)")

    # Gold distribution
    gold_counts = count_gold(disputed)
    print(f"\nGold distribution: {gold_counts}")

    # Build lookup
    disputed_lookup = {w['id']: w for w in disputed}

    # Compute intersection for each word
    results = {}
    for wid in phonetic:
        p_root = phonetic[wid]['root']
        s_root = semantic[wid]['root']
        e_root = etymological[wid]['root']

        assigned, votes, method = intersection(p_root, s_root, e_root)
        results[wid] = {
            'word': phonetic[wid]['word'],
            'phonetic': p_root,
            'phonetic_reason': phonetic[wid]['reason'],
            'semantic': s_root,
            'semantic_reason': semantic[wid]['reason'],
            'etymological': e_root,
            'etymological_reason': etymological[wid]['reason'],
            'votes': votes,
            'assigned': assigned,
            'method': method,
        }

    # ── summary statistics ──────────────────────────────────────────
    assignment_counts = {'ATUM': 0, 'BULL': 0, 'TOR': 0, 'NONE': 0, 'MULTI': 0}
    for r in results.values():
        if not r['assigned']:
            assignment_counts['NONE'] += 1
        elif len(r['assigned']) > 1:
            assignment_counts['MULTI'] += 1
        else:
            assignment_counts[r['assigned'][0]] += 1

    print(f"\nAssignment distribution: {assignment_counts}")

    # Agreement depth (how many agents agreed)
    depth_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    for r in results.values():
        # Count how many agents gave non-NONE assignments for the same root
        agents = [r['phonetic'], r['semantic'], r['etymological']]
        non_none = sum(1 for a in agents if a != 'NONE')
        depth_counts[non_none] += 1
    print(f"\nAgent agreement depth (non-NONE): {depth_counts}")

    # Accuracy vs gold
    correct_atum = correct_bull = correct_tor = 0
    total_atum = total_bull = total_tor = 0
    for wid, r in results.items():
        wid_int = int(wid)
        gold = ROOTS_DISPLAY.get(disputed_lookup[wid_int]['gold_root'],
                                  disputed_lookup[wid_int]['gold_root'])
        assigned_str = ', '.join(r['assigned']) if r['assigned'] else 'NONE'
        if gold == 'ATUM':
            total_atum += 1
            if assigned_str == 'ATUM':
                correct_atum += 1
        elif gold == 'BULL':
            total_bull += 1
            if assigned_str == 'BULL':
                correct_bull += 1
        elif gold == 'TOR':
            total_tor += 1
            if assigned_str == 'TOR':
                correct_tor += 1

    acc_atum = correct_atum / total_atum if total_atum else 0
    acc_bull = correct_bull / total_bull if total_bull else 0
    acc_tor = correct_tor / total_tor if total_tor else 0
    acc_total = (correct_atum + correct_bull + correct_tor) / len(results)

    print(f"\n--- Per-Root Accuracy vs Gold ---")
    print(f"  ATUM: {correct_atum}/{total_atum} = {acc_atum:.1%}")
    print(f"  BULL: {correct_bull}/{total_bull} = {acc_bull:.1%}")
    print(f"  TOR:  {correct_tor}/{total_tor} = {acc_tor:.1%}")
    print(f"  ALL:  {correct_atum+correct_bull+correct_tor}/{len(results)} = {acc_total:.1%}")

    # ── write outputs ───────────────────────────────────────────────
    table = format_table(results, disputed_lookup)

    report_path = os.path.join(BASE_DIR, 'intersection_report.txt')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(table)
    print(f"\nReport saved to {report_path}")

    results_path = os.path.join(BASE_DIR, 'intersection_results.json')
    with open(results_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"Results saved to {results_path}")

    # Print first/last rows of table
    print("\n" + table[:1200] + "\n...\n" + table[-400:])


if __name__ == '__main__':
    main()
