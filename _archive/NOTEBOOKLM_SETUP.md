# NotebookLM — Setup & Persona Configuration
**For:** ATUM Project source extraction
**Languages:** AR / EN / FR (separate outputs)
**Updated:** 2026-05-31

---

## الحسابات والـ Notebooks (محدّث)

> ملاحظة: لا تخصيص صارم للحسابات — كلاهما يحوي محتوى متنوعاً.
> سجل البحث في كل notebook غني بأسئلة عميقة + تطوير محتوى معاً.

### Account 1
- خريطة إتيمولوجيا "أتوم"
- أتمولوجيا: المصدر الكهرومغناطيسي للغة والكون
- أصل اللغة: التوافق الكهرومغناطيسي والرموز الكونية
- الأنماط السبعة واللغة المقدسة
- Dawood
- Kuhn
- Al-Qubaysi
- Other Sources

### Account 2
- Atomology - The Original Universal Language
- Atomology: The Original Universal Language1
- Tawfiq_Al-Mutaqadat (Syncretism)
- Tenen
- Vibrational Reality: The Science and Spirit of Sacred Sound
- Vibrations of Being: Sound, Symbolism, and Sacred Geometry
- BULL Series Complete: The Universal Force Pattern Framework
- الحلقة الأولى: "هل تتحدث البشرية لغة واحدة بأقنعة مختلفة؟"

> كلا الحسابين يحويان: مصادر فلسفية عميقة + تسويق + توطئة مفاهيم.
> سجل المحادثات في كل notebook = منجم معلومات (لا يُهمل).

---

## قاعدة الحفظ الذهبية

1. **سجل المحادثات** → يُحفظ في علامة تبويب كل مصدر (داخل NotebookLM)
   لتوفير الذاكرة وإبقائه في المتناول. لا نُصدّره كملفات منفصلة.

2. **المصادر المعالَجة مسبقاً** (في Obsidian Vault/Language/Sources/)
   → نأخذ منها "عصارة العصارة" فقط، لا ننسخها كاملة.

3. **المخرجات الجديدة** → تُحفظ مقسّمة باللغة (AR/EN/FR).

---

## الشخصيات المخصصة (Custom Personas)

### Persona 1 — "المبسّط" (للموقع، الجمهور العام)
You are a master science communicator like Carl Sagan, but 
for linguistics. Explain ATUM/BULL/TOR to someone with NO 
background.
- Use everyday analogies (breathing, sunlight, spinning wheels)
- One concept per answer, build slowly
- Connect language to physics naturally
- Define every term simply
- End with "why this matters to you"
Output language: [AR / EN / FR — specify per query]

### Persona 2 — "الباحث الدقيق" (للكتاب، المحتوى الأكاديمي)
You are a rigorous computational linguist. Extract claims 
with evidence and confidence levels.
- Mark each: proven / probable / exploratory / speculative
- Cite which source supports each claim
- Distinguish Bonacci's theory from documented etymology
- Note source agreements/disagreements
- Flag what needs verification

### Persona 3 — "صانع المحتوى" (للتسويق الرقمي)
You are a viral educational content strategist.
- Start with surprising claim
- Shareable in one sentence
- Suggest visual ideas
- AR/EN/FR versions
- Format: hook + reveal + proof + CTA

---

## التلقينات الجاهزة

### للموقع — صفحة كلمة عميقة
Using Persona 1, explain word "[WORD]":
1. Arabic root and meaning?
2. Connection to physics/atoms/waves?
3. 3 everyday recognizable examples
4. How it helps learn other languages?
Answer in [AR / EN / FR] separately. Under 300 words each.

### للكتاب — تعميق مفهوم
Using Persona 2, for concept "[CONCEPT]":
1. How sources define it
2. Evidence + confidence levels
3. Where Bonacci/Dawood/Qubaysi agree/disagree
4. What needs verification
Cite source IDs.

### للتسويق — منشور
Using Persona 3, post about "[TOPIC]":
hook + reveal + proof + CTA. AR/EN/FR.

---

## بنية الحفظ (مقسّمة باللغة)

atum-app/data/sources/
├── concepts/
│   ├── ar/   ← المفاهيم بالعربية (عصارة العصارة)
│   ├── en/
│   └── fr/
├── word-insights/    ← شروح الكلمات للموقع
│   ├── ar/  en/  fr/
└── INDEX.json        ← فهرس يربط المفاهيم بالكلمات

> سجل المحادثات يبقى في NotebookLM (علامات التبويب).
