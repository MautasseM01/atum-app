# ATUM — Task Board (Parallel Execution)
**Updated:** 2026-06-01 | **Conductor:** Claude
**Rule:** Agents work in parallel. Return to Claude only when ALL done.

---

## الوضع الحالي

✅ التطبيق حي: atum-app-dna.vercel.app
✅ صفحة الكلمة العميقة تعمل (7 أقسام)
✅ 18 concept chunk + 51 word-insight + 15 primer + INDEX.json
✅ 5,168 كلمة | بحث server-side سريع (27KB)

⏳ المصادر: استخرجنا Other Sources فقط — باقي 7 notebooks
⏳ word-insights موجودة لكن لا تظهر في الصفحات
⏳ النصوص الثابتة إنجليزية في الصفحة العربية

---

## التوزيع — 3 وكلاء بالتوازي

### 🟢 Open Code (DeepSeek free) — التطبيق والبيانات
TRACK A: ربط word-insights بالصفحات
  - الـ 51 ملف word-insight لا تظهر في /etymology/[word]
  - أضف قسم "Simplified Explanation" يقرأ من word-insights/[lang]/[word].md
  - يظهر بلغة الصفحة الحالية (ar/en/fr)

TRACK B: إثراء كل الكلمات بـ insights
  - حالياً 17 كلمة لها insights، الباقي لا
  - أنشئ fallback: كلمات بلا insight تعرض template ذكي
    من rootPatterns + concept المرتبط بجذرها

TRACK C: تحسينات UX من ملاحظات سابقة
  - الصفحة العربية: النصوص الثابتة تُترجم (i18n keys)
  - أضف breadcrumb: Explorer > [Root] > [Word]
  - أضف "كلمة عشوائية" زر للاستكشاف

### 🔵 Cursor (Claude + NotebookLM CLI) — باقي المصادر
TRACK D: استخراج النوتبوكس المتبقية
  Account 2:
  - Tenen → concepts/[lang]/tenen-geometry.md
  - Vibrational Reality → concepts/[lang]/vibration.md
  - Vibrations of Being → concepts/[lang]/sacred-sound.md
  - BULL Series Complete → concepts/[lang]/bull-force.md
  - الحلقة الأولى (لغة واحدة بأقنعة) → concepts/[lang]/one-language.md

TRACK E: توسيع concepts.json
  - دمج المستخرج الجديد في data/sources/concepts.json
  - حدّث INDEX.json بالمفاهيم الجديدة
  - اربط كل مفهوم جديد بجذره (ATUM/BULL/TOR) وبالكلمات

TRACK F: word-insights لكلمات أكثر
  - أضف 20 كلمة جديدة قوية (من proven etymologies)
  - 3 لغات لكل كلمة

### 🟣 Anti-Gravity (Gemini) — العربية والـ UI
TRACK G: الترجمات الطبيعية
  - كل النصوص الثابتة في صفحات الكلمات → عربية طبيعية
  - word-insights بالعربية: مراجعة وتحسين الصياغة
  - تأكد RTL مثالي

TRACK H: التحسينات البصرية
  - animations على أقسام صفحة الكلمة (fade-in تدريجي)
  - تحسين عرض "Across Languages" كخط زمني بصري
  - Three.js torus على الصفحة الرئيسية (lazy)

---

## التسلسل (للتجنب التعارض)

```
المرحلة 1 (الآن، بالتوازي):
  Open Code → Track A, B, C
  Cursor → Track D, E, F
  (لا تعارض — ملفات مختلفة)

المرحلة 2 (بعد اكتمال 1):
  Anti-Gravity → Track G, H
  (يحتاج المحتوى جاهزاً أولاً)
```

---

## قواعد
1. كل وكيل يقرأ MASTER_PLAN.md + هذا الملف أولاً
2. git commit + push بعد كل track
3. لا ترجع لـ Claude حتى تكتمل كل tracks الوكيل
4. توثيق أي قرار مهم في هذا الملف
