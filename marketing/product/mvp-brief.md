# MVP Brief — Root Code Starter Pack

> One-page positioning, audience, funnel, and build status.
> Date: 2026-06-10

---

## Who It's For (3 Segments)

| Segment | Description | Pain Point | Will Pay For |
|---------|-------------|------------|--------------|
| **Language Curious** | People fascinated by word origins, etymology hobbyists, polyglot learners | "I know words come from somewhere, but no one explains the *system*" | Playbook (€10–20) |
| **Spiritual & Meaning Seeker** | Interested in sacred geometry, hermetic traditions, hidden patterns in language | "I feel words matter more than dictionary definitions — but I can't prove it" | Masterclass + Playbook + Community |
| **Academic/Researcher Edge** | Linguists (especially semitic), students of comparative philology | "Arabic etymology is understudied in the CCM framework — this is publishable data" | Free app + paper access; unlikely to pay for playbook but drives credibility |

**Primary launch target:** Segment 1 (broadest, lowest friction).

---

## Unique Selling Proposition

**"Three roots explain 100+ words across 3 languages — not by memorization, by pattern recognition."**

The USP rests on three unshakeable pillars:
1. **Measurable** — The CCM algorithm produces real statistics (r = −0.693, p<0.0001)
2. **Cross-linguistic** — Arabic root + European word + French/English cognate in every entry
3. **Low barrier** — Each word takes 30 seconds to understand; no linguistics background needed

---

## 3-Tier Funnel

```
┌──────────────────────────────┐
│  FREE  │ App + Masterclass  │  Awareness
├──────────────────────────────┤
│  PAID  │ Root Code Playbook │  Conversion
├──────────────────────────────┤
│  PREM  │ Book / Community   │  Retention
└──────────────────────────────┘
```

### Tier 1 — Free (Exists Now)
- **Web app** → https://atum-app-dna.vercel.app
  - 24 concepts with confidence badges, 37 word insights, 8 chat-insight deep dives
  - /concepts browser with 7 groups and Deep Dives section
  - i18n in English, Arabic, French
- **Masterclass** → outline exists (masterclass-outline.md), needs: landing page, recording/slides, email capture

### Tier 2 — Paid Playbook (Built Now)
- **Root Code Playbook** → root-code-playbook.md (this repo)
  - 20 word journeys, 3-language comparisons, everyday examples
  - Structured for visual PDF conversion
  - **Not yet:** designed layout, purchase page, delivery system

### Tier 3 — Premium (Not Built)
- **Book** → deeper 100-word expansion + the full CCM research narrative
- **Community** → cohort-based masterclass, live Q&A, private discussion
- **Paper** → academic publication of the CCM algorithm and Ibdal methodology

---

## What's Already Built

| Asset | Status | Location |
|-------|--------|----------|
| Web app (Next.js) | Live — /en/concepts, /explorer, /patterns | atum-app-dna.vercel.app |
| 37 word-insights (3 languages) | Complete | data/sources/word-insights/ |
| 24 concept pages (3 languages) | Complete | data/sources/concepts/ |
| INDEX.json (v1.4) | Complete | data/sources/INDEX.json |
| CCM algorithm (Python) | Complete | scripts/ccm/ |
| PhD synthesis (3-model) | Complete | marketing/product/SYNTHESIS_phd.md |
| Root Code Playbook | **Complete** | marketing/product/root-code-playbook.md |
| Masterclass outline | **Complete** | marketing/product/masterclass-outline.md |
| **Masterclass full script (60 min)** | **✅ Complete 2026-06-10** | marketing/product/masterclass-script.md |
| **Landing page copy + structure** | **✅ Complete 2026-06-10** | marketing/product/masterclass-landing-page.md |
| This MVP brief | **Complete** | marketing/product/mvp-brief.md |

---

## What's Still Needed (to sell)

| Priority | Missing Piece | Cost/Effort | Notes |
|----------|---------------|-------------|-------|
| **🔴 1** | Playbook designed as a visual PDF | Designer (freelance) | Current = raw markdown. Needs layout, root color-coding, diagrams, Arabic script callouts |
| **🔴 2** | Purchase page + delivery | Stripe + email (Gumroad/LemonSqueezy) | Simple 1-page checkout. Can launch for ~€0 setup |
| **🔴 3** | Masterclass landing page + recording | Developer + presenter time | Needs `/masterclass` route with registration + email capture (15 min dev work) |
| **🟡 4** | Email capture on the app | Developer (~2h) | Simple "Get the Playbook" popup or footer form. Connects to Mailchimp/ConvertKit |
| **🟡 5** | Testimonial / authority proof | Time | Need 3-5 early users to validate. Target: etymology subreddits, linguistics Discord servers |
| **🟢 6** | Sales copy for playbook listing | Copywriter (you?) | Can draft from this brief. Needs: benefit-first headline, 3 bullet points, FAQ |
| **🟢 7** | Pricing decision | Strategy | Suggested: €10 intro / €20 full / free with email (opt-in strategy) |

---

## Biggest Gap (Critical Path)

**The playbook needs to be designed as a beautiful, printable PDF before it can sell.**

The content is built and proven from real word-insights. But raw markdown doesn't convert. The single thing blocking revenue is:
- **Visual design**: root-colored headers, Arabic calligraphy for each root, 2-page word spreads, consistent branding (dark #0a0a0f + gold #f39c12 + root colors 🟢🔴🔵)
- **Delivery mechanism**: Gumroad/LemonSqueezy listing with the PDF + a simple landing page

Once those two are done (estimated 1-2 weeks with a designer), the product is ready to sell at €10–20.

**Secondary gap:** No audience yet. The masterclass (Tier 1 free hook) must be delivered before the playbook can convert. Order of operations:
1. Record or deliver the masterclass live → capture emails
2. Send playbook offer to email list
3. Sell playbook → use revenue for community tier

---

## Revenue Projection (Rough)

| Volume | Conversion | Revenue |
|--------|-----------|---------|
| 100 masterclass attendees | 5% → 5 playbooks | €50–100 |
| 1,000 masterclass attendees | 5% → 50 playbooks | €500–1,000 |
| 10,000 organic visitors/mo | 0.5% → 50 playbooks/mo | €500–1,000/mo |

Breakeven = ~€0 (zero marginal cost per digital download). Every sale is pure profit after design + platform fees.
