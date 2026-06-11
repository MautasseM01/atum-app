#!/usr/bin/env python3
"""
Extract Arabic-bridged word pairs from Etymological Wordnet (etymwn.tsv).
Usage: python _process_etymwn.py
Requires: etymwn.tsv in same directory (download from archive.org/details/etymwn-20130208)
Output: etymwn_pairs.json (ready for ccm_etymwn_run.py)
"""
import json, sys
from pathlib import Path
from collections import defaultdict, deque

BASE = Path(__file__).resolve().parent
TSV_PATH = BASE / "etymwn.tsv"
OUT_PATH = BASE / "etymwn_pairs.json"
TARGET_LANGS = {"grc", "ell", "lat", "eng", "fas", "pes", "heb"}
TARGET_READABLE = {"grc":"Ancient Greek","ell":"Modern Greek","lat":"Latin","eng":"English","fas":"Persian","pes":"Persian","heb":"Hebrew"}
GREEK_TO_LATIN = {"α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"e","θ":"th","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"x","ο":"o","π":"p","ρ":"r","σ":"s","τ":"t","υ":"y","φ":"ph","χ":"ch","ψ":"ps","ω":"o","ς":"s"}
HEBREW_TO_LATIN = {"א":"a","ב":"b","ג":"g","ד":"d","ה":"h","ו":"w","ז":"z","ח":"kh","ט":"t","י":"y","כ":"k","ל":"l","מ":"m","נ":"n","ס":"s","ע":"a","פ":"p","צ":"ts","ק":"q","ר":"r","ש":"sh","ת":"th"}
AR_TO_LATIN = {"أ":"hamza","ا":"alef","ب":"baa","ت":"taa","ث":"thaa","ج":"jeem","ح":"haa","خ":"khaa","د":"dal","ذ":"dhal","ر":"raa","ز":"zay","س":"seen","ش":"sheen","ص":"sad","ض":"dhad","ط":"taa2","ظ":"dhaa","ع":"ayn","غ":"ghayn","ف":"faa","ق":"qaf","ك":"kaf","ل":"lam","م":"meem","ن":"noon","ه":"haa2","و":"waw","ي":"yaa"}
AR_DIACRITICS = set("ًٌٍَُِّْ")
LATIN_TO_CLASS = {"h":"G1","j":"G3","y":"G3","c":"G3","k":"G3","q":"G4","t":"G5","d":"G5","z":"G6","s":"G7","r":"G8","l":"G8","n":"G8","b":"G9","f":"G9","m":"G9","p":"G9","v":"G9","x":"G3","w":"G9"}
LETTER_MAPPING = json.load(open(BASE/"phonetic_classes.json"))["letterMapping"]

def load_all_lines():
    ara_lines, all_lines = [], []
    with open(TSV_PATH, encoding="utf-8", errors="replace") as f:
        for i, line in enumerate(f):
            if i % 500000 == 0: print(f"  line {i/1e6:.1f}M...", end="\r")
            line = line.strip()
            if not line: continue
            parts = line.split("\t")
            if len(parts) != 3: continue
            sl, sw = parts[0].split(":", 1); tl, tw = parts[2].split(":", 1)
            tup = (sl, sw, parts[1], tl, tw)
            all_lines.append(tup)
            if sl == "ara": ara_lines.append(tup)
            if tl == "ara": ara_lines.append((tl, tw, parts[1], sl, sw))
    print()
    return ara_lines, all_lines

def extract_paths(ara_lines, all_lines):
    adj = defaultdict(list)
    for sl, sw, r, tl, tw in all_lines:
        adj[(sl, sw)].append((r, tl, tw))
        adj[(tl, tw)].append((r, sl, sw))
    ara_nodes = set()
    for sl, sw, r, tl, tw in ara_lines:
        ara_nodes.add((sl, sw)); ara_nodes.add((tl, tw))
    paths, seen = [], set()
    for an in ara_nodes:
        if an[0] != "ara": continue
        q = deque([(an, [], [])])
        vis = {an: 0}
        while q:
            (cl, cw), pn, pr = q.popleft()
            depth = len(pn)
            if depth > 0 and cl in TARGET_LANGS:
                key = (cw, cl, tw) if cl != an[0] else (an[1], an[0], cw)
                if key not in seen:
                    seen.add(key)
                    paths.append({"ara_word":an[1],"target_lang":cl,"target_word":cw,
                                  "path_len":depth,"path_rels":pr})
                continue
            if depth >= 3: continue
            for r, nl, nw in adj.get((cl, cw), []):
                if (nl, nw) in vis and vis[(nl, nw)] < depth: continue
                vis[(nl, nw)] = depth
                q.append(((nl, nw), pn+[(nl, nw)], pr+[r]))
    return paths

def transliterate(paths):
    out = []
    for p in paths:
        aw = p["ara_word"]; tl = p["target_lang"]; tw = p["target_word"]
        clean_ar = "".join(c for c in aw if c not in AR_DIACRITICS)
        ar_cons = [AR_TO_LATIN.get(c) for c in clean_ar if c in AR_TO_LATIN and AR_TO_LATIN.get(c) not in ("alef","waw","yaa","hamza")][:2]
        lat_text = tw.lower()
        if tl in ("grc","ell"):
            lat_text = "".join(GREEK_TO_LATIN.get(c,c).lower() for c in tw)
        elif tl == "heb":
            lat_text = "".join(HEBREW_TO_LATIN.get(c,c).lower() for c in tw)
        lat_cons = [c for c in lat_text if c.isalpha() and c not in "aeiou"][:2]
        if len(ar_cons) < 2 or len(lat_cons) < 2: continue
        ar_cls = [LETTER_MAPPING.get(c) for c in ar_cons]
        lat_cls = [LATIN_TO_CLASS.get(c) for c in lat_cons]
        if None in ar_cls or None in lat_cls: continue
        pair_map = {"heb":"ar-he","lat":"ar-la","grc":"ar-gr","ell":"ar-gr","eng":"ar-en","fas":"ar-fa","pes":"ar-fa"}
        roman_ar = "".join({"أ":"a","ا":"a","ب":"b","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"dh","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"d","ط":"t","ظ":"dh","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ي":"y"}.get(c,c) for c in clean_ar)
        out.append({
            "arabicRoot": clean_ar, "modernWord": tw, "targetLanguage": tl,
            "arConsonants": ar_cons, "latConsonants": lat_cons,
            "arClasses": ar_cls, "latClasses": lat_cls,
            "match": ar_cls[0]==lat_cls[0] and ar_cls[1]==lat_cls[1],
            "pair": pair_map.get(tl, "unknown"), "relation": "borrowed",
            "path_len": p["path_len"], "path_rels": p["path_rels"],
            "dataset": "etymwn", "romanized_ar": roman_ar, "romanized_target": lat_text,
        })
    return out

if __name__ == "__main__":
    print("Loading etymwn.tsv...")
    ara_lines, all_lines = load_all_lines()
    print(f"  Ara lines: {len(ara_lines)}, All lines: {len(all_lines)}")
    paths = extract_paths(ara_lines, all_lines)
    entries = transliterate(paths)
    print(f"Paths: {len(paths)}, CCM-parseable: {len(entries)}")
    json.dump({"meta":{"source":"etymwn-20130208"},"entries":entries},
              open(OUT_PATH,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"Saved to {OUT_PATH}")
