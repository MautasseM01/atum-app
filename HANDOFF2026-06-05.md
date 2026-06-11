# ATUM Project — Handoff Brief
**For:** New conversation (same project)
**Date:** 2026-06-05
**Purpose:** Complete context snapshot to start clean

> اقرأ هذا الملف أولاً في المحادثة الجديدة. هو الذاكرة الكاملة.

---

## المشروع في جملة واحدة

تطبيق + بحث يكشف أن كل كلمات العالم تعود لـ3 جذور كهرومغناطيسية
(ATUM/BULL/TOR — نظرية Santos Bonacci)، مُتحقَّق منها ببحث لغوي عربي
من 5 مصادر. العربية الأكثر حفظاً للأصوات (تفقد 0 مقابل اليونانية -5، اللاتينية -12).

**الفلسفة:** "تبسيط شفرة اللغة لمن يريد الاستمتاع بلعبة الحياة"
ليست أكاديميا جافة، ولا روحانيات غامضة — اكتشاف ممتع للجميع.

---

## الروابط الحية

| الخدمة | الرابط |
|--------|--------|
| التطبيق الموحد (الجديد) | https://atum-app-dna.vercel.app |
| API Worker | https://etymology-nexus-api.mautassem.workers.dev |
| sacred-word-flow (قديم) | https://sacred-word-flow-dna.vercel.app |
| abjad (قديم) | https://abjad-dna.vercel.app |
| source-of-all-language (قديم) | https://source-of-all-language.vercel.app |

## GitHub Repos
- MautasseM01/atum-app (الرئيسي الجديد)
- MautasseM01/sacred-word-flow, abjad, etymology-nexus (قديمة)

---

## المجلدات (المسارات)

```
C:\Projects\_ACTIVE\
├── atum-app/                    ← المشروع النشط (التركيز هنا)
│   ├── atum-app/                ← Next.js app (7 صفحات)
│   ├── data/sources/            ← المفاهيم + word-insights
│   ├── marketing/               ← strategy + content + product
│   ├── Design/                  ← مخرجات Claude Design
│   ├── STATUS.md                ← مصدر الحقيقة للحالة
│   ├── SOURCE-INDEX.md          ← دليل المصادر
│   ├── MASTER_PLAN.md, TASK_BOARD.md, NOTEBOOKLM_SETUP.md
│   └── ATUM_PRD_v1.0.md/.docx
└── Obsidian Vault/Language/     ← البحث الأكاديمي (CSVs, الكتاب, المصادر)
```

---

## التقنية

- Next.js 14 App Router + Tailwind + shadcn/ui
- i18n: next-intl (AR/EN/FR)
- Data: JSON files (لا DB بعد — Supabase/Convex لاحقاً)
- 3D: React Three Fiber (lazy)
- Deploy: Vercel
- خطوط: Cinzel (display), Source Serif (body), Amiri (عربي), JetBrains Mono
- ألوان: ATUM #22C55E أخضر | BULL #EF4444 أحمر | TOR #3B82F6 أزرق | gold #f39c12
- نظام الثقة: 🔬 مُثبَت | 🧩 محتمل | 🔍 استكشافي | ❓ تخميني

---

## البيانات الحالية

- 5,168 كلمة (85 موثقة + 5,083 مصنفة)
- 75 قاعدة إبدال
- 28 حرف + DNA
- ~20+ مفهوم × 3 لغات
- 37+ word-insight × 3 لغات
- concepts.json + INDEX.json (v1.2، يتجه لـ v1.3)

---

## صفحات التطبيق (تعمل)

Home · Explorer · Learn · Concepts · Patterns · Letters · Research
+ /etymology/[word] (صفحة كلمة عميقة، 7 أقسام)

---

## الوكلاء الثلاثة (توزيع العمل)

| الوكيل | الدور | الملفات |
|--------|-------|---------|
| Claude (المحادثة) | العقل المدبر: خطط + تلقينات + مراجعة | — |
| Open Code (DeepSeek free) | كود التطبيق | app/, components/ |
| Cursor (Claude + NotebookLM CLI) | المصادر | data/sources/ |
| Anti-Gravity (Gemini) | عربي + جماليات + 3D | messages/, visuals |

**قاعدة:** كل وكيل على ملفات منفصلة (لا تعارض). git push بعد كل مهمة.
لا نرجع لـ Claude حتى تكتمل كل المهام المتوازية.

---

## NotebookLM (15 notebook عبر حسابين)

**Account 1** (يعمل، storage_state.json):
خريطة إتيمولوجيا أتوم، أتمولوجيا EM، أصل اللغة، الأنماط السبعة،
Dawood، Kuhn، Al-Qubaysi، Other Sources

**Account 2** (يعمل الآن عبر --storage account2.json):
Atomology (نسختان)، Syncretism، Tenen، Vibrational Reality،
Vibrations of Being، BULL Series، الحلقة الأولى، The Hermetic Mind

3 شخصيات مخصصة: المبسّط (موقع)، الباحث (كتاب)، صانع المحتوى (تسويق)
سجلات المحادثات تبقى في NotebookLM (لتوفير الذاكرة).

---

## ما يحتاج عملاً (PENDING — مرتب بالأولوية)

### عاجل (لم يُلتزم بعد)
- [ ] التزام التنظيم: STATUS.md + بنية المجلدات الموحدة (git push)
- [ ] استخراج Account 2 المتبقي: Atomology نسختان + Hermetic Mind
- [ ] wire كل المفاهيم (20+) في /concepts — STEP 3 المحجوب

### مهم
- [ ] الادعاءات المُعلَّمة ❓ في QUALITY-REVIEW.md تحتاج مراجعتك البشرية
  (wormhole-letter, syncretism-core, vibrational-reality)
- [ ] ربط word-insights بصفحات الكلمات (قد يكون اكتمل — تحقق)
- [ ] الترجمات العربية الطبيعية (Anti-Gravity) — النصوص الثابتة إنجليزية في /ar

### استراتيجية المنتج (بدأت، لم تكتمل)
- [ ] Master Prompt 1 (شخصية العميل + MVP): أُجيب من نموذجين، يحتاج توليف نهائي
  - التوليف: 80% من MVP مبني بالفعل. المنتج المقترح: "Root Code Starter Pack"
    (مجاني: التطبيق | مدفوع: دليل 20 جذر PDF + ماستر كلاس | لاحقاً: كتاب + API)
- [ ] Master Prompt 2 (صفحة الهبوط) — لم يبدأ
- [ ] Master Prompt 3 (خطة النمو) — لم يبدأ

### مؤجل (قرارات سابقة)
- [ ] الكتاب: تحديث بمفاهيم الفيزياء — مؤجل حتى تكتمل المصادر
- [ ] Kaggle: النشر — مؤجل
- [ ] أول منشور Instagram (batch_01 جاهز: Isis←حيزي 🔬) — لم يُنشر
- [ ] Domain من Namecheap — آخر مرحلة
- [ ] SSR/SEO للصفحات — مؤجل (طور التطوير، لا يهم الآن)
- [ ] Supabase/Convex — لاحقاً

---

## أشياء تجاهلناها / تحتاج انتباهاً

1. بعض مصادر Bonacci تخلط العلم بادعاءات غير علمية (أرض مسطحة، Allah=Baal)
   → مستبعدة بوضوح، لكن تحتاج يقظة مستمرة. مصداقية المشروع = الفصل بينهما.
2. التطبيقات الثلاثة القديمة لا تزال حية على Vercel — قرار أرشفتها/حذفها لم يُنفذ.
3. n8n workflows (Gemini content-gen) موجودة لكن غير مستخدمة حالياً.
4. الـ word-insights موجودة لكن قد لا تظهر كلها في الصفحات — يحتاج تحقق.

---

## طريقة العمل المفضلة (مؤكدة من المستخدم)

1. Claude يكتب خطة بخطوط عريضة
2. تُحوّل لقوائم مهام متوازية
3. الوكلاء ينفذون بالتوازي (Open Code + Cursor + Anti-Gravity)
4. تلقينة واحدة لكل وكيل، ننتظر اكتمال الكل
5. الرجوع لـ Claude للمراجعة أو قرارات UI/UX
6. لا توليد ملفات زائدة — التركيز والتنظيم أولاً
