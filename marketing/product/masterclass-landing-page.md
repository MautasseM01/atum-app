# Root Code Masterclass — Landing Page Copy
## Section Structure + Full Copy

> ⚠️ **For content team only.** This is copy + structure — design, build, and deployment
> are the responsibility of the dev/design team (see STEP 3 DEFERRED in mvp-brief.md).
> Suggested route: `/masterclass` on atum-app-dna.vercel.app, or a standalone Carrd/Notion page
> for faster launch.

---

## Page Goal

**One action:** visitor submits email address to receive free masterclass access.

No sales pressure on this page. No playbook price. Email first, everything else later.

---

## SECTION 1 — Hero (above the fold)

### Headline
**"Three roots. Every language on Earth. One hour."**

### Sub-headline
Free live masterclass — *Root Code: How an Ancient Sound Shaped 3 Continents of Language*

### Hero body copy (2-3 lines)
> "Caesar became Kaiser became Tsar became Sir — all the same word, across 2,000 years.
> In 60 minutes, you'll understand why. And you'll never read a word the same way again."

### CTA Button
**Register Free →**  
*(Button color: gold #f39c12 on dark background)*

### Below button — trust line
*No spam. Replay sent to inbox. Unsubscribe any time.*

---

## SECTION 2 — What You'll Learn (3 columns)

### Section header
**"In 60 minutes, you will:"**

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| 🔍 **See 6 common words decoded live** — Motor, Europe, Paradise, Radio, Human, Vision | 📐 **Understand the system behind the sounds** — 75 documented rules that explain *why* words change | 🧠 **Walk away with a pattern you can't un-see** — your brain will start recognizing roots automatically |

---

## SECTION 3 — The Hook Story

### Section header
**"It starts with Caesar."**

### Body copy (readable, casual)
> One word became the title of every emperor in European history.
>
> Caesar → Kaiser (German) → Tsar (Russian) → Sir (English)
>
> That's not a coincidence. That's a root. A sound that carries the meaning of command, sovereignty, and forward motion — regardless of the language it lands in.
>
> For the past two years, I've been building a dataset of 5,000+ words — tracking these roots across Arabic, Latin, Greek, English, French, Russian, Persian, and more. What I found: language is not random. Sounds follow rules. Meanings follow patterns.
>
> This masterclass is the 60-minute version of that research. No linguistics degree required.

---

## SECTION 4 — Social Proof / Authority

*(Note to team: use real quotes once early-access users test the app. Placeholder structure below.)*

### Section header
**"What people say"**

**Quote 1** (placeholder)
> "I've been learning Arabic for three years and this reframed everything I thought I knew about roots. Extraordinary."
> — *Language learner, Paris*

**Quote 2** (placeholder)
> "I came for the etymology. I stayed for the statistics. The correlation data alone is worth 10x the price of the playbook."
> — *Data scientist, Berlin*

**Quote 3** (placeholder)
> "My name decoded in 30 seconds. I've never thought about where it came from. Now I can't stop."
> — *Student, Montréal*

*(Replace with real testimonials before launch. Sources: r/etymology, linguistics Discord, early-access users.)*

---

## SECTION 5 — Who Is This For

### Section header
**"This is for you if:"**

- ✅ You've ever wondered why words in different languages *feel* similar
- ✅ You learn languages and want a pattern-based shortcut to vocabulary
- ✅ You're fascinated by history, ancient civilizations, or hidden connections
- ✅ You want to understand *why* language works, not just *how* to use it
- ✅ You're curious and you have 60 minutes

### "This is NOT for you if:"
- ❌ You want a grammar course (this is etymology, not learning Arabic)
- ❌ You need academic citations for every claim (we're rigorous but approachable)

---

## SECTION 6 — About the Project

### Section header
**"Where this comes from"**

### Body copy
> Root Code is built on two years of research combining computational linguistics, data science, and comparative etymology.
>
> The core finding: measurable phonosemantic patterns connect Arabic root sounds to vocabulary across the Indo-European language family — with statistical evidence (r = −0.693, p < 0.0001) that the relationships are not coincidental.
>
> The web app has 5,168 analyzed words. The algorithm runs on 75 documented phonetic rules. The masterclass distills the whole thing into one hour.

**Logo / app screenshot** *(design team: screenshot of atum-app-dna.vercel.app explorer)*

---

## SECTION 7 — Email Capture (repeated CTA)

### Section header
**"Reserve your free spot"**

### Body copy (short)
> The masterclass is free. The replay is free. Leave your email and you'll receive:
> - 🎥 Access to the live session (or replay)
> - 📄 A free 5-word decode guide to keep
> - 🔔 First access when the Root Code Playbook launches

### Form fields
- Email address (required)
- First name (optional — for personalized decode)
- *(Optional)* "One word you want decoded" — text field. This doubles as engagement data.

### Submit button
**"Send me the free masterclass →"**

### Below form
*No spam. No selling your data. Unsubscribe with one click.*  
*Built with research from atum-app-dna.vercel.app*

---

## SECTION 8 — FAQ

**Q: Is this really free?**
A: Yes. The masterclass and replay are always free. There's a paid playbook available after, but no pressure and no upsell during the session.

**Q: I don't speak Arabic — is that a problem?**
A: Not at all. Everything is explained in plain English (and French if you prefer). The Arabic words are shown for context, not required knowledge.

**Q: Is this academic research or spiritual teaching?**
A: Both exist in the project — transparently labeled. The masterclass sticks to what the data shows. We're careful to say "probable" when something is probable, and "speculative" when it's speculative. The statistical evidence is real.

**Q: Will there be a replay?**
A: Yes. Register and you'll receive the replay within 24 hours of the live session.

**Q: What's the Root Code Playbook?**
A: A paid document (€15) with 20 full word journeys — much deeper than the masterclass. If you enjoy the hour, it's the obvious next step. You'll hear about it after you register — no pressure.

---

## TECHNICAL NOTES FOR DEV/DESIGN TEAM

> ⚠️ These are implementation suggestions — NOT the content author's responsibility.

**Fastest path to live (< 1 day):**
1. Carrd.co or Notion public page — paste this copy, add email form via Mailchimp/ConvertKit embed
2. Custom domain: masterclass.atum-app-dna.vercel.app OR a Carrd custom domain
3. Email tool: ConvertKit free tier (1,000 subscribers free) — set up automation: confirm → replay link → playbook offer 3 days later

**Next-level path (2-3 days dev):**
- Add `/masterclass` route to existing Next.js app
- Reuse existing design system (dark background, gold CTA, root color accents)
- Email via ConvertKit or Loops API

**Email sequence (3 messages):**
1. **Immediately on signup:** "You're in — here's what to expect" + calendar invite
2. **Day of session:** "We're live in 1 hour" + direct link
3. **24h after:** Replay link + 5-word decode guide (PDF) + soft playbook mention

**Analytics:** Add UTM params to all links. Track: registrations, email opens, replay clicks, playbook page visits.
