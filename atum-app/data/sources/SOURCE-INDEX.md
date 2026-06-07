# SOURCE-INDEX — NotebookLM Account Access Guide

**Last updated:** 2026-06-07 (v1.4)

---

## Auth Problem (Diagnosed)

The NotebookLM CLI stores one Google session at a time in:

```text
C:\Users\utilisateur\.notebooklm\storage_state.json
```

Account 1 was the default. Account 2 had its own session file at:

```text
C:\Users\utilisateur\.notebooklm\account2.json
```

The CLI was never given the `--storage` flag, so it always used Account 1's
session — making Account 2 notebooks return "RPC GET_NOTEBOOK failed".

---

## Fix: Use `--storage` Flag

The CLI accepts `--storage PATH` as a **global option** before any command.

### Account 1 (default — no flag needed)

```powershell
$env:PYTHONUTF8="1"
notebooklm list
notebooklm ask "..." --notebook <id>
```

### Account 2

```powershell
$env:PYTHONUTF8="1"
notebooklm --storage "C:\Users\utilisateur\.notebooklm\account2.json" list
notebooklm --storage "C:\Users\utilisateur\.notebooklm\account2.json" ask "..." --notebook <id>
```

---

## Account 1 Notebooks (storage_state.json)

| ID prefix | Title | Extraction Status |
| --------- | ----- | ----------------- |
| 722cb689 | أتمولوجيا: المصدر الكهرومغناطيسي للغة والكون | ✅ mined — chat-insights/*/electromagnetic-language.md + root-geographic-mapping.md |
| 44ddb21a | Kuhn | ✅ done — kuhn-consciousness.md |
| bf582fe1 | Al-Qubaysi | ✅ done — qubaysi-ibdal.md |
| a82b08dd | Dawood | ✅ done — dawood-method.md |
| 4f0561b3 | أصل اللغة: التوافق الكهرومغناطيسي والرموز الكونية | ✅ mined — content merged into electromagnetic-source.md + seven-patterns-deep.md |
| e54f09c4 | خريطة إتيمولوجيا "أتوم": الأنماط السبعة واللغة المقدسة | ✅ mined — atum-etymology-map.md + seven-patterns-deep.md |
| c1cfa5f0 | Other Sources | ✅ done — other-sources.md (2026-06-07) |
| baee1960 | علم الفلك الهرمسي وفهم مخطط الميالد الكوني | 🚫 excluded — out of scope (Hermetic astrology/natal charts, no linguistic content) |
| 7af5873a | فيثاغوراس: نغم الأعداد وأسرار الحكمة الإلهية | 🚫 excluded — out of scope (Pythagorean numerology, no Arabic etymology content) |
| 4379a172 | Animation | 🚫 excluded — out of scope (visual production content, not research) |

---

## Account 2 Notebooks (account2.json)

| ID prefix | Title | Extraction Status |
| --------- | ----- | ----------------- |
| ba51ed75 | Tawfiq\_Al-Mutaqadat (Syncretism) | ✅ updated — syncretism-core.md + new §7 from 2026 sources (2026-06-07) |
| 6626e2de | Vibrational Reality | ✅ done — vibration.md |
| 9f57daca | Tenen | ✅ done — tenen-geometry.md |
| b9f26e71 | The Hermetic Mind | ✅ done — hermetic-mind.md |
| 91b99449 | Atomology v1 (Original Universal Language1) | ✅ done — atomology-universal.md |
| 1edf4366 | Atomology v2 (Original Universal Language) | ✅ done — merged into atomology-universal.md |
| bc5fb1b5 | Vibrations of Being | ✅ done — sacred-sound.md |
| c1606170 | BULL Series Complete | ⚠️ marketing/ — bull-force.md extracted; note: this notebook is marketing content (BULL/branding), not primary research. Belongs in marketing/ not research/. |
| 8139bad1 | الحلقة الأولى | ✅ done — one-language.md |
| f9cf5937 | The Celestial Seal: Astrology | 🚫 excluded — out of scope (astrological, no linguistic methodology) |

---

## Chat Insights — Topic Index (chat-insights/[lang]/[topic].md)

All 8 topics exist in EN + AR + FR:

| Topic File | Key Content |
|-----------|-------------|
| `atum-bull-tor-framework.md` | Causal vs instrumental words; three root energies |
| `letter-pictographs.md` | Aleph=bull head, AB=father, pictographic origins |
| `electromagnetic-language.md` | R/L cosmic consonants, torus theory, pulse vs wave |
| `content-strategy-insights.md` | Persona 1+2 narrative formulas |
| `monad-diad-trinity.md` | Three levels of existence (Atomology v1) |
| `letter-zodiac-calendar.md` | 8-spoke wheel, M=meridian, Ramadan analysis ❓ |
| `hermetic-principles-language.md` | Al-aḍdād 🔬, ibdal causality 🔬, Hermetic laws |
| `root-geographic-mapping.md` | SAR/MAR/RAB roots, R=radiation/L=gravitation confirmed 🔬 |

---

## Quick Reference — Both Accounts

```powershell
# Account 1
$env:PYTHONUTF8="1"; notebooklm list

# Account 2
$env:PYTHONUTF8="1"; notebooklm --storage "$env:USERPROFILE\.notebooklm\account2.json" list

# Query Account 2 notebook (example: Hermetic Mind)
$env:PYTHONUTF8="1"
notebooklm --storage "$env:USERPROFILE\.notebooklm\account2.json" ask "..." --notebook b9f26e71
```
