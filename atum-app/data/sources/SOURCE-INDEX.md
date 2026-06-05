# SOURCE-INDEX — NotebookLM Account Access Guide

**Last updated:** 2026-06-05

---

## Auth Problem (Diagnosed)

The NotebookLM CLI stores one Google session at a time in:
```
C:\Users\utilisateur\.notebooklm\storage_state.json
```

Account 1 was the default. Account 2 had its own session file at:
```
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

| ID prefix | Title |
|-----------|-------|
| 722cb689 | أتمولوجيا: المصدر الكهرومغناطيسي للغة والكون |
| 44ddb21a | Kuhn |
| bf582fe1 | Al-Qubaysi |
| a82b08dd | Dawood |
| 4f0561b3 | أصل اللغة: التوافق الكهرومغناطيسي والرموز الكونية |
| e54f09c4 | خريطة إتيمولوجيا "أتوم": الأنماط السبعة واللغة المقدسة |
| c1cfa5f0 | Other Sources |
| baee1960 | علم الفلك الهرمسي وفهم مخطط الميالد الكوني |
| 7af5873a | فيثاغوراس: نغم الأعداد وأسرار الحكمة الإلهية |
| 4379a172 | Animation |

---

## Account 2 Notebooks (account2.json)

| ID prefix | Title | Project Relevance |
|-----------|-------|------------------|
| ba51ed75 | Tawfiq_Al-Mutaqadat (Syncretism) | ✅ Bonacci syncretism |
| 6626e2de | Vibrational Reality: The Science and Spirit of Sacred Sound | ✅ Cymatics/sound |
| 9f57daca | Tenen | ✅ Geometric letter theory |
| b9f26e71 | The Hermetic Mind: Universal Laws and the Cosmic Journey | 🔍 Explore |
| 91b99449 | Atomology: The Original Universal Language1 | ✅ Bonacci v2 |
| 1edf4366 | Atomology: The Original Universal Language | ✅ Bonacci v1 |
| bc5fb1b5 | Vibrations of Being: Sound, Symbolism, and Sacred Geometry | ✅ Sound theory |
| c1606170 | BULL Series Complete: The Universal Force Pattern Framework | ✅ BULL force |
| 8139bad1 | الحلقة الأولى: "هل تتحدث البشرية لغة واحدة بأقنعة مختلفة؟" | ✅ Core thesis |
| f9cf5937 | The Celestial Seal: Astrology and the Human Essence | ❓ Astrological |

---

## Quick Reference — Both Accounts

```powershell
# Account 1
$env:PYTHONUTF8="1"; notebooklm list

# Account 2
$env:PYTHONUTF8="1"; notebooklm --storage "$env:USERPROFILE\.notebooklm\account2.json" list

# Query Account 2 notebook (example: Tenen)
$env:PYTHONUTF8="1"
notebooklm --storage "$env:USERPROFILE\.notebooklm\account2.json" ask "..." --notebook 9f57daca
```
