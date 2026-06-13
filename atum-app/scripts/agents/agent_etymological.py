#!/usr/bin/env python3
"""
Etymological Agent — Etymological/etymon analysis using the meaning
field (etymological gloss) from audit_blind.json.

Rule-based: identifies language families, suffixes, and root words
from the etymology that signal ATUM / BULL / TOR.

Output: ATUM | BULL | TOR | NONE
"""
import json, os, re

BASE_DIR = os.path.dirname(__file__)
AUDIT_DIR = os.path.join(BASE_DIR, '..', 'audit')

# ── etymological signals ──────────────────────────────────────────────
# Language → likely root mapping (based on suffix/word patterns)

# Suffix patterns mapped to roots (Section 1.2, 1.3 of new-q.md)
SUFFIX_MAP = {
    # TOR suffixes
    'tor': 'TOR', 'dor': 'TOR', 'tur': 'TOR', 'dur': 'TOR',
    'tion': 'TOR', 'sion': 'TOR', 'cion': 'TOR',
    'ture': 'TOR', 'tura': 'TOR', 'ture': 'TOR',
    'ator': 'TOR', 'itor': 'TOR', 'utor': 'TOR',
    'tory': 'TOR', 'tori': 'TOR', 'torium': 'TOR',
    'tron': 'TOR', 'trop': 'TOR', 'trope': 'TOR',
    'tro': 'TOR', 'tra': 'TOR',
    # BULL suffixes
    'ble': 'BULL', 'bil': 'BULL', 'bul': 'BULL', 'bol': 'BULL', 'bal': 'BULL',
    'able': 'BULL', 'ible': 'BULL', 'uble': 'BULL',
    'bull': 'BULL', 'bell': 'BULL', 'bellum': 'BULL',
    'bula': 'BULL', 'bule': 'BULL',
    'bel': 'BULL',  # Latin bellum
    'vul': 'BULL', 'vol': 'BULL',  # volution
    # ATUM suffixes/patterns
    'tom': 'ATUM', 'tomia': 'ATUM', 'tomy': 'ATUM',
    'ton': 'ATUM', 'tonia': 'ATUM',
    'nom': 'ATUM', 'nomia': 'ATUM', 'nomy': 'ATUM',
    'nat': 'ATUM', 'natur': 'ATUM', 'nature': 'ATUM',
    'met': 'ATUM', 'meter': 'ATUM', 'metry': 'ATUM',
    'mat': 'ATUM', 'mater': 'ATUM', 'materia': 'ATUM',
    'mut': 'ATUM', 'mot': 'ATUM',
}

# Source-language root words
ETYMON_MAP = {
    # Latin
    'tornare': 'TOR', 'tornus': 'TOR', 'torus': 'TOR',
    'torrere': 'TOR', 'torrens': 'TOR',
    'torqueo': 'TOR',
    'tempus': 'TOR', 'tempor': 'TOR',
    'terminus': 'TOR',
    'terra': 'TOR', 'terr': 'TOR',
    'bellum': 'BULL', 'belli': 'BULL', 'bell': 'BULL',
    'ballista': 'BULL', 'ball': 'BULL',
    'bulla': 'BULL', 'bull': 'BULL',
    'volvo': 'BULL', 'volut': 'BULL', 'volv': 'BULL',
    'atomus': 'ATUM', 'atom': 'ATUM',
    'natura': 'ATUM', 'natur': 'ATUM', 'natus': 'ATUM',
    'mater': 'ATUM', 'materia': 'ATUM', 'materi': 'ATUM',
    'metrum': 'ATUM', 'metr': 'ATUM',
    'nomen': 'ATUM', 'nomin': 'ATUM',
    'mutare': 'ATUM', 'mut': 'ATUM',
    'motus': 'ATUM', 'mot': 'ATUM',
    'creare': 'ATUM', 'creat': 'ATUM', 'crea': 'ATUM',
    'genus': 'ATUM', 'gener': 'ATUM', 'gen': 'ATUM',
    # Greek
    'atomos': 'ATUM', 'atom': 'ATUM',
    'tornos': 'TOR', 'tropos': 'TOR', 'trop': 'TOR',
    'metron': 'ATUM', 'metr': 'ATUM',
    'onoma': 'ATUM', 'onom': 'ATUM',
    'genos': 'ATUM', 'gen': 'ATUM',
    'ballein': 'BULL', 'ball': 'BULL',
    'biblion': 'BULL', 'bibl': 'BULL',
    # French
    'tour': 'TOR', 'tourner': 'TOR',
    'torrent': 'TOR',
    'boule': 'BULL', 'boulet': 'BULL',
    # Arabic
    'tawr': 'TOR', 'taura': 'TOR',
    # Hebrew
    'bel': 'BULL', 'baal': 'BULL',
}

# Language → likelihood adjustment (some languages more likely for certain roots)
LANG_BIAS = {
    'Latin': {'ATUM': 0, 'BULL': 0, 'TOR': 1},   # TOR slightly favored (abundant -tor)
    'Greek': {'ATUM': 1, 'BULL': 0, 'TOR': 1},
    'French': {'ATUM': 0, 'BULL': 1, 'TOR': 1},
    'Hebrew': {'BULL': 1, 'TOR': 0, 'ATUM': 0},
    'Arabic': {'TOR': 1, 'ATUM': 0, 'BULL': 0},
    'Sanskrit': {'ATUM': 1, 'TOR': 0, 'BULL': 0},
}


def extract_language(meaning):
    """Extract the source language from a meaning string."""
    if not meaning:
        return 'Unknown'
    # Common patterns: "From Latin ...", "From Greek ...", etc.
    m = re.search(r'\b(French|Latin|Greek|Hebrew|Arabic|'
                  r'German|Spanish|Sanskrit|Persian)\b', meaning)
    return m.group(1) if m else 'Unknown'


def score_etymology(meaning, language):
    """Score etymology against each root."""
    scores = {'ATUM': 0, 'BULL': 0, 'TOR': 0}

    if not meaning:
        return scores

    text = meaning.lower()

    # Check suffix patterns
    for suffix, root in SUFFIX_MAP.items():
        if suffix in text:
            scores[root] += 2

    # Check etymon roots
    for etymon, root in ETYMON_MAP.items():
        if re.search(r'\b' + re.escape(etymon) + r'\b', text):
            scores[root] += 3

    # Language bias
    bias = LANG_BIAS.get(language, {})
    for root in scores:
        scores[root] += bias.get(root, 0)

    return scores


def classify(meaning, language='Unknown'):
    """
    Returns: ('ATUM'|'BULL'|'TOR'|'NONE', reason: str)
    """
    if not meaning:
        return ('NONE', 'no etymology available')

    scores = score_etymology(meaning, language)

    sorted_roots = sorted(scores.items(), key=lambda x: -x[1])

    top_root, top_score = sorted_roots[0]
    second_score = sorted_roots[1][1]

    if top_score == 0:
        return ('NONE', 'no etymological signals detected')

    if top_score == second_score:
        return ('NONE', f'tie in etymology ({top_score} each)')

    return (top_root,
            f'scores={scores} dominant={top_root}({top_score}) '
            f'lang={language}')


def main():
    blind_path = os.path.join(AUDIT_DIR, 'audit_blind.json')
    with open(blind_path, 'r', encoding='utf-8') as f:
        blind_data = {w['id']: w for w in json.load(f)}

    disputed_path = os.path.join(AUDIT_DIR,
                                 'multi_llm_combined_disagreement.json')
    with open(disputed_path, 'r', encoding='utf-8') as f:
        disputed = json.load(f)

    results = {}
    for w in disputed:
        wid = w['id']
        word = w['word']
        entry = blind_data.get(wid, {})
        meaning = entry.get('meaning', '')
        language = entry.get('language', 'Unknown')
        root, reason = classify(meaning, language)
        results[wid] = {
            'word': word,
            'etymological_root': root,
            'etymological_reason': reason,
        }

    out_path = os.path.join(BASE_DIR, 'agent_etymological_output.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    counts = {'ATUM': 0, 'BULL': 0, 'TOR': 0, 'NONE': 0}
    for r in results.values():
        counts[r['etymological_root']] += 1
    print(f"Etymological Agent — results: {counts}")
    print(f"Saved to {out_path}")


if __name__ == '__main__':
    main()
