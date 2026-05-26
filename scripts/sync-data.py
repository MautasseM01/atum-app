"""
sync-data.py — ATUM Data Pipeline
==================================
STEP 2: Sync script that reads from multiple source files and writes
consolidated JSON files to atum-app/data/.

Reads from:
  - etymology_bridge.csv    (85 documented Arabic→European etymologies)
  - ibdal_rules.csv         (75 phonetic substitution rules — Al-Qubaysi)
  - letters-dna.json        (28 Arabic letters + DNA data)
  - etymology-database.json (5,083 classified words)
  - rootPatterns.ts         (reference for root patterns and flashcard data)

Writes to:
  - atum-app/data/etymologies.json
  - atum-app/data/ibdalRules.json
  - atum-app/data/letters.json
  - atum-app/data/rootPatterns.json

Usage:
  python scripts/sync-data.py
"""

import csv
import json
import os
import re
import sys
from datetime import datetime

# ── Paths ──────────────────────────────────────────────────────────────────

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_DIR = os.path.join(PROJECT_ROOT, 'data')

OBSIDIAN_DIR = r'C:\Projects\_ACTIVE\Obsidian Vault\Language\Language-Datasets'
SOURCE_ALL_LANG = r'C:\Projects\_ACTIVE\languge\Sacred-Language-Content\source-of-all-Language'
SOURCE_APP = os.path.join(SOURCE_ALL_LANG, 'source-of-all-language')

ETYMOLOGY_BRIDGE_CSV = os.path.join(OBSIDIAN_DIR, 'etymology_bridge.csv')
IBDAL_RULES_CSV = os.path.join(OBSIDIAN_DIR, 'ibdal_rules.csv')
ETYMOLOGY_DATABASE_JSON = os.path.join(SOURCE_APP, 'public', 'data', 'etymology-database.json')
LETTERS_DNA_JSON = os.path.join(SOURCE_ALL_LANG, 'data', 'letters-dna.json')
LETTERS_DNA_JSON_ALT = os.path.join(
    r'C:\Projects\_ACTIVE\languge\source-of-all-Language', 'data', 'letters-dna.json'
)
LETTERS_TS = os.path.join(
    r'C:\Projects\_ACTIVE\languge\Abjd\abjad\src\data', 'letters.ts'
)
ROOT_PATTERNS_TS = os.path.join(
    r'C:\Projects\_ACTIVE\languge\App\sacred-word-flow\src\data', 'rootPatterns.ts'
)

SEP = '=' * 50


# ── Helpers ────────────────────────────────────────────────────────────────

def ensure_dir(directory):
    os.makedirs(directory, exist_ok=True)


def load_json(path, default=None):
    if not os.path.exists(path):
        print(f'  !! File not found: {path}')
        return default if default is not None else []
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(path, data):
    ensure_dir(os.path.dirname(path))
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'  ✓  Saved: {path}')


def load_csv(path):
    rows = []
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


# ── 1. Build etymologies.json ────────────────────────────────────────────

def build_etymologies():
    print(f'\n{SEP}')
    print('[1/5] Building etymologies.json')
    print(SEP)

    # Read bridge from CSV (85 documented etymologies)
    if not os.path.exists(ETYMOLOGY_BRIDGE_CSV):
        print(f'  !! etymology_bridge.csv not found at {ETYMOLOGY_BRIDGE_CSV}')
        return

    csv_rows = load_csv(ETYMOLOGY_BRIDGE_CSV)
    print(f'  Read {len(csv_rows)} rows from etymology_bridge.csv')

    bridge_entries = []
    for row in csv_rows:
        eid = row.get('Etym_ID', '').strip()
        if not eid:
            continue
        entry = {
            'id': eid,
            'arabicRoot': row.get('Arabic_Root', '').strip(),
            'arabicForm': row.get('Arabic_Form', '').strip(),
            'arabicMeaning': row.get('Arabic_Meaning', '').strip(),
            'modernWord': row.get('Modern_Word', '').strip(),
            'modernMeaning': row.get('Modern_Meaning', '').strip(),
            'targetLanguage': row.get('Target_Language', '').strip(),
            'transformationRule': row.get('Transformation_Rule', '').strip(),
            'ibdalIDs': row.get('Ibdal_IDs', '').strip(),
            'intermediateForm': row.get('Intermediate_Form', '').strip(),
            'languagePath': row.get('Language_Path', '').strip(),
            'domain': row.get('Domain', '').strip(),
            'dawoodEpisode': row.get('Dawood_Episode', '').strip(),
            'confidence': row.get('Confidence', '').strip(),
            'notes': row.get('Notes', '').strip(),
            'dataset': 'etymology_bridge',
        }
        bridge_entries.append(entry)

    # Read database from the 5,083-word JSON
    db_words = load_json(ETYMOLOGY_DATABASE_JSON, [])
    print(f'  Read {len(db_words)} words from etymology-database.json')

    # Build database section — all 5,083 words
    database_entries = []
    for i, w in enumerate(db_words, start=1):
        entry = {
            'id': i,
            'word': w.get('word', ''),
            'root': w.get('root', 'UNKNOWN'),
            'etymology': w.get('etymology', ''),
            'meaning': w.get('meaning', ''),
            'confidence': w.get('confidence', 0.0),
            'source': w.get('source', 'unknown'),
            'validated': w.get('validated', False),
            'timestamp': w.get('timestamp', ''),
            'dataset': 'etymology_database',
        }
        # Carry over any extra fields
        for key in ('arabicRoot', 'arabicForm', 'arabicMeaning',
                     'targetLanguage', 'transformationRule', 'languagePath',
                     'domain', 'ibdalIds', 'dawoodEpisode', 'notes',
                     'patterns', 'dateAdded', 'intermediateForms', 'dnaConfidence',
                     'etymId'):
            if key in w:
                entry[key] = w[key]
        database_entries.append(entry)

    out = {
        'meta': {
            'description': 'Unified etymology dataset — Arabic Linguistic DNA project',
            'sources': [
                'etymology_bridge.csv (research grade, 85 entries)',
                'etymology-database.json (ATUM/BULL/TOR classification, 5,083 words)',
            ],
            'bridgeCount': len(bridge_entries),
            'databaseCount': len(database_entries),
            'total': len(bridge_entries) + len(database_entries),
            'lastSync': datetime.now().isoformat(),
        },
        'bridge': bridge_entries,
        'database': database_entries,
    }

    save_json(os.path.join(DATA_DIR, 'etymologies.json'), out)
    print(f'  Bridge entries: {len(bridge_entries)}')
    print(f'  Database entries: {len(database_entries)}')
    print(f'  Total: {len(bridge_entries) + len(database_entries)}')


# ── 2. Build ibdalRules.json ─────────────────────────────────────────────

def build_ibdal_rules():
    print(f'\n{SEP}')
    print('[2/5] Building ibdalRules.json')
    print(SEP)

    if not os.path.exists(IBDAL_RULES_CSV):
        print(f'  !! ibdal_rules.csv not found at {IBDAL_RULES_CSV}')
        return

    rows = load_csv(IBDAL_RULES_CSV)
    print(f'  Read {len(rows)} rows from ibdal_rules.csv')

    rules = []
    for row in rows:
        rid = row.get('Ibdal_ID', '').strip()
        if not rid:
            continue
        rule = {
            'id': rid,
            'letter1': row.get('Letter_1', '').strip(),
            'letter2': row.get('Letter_2', '').strip(),
            'letter1Latin': row.get('Letter_1_Latin', '').strip(),
            'letter2Latin': row.get('Letter_2_Latin', '').strip(),
            'makhrajGroup1': row.get('Makhraj_Group_1', '').strip(),
            'makhrajGroup2': row.get('Makhraj_Group_2', '').strip(),
            'makhrajDistance': row.get('Makhraj_Distance', '').strip(),
            'exampleWordL1': row.get('Example_Word_L1', '').strip(),
            'exampleWordL2': row.get('Example_Word_L2', '').strip(),
            'languageContext': row.get('Language_Context', '').strip(),
            'ibdalType': row.get('Ibdal_Type', '').strip(),
            'dialectFrom': row.get('Dialect_From', '').strip(),
            'dialectTo': row.get('Dialect_To', '').strip(),
            'dawoodLink': row.get('Dawood_Link', '').strip(),
            'confidence': row.get('Confidence', '').strip(),
            'notes': row.get('Notes', '').strip(),
        }
        rules.append(rule)

    out = {
        'meta': {
            'description': '75 phonetic substitution (ibdal) rules — Al-Qubaysi: Philology of Arabic Dialects (800 pages)',
            'source': 'ibdal_rules.csv — Al-Qubaysi',
            'keyFinding': '68% of ibdal rules occur between phonetically adjacent letters (same makhraj group)',
            'total': len(rules),
        },
        'rules': rules,
    }

    save_json(os.path.join(DATA_DIR, 'ibdalRules.json'), out)
    print(f'  Rules: {len(rules)}')


# ── 3. Build letters.json ─────────────────────────────────────────────────

def parse_letters_ts(path):
    """Extract letter data from the TypeScript file using regex."""
    if not os.path.exists(path):
        return None

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    letters = []
    # Find each letter object block: { id: N, ... },
    pattern = r'\{\s*id:\s*(\d+),\s*phoenician:\s*"([^"]*)",\s*arabic:\s*"([^"]*)",'
    for m in re.finditer(pattern, content):
        lid = int(m.group(1))
        phoenician = m.group(2)
        arabic = m.group(3)
        letters.append({'id': lid, 'phoenician': phoenician, 'arabic': arabic})

    return letters


def build_letters():
    print(f'\n{SEP}')
    print('[3/5] Building letters.json')
    print(SEP)

    # Try letters-dna.json first (28 letters, rich DNA data)
    letters_dna_path = LETTERS_DNA_JSON
    if not os.path.exists(letters_dna_path):
        letters_dna_path = LETTERS_DNA_JSON_ALT
    if os.path.exists(letters_dna_path):
        raw = load_json(letters_dna_path, [])
        print(f'  Read {len(raw)} letters from letters-dna.json')

        # Also try to get descriptions from letters.ts
        ts_letters = parse_letters_ts(LETTERS_TS) if os.path.exists(LETTERS_TS) else None
        if ts_letters:
            print(f'  Read {len(ts_letters)} letters from letters.ts (for descriptions)')

        letters_out = []
        for item in raw:
            letter = {
                'id': letters_out.__len__() + 1,
                'arabic': item.get('letter', ''),
                'name': item.get('name', ''),
                'nameAr': item.get('name', ''),
                'abjadValue': item.get('abjadValue', 0),
                'element': item.get('element', ''),
                'dna': {
                    'semanticDepth': item.get('semanticDepth'),
                    'fundamentalFreqHz': item.get('fundamentalFreqHz'),
                    'corpusFrequency': item.get('corpusFrequency'),
                    'energyType': item.get('energyType', ''),
                    'mataqadatClass': item.get('mataqadatClass', ''),
                    'phonosemanticVerdict': item.get('phonosemanticVerdict', ''),
                    'cnnConfirmed': item.get('cnnConfirmed', False),
                },
            }
            letters_out.append(letter)

        out = {
            'meta': {
                'description': f'{len(letters_out)} Arabic letters with Abjad values, elements, and DNA data',
                'sources': [
                    'letters-dna.json (Arabic Linguistic DNA — Kaggle)',
                    'letters.ts (abjad app)',
                ],
                'cnnAccuracy': '99.7%',
                'lamContraction': 'p<0.0001',
                'raExpansion': 'p=0.028',
                'total': len(letters_out),
            },
            'letters': letters_out,
        }
    else:
        # Fallback: try to parse letters.ts directly
        print('  letters-dna.json not found, parsing letters.ts...')
        ts_data = parse_letters_ts(LETTERS_TS)
        if ts_data:
            out = {
                'meta': {
                    'description': f'{len(ts_data)} Arabic letters from abjad app',
                    'sources': ['letters.ts (abjad app)'],
                    'total': len(ts_data),
                },
                'letters': ts_data,
            }
        else:
            print('  No letter sources found')
            return

    save_json(os.path.join(DATA_DIR, 'letters.json'), out)
    letter_count = len(out.get('letters', []))
    print(f'  Letters: {letter_count}')

    return letter_count


# ── 4. Build rootPatterns.json ────────────────────────────────────────────

def build_root_patterns():
    print(f'\n{SEP}')
    print('[4/5] Building rootPatterns.json')
    print(SEP)

    # Load existing root patterns from etymologies bridge for count
    bridge_ref = None
    if os.path.exists(ETYMOLOGY_BRIDGE_CSV):
        rows = load_csv(ETYMOLOGY_BRIDGE_CSV)
        print(f'  Referencing {len(rows)} bridge entries for root classification')
        bridge_ref = rows

    # The root patterns have rich flashcard data — preserve existing
    existing_path = os.path.join(DATA_DIR, 'rootPatterns.json')
    if os.path.exists(existing_path):
        existing = load_json(existing_path, {})
        roots = existing.get('roots', {})
        count = sum(len(r.get('etymologyIDs', [])) for r in roots.values())
        print(f'  Root patterns: ATUM={len(roots.get("ATUM",{}).get("etymologyIDs",[]))}, '
              f'BULL={len(roots.get("BULL",{}).get("etymologyIDs",[]))}, '
              f'TOR={len(roots.get("TOR",{}).get("etymologyIDs",[]))}')
        print(f'  Total etymology IDs in roots: {count}')
    else:
        print('  No existing rootPatterns.json — will be created by _build_data.py')
        print('  Run: python data/_build_data.py')


# ── 5. Copy supabase-export.json ──────────────────────────────────────────

def copy_supabase_export():
    print(f'\n{SEP}')
    print('[5/5] Copying supabase-export.json (5,083 words)')
    print(SEP)

    if os.path.exists(ETYMOLOGY_DATABASE_JSON):
        words = load_json(ETYMOLOGY_DATABASE_JSON, [])
        export = {
            'meta': {
                'description': 'Source-of-all-Language — complete etymology database',
                'total': len(words),
                'exportedAt': datetime.now().isoformat(),
                'source': 'etymology-database.json',
            },
            'words': words,
        }
        save_json(os.path.join(DATA_DIR, 'supabase-export.json'), export)
        print(f'  Words: {len(words)}')
    else:
        print(f'  ⚠  etymology-database.json not found')


# ── Main ──────────────────────────────────────────────────────────────────

def main():
    print('=== ATUM Data Pipeline (sync-data.py) ===')
    print('The Root of All Words')
    print('')

    os.makedirs(DATA_DIR, exist_ok=True)

    build_etymologies()
    build_ibdal_rules()
    build_letters()
    build_root_patterns()
    copy_supabase_export()

    print(f'\n{SEP}')
    print('✅  Sync complete')
    print(SEP)


if __name__ == '__main__':
    main()
