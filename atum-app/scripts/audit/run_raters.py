#!/usr/bin/env python3
"""
STEP 4-5: Run 3 raters on the 357-word stratified sample.
Uses the project's documented sound-pattern criteria (rootPatterns.json).

Rater strategies:
  A (SoundMatch): Match first letter of word against root sound patterns
  B (FullScan):   Match ANY consonant in the word
  C (Weighted):   Weighted: consonant + semantic + NONE threshold

All raters are deterministic — based on rootPatterns.json, NOT the original AI classifier.
This tests INTERNAL consistency: do the OFFICIAL criteria reproduce classifier picks?

NEAR-CIRCULARITY FLAG: All 3 "raters" are from the same deterministic algorithm family.
This is a mechanical consistency check, NOT an LLM reproducibility study.
"""
import json, os, re, sys
from collections import Counter

BASE_DIR = os.path.dirname(__file__)
BLIND_PATH  = os.path.join(BASE_DIR, 'audit_blind.json')
KEY_PATH    = os.path.join(BASE_DIR, 'audit_key.json')
ROOT_PATTERNS_PATH = os.path.join(BASE_DIR, '..', '..', 'data', 'rootPatterns.json')

# Load root sound patterns
with open(ROOT_PATTERNS_PATH, 'r', encoding='utf-8') as f:
    rp = json.load(f)['roots']

# Build sound→root maps
# European sounds
EURO_SOUNDS = {}
for root_name, root_data in rp.items():
    for s in root_data['europeanSounds']:
        sl = s.lower()
        if sl not in EURO_SOUNDS:
            EURO_SOUNDS[sl] = []
        EURO_SOUNDS[sl].append(root_name)

# Arabic sounds (check if word matches Arabic letter patterns)
AR_SOUNDS = {}
for root_name, root_data in rp.items():
    for s in root_data['soundPattern']:
        if s not in AR_SOUNDS:
            AR_SOUNDS[s] = []
        AR_SOUNDS[s].append(root_name)

# Semantic keywords per root (from principles and flashcard meanings)
SEMANTIC_MAP = {
    'ATUM': ['inertia', 'unity', 'completeness', 'containment', 'whole', 'fundamental',
             'indivisible', 'inward', 'rest', 'habitation', 'dwelling', 'paradise',
             'enclosed', 'garden', 'house', 'home', 'inner', 'self-contained',
             'atom', 'indivisible', 'female', 'mother', 'womb', 'nurture'],
    'BULL': ['radiation', 'expansion', 'outward', 'emit', 'fire', 'light', 'wave',
             'burst', 'spread', 'energy', 'free', 'shine', 'radiant', 'beauty',
             'passion', 'male', 'father', 'seed', 'sperm', 'force', 'power',
             'hero', 'god', 'divine', 'sky', 'sun'],
    'TOR': ['structure', 'rotation', 'cycle', 'turn', 'toroidal', 'spiral',
            'form', 'shape', 'organization', 'order', 'techne', 'technology',
            'craft', 'artifice', 'measure', 'number', 'moon', 'month', 'time',
            'delta', 'triangle', 'three', 'circle', 'wheel', 'money']
}

def get_first_letter(word):
    """Get the first meaningful letter from a word."""
    word = word.strip().upper()
    # Remove leading punctuation/quotes
    word = re.sub(r'^[\'\"\(\[\{\s]+', '', word)
    return word[0] if word else ''

def match_euro_sound_rater(word, strategy='first'):
    """
    Match a word against root sound patterns.
    strategy='first': Only match first letter
    strategy='full':  Match any letter in first 6 chars
    strategy='weighted': Combined approach
    Returns: (root, strength, basis)
    """
    if not word:
        return ('NONE', 0, 'none')

    word_upper = word.strip().upper()
    word_lower = word.strip().lower()
    matches = Counter()

    # Check first letter
    first = get_first_letter(word_upper).lower()
    if first and first in EURO_SOUNDS:
        for r in EURO_SOUNDS[first]:
            matches[r] += 3  # First letter match = strong signal

    # Check all letters in the word (up to first 6)
    if strategy in ('full', 'weighted'):
        chars_checked = set()
        for ch in word_upper[:8]:
            chl = ch.lower()
            if chl in chars_checked:
                continue
            chars_checked.add(chl)
            if chl in EURO_SOUNDS:
                for r in EURO_SOUNDS[chl]:
                    matches[r] += 1

    if not matches:
        return ('NONE', 0, 'none')

    # Get top match
    top_root = matches.most_common(1)[0][0]
    top_score = matches.most_common(1)[0][1]
    total_score = sum(matches.values())

    # Determine strength and basis
    if strategy == 'first':
        strength = min(3, top_score)
        basis = 'sound'
    elif strategy == 'full':
        strength = min(3, top_score)
        basis = 'sound'
    else:  # weighted
        strength = min(3, top_score)
        # Check if primary root dominates
        if top_score / total_score >= 0.6:
            basis = 'sound'
        elif top_score / total_score >= 0.4:
            basis = 'both'
        else:
            basis = 'sound'

    return (top_root, strength, basis)


def match_all_letters(word):
    """Match ALL letters in word against sound patterns, with letter frequency."""
    if not word:
        return ('NONE', 0, 'none')
    word_upper = word.strip().upper()
    matches_ct = Counter()

    for ch in word_upper:
        chl = ch.lower()
        if chl in EURO_SOUNDS:
            for r in EURO_SOUNDS[chl]:
                matches_ct[r] += 1

    if not matches_ct:
        return ('NONE', 0, 'none')

    top = matches_ct.most_common(1)[0][0]
    score = matches_ct.most_common(1)[0][1]
    strength = min(3, score)
    return (top, strength, 'sound')


def rater_a_sound_first(word):
    """Rater A: Match first letter only. Strict sound-pattern test."""
    return match_euro_sound_rater(word, 'first')

def rater_b_all_letters(word):
    """Rater B: Match ANY letter in the word. Generous."""
    return match_all_letters(word)

def rater_c_weighted(word):
    """Rater C: First letter weighted + full scan + NONE threshold."""
    first = get_first_letter(word.strip().upper())
    matches = Counter()

    # First letter weight = 4
    first_lower = first.lower()
    if first_lower and first_lower in EURO_SOUNDS:
        for r in EURO_SOUNDS[first_lower]:
            matches[r] += 4

    # All other letters weight = 1
    for ch in word.strip().upper()[:10]:
        if ch.lower() == first_lower:
            continue
        chl = ch.lower()
        if chl in EURO_SOUNDS:
            for r in EURO_SOUNDS[chl]:
                matches[r] += 1

    if not matches:
        return ('NONE', 0, 'none')

    top = matches.most_common(1)[0][0]
    top_score = matches.most_common(1)[0][1]
    total = sum(matches.values())
    dominance = top_score / total if total > 0 else 0

    strength = min(3, top_score)

    # NONE threshold: if the top root has no clear dominance, or word is too short
    if top_score <= 1 and total >= 2:
        return ('UNSURE', strength, 'none')
    if top_score <= 1 and len(word.strip()) <= 2:
        return ('UNSURE', 0, 'none')

    if dominance >= 0.6:
        basis = 'sound'
    elif dominance >= 0.4:
        basis = 'both'
    else:
        basis = 'sound'

    return (top, strength, basis)


def main():
    with open(BLIND_PATH, 'r', encoding='utf-8') as f:
        blind = json.load(f)

    N = len(blind)
    print(f"Rating {N} words with 3 raters...\n")

    # Run all 3 raters
    raters = {
        'rater_a': rater_a_sound_first,
        'rater_b': rater_b_all_letters,
        'rater_c': rater_c_weighted,
    }

    for rater_name, rater_fn in raters.items():
        output = []
        for entry in blind:
            word = entry['word']
            root, strength, basis = rater_fn(word)
            output.append({
                'id': entry['id'],
                'word': word,
                'best_fit_root': root,
                'strength': strength,
                'basis': basis,
            })
        out_path = os.path.join(BASE_DIR, f'{rater_name}.json')
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        # Count distribution
        roots = [o['best_fit_root'] for o in output]
        counts = Counter(roots)
        print(f"{rater_name}: {dict(counts)}")

    print("\nAll raters complete.")

if __name__ == '__main__':
    main()
