#!/usr/bin/env python3
"""
CCM Phase 3 close-out — Levenshtein baseline + loanword/cognate tagging.
Workflow:
  1. Load bridge entries + relation_map.json (cognate|loanword|unknown)
  2. Compute CCM match rate per language pair
  3. Compute normalized Levenshtein on romanized Arabic root vs modern word
  4. Compare CCM vs Levenshtein per pair
  5. Report ALL entries vs COGNATE-only entries

Usage: python ccm_closeout.py
"""

import json, math
from pathlib import Path
from collections import defaultdict

BASE = Path(__file__).resolve().parent
DATA = BASE.parent.parent / "data"

# ── Load data ──
with open(BASE / "phonetic_classes.json", encoding="utf-8") as f:
    classes_data = json.load(f)

with open(DATA / "etymologies.json", encoding="utf-8") as f:
    etym = json.load(f)

with open(BASE / "relation_map.json", encoding="utf-8") as f:
    relation_map = json.load(f)

bridge = etym["bridge"]
letter_mapping = classes_data["letterMapping"]

# ── Mappings ──
LATIN_TO_CLASS = {
    "h": "G1", "j": "G3", "y": "G3", "c": "G3", "k": "G3",
    "q": "G4", "t": "G5", "d": "G5", "z": "G6", "s": "G7",
    "r": "G8", "l": "G8", "n": "G8",
    "b": "G9", "f": "G9", "m": "G9", "p": "G9", "v": "G9",
    "x": "G3", "w": "G9",
}

AR_TO_LATIN = {
    "أ": "hamza", "ا": "alef", "ب": "baa", "ت": "taa", "ث": "thaa",
    "ج": "jeem", "ح": "haa", "خ": "khaa", "د": "dal", "ذ": "dhal",
    "ر": "raa", "ز": "zay", "س": "seen", "ش": "sheen", "ص": "sad",
    "ض": "dhad", "ط": "taa2", "ظ": "dhaa", "ع": "ayn", "غ": "ghayn",
    "ف": "faa", "ق": "qaf", "ك": "kaf", "ل": "lam", "م": "meem",
    "ن": "noon", "ه": "haa2", "و": "waw", "ي": "yaa",
}

# Simple romanization for Levenshtein (approximate phonemic, not phonetic)
AR_TO_ROMAN = {
    "أ": "a", "ا": "a", "ب": "b", "ت": "t", "ث": "th",
    "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh",
    "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "s",
    "ض": "d", "ط": "t", "ظ": "dh", "ع": "a", "غ": "gh",
    "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m",
    "ن": "n", "ه": "h", "و": "w", "ي": "y",
}

WEAK_AR = {"alef", "waw", "yaa", "hamza"}
VOWELS = set("aeiouAEIOU")

LANG_NAMES = {
    "ar-he": "Arabic-Hebrew",
    "ar-la": "Arabic-Latin",
    "ar-gr": "Arabic-Greek",
    "ar-en": "Arabic-English",
    "ar-fa": "Arabic-Persian",
}
LANG_ORDER = ["ar-he", "ar-la", "ar-gr", "ar-en", "ar-fa"]

REL_TAG = relation_map  # dict from ID -> cognate|loanword|unknown
# Remove meta key
REL_TAG.pop("_meta", None)


# ── Helpers ──

def first2_ar_cons(root_str):
    root = root_str.split("/")[0].split("+")[0]
    cons = []
    for ch in root:
        if ch in AR_TO_LATIN:
            lat = AR_TO_LATIN[ch]
            if lat not in WEAK_AR:
                cons.append(lat)
    return cons[:2]

def first2_lat_cons(word):
    cons = [c.lower() for c in word if c.isalpha() and c.lower() not in VOWELS]
    return cons[:2]

def romanize(root_str):
    """Romanize Arabic root for Levenshtein comparison."""
    root = root_str.split("/")[0].split("+")[0]
    result = []
    for ch in root:
        if ch in AR_TO_ROMAN:
            result.append(AR_TO_ROMAN[ch])
    return "".join(result)

def get_lang_pairs(target_lang, lang_path):
    text = (target_lang + " " + lang_path).lower()
    pairs = []
    if any(w in text for w in ["عبرية", "hebrew", "إسرائيلي"]):
        pairs.append("ar-he")
    if any(w in text for w in ["لاتينية", "latin", "إنكليزية", "english",
                                "فرنسية", "french", "ألمانية", "german"]):
        pairs.append("ar-la")
    if any(w in text for w in ["يونانية", "greek"]):
        pairs.append("ar-gr")
    if any(w in text for w in ["إنكليزية", "english"]):
        pairs.append("ar-en")
    if any(w in text for w in ["فارسية", "persian"]):
        pairs.append("ar-fa")
    if not pairs:
        pairs.append("ar-la")
    return pairs


# ── Entry builder (adds relation) ──

def build_entry_from_bridge(entry):
    ar_root = entry.get("arabicRoot", "")
    modern_word = entry.get("modernWord", "")
    if not ar_root or not modern_word:
        return None
    first_ar = first2_ar_cons(ar_root)
    first_lat = first2_lat_cons(modern_word)
    if len(first_ar) < 2 or len(first_lat) < 2:
        return None
    ar_cls = [letter_mapping.get(c) for c in first_ar]
    lat_cls = [LATIN_TO_CLASS.get(c) for c in first_lat]
    if None in ar_cls or None in lat_cls:
        return None
    match = (ar_cls[0] == lat_cls[0] and ar_cls[1] == lat_cls[1])

    pairs = get_lang_pairs(
        entry.get("targetLanguage", ""),
        entry.get("languagePath", "")
    )

    eid = entry.get("id", "??")
    rel = REL_TAG.get(eid, "unknown")

    return {
        "id": eid,
        "arabicRoot": ar_root,
        "romanized": romanize(ar_root),
        "modernWord": modern_word,
        "arConsonants": first_ar,
        "latConsonants": first_lat,
        "arClasses": ar_cls,
        "latClasses": lat_cls,
        "match": match,
        "relation": rel,
        "dataset": "bridge",
        "pairs": pairs,
    }


def build_entry_supplement(ar_root, target_word, note, pair_key, relation):
    first_ar = first2_ar_cons(ar_root)
    first_lat = first2_lat_cons(target_word)
    if len(first_ar) < 2 or len(first_lat) < 2:
        return None
    ar_cls = [letter_mapping.get(c) for c in first_ar]
    lat_cls = [LATIN_TO_CLASS.get(c) for c in first_lat]
    if None in ar_cls or None in lat_cls:
        return None
    match = (ar_cls[0] == lat_cls[0] and ar_cls[1] == lat_cls[1])
    return {
        "id": f"SUPP_{pair_key}",
        "arabicRoot": ar_root,
        "romanized": romanize(ar_root),
        "modernWord": target_word,
        "arConsonants": first_ar,
        "latConsonants": first_lat,
        "arClasses": ar_cls,
        "latClasses": lat_cls,
        "match": match,
        "relation": relation,
        "dataset": "supplement",
        "pairs": [pair_key],
    }


# ── Supplemental data ──

HE_SUPPLEMENT = [
    ("سلم", "Shalom", "cognate"),
    ("ملك", "Melekh", "cognate"),
    ("بيت", "Bayit", "cognate"),
    ("أرض", "Erets", "cognate"),
    ("كتاب", "Ktav", "cognate"),
    ("مدينة", "Medina", "cognate"),
    ("شمس", "Shemesh", "cognate"),
    ("لسان", "Lashon", "cognate"),
    ("عين", "Ayin", "cognate"),
    ("يمين", "Yamin", "cognate"),
    ("سمع", "Shama", "cognate"),
    ("قلب", "Lev", "cognate"),
    ("رأس", "Rosh", "cognate"),
    ("نفس", "Nefesh", "cognate"),
    ("أخ", "Akh", "cognate"),
    ("أم", "Em", "cognate"),
    ("أب", "Av", "cognate"),
    ("يد", "Yad", "cognate"),
    ("دين", "Din", "cognate"),
]

FA_SUPPLEMENT = [
    ("كتاب", "Ketab", "loanword"),
    ("مدرسة", "Madrese", "loanword"),
    ("جمهور", "Jomhur", "loanword"),
    ("حكومة", "Hokumat", "loanword"),
    ("شكر", "Tashakor", "loanword"),
    ("علم", "Elm", "loanword"),
    ("قانون", "Ghanun", "loanword"),
    ("طبيعة", "Tabiat", "loanword"),
    ("دين", "Din", "loanword"),
    ("مدينة", "Madine", "loanword"),
    ("جماعة", "Jamaat", "loanword"),
    ("حقيقة", "Haghigha", "loanword"),
    ("خبر", "Khabar", "loanword"),
    ("سفر", "Safar", "loanword"),
    ("فكر", "Fekr", "loanword"),
    ("صبر", "Sabr", "loanword"),
    ("قدر", "Ghadr", "loanword"),
    ("نفس", "Nafas", "loanword"),
    ("جسم", "Jesm", "loanword"),
    ("روح", "Ruh", "loanword"),
]


# ── Build master entry list ──

def build_all_entries():
    entries = []
    for e in bridge:
        built = build_entry_from_bridge(e)
        if built:
            entries.append(built)
    for ar, target, rel in HE_SUPPLEMENT:
        built = build_entry_supplement(ar, target, "", "ar-he", rel)
        if built:
            entries.append(built)
    for ar, target, rel in FA_SUPPLEMENT:
        built = build_entry_supplement(ar, target, "", "ar-fa", rel)
        if built:
            entries.append(built)
    return entries


# ── Levenshtein ──

def levenshtein(s1, s2):
    if len(s1) < len(s2):
        return levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    prev = list(range(len(s2) + 1))
    for i, c1 in enumerate(s1):
        curr = [i + 1]
        for j, c2 in enumerate(s2):
            cost = 0 if c1 == c2 else 1
            curr.append(min(curr[-1] + 1, prev[j + 1] + 1, prev[j] + cost))
        prev = curr
    return prev[-1]


def normalized_levenshtein(s1, s2):
    """Return normalized edit distance (0=identical, 1=completely different)."""
    if not s1 and not s2:
        return 0.0
    lev = levenshtein(s1, s2)
    max_len = max(len(s1), len(s2))
    return lev / max_len


def levenshtein_similarity(s1, s2):
    """Return similarity (1 - normalized edit distance). 1=identical, 0=completely different."""
    return 1.0 - normalized_levenshtein(s1, s2)


# ── Compute CCM rate ──

def ccm_rate(entries, pair_key):
    pair_entries = [e for e in entries if e["pairs"] and pair_key in e["pairs"]]
    if not pair_entries:
        return 0.0, 0, 0
    matches = sum(1 for e in pair_entries if e["match"])
    total = len(pair_entries)
    return matches / total, matches, total


def mean_levenshtein_sim(entries, pair_key):
    """Mean Levenshtein similarity between romanized Arabic root and modern word."""
    pair_entries = [e for e in entries if e["pairs"] and pair_key in e["pairs"]]
    if not pair_entries:
        return 0.0
    sims = [levenshtein_similarity(e["romanized"], e["modernWord"].lower()) for e in pair_entries]
    return sum(sims) / len(sims)


# ── Bootstrap CI ──

import random
random.seed(20260610)

def bootstrap_ci(entries, pair_key, n_iter=1000):
    pair_entries = [e for e in entries if e["pairs"] and pair_key in e["pairs"]]
    if not pair_entries:
        return (0, 0)
    rates = []
    for _ in range(n_iter):
        sample = [random.choice(pair_entries) for _ in pair_entries]
        m = sum(1 for e in sample if e["match"])
        rates.append(m / len(sample))
    rates.sort()
    return (rates[25], rates[974])


# ── Main ──

if __name__ == "__main__":
    entries = build_all_entries()

    print("=" * 78)
    print("  CCM PHASE 3 CLOSE-OUT — Levenshtein Baseline + Cognate/All Split")
    print("=" * 78)

    # Per-pair counts by relation
    print(f"\n{'Pair':<20} {'Total':>6} {'Cognate':>8} {'Loanword':>9} {'Unknown':>8} {'Bridge':>7} {'Supp.':>6}")
    print("-" * 68)
    for pk in LANG_ORDER:
        pe = [e for e in entries if pk in e["pairs"]]
        total = len(pe)
        cog = sum(1 for e in pe if e["relation"] == "cognate")
        loa = sum(1 for e in pe if e["relation"] == "loanword")
        unk = sum(1 for e in pe if e["relation"] == "unknown")
        bri = sum(1 for e in pe if e["dataset"] == "bridge")
        sup = sum(1 for e in pe if e["dataset"] == "supplement")
        print(f"  {LANG_NAMES[pk]:<18} {total:>6} {cog:>8} {loa:>9} {unk:>8} {bri:>7} {sup:>6}")

    # ── RESULTS TABLE ──
    print(f"\n{'='*78}")
    print(f"  {'Pair':<20} {'CCM%':>8} {'Lev%':>8} {'Δ%':>8} {'CCM wins?':>10} {'N(all)':>7} {'Cog%':>8} {'N(cog)':>7}")
    print(f"  {'-'*20} {'-'*8} {'-'*8} {'-'*8} {'-'*10} {'-'*7} {'-'*8} {'-'*7}")
    print(f"  {'-'*78}")

    results = []
    for pk in LANG_ORDER:
        # All entries
        ccm_all, m_all, t_all = ccm_rate(entries, pk)
        lev_all = mean_levenshtein_sim(entries, pk)
        ci = bootstrap_ci(entries, pk)
        delta = ccm_all - lev_all
        ccm_wins = "YES" if ccm_all > lev_all else "NO"

        # Cognate-only entries
        cog_entries = [e for e in entries if pk in e["pairs"] and e["relation"] == "cognate"]
        if cog_entries:
            ccm_cog = sum(1 for e in cog_entries if e["match"]) / len(cog_entries)
            n_cog = len(cog_entries)
        else:
            ccm_cog = 0.0
            n_cog = 0

        results.append({
            "pair": pk,
            "name": LANG_NAMES[pk],
            "ccm_all": ccm_all,
            "lev_all": lev_all,
            "delta": delta,
            "ccm_wins": ccm_wins,
            "n_all": t_all,
            "ccm_cog": ccm_cog,
            "n_cog": n_cog,
            "ci": ci,
        })

        line = (f"  {LANG_NAMES[pk]:<20} {ccm_all*100:>6.1f}%  {lev_all*100:>6.1f}%  "
                f"{delta*100:>+6.1f}%  {ccm_wins:>10} {t_all:>7} {ccm_cog*100:>6.1f}%  {n_cog:>7}")
        print(line)

    # ── Summary lines ──
    print(f"\n{'='*78}")
    print("  SUMMARY")
    print(f"{'='*78}")

    # CCM beats Levenshtein by pair
    print("\n  1. CCM beats Levenshtein?")
    for r in results:
        if r["n_all"] == 0:
            print(f"     {r['name']}: insufficient data")
        else:
            win_str = f"YES (+{r['delta']*100:.1f}pp)" if r["delta"] > 0 else f"NO ({r['delta']*100:.1f}pp)"
            print(f"     {r['name']}: {win_str}")

    # Ordering: Latin > English > Greek on cognate-only
    print("\n  2. Latin > English > Greek ordering (cognate-only)?")
    la_cog = next(r for r in results if r["pair"] == "ar-la")["ccm_cog"]
    en_cog = next(r for r in results if r["pair"] == "ar-en")["ccm_cog"]
    gr_cog = next(r for r in results if r["pair"] == "ar-gr")["ccm_cog"]
    ordering = la_cog >= en_cog >= gr_cog
    print(f"     Latin ({la_cog*100:.1f}%) >= English ({en_cog*100:.1f}%) >= Greek ({gr_cog*100:.1f}%): {'YES' if ordering else 'NO'}")

    # Cognate-only CCM rates
    print("\n  3. Cognate-only CCM rates (headline numbers):")
    cog_only_line = "     "
    for r in results:
        if r["n_cog"] > 0:
            cog_only_line += f"{r['name']}: {r['ccm_cog']*100:.1f}% (N={r['n_cog']})  "
    print(cog_only_line)
    for r in results:
        if r["n_cog"] == 0 and r["n_all"] > 0:
            print(f"     {r['name']}: no cognate entries (N={r['n_all']} all, but all are loanword/unknown)")

    # Notes
    print(f"\n  Notes:")
    print(f"  - Lev% = mean normalized Levenshtein similarity on romanized root vs modern word")
    print(f"  - Δ% = CCM% - Lev% (positive = CCM beats naive edit distance)")
    print(f"  - Cognate-only entries: Semitic cognates (Hebrew, Akkadian, Canaanite)")
    print(f"  - Loanword entries: Arabic->European borrowings, Arabic->Persian borrowings")
    print(f"  - Unknown entries: CONTESTED or uncertain (Egyptian, PIE-alternative, etc.)")
