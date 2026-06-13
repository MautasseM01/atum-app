#!/usr/bin/env python3
"""
Phonetic Agent — Consonant-skeleton analysis under Bonacci Section 2.2 prohibitions.

Strips vowels from each word, then checks whether the consonant skeleton
contains the radical pattern of ATUM, BULL, or TOR under strict constraints:
- Same articulation place
- No percussive ↔ continuous mixing
- Monosyllabic radical (≤3 consonants)
- ONE interchange degree max (no chains, reversals, anagrams)

Output: ATUM | BULL | TOR | NONE
"""
import json, os, re, sys

BASE_DIR = os.path.dirname(__file__)
AUDIT_DIR = os.path.join(BASE_DIR, '..', 'audit')

# ── consonant classification ──────────────────────────────────────────
# Articulation place
PLACE = {
    'B': 'bilabial', 'P': 'bilabial', 'M': 'bilabial',
    'F': 'labiodental', 'V': 'labiodental',
    'T': 'dental', 'D': 'dental',
    'S': 'alveolar', 'Z': 'alveolar', 'N': 'alveolar',
    'R': 'alveolar', 'L': 'alveolar',
    'K': 'velar', 'G': 'velar', 'Q': 'velar', 'C': 'velar',
    'H': 'glottal', 'Y': 'palatal', 'J': 'alveolar',
    'W': 'bilabial', 'X': 'velar',  # X = /ks/ cluster
}

# Manner: percussive (stop) vs continuous (all others)
MANNER = {
    'B': 'stop', 'P': 'stop', 'T': 'stop', 'D': 'stop',
    'K': 'stop', 'G': 'stop', 'C': 'stop', 'Q': 'stop',
    'F': 'fricative', 'V': 'fricative', 'S': 'fricative',
    'Z': 'fricative', 'H': 'fricative',
    'M': 'nasal', 'N': 'nasal',
    'R': 'liquid', 'L': 'liquid',
    'W': 'approximant', 'Y': 'approximant',
    'J': 'affricate',
}

# ── root definitions ──────────────────────────────────────────────────
# Each root defines its canonical consonant skeleton and the allowed
# substitutes for each consonant under the Section 2.2 constraints.
# Restrictive: T↔D, B↔P, F↔V, S↔Z, K↔G only (same place, same manner).

def allowed_substitutes(c):
    """Return set of consonants interchangeable with c under Section 2.2."""
    m = MANNER.get(c)
    p = PLACE.get(c)
    if not m or not p:
        return {c}
    subs = {c}
    for ch in PLACE:
        if PLACE[ch] == p and MANNER.get(ch) == m:
            subs.add(ch)
    # R and L: polarity resistance (Section 2.2) prohibits their swap
    if c in ('R', 'L'):
        subs.discard('R' if c == 'L' else 'L')
    return subs

ROOTS = {
    'ATUM': {
        'cons': ['T', 'M'],
        'mutations': [{'T', 'D'}, {'M'}],  # M has no valid substitute
    },
    'BULL': {
        'cons': ['B', 'L'],
        'mutations': [{'B', 'P'}, {'L'}],  # polarity blocks L↔R
    },
    'TOR': {
        'cons': ['T', 'R'],
        'mutations': [{'T', 'D'}, {'R'}],  # polarity blocks R↔L
    },
}
# Verify constraints
for root_name, spec in ROOTS.items():
    for i, c in enumerate(spec['cons']):
        spec['mutations'][i] = allowed_substitutes(c)

ROOT_NAMES = ['ATUM', 'BULL', 'TOR']


# ── helpers ───────────────────────────────────────────────────────────
VOWEL_RE = re.compile(r'[AEIOUY]', re.IGNORECASE)


def consonant_skeleton(word):
    """Return uppercase consonants only (vowels stripped)."""
    return VOWEL_RE.sub('', word.upper())


def find_root_pattern(skel, root_spec):
    """
    Check if `skel` contains the root's consonant pattern in order
    with at most 1 consonant substitution (within allowed mutations)
    and with ≤3 consonant span (monosyllabic radical limit).

    Returns (matched: bool, substitutions: int, positions: tuple).
    """
    cons = root_spec['cons']
    mutations = root_spec['mutations']
    n = len(cons)

    # Scan the skeleton for the pattern
    for i in range(len(skel)):
        # Try matching starting at position i
        substitutions = 0
        pos = []
        skel_idx = i
        for j in range(n):
            if skel_idx >= len(skel):
                break
            c_skel = skel[skel_idx]
            if c_skel in mutations[j]:
                pos.append(skel_idx)
                skel_idx += 1
            else:
                break
        else:
            # All root consonants matched
            span = pos[-1] - pos[0] + 1
            if span <= 3 and substitutions <= 1:
                return (True, substitutions, tuple(pos))

    return (False, 0, ())


# ── main agent function ───────────────────────────────────────────────
def classify(word):
    """
    Returns: ('ATUM'|'BULL'|'TOR'|'NONE', reason: str)
    """
    skel = consonant_skeleton(word)
    if not skel:
        return ('NONE', 'no consonants')

    matches = {}
    for root_name in ROOT_NAMES:
        found, subs, pos = find_root_pattern(skel, ROOTS[root_name])
        if found:
            matches[root_name] = (subs, pos)

    if not matches:
        return ('NONE', f'skeleton={skel} no root pattern found')

    if len(matches) > 1:
        return ('NONE',
                f'skeleton={skel} ambiguous ({" & ".join(matches.keys())})')

    root_name = list(matches.keys())[0]
    subs, pos = matches[root_name]
    return (root_name,
            f'skeleton={skel} matched {root_name} at positions {pos}')


# ── CLI ───────────────────────────────────────────────────────────────
def main():
    disputed_path = os.path.join(AUDIT_DIR,
                                 'multi_llm_combined_disagreement.json')
    with open(disputed_path, 'r', encoding='utf-8') as f:
        words = json.load(f)

    results = {}
    for w in words:
        wid = w['id']
        word = w['word']
        root, reason = classify(word)
        results[wid] = {
            'word': word,
            'phonetic_root': root,
            'phonetic_reason': reason,
        }

    out_path = os.path.join(BASE_DIR, 'agent_phonetic_output.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    # Summary
    counts = {'ATUM': 0, 'BULL': 0, 'TOR': 0, 'NONE': 0}
    for r in results.values():
        counts[r['phonetic_root']] += 1
    print(f"Phonetic Agent — results: {counts}")
    print(f"Saved to {out_path}")


if __name__ == '__main__':
    main()
