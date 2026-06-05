import json, csv

# ── rootPatterns.json ─────────────────────────────────────────────────────
root_patterns = {
    "meta": {
        "description": "3 electromagnetic roots: ATUM / BULL / TOR — Bonacci / Santos Bonacci theory",
        "source": "rootPatterns.ts (sacred-word-flow app)",
        "license": "CC BY-SA 4.0"
    },
    "roots": {
        "ATUM": {
            "root": "ATUM",
            "arabicName": "أتوم",
            "principle": "Unity & Inwardness",
            "principleAr": "الوحدة والداخل",
            "principleFr": "Unité et Intériorité",
            "energy": "Inertia",
            "color": "#8B5CF6",
            "soundPattern": ["أ", "م", "و", "ن", "ه", "ل"],
            "europeanSounds": ["A", "M", "W", "N", "H", "L"],
            "etymologyIDs": [
                "E002","E003","E005","E014","E016","E017","E018",
                "E020","E023","E024","E025","E028","E029","E031",
                "E032","E033","E034","E035","E041","E042","E044",
                "E046","E050","E051","E055","E057","E059","E062",
                "E063","E065","E066","E069","E071","E075",
                "EB_078","EB_081","EB_082","EB_084"
            ],
            "flashcards": [
                {"arabic": "أتوم", "european": "Atom", "language": "EN", "rule": "ط→t", "meaning": "الوحدة التي لا تتجزأ", "confidence": "🧩"},
                {"arabic": "بيت", "european": "Beta / Habitation", "language": "EN/FR", "rule": "مباشر", "meaning": "المسكن والاحتواء", "confidence": "🔬"},
                {"arabic": "حيزي", "european": "Isis", "language": "GR", "rule": "H-Drop + Sacred-S", "meaning": "البصيرة الداخلية", "confidence": "🔬"},
                {"arabic": "فرديس", "european": "Paradise", "language": "EN", "rule": "ف→P", "meaning": "البستان المحاط", "confidence": "🔬"},
                {"arabic": "إيل", "european": "El / Allah / Elohim", "language": "Universal", "rule": "مباشر", "meaning": "الإله الواحد", "confidence": "🔬"}
            ]
        },
        "BULL": {
            "root": "BULL",
            "arabicName": "بول",
            "principle": "Radiation & Expansion",
            "principleAr": "الإشعاع والتمدد",
            "principleFr": "Rayonnement et Expansion",
            "energy": "Radiation",
            "color": "#F59E0B",
            "soundPattern": ["ب", "ر", "ف", "ح", "ع", "و"],
            "europeanSounds": ["B", "R", "F", "V", "P", "W"],
            "etymologyIDs": [
                "E001","E006","E007","E008","E009","E010","E012",
                "E013","E015","E021","E022","E037","E045","E047",
                "E049","E053","E072","E073","E076",
                "EB_077","EB_080","EB_085"
            ],
            "flashcards": [
                {"arabic": "أثّ/أتون", "european": "Athena", "language": "GR", "rule": "أتون→أثينا", "meaning": "الخصب المتمدد", "confidence": "🔬"},
                {"arabic": "أف+رود", "european": "Aphrodite", "language": "GR", "rule": "ibdal 003+040", "meaning": "الجمال المشع", "confidence": "🔬"},
                {"arabic": "حُر", "european": "Horus / Hero", "language": "GR/EN", "rule": "H-Drop", "meaning": "الطاقة الطليقة", "confidence": "🔬"},
                {"arabic": "ردى", "european": "Radio / Road", "language": "EN", "rule": "ر→R", "meaning": "الموجة المنتشرة", "confidence": "🔍"},
                {"arabic": "أوريد", "european": "Europe", "language": "Universal", "rule": "ibdal 008", "meaning": "التمدد والتعليم", "confidence": "🔬"}
            ]
        },
        "TOR": {
            "root": "TOR",
            "arabicName": "طور",
            "principle": "Structure & Rotation",
            "principleAr": "البنية والدوران",
            "principleFr": "Structure et Rotation",
            "energy": "Gravitation",
            "color": "#10B981",
            "soundPattern": ["ط", "د", "ز", "ك", "ت", "ق"],
            "europeanSounds": ["T", "D", "Z", "K", "G", "C"],
            "etymologyIDs": [
                "E004","E011","E019","E026","E027","E030","E036",
                "E038","E039","E040","E043","E048","E052","E054",
                "E056","E058","E060","E061","E064","E067","E068",
                "E070","E074","EB_079","EB_083"
            ],
            "flashcards": [
                {"arabic": "دلت", "european": "Delta", "language": "GR", "rule": "مباشر", "meaning": "البنية المثلثة", "confidence": "🔬"},
                {"arabic": "أردى", "european": "Jordan", "language": "EN", "rule": "نون الجمع", "meaning": "دورة التطهير", "confidence": "🔬"},
                {"arabic": "طلية", "european": "Italy", "language": "EN", "rule": "ط→it", "meaning": "الشكل الصغير", "confidence": "🔬"},
                {"arabic": "تقن", "european": "Techne / Technology", "language": "EN", "rule": "مباشر", "meaning": "الصنع المنظم", "confidence": "🔬"},
                {"arabic": "منثا", "european": "Moon / Money / Menu", "language": "EN", "rule": "ث→n", "meaning": "دورة القمر والحساب", "confidence": "🔍"}
            ]
        }
    }
}

with open(r"C:\Projects\_ACTIVE\atum-app\data\rootPatterns.json", "w", encoding="utf-8") as f:
    json.dump(root_patterns, f, ensure_ascii=False, indent=2)

atum_count = len(root_patterns["roots"]["ATUM"]["etymologyIDs"])
bull_count = len(root_patterns["roots"]["BULL"]["etymologyIDs"])
tor_count  = len(root_patterns["roots"]["TOR"]["etymologyIDs"])
print(f"rootPatterns.json: ATUM={atum_count}, BULL={bull_count}, TOR={tor_count}, total={atum_count+bull_count+tor_count}")

# ── ibdalRules.json ───────────────────────────────────────────────────────
ibdal_rows = []
with open(r"C:\Projects\_ACTIVE\Obsidian Vault\Language\Language-Datasets\ibdal_rules.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row.get("Ibdal_ID","").strip():
            ibdal_rows.append({
                "id": row["Ibdal_ID"].strip(),
                "letter1": row.get("Letter_1","").strip(),
                "letter2": row.get("Letter_2","").strip(),
                "letter1Latin": row.get("Letter_1_Latin","").strip(),
                "letter2Latin": row.get("Letter_2_Latin","").strip(),
                "makhrajGroup1": row.get("Makhraj_Group_1","").strip(),
                "makhrajGroup2": row.get("Makhraj_Group_2","").strip(),
                "makhrajDistance": row.get("Makhraj_Distance","").strip(),
                "exampleWordL1": row.get("Example_Word_L1","").strip(),
                "exampleWordL2": row.get("Example_Word_L2","").strip(),
                "languageContext": row.get("Language_Context","").strip(),
                "ibdalType": row.get("Ibdal_Type","").strip(),
                "dialectFrom": row.get("Dialect_From","").strip(),
                "dialectTo": row.get("Dialect_To","").strip(),
                "dawoodLink": row.get("Dawood_Link","").strip(),
                "confidence": row.get("Confidence","").strip(),
                "notes": row.get("Notes","").strip()
            })

ibdal_out = {
    "meta": {
        "description": "75 phonetic substitution (ibdal) rules — Al-Qubaysi: Philology of Arabic Dialects (800 pages)",
        "source": "ibdal_rules.csv — Al-Qubaysi",
        "keyFinding": "68% of ibdal rules occur between phonetically adjacent letters (same makhraj group) 🔬",
        "total": len(ibdal_rows)
    },
    "rules": ibdal_rows
}

with open(r"C:\Projects\_ACTIVE\atum-app\data\ibdalRules.json", "w", encoding="utf-8") as f:
    json.dump(ibdal_out, f, ensure_ascii=False, indent=2)

print(f"ibdalRules.json: {len(ibdal_rows)} rules")
