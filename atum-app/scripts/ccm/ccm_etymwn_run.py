#!/usr/bin/env python3
"""
Re-run CCM + Levenshtein on enlarged etymwn-tagged dataset.
Merges:
  - etymwn_pairs.json (812 entries, auto-tagged via etymwn relations)
  - Existing bridge + supplement entries (with relation_map.json tagging)
  - Hand-tagged Hebrew=cognate and Persian=loanword seeds (for validation)

Output: CCM vs Levenshtein on same-representation, with cognate-only split.
"""

import json, random, math
from pathlib import Path
from collections import defaultdict

BASE = Path(__file__).resolve().parent
DATA = BASE.parent.parent / "data"

random.seed(20260610)

# ── Load data ──
with open(BASE / "phonetic_classes.json", encoding="utf-8") as f:
    classes_data = json.load(f)

with open(DATA / "etymologies.json", encoding="utf-8") as f:
    etym = json.load(f)

with open(BASE / "relation_map.json", encoding="utf-8") as f:
    relation_map = json.load(f)

with open(BASE / "etymwn_pairs.json", encoding="utf-8") as f:
    etymwn_data = json.load(f)

bridge = etym["bridge"]
etymwn_entries_raw = etymwn_data["entries"]
letter_mapping = classes_data["letterMapping"]

LATIN_TO_CLASS = {
    "h": "G1", "j": "G3", "y": "G3", "c": "G3", "k": "G3",
    "q": "G4", "t": "G5", "d": "G5", "z": "G6", "s": "G7",
    "r": "G8", "l": "G8", "n": "G8",
    "b": "G9", "f": "G9", "m": "G9", "p": "G9", "v": "G9",
    "x": "G3", "w": "G9",
}

LANG_NAMES = {
    "ar-he": "Arabic-Hebrew",
    "ar-la": "Arabic-Latin",
    "ar-gr": "Arabic-Greek",
    "ar-en": "Arabic-English",
    "ar-fa": "Arabic-Persian",
}
LANG_ORDER = ["ar-he", "ar-la", "ar-gr", "ar-en", "ar-fa"]

# ── Helpers ──

def normalize_word(w):
    """Normalize a word for comparison."""
    return w.lower().strip().replace("-", "").replace("'", "").replace(" ", "")


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


def norm_lev_sim(s1, s2):
    if not s1 and not s2:
        return 0.0
    lev = levenshtein(s1, s2)
    max_len = max(len(s1), len(s2))
    return 1.0 - (lev / max_len)


# ── Build master entry list ──

def build_entries():
    """
    Merge etymwn entries + existing bridge + supplements.
    All entries get: pair, relation, arabicRoot, modernWord, romanized_ar,
      romanized_target, arConsonants, latConsonants, match, source
    """
    entries = []

    # 1. Bridge entries (with relation_map tagging)
    for e in bridge:
        ar_root = e.get("arabicRoot", "")
        modern_word = e.get("modernWord", "")
        if not ar_root or not modern_word:
            continue
        pairs = get_old_lang_pairs(e.get("targetLanguage", ""), e.get("languagePath", ""))
        eid = e.get("id", "??")
        rel = relation_map.get(eid, {}).get(eid, "unknown") if isinstance(relation_map.get(eid), dict) else relation_map.get(eid, "unknown")

        for pk in pairs:
            entry = build_single_entry(ar_root, modern_word, pk, rel, eid, "bridge")
            if entry:
                entries.append(entry)

    # 2. Etymwn entries — use pre-computed fields (handles Greek/Hebrew scripts)
    for e in etymwn_entries_raw:
        ar_cons = e.get("arConsonants", [])
        lat_cons = e.get("latConsonants", [])
        ar_cls = e.get("arClasses", [])
        lat_cls = e.get("latClasses", [])
        match = e.get("match", False)

        if len(ar_cons) < 2 or len(lat_cons) < 2:
            continue
        if None in ar_cls or None in lat_cls:
            continue

        entries.append({
            "id": e.get("id", "ETYM_??"),
            "pair": e.get("pair", "unknown"),
            "relation": e.get("relation", "unknown"),
            "source": "etymwn",
            "arabicRoot": e.get("arabicRoot", ""),
            "modernWord": e.get("modernWord", ""),
            "arConsonants": ar_cons,
            "latConsonants": lat_cons,
            "arClasses": ar_cls,
            "latClasses": lat_cls,
            "match": match,
            "romanized_ar": e.get("romanized_ar", ""),
            "romanized_target": e.get("romanized_target", ""),
        })

    # 3. Hebrew supplement seeds (tagged cognate for validation)
    he_seeds = [
        ("سلم", "Shalom"), ("ملك", "Melekh"), ("بيت", "Bayit"), ("أرض", "Erets"),
        ("كتاب", "Ktav"), ("مدينة", "Medina"), ("شمس", "Shemesh"), ("لسان", "Lashon"),
        ("عين", "Ayin"), ("يمين", "Yamin"), ("سمع", "Shama"), ("قلب", "Lev"),
        ("رأس", "Rosh"), ("نفس", "Nefesh"), ("أخ", "Akh"), ("أم", "Em"),
        ("أب", "Av"), ("يد", "Yad"), ("دين", "Din"),
    ]
    for ar, target in he_seeds:
        entry = build_single_entry(ar, target, "ar-he", "cognate_seed", f"SEED_HE_{ar}", "seed")
        if entry:
            entries.append(entry)

    # 4. Persian supplement seeds (tagged loanword)
    fa_seeds = [
        ("كتاب", "Ketab"), ("مدرسة", "Madrese"), ("جمهور", "Jomhur"),
        ("حكومة", "Hokumat"), ("شكر", "Tashakor"), ("علم", "Elm"),
        ("قانون", "Ghanun"), ("طبيعة", "Tabiat"), ("دين", "Din"),
        ("مدينة", "Madine"), ("جماعة", "Jamaat"), ("حقيقة", "Haghigha"),
        ("خبر", "Khabar"), ("سفر", "Safar"), ("فكر", "Fekr"),
        ("صبر", "Sabr"), ("قدر", "Ghadr"), ("نفس", "Nafas"),
        ("جسم", "Jesm"), ("روح", "Ruh"),
    ]
    for ar, target in fa_seeds:
        entry = build_single_entry(ar, target, "ar-fa", "loanword_seed", f"SEED_FA_{ar}", "seed")
        if entry:
            entries.append(entry)

    return entries


def build_single_entry(ar_root, modern_word, pair_key, relation, eid, source,
                       romanized_ar=None, romanized_target=None):
    """Build a single CCM entry from raw data."""
    # Get consonants
    ar_cons = first2_ar_cons(ar_root)
    lat_cons = first2_lat_cons(modern_word)
    if len(ar_cons) < 2 or len(lat_cons) < 2:
        return None

    ar_cls = [letter_mapping.get(c) for c in ar_cons]
    lat_cls = [LATIN_TO_CLASS.get(c) for c in lat_cons]
    if None in ar_cls or None in lat_cls:
        return None

    match = (ar_cls[0] == lat_cls[0] and ar_cls[1] == lat_cls[1])

    # Romanize for Levenshtein (same representation)
    if romanized_ar is None:
        romanized_ar = romanize_ar(ar_root)
    if romanized_target is None:
        romanized_target = modern_word.lower()

    return {
        "id": eid,
        "pair": pair_key,
        "relation": relation,
        "source": source,
        "arabicRoot": ar_root,
        "modernWord": modern_word,
        "arConsonants": ar_cons,
        "latConsonants": lat_cons,
        "arClasses": ar_cls,
        "latClasses": lat_cls,
        "match": match,
        "romanized_ar": romanized_ar,
        "romanized_target": romanized_target,
    }


AR_TO_LATIN = {
    "أ": "hamza", "ا": "alef", "ب": "baa", "ت": "taa", "ث": "thaa",
    "ج": "jeem", "ح": "haa", "خ": "khaa", "د": "dal", "ذ": "dhal",
    "ر": "raa", "ز": "zay", "س": "seen", "ش": "sheen", "ص": "sad",
    "ض": "dhad", "ط": "taa2", "ظ": "dhaa", "ع": "ayn", "غ": "ghayn",
    "ف": "faa", "ق": "qaf", "ك": "kaf", "ل": "lam", "م": "meem",
    "ن": "noon", "ه": "haa2", "و": "waw", "ي": "yaa",
}

WEAK_AR = {"alef", "waw", "yaa", "hamza"}


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
    cons = [c.lower() for c in word if c.isalpha() and c.lower() not in "aeiou"]
    return cons[:2]


def romanize_ar(root_str):
    root = root_str.split("/")[0].split("+")[0]
    roman_map = {
        "أ": "a", "ا": "a", "ب": "b", "ت": "t", "ث": "th",
        "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh",
        "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "s",
        "ض": "d", "ط": "t", "ظ": "dh", "ع": "a", "غ": "gh",
        "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m",
        "ن": "n", "ه": "h", "و": "w", "ي": "y",
    }
    result = []
    for ch in root:
        if ch in roman_map:
            result.append(roman_map[ch])
    return "".join(result)


def get_old_lang_pairs(target_lang, lang_path):
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


# ── Stats per pair ──

def compute(entries, pair_key):
    pair_entries = [e for e in entries if e["pair"] == pair_key]
    if not pair_entries:
        return None

    # CCM
    matches = sum(1 for e in pair_entries if e["match"])
    total = len(pair_entries)
    ccm = matches / total

    # Levenshtein on same representation
    lev_sims = [norm_lev_sim(e["romanized_ar"], e["romanized_target"]) for e in pair_entries]
    lev = sum(lev_sims) / len(lev_sims)

    delta = ccm - lev

    # Cognate-only: entries with relation containing "cognate" or "cognate_seed"
    cog_entries = [e for e in pair_entries if "cognate" in e["relation"]]
    if cog_entries:
        ccm_cog = sum(1 for e in cog_entries if e["match"]) / len(cog_entries)
        n_cog = len(cog_entries)
    else:
        ccm_cog = None
        n_cog = 0

    # Seed validation
    seeds = [e for e in pair_entries if e["source"] == "seed"]
    seed_agree = sum(1 for e in seeds if e["match"])
    seed_total = len(seeds)

    return {
        "pair": pair_key,
        "name": LANG_NAMES[pair_key],
        "n_all": total,
        "ccm_all": ccm,
        "lev_all": lev,
        "delta": delta,
        "ccm_wins": ccm > lev,
        "n_cog": n_cog,
        "ccm_cog": ccm_cog,
        "n_etymwn": sum(1 for e in pair_entries if e["source"] == "etymwn"),
        "n_bridge": sum(1 for e in pair_entries if e["source"] == "bridge"),
        "n_seed": seed_total,
        "seed_agree": seed_agree,
    }


# ── Main ──

if __name__ == "__main__":
    entries = build_entries()
    print("=" * 78)
    print("  CCM ON ENLARGED ETYMWN DATASET — Levenshtein Baseline + Cognate Split")
    print("=" * 78)

    # Source distribution
    src_dist = defaultdict(int)
    for e in entries:
        src_dist[e["source"]] += 1
    print(f"\n  Source distribution: {dict(src_dist)}")
    print(f"  Total entries: {len(entries)}")

    # Per-pair breakdown
    print(f"\n{'Pair':<20} {'Total':>6} {'Etymwn':>8} {'Bridge':>7} {'Seed':>6} {'Cog':>6}")
    print("-" * 60)
    for pk in LANG_ORDER:
        pe = [e for e in entries if e["pair"] == pk]
        total = len(pe)
        ewn = sum(1 for e in pe if e["source"] == "etymwn")
        bri = sum(1 for e in pe if e["source"] == "bridge")
        seed = sum(1 for e in pe if e["source"] == "seed")
        cog = sum(1 for e in pe if "cognate" in e["relation"])
        print(f"  {LANG_NAMES[pk]:<18} {total:>6} {ewn:>8} {bri:>7} {seed:>6} {cog:>6}")

    # Main results table
    print(f"\n{'='*78}")
    header = f"{'Pair':<20} {'N(all)':>7} {'N(cog)':>7} {'CCM all':>8} {'CCM cog':>10} {'Lev(same)':>10} {'Δ vs Lev':>9}  CCM wins?"
    print(f"  {header}")
    print(f"  {'-'*78}")

    results = []
    for pk in LANG_ORDER:
        r = compute(entries, pk)
        if r is None:
            print(f"  {LANG_NAMES[pk]:<20}  insufficient data")
            continue
        results.append(r)

        cog_str = f"{r['ccm_cog']*100:.1f}%" if r['ccm_cog'] is not None else "   —  "
        if r['n_cog'] < 30 and r['ccm_cog'] is not None:
            cog_matches = sum(1 for e in entries if e["pair"] == pk and "cognate" in e["relation"] and e["match"])
            cog_str = f"{cog_matches}/{r['n_cog']}"

        win_str = "YES" if r['ccm_wins'] else "NO"
        line = (f"  {r['name']:<20} {r['n_all']:>7} {r['n_cog']:>7} "
                f"{r['ccm_all']*100:>7.1f}% {cog_str:>10} "
                f"{r['lev_all']*100:>9.1f}% {r['delta']*100:>+8.1f}pp  {win_str}")
        print(line)

    # Summary
    print(f"\n{'='*78}")
    print("  SUMMARY")
    print(f"{'='*78}")

    print("\n  1. Arabic↔Greek/Latin cognate N ≥ 30?")
    for r in results:
        if r["pair"] in ("ar-gr", "ar-la"):
            status = "YES" if r["n_cog"] >= 30 else f"NO (N={r['n_cog']})"
            print(f"     {r['name']}: {r['n_cog']} cognate entries — {status}")

    print("\n  2. On same-representation Levenshtein, does CCM still win?")
    for r in results:
        print(f"     {r['name']}: CCM={r['ccm_all']*100:.1f}% vs Lev={r['lev_all']*100:.1f}% — "
              f"{'YES' if r['ccm_wins'] else 'NO'} (Δ={r['delta']*100:+.1f}pp)")

    print("\n  3. Seed-tag disagreements (hand seeds vs etymwn):")
    mismatches = []
    for r in results:
        if r["n_seed"] > 0:
            agree_rate = r["seed_agree"] / r["n_seed"] * 100
            mismatches.append(f"{r['name']}: {r['seed_agree']}/{r['n_seed']} seeds agree with CCM ({agree_rate:.0f}%)")
            for m in mismatches:
                print(f"     {m}")

    # Etymwn vs hand seed comparison
    print("\n     Etymwn vs hand seed tagging:")
    # Find etymwn entries that match seed words
    seed_words_he = {"سلم", "ملك", "بيت", "أرض", "كتاب", "مدينة", "شمس",
                     "لسان", "عين", "يمين", "سمع", "قلب", "رأس", "نفس", "دين"}
    seed_words_fa = {"كتاب", "مدرسة", "جمهور", "حكومة", "شكر", "علم", "قانون",
                     "طبيعة", "دين", "مدينة", "جماعة", "حقيقة", "خبر", "سفر",
                     "فكر", "صبر", "قدر", "نفس", "جسم", "روح"}

    for e in entries:
        if e["source"] == "etymwn":
            ar = e["arabicRoot"]
            if ar in seed_words_he:
                print(f"       HE seed '{ar}'→'{e['modernWord']}': hand=cognate, etymwn={e['relation']}")
            if ar in seed_words_fa:
                print(f"       FA seed '{ar}'→'{e['modernWord']}': hand=loanword, etymwn={e['relation']}")

    print(f"\n  Commit: to be added")
