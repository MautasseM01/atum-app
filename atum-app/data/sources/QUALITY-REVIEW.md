# Quality Review — Non-Scientific Claims Audit

**Date:** 2026-06-05
**Reviewer:** Claude Code (automated scan + manual check)
**Scope:** All files in `data/sources/`

---

## ✅ Status: All Files Have Trust Markers

Every claim in `data/sources/` carries a trust marker (🔬🧩🔍❓).
No untagged assertions found.

---

## 🔴 High-Priority: Claims Requiring Human Review

These claims appear in concept files and are flagged ❓ or 🔍. A human reviewer should verify the disclaimer language is sufficient before these concepts are shown to users.

| File | Claim | Current Flag | Action Needed |
|------|-------|-------------|---------------|
| `concepts/*/atomology-original.md` | Allah = Baal etymology | ❌ excluded | ✅ Explicitly excluded — disclaimer present |
| `concepts/*/cosmic-symbols.md` | Flat earth references | ❌ excluded | ✅ Explicitly excluded — section 5 disclaimer |
| `concepts/*/cosmic-symbols.md` | "English = language of angels" | ❌ excluded | ✅ Explicitly excluded — section 5 disclaimer |
| `concepts/*/wormhole-letter.md` | Letters as quantum wormholes | 🔍 | ⚠️ Needs more explicit disclaimer that this is metaphor not physics |
| `concepts/*/bull-force.md` | Centrifugal/centripetal physics claims | 🔍🧩 | ⚠️ Review that no specific physics numbers are stated as fact |
| `concepts/*/syncretism-core.md` | Wormhole / counter-space claims | 🔍 | ⚠️ Mentions "counter space" — flag if shown to academic audiences |
| `concepts/*/vibrational-reality.md` | R=proton / L=electron | 🔍 | ⚠️ Metaphorical mapping, not physical chemistry — disclaimer sufficient |
| `chat-insights/*/electromagnetic-language.md` | "Magnetism 10 billion times stronger" | ❓ | ✅ Flagged ❓ and explicitly marked as not academic physics |

---

## 🟡 Medium-Priority: Claims That Need Corpus Expansion

These claims are plausible but based on small corpora. Marked 🧩 — need upgrade to 🔬 with larger datasets.

| Claim | Current Support | Upgrade Path |
|-------|----------------|-------------|
| Ra = outward movement | p=0.028, ~50 roots 🧩 | Expand corpus to Lisaan al-Arab 10,000+ roots |
| ~50% words end in ATUM/BULL/TOR suffixes | Assertion only 🔍 | Statistical test on etymology_bridge.csv |
| Seven universal suffix patterns | Cross-language attestation only 🧩 | Formal morphological analysis |
| ATUM first pattern = source of 7 | Framework claim 🧩 | Comparative linguistics literature |

---

## 🟢 Confirmed Scientific Claims — Do Not Weaken

These have solid statistical backing. Do NOT downgrade their confidence markers.

| Claim | Evidence | Marker |
|-------|----------|--------|
| Lam = contraction | p<0.0001, z=4.92 | 🔬 |
| Abjad × frequency correlation | r=−0.693, p<0.0001 | 🔬 |
| CNN v2 accuracy | 99.7% on 27 letters | 🔬 |
| Aleph = bull's head (archaeology) | Archaeological documentation | 🔬 |
| Ibdal: 68% adjacent articulation | Al-Qubaysi 75 rules | 🔬 |
| Proto-World *MA | 847+ languages | 🔬 |
| Arabic-Latin sound shifts | etymology_bridge.csv 96 rows | 🔬🧩 |

---

## Files Checked in This Audit

- `concepts/ar/en/fr/` — 30+ concept files ✅
- `word-insights/ar/en/fr/` — 57+ word insight files ✅
- `chat-insights/ar/en/fr/` — 12 new files ✅
- No files without trust markers found

---

## Recommendation for App Team (STEP 3)

> **STEP 3 is BLOCKED** — app code ownership constraint.
> 
> `INDEX.json` now has **20 concepts** (c001–c030).
> The app's `CONCEPT_GROUPS` must be updated to display all 20.
> Files to update: wherever `CONCEPT_GROUPS` is defined in the app code.
> This touches app source — requires Open Code team action.
