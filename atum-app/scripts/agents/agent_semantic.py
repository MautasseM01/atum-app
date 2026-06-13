#!/usr/bin/env python3
"""
Semantic Agent — Gloss/meaning analysis mapping word definitions
to ATUM / BULL / TOR semantic fields under strict constraints.

Uses the `meaning` field from audit_blind.json (raw etymological gloss).
Keyword-based scoring against each root's semantic domain.

Output: ATUM | BULL | TOR | NONE
"""
import json, os, re, sys

BASE_DIR = os.path.dirname(__file__)
AUDIT_DIR = os.path.join(BASE_DIR, '..', 'audit')

# ── semantic signatures ───────────────────────────────────────────────
# Each root defines keywords/phrases that signal its semantic field.
# These derive from Section 1 of new-q.md (Core Theoretical Framework).

ATUM_SIGNALS = {
    # Core concepts
    'unity', 'unify', 'unified', 'oneness', 'one', 'monad',
    'essence', 'essential', 'fundamental', 'basic',
    'existence', 'exist', 'being',
    'mother', 'womb', 'origin', 'source', 'beginning', 'genesis',
    'atomic', 'atom', 'indivisible', 'primal', 'primordial',
    'silent', 'pulse', 'pulsation',
    'creation', 'creative', 'create', 'birth', 'born',
    'nature', 'natural', 'native', 'nation', 'natal',
    'name', 'naming', 'nominate',
    'self', 'identity', 'soul', 'spirit', 'breath',
    # Common ATUM-pattern words in the dataset
    'mat', 'met', 'mot', 'mut', 'nat', 'nom', 'num',
}

BULL_SIGNALS = {
    # Core concepts
    'force', 'thrust', 'push', 'pull', 'pressure', 'power',
    'body', 'bodily', 'physical', 'flesh',
    'sphere', 'spherical', 'ball', 'globe', 'global', 'bulb',
    'contain', 'container', 'capacity', 'capable',
    'war', 'battle', 'fight', 'conflict', 'violence', 'aggression',
    'strength', 'strong', 'muscle',
    'stable', 'stability', 'stand', 'establish',
    'serve', 'service', 'slave', 'serf', 'servant',
    'bell', 'belli', 'belligerent', 'bel', 'bul',
    'build', 'building', 'edifice',
    'full', 'fill', 'plenty', 'abundant',
    # Common BULL-pattern words
    'able', 'ible', 'ble', 'bil', 'bul', 'bol', 'bal',
    'value', 'valuable', 'noble', 'notable',
}

TOR_SIGNALS = {
    # Core concepts
    'rotation', 'rotate', 'rotational', 'turn', 'turning',
    'time', 'temporal', 'chrono', 'cycle', 'cyclical',
    'space', 'spatial', 'dimension',
    'motion', 'movement', 'move', 'mobile',
    'direction', 'direct',
    'journey', 'travel', 'wander', 'circuit',
    'profession', 'profess', 'declare',
    'order', 'ordering', 'ordinate', 'arrange',
    'creation', 'creative',
    'torus', 'toroidal',
    'wheel', 'whirl', 'vortex', 'spin',
    'heat', 'warm', 'thermal', 'therm',
    'radiation', 'radiate', 'centrifugal',
    # Common TOR-pattern suffixes/words
    'tor', 'tur', 'tro', 'trop',
    'tion', 'sion', 'cion',
    'sor', 'zor', 'dor',
    # Story/narrative
    'narrate', 'narration', 'story', 'history',
    'operate', 'operator', 'action', 'actor',
}


def score_semantic(meaning):
    """Score a meaning string against each root's semantic field."""
    if not meaning:
        return {'ATUM': 0, 'BULL': 0, 'TOR': 0}

    text = meaning.lower()

    scores = {'ATUM': 0, 'BULL': 0, 'TOR': 0}

    for root, signals in [('ATUM', ATUM_SIGNALS),
                           ('BULL', BULL_SIGNALS),
                           ('TOR', TOR_SIGNALS)]:
        for kw in signals:
            # Count occurrences of keyword as whole word or prefix
            if re.search(r'\b' + re.escape(kw) + r'\w*\b', text):
                scores[root] += 1

    # Bonus: the meaning may contain explicit root references
    for r, refs in [('ATUM', ['ATOM', 'ATUM', 'ADAM']),
                     ('BULL', ['BULL', 'BELL', 'BAL']),
                     ('TOR', ['TOR', 'TUR'])]:
        for ref in refs:
            if re.search(r'\b' + ref + r'\b', text):
                scores[r] += 3  # explicit reference carries more weight

    return scores


# ── main agent function ───────────────────────────────────────────────
def classify(meaning):
    """
    Returns: ('ATUM'|'BULL'|'TOR'|'NONE', reason: str)
    """
    if not meaning:
        return ('NONE', 'no meaning available')

    scores = score_semantic(meaning)

    # Find root with highest score
    sorted_roots = sorted(scores.items(), key=lambda x: -x[1])

    top_root, top_score = sorted_roots[0]
    second_score = sorted_roots[1][1]

    if top_score == 0:
        return ('NONE', 'no semantic signals detected')
    if top_score == second_score:
        return ('NONE', f'tie between top roots ({top_score} each)')

    return (top_root,
            f'scores={scores} dominant={top_root}({top_score})')


# ── CLI ───────────────────────────────────────────────────────────────
def main():
    # Load meanings from audit_blind.json
    blind_path = os.path.join(AUDIT_DIR, 'audit_blind.json')
    with open(blind_path, 'r', encoding='utf-8') as f:
        blind_data = {w['id']: w for w in json.load(f)}

    # Load disputed words
    disputed_path = os.path.join(AUDIT_DIR,
                                 'multi_llm_combined_disagreement.json')
    with open(disputed_path, 'r', encoding='utf-8') as f:
        disputed = json.load(f)

    results = {}
    for w in disputed:
        wid = w['id']
        word = w['word']
        meaning = blind_data.get(wid, {}).get('meaning', '')
        root, reason = classify(meaning)
        results[wid] = {
            'word': word,
            'semantic_root': root,
            'semantic_reason': reason,
        }

    out_path = os.path.join(BASE_DIR, 'agent_semantic_output.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    counts = {'ATUM': 0, 'BULL': 0, 'TOR': 0, 'NONE': 0}
    for r in results.values():
        counts[r['semantic_root']] += 1
    print(f"Semantic Agent — results: {counts}")
    print(f"Saved to {out_path}")


if __name__ == '__main__':
    main()
