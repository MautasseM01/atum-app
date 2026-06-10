#!/usr/bin/env python3
"""
PHASE 3 — Baseline comparison for CCM Algorithm
================================================
Computes:
  1. Permutation test (1000 iterations) — random class assignment
  2. Levenshtein distance baseline
  3. p-values + Bonferroni correction
  4. Verdict per pair (🔬🧩❓)

Pre-registered verdict rule (set before running):
  🔬 p < 0.01  (Bonferroni: α = 0.05 / 5 pairs = 0.01)
  🧩 p < 0.10  (suggestive)
  ❓ p >= 0.10 (no better than chance)

Usage: python baseline_ccm.py
"""

import json, random, math
from pathlib import Path
from collections import defaultdict

BASE = Path(__file__).resolve().parent
DATA = BASE.parent.parent / "data"

random.seed(20260610)  # reproducible

# ── Load data ──
with open(BASE / "phonetic_classes.json", encoding="utf-8") as f:
    classes_data = json.load(f)

with open(DATA / "etymologies.json", encoding="utf-8") as f:
    etym = json.load(f)

bridge = etym["bridge"]
letter_mapping = classes_data["letterMapping"]
all_classes = sorted(set(letter_mapping.values()))  # 9 classes

# ── Latin→CCM class mapping (from Phase 2) ──
LATIN_TO_CLASS = {
    "h": "G1",
    "j": "G3", "y": "G3", "c": "G3", "k": "G3",
    "q": "G4",
    "t": "G5", "d": "G5",
    "z": "G6",
    "s": "G7",
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

# ── Helpers ──

def first2_ar_cons(root_str):
    root = root_str.split("/")[0]
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


# ── Supplemental: documented Arabic-Hebrew cognates (Semitic) ──
# Source: Common Semitic word stock — Hebrew roots in Latin transcription
HE_SUPPLEMENT = [
    # (arabic_root, hebrew_word, note)
    ("سلم", "Shalom", "peace — S-L-M / SH-L-M"),
    ("ملك", "Melekh", "king/queen — M-L-K / M-L-KH"),
    ("بيت", "Bayit", "house — B-Y-T / B-Y-T"),
    ("أرض", "Erets", "earth — ʔ-R-Dˤ / ʔ-R-TS"),
    ("كتاب", "Ktav", "writing — K-T-B / K-T-V"),
    ("مدينة", "Medina", "state — M-D-N / M-D-N"),
    ("شمس", "Shemesh", "sun — SH-M-S / SH-M-SH"),
    ("لسان", "Lashon", "tongue — L-S-N / L-SH-N"),
    ("عين", "Ayin", "eye — ʕ-Y-N / ʕ-Y-N"),
    ("يمين", "Yamin", "right hand — Y-M-N / Y-M-N"),
    ("سمع", "Shama", "hear — S-M-ʕ / SH-M-ʕ"),
    ("قلب", "Lev", "heart — Q-L-B / L-V"),
    ("رأس", "Rosh", "head — R-ʔ-S / R-SH"),
    ("ماء", "Mayim", "water — M-ʔ / M-Y-M"),
    ("نفس", "Nefesh", "soul — N-F-S / N-F-SH"),
    ("أخ", "Akh", "brother — ʔ-KH / ʔ-KH"),
    ("أم", "Em", "mother — ʔ-M / ʔ-M"),
    ("أب", "Av", "father — ʔ-B / ʔ-V"),
    ("يد", "Yad", "hand — Y-D / Y-D"),
    ("دين", "Din", "judgment — D-Y-N / D-N"),
]

# ── Supplemental: Arabic→Persian loanwords (heavy borrowing) ──
# Source: documented Arabic loanwords in Persian (John Perry, "Arabic loanwords in Persian")
FA_SUPPLEMENT = [
    # (arabic_root, persian_word, note)
    ("كتاب", "Ketab", "book — Arabic loanword"),
    ("مدرسة", "Madrese", "school — Arabic loanword"),
    ("جمهور", "Jomhur", "republic — Arabic loanword"),
    ("حكومة", "Hokumat", "government — Arabic loanword"),
    ("شكر", "Tashakor", "thanks — Arabic šukr"),
    ("علم", "Elm", "science — Arabic ʕilm"),
    ("قانون", "Ghanun", "law — Arabic qānūn"),
    ("طبيعة", "Tabiat", "nature — Arabic ṭabīʕa"),
    ("دين", "Din", "religion — Arabic dīn"),
    ("مدينة", "Madine", "city — Arabic madīna"),
    ("جماعة", "Jamaat", "group — Arabic jamāʕa"),
    ("حقيقة", "Haghigha", "truth — Arabic ḥaqīqa"),
    ("خبر", "Khabar", "news — Arabic khabar"),
    ("سفر", "Safar", "travel — Arabic safar"),
    ("فكر", "Fekr", "thought — Arabic fikr"),
    ("صبر", "Sabr", "patience — Arabic ṣabr"),
    ("قدر", "Ghadr", "power/fate — Arabic qadr"),
    ("نفس", "Nafas", "breath — Arabic nafas"),
    ("جسم", "Jesm", "body — Arabic jism"),
    ("روح", "Ruh", "spirit — Arabic rūḥ"),
]


def parse_supplement(supp_list, pair_key):
    """Parse a supplement list into entry objects compatible with bridge."""
    entries = []
    for ar_root, target_word, note in supp_list:
        first_ar = first2_ar_cons(ar_root)
        first_lat = first2_lat_cons(target_word)
        if len(first_ar) < 2 or len(first_lat) < 2:
            continue
        ar_cls = [letter_mapping.get(c) for c in first_ar]
        lat_cls = [LATIN_TO_CLASS.get(c) for c in first_lat]
        if None in ar_cls or None in lat_cls:
            continue
        match = (ar_cls[0] == lat_cls[0] and ar_cls[1] == lat_cls[1])
        entries.append({
            "pair": pair_key,
            "id": f"SUPP_{pair_key}_{len(entries)+1}",
            "arabicRoot": ar_root,
            "modernWord": target_word,
            "arConsonants": first_ar,
            "latConsonants": first_lat,
            "arClasses": ar_cls,
            "latClasses": lat_cls,
            "match": match,
            "note": note,
            "dataset": "supplemental_documented"
        })
    return entries


# ── Build master entry list ──
def build_entries(bridge_data, supplement_data):
    entries = []
    for entry in bridge_data:
        ar_root = entry.get("arabicRoot", "")
        modern_word = entry.get("modernWord", "")
        if not ar_root or not modern_word:
            continue
        first_ar = first2_ar_cons(ar_root)
        first_lat = first2_lat_cons(modern_word)
        if len(first_ar) < 2 or len(first_lat) < 2:
            continue
        ar_cls = [letter_mapping.get(c) for c in first_ar]
        lat_cls = [LATIN_TO_CLASS.get(c) for c in first_lat]
        if None in ar_cls or None in lat_cls:
            continue
        match = (ar_cls[0] == lat_cls[0] and ar_cls[1] == lat_cls[1])
        pairs = get_lang_pairs(
            entry.get("targetLanguage", ""),
            entry.get("languagePath", "")
        )
        for pk in pairs:
            entries.append({
                "pair": pk,
                "id": entry.get("id", "??"),
                "arabicRoot": ar_root,
                "modernWord": modern_word,
                "arConsonants": first_ar,
                "latConsonants": first_lat,
                "arClasses": ar_cls,
                "latClasses": lat_cls,
                "match": match,
                "dataset": "etymology_bridge"
            })

    # Add supplemental
    for e in supplement_data:
        entries.append(e)

    return entries


# ── CCM scorer ──
def ccm_rate(entries, pair_key):
    pair_entries = [e for e in entries if e["pair"] == pair_key]
    if not pair_entries:
        return 0.0, 0, 0
    matches = sum(1 for e in pair_entries if e["match"])
    total = len(pair_entries)
    return matches / total, matches, total


def ccm_rate_with_mapping(entries, pair_key, mapping_ar, mapping_lat=None):
    """Compute CCM rate with custom letter→class mappings.
    
    mapping_ar: Arabic letter name → class (shuffled in permutation test)
    mapping_lat: Latin letter → class (fixed = LATIN_TO_CLASS)
    """
    if mapping_lat is None:
        mapping_lat = LATIN_TO_CLASS
    pair_entries = [e for e in entries if e["pair"] == pair_key]
    if not pair_entries:
        return 0.0
    matches = 0
    for e in pair_entries:
        c1 = mapping_ar.get(e["arConsonants"][0]) if len(e["arConsonants"]) >= 1 else None
        c2 = mapping_ar.get(e["arConsonants"][1]) if len(e["arConsonants"]) >= 2 else None
        c3 = mapping_lat.get(e["latConsonants"][0]) if len(e["latConsonants"]) >= 1 else None
        c4 = mapping_lat.get(e["latConsonants"][1]) if len(e["latConsonants"]) >= 2 else None
        if None not in (c1, c2, c3, c4) and c1 == c3 and c2 == c4:
            matches += 1
    return matches / len(pair_entries)


# ── Levenshtein baseline ──
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


def levenshtein_rate(entries, pair_key):
    """Mean Levenshtein distance across class sequences for a pair."""
    pair_entries = [e for e in entries if e["pair"] == pair_key]
    if not pair_entries:
        return 0.0
    dists = []
    for e in pair_entries:
        ar_seq = "".join(e["arClasses"])
        lat_seq = "".join(e["latClasses"])
        dists.append(levenshtein(ar_seq, lat_seq))
    return sum(dists) / len(dists)


# ── Permutation test ──
def permutation_test(entries, pair_key, n_iter=1000):
    """
    Shuffle class assignments, recompute CCM rate.
    Returns (p_value, null_rates) where p = P(null >= observed).
    """
    observed, _, _ = ccm_rate(entries, pair_key)
    pair_entries = [e for e in entries if e["pair"] == pair_key]
    if not pair_entries:
        return 1.0, []

    all_letters = list(letter_mapping.keys())
    null_rates = []

    for _ in range(n_iter):
        shuffled_ar = {k: random.choice(all_classes) for k in all_letters}
        rate = ccm_rate_with_mapping(entries, pair_key, shuffled_ar, LATIN_TO_CLASS)
        null_rates.append(rate)

    # p-value: proportion of null >= observed (one-tailed test for beats-baseline)
    p_value = sum(1 for r in null_rates if r >= observed) / n_iter
    return p_value, null_rates


# ── 95% CI via bootstrap ──
def bootstrap_ci(entries, pair_key, n_iter=1000):
    pair_entries = [e for e in entries if e["pair"] == pair_key]
    if not pair_entries:
        return (0, 0)
    rates = []
    for _ in range(n_iter):
        sample = [random.choice(pair_entries) for _ in pair_entries]
        m = sum(1 for e in sample if e["match"])
        rates.append(m / len(sample))
    rates.sort()
    return (rates[25], rates[974])  # 95% CI


# ── Main ──
if __name__ == "__main__":
    print("=" * 72)
    print("  CCM ALGORITHM — PHASE 3: BASELINE COMPARISON")
    print("  Pre-registered verdict rule:")
    print("    🔬 p < 0.01 (Bonferroni: α = 0.05 / 5 pairs = 0.01)")
    print("    🧩 p < 0.10 (suggestive)")
    print("    ❓ p ≥ 0.10 (no better than chance)")
    print("=" * 72)

    # Build master entries
    supp_data = []
    supp_data += parse_supplement(HE_SUPPLEMENT, "ar-he")
    supp_data += parse_supplement(FA_SUPPLEMENT, "ar-fa")
    entries = build_entries(bridge, supp_data)

    print(f"\n  Bridge entries: {len(bridge)}")
    print(f"  Supplemental entries: {len(supp_data)} (Hebrew: {sum(1 for e in supp_data if e['pair']=='ar-he')}, Persian: {sum(1 for e in supp_data if e['pair']=='ar-fa')})")
    print(f"  Total entries: {len(entries)}")

    # Per-pair counts
    print(f"\n{'Pair':<22} {'Bridge':>7} {'Supp.':>6} {'Total':>7}")
    print("-" * 45)
    for pk in LANG_ORDER:
        b_count = sum(1 for e in entries if e["pair"] == pk and e["dataset"] == "etymology_bridge")
        s_count = sum(1 for e in entries if e["pair"] == pk and e["dataset"] == "supplemental_documented")
        t_count = b_count + s_count
        print(f"  {LANG_NAMES[pk]:<20} {b_count:>7} {s_count:>6} {t_count:>7}")

    print()

    # ── Run comparisons ──
    results_list = []
    for pk in LANG_ORDER:
        observed, matches, total = ccm_rate(entries, pk)
        if total == 0:
            results_list.append({
                "pair": pk,
                "name": LANG_NAMES[pk],
                "observed": 0,
                "matches": 0,
                "total": 0,
                "random_mean": 0,
                "p_value": 1.0,
                "ci": (0, 0),
                "levenshtein": 0,
                "verdict": "❓",
                "verdict_detail": "insufficient data"
            })
            continue

        # Permutation test
        p_value, null_rates = permutation_test(entries, pk, 1000)
        random_mean = sum(null_rates) / len(null_rates) if null_rates else 0

        # 95% CI
        ci = bootstrap_ci(entries, pk)

        # Levenshtein
        lev = levenshtein_rate(entries, pk)

        # Verdict
        if p_value < 0.01:
            verdict = "🔬"
            vd = f"beats baseline p={p_value:.4f} (Bonferroni p<0.01)"
        elif p_value < 0.10:
            verdict = "🧩"
            vd = f"suggestive p={p_value:.4f} (raw p<0.10, not Bonferroni-significant)"
        else:
            verdict = "❓"
            vd = f"no better than chance p={p_value:.4f}"

        results_list.append({
            "pair": pk,
            "name": LANG_NAMES[pk],
            "observed": observed,
            "matches": matches,
            "total": total,
            "random_mean": random_mean,
            "p_value": p_value,
            "ci": ci,
            "levenshtein": lev,
            "verdict": verdict,
            "verdict_detail": vd,
            "null_samples": null_rates[:5]  # first 5 for inspection
        })

    # ── Output ──
    print("=" * 72)
    print("  BASELINE RESULTS")
    print("=" * 72)
    header = f"{'Pair':<20} {'Observed':>9} {'Random Ø':>9} {'p-value':>8} {'95% CI':>18} {'Lev':>5} {'Verdict':>3}"
    print(f"\n  {header}")
    print("  " + "-" * 72)
    for r in results_list:
        ci_str = f"({r['ci'][0]*100:.1f}–{r['ci'][1]*100:.1f}%)" if r['total'] > 0 else "—"
        line = f"{r['name']:<20} {r['observed']*100:>8.1f}% {r['random_mean']*100:>8.1f}% {r['p_value']:>8.4f} {ci_str:>18} {r['levenshtein']:>5.2f} {r['verdict']:>3}"
        print(f"  {line}")

    # ── Comparison: ordering survived? ──
    print(f"\n{'='*72}")
    print("  ORDERING TEST: Latin > English > Greek — did it survive?")
    print(f"{'='*72}")
    print("  (Only bridge data; supplemental only added for Hebrew/Persian)")

    # Check bridge-only ordering
    bridge_only_entries = [e for e in entries if e["dataset"] == "etymology_bridge"]
    bridge_results = {}
    for pk in LANG_ORDER:
        r, m, t = ccm_rate(bridge_only_entries, pk)
        bridge_results[pk] = {"rate": r, "matches": m, "total": t}

    for pk in ["ar-la", "ar-en", "ar-gr"]:
        r = bridge_results[pk]
        print(f"    {LANG_NAMES[pk]}: {r['rate']*100:.1f}% ({r['matches']}/{r['total']}) — bridge only")

    # Check ordering
    la_r = bridge_results["ar-la"]["rate"]
    en_r = bridge_results["ar-en"]["rate"]
    gr_r = bridge_results["ar-gr"]["rate"]

    ordering_survived = (la_r >= en_r >= gr_r) or (la_r > en_r and en_r >= gr_r)
    print(f"\n    Latin ({la_r*100:.1f}%) >= English ({en_r*100:.1f}%) >= Greek ({gr_r*100:.1f}%): {'YES ✓' if ordering_survived else 'NO ✗'}")

    # ── Final output ──
    print(f"\n{'='*72}")
    print("  SUMMARY")
    print(f"{'='*72}")
    for r in results_list:
        if r["total"] == 0:
            print(f"  {r['name']}: ❓ insufficient data")
        else:
            bonf_note = ""
            if r["p_value"] < 0.01:
                bonf_note = " — survives Bonferroni"
            elif r["p_value"] < 0.05:
                bonf_note = " — raw p<0.05 but fails Bonferroni (α=0.01)"
            print(f"  {r['verdict']} {r['name']}: {r['observed']*100:.1f}% vs random {r['random_mean']*100:.1f}% (p={r['p_value']:.4f}{bonf_note})")

    print(f"\n  Note: Results marked 🔍 exploratory, not for academic claims.")
    print(f"  Data sources: etymology_bridge.csv + supplemental documented cognates for Hebrew & Persian.")
