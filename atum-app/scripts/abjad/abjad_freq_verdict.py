#!python3
"""
ABJAD x FREQUENCY — Phase 0 gate: replace expert estimates with real corpus counts.

PRE-REGISTERED ANALYSIS (do all, report all):
1. Spearman rho (abjad value vs frequency) — rank-based primary test
2. Pearson r on raw abjad, and Pearson r on log10(abjad)
3. Robustness: (a) leave-one-out — drop each letter, recompute rho, report min/max
                (b) recompute excluding high-value letters (abjad 100..1000)
4. Bonferroni correction for multiple tests

PRE-REGISTERED VERDICT:
- SURVIVES:  |rho| >= 0.5 AND p < 0.01 (Bonferroni) AND leave-one-out stable
             (no single letter flips significance)
- COLLAPSES: |rho| < 0.3 OR not significant OR depends on <=2 letters
- GRAY:      0.3 <= |rho| < 0.5 and stable -> exploratory only

Data corpus: Leipzig Corpora Collection — ara_wikipedia_2021_100K
             100,000 sentences, 7,582,207 Arabic letters (28-letter standard)
"""

import json, math, sys
from scipy.stats import spearmanr, pearsonr

# ── 28 letters in letters.json id order (matches estimated_freq order) ──
#   id  letter  abjad  name    est_freq  real_freq_pct (Leipzig Wikpedia corpus)
#   --  ------  -----  ----    --------  --------------
#    1  أ/ا       1   Alef     8.2       17.8367   (normalized from أإآ)
#    2  ب         2   Ba       7.1        3.4973
#    3  ج         3   Jim      6.4        1.4527
#    4  د         4   Dal      5.8        3.0588
#    5  ه         5   Ha2      4.6        2.2050
#    6  و         6   Waw      6.9        5.4732
#    7  ز         7   Zay      4.1        0.6248
#    8  ح         8   Ha       4.2        1.7319
#    9  ط         9   Ta2      3.2        0.9437
#   10  ي        10   Ya       5.7        9.2034
#   11  ك        20   Kaf      5.9        2.1584
#   12  ل        30   Lam      8.5       11.4476
#   13  م        40   Mim      8.1        6.5474
#   14  ن        50   Nun      6.7        5.2395
#   15  س        60   Sin      6.2        2.5398
#   16  ع        70   Ayn      7.3        3.3574
#   17  ف        80   Fa       5.1        2.6254
#   18  ص        90   Sad      3.4        0.9170
#   19  ق       100   Qaf      4.4        2.0113
#   20  ر       200   Ra       7.8        4.5887
#   21  ش       300   Shin     4.8        0.9620
#   22  ت       400   Ta       5.3        8.0764
#   23  ث       500   Tha      3.1        0.6618
#   24  خ       600   Kha      2.8        0.8568
#   25  ذ       700   Dhal     2.6        0.6097
#   26  ض       800   Dad      2.9        0.6391
#   27  ظ       900   Dha      2.1        0.2317
#   28  غ      1000   Ghayn    2.3        0.5025

ABJAD   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90,
           100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]

FREQ_REAL = [17.8367, 3.4973, 1.4527, 3.0588, 2.2050, 5.4732, 0.6248, 1.7319,
             0.9437, 9.2034, 2.1584, 11.4476, 6.5474, 5.2395, 2.5398, 3.3574,
             2.6254, 0.9170, 2.0113, 4.5887, 0.9620, 8.0764, 0.6618, 0.8568,
             0.6097, 0.6391, 0.2317, 0.5025]

FREQ_EST = [8.2, 7.1, 6.4, 5.8, 4.6, 6.9, 4.1, 4.2, 3.2, 5.7, 5.9, 8.5, 8.1,
            6.7, 6.2, 7.3, 5.1, 3.4, 4.4, 7.8, 4.8, 5.3, 3.1, 2.8, 2.6, 2.9,
            2.1, 2.3]

NAMES = ["Alef","Ba","Jim","Dal","Ha2","Waw","Zay","Ha","Ta2","Ya",
         "Kaf","Lam","Mim","Nun","Sin","Ayn","Fa","Sad","Qaf","Ra",
         "Shin","Ta","Tha","Kha","Dhal","Dad","Dha","Ghayn"]

N = len(ABJAD)


def main():
    out = r"C:\Projects\_ACTIVE\atum-app\atum-app\data\sources\phd-mining\abjad_verdict.txt"
    log_abjad = [math.log10(v) for v in ABJAD]

    lines = []
    def pl(msg=""):
        lines.append(msg)
        print(msg)

    pl("=" * 72)
    pl("  ABJAD x FREQUENCY — REAL CORPUS VERDICT")
    pl("=" * 72)
    pl()
    pl(f"  Corpus:      Leipzig ara_wikipedia_2021_100K")
    pl(f"  Sentences:   100,000")
    pl(f"  Total chars: 9,693,424")
    pl(f"  Arabic letters: 7,582,207 (28-letter standard alphabet)")
    pl(f"  Normalization: alef variants -> bare alef, taa marbouta -> taa, alif maqsura -> yaa")
    pl(f"  Diacritics:  stripped (corpus has minimal diacritics)")
    pl(f"  Positional:  normalized to isolated form")
    pl(f"  Date:        2026-06-11")
    pl()

    # ── 1. Spearman rho (primary) ──
    rho, p_rho = spearmanr(ABJAD, FREQ_REAL)
    pl(f"  1. PRIMARY: Spearman rho")
    pl(f"     rho = {rho:.6f}")
    pl(f"     p   = {p_rho:.6e}")
    pl()

    # ── 2. Pearson ──
    r_raw, p_raw = pearsonr(ABJAD, FREQ_REAL)
    r_log, p_log = pearsonr(log_abjad, FREQ_REAL)
    pl(f"  2. SECONDARY: Pearson")
    pl(f"     Pearson r (raw abjad):     r = {r_raw:.6f},  p = {p_raw:.6e}")
    pl(f"     Pearson r (log10 abjad):   r = {r_log:.6f},  p = {p_log:.6e}")
    pl()

    # ── 3. Bonferroni ──
    n_tests = 3
    alpha_bonf = 0.01 / n_tests
    pl(f"  3. BONFERRONI: {n_tests} tests, corrected alpha = {alpha_bonf:.8f}")
    pl(f"     Spearman rho  p < {alpha_bonf:.8f}?     {'YES' if p_rho < alpha_bonf else 'NO'}")
    pl(f"     Pearson raw   p < {alpha_bonf:.8f}?     {'YES' if p_raw < alpha_bonf else 'NO'}")
    pl(f"     Pearson log   p < {alpha_bonf:.8f}?     {'YES' if p_log < alpha_bonf else 'NO'}")
    pl()

    # ── 4a. Leave-one-out ──
    rho_loo = []
    p_loo = []
    for i in range(N):
        a = ABJAD[:i] + ABJAD[i+1:]
        f = FREQ_REAL[:i] + FREQ_REAL[i+1:]
        r, p = spearmanr(a, f)
        rho_loo.append(r)
        p_loo.append(p)

    rho_min = min(rho_loo)
    rho_max = max(rho_loo)
    rho_mean = sum(rho_loo) / N
    min_p_loo = min(p_loo)
    max_p_loo = max(p_loo)
    all_sig_loo = all(p < alpha_bonf for p in p_loo)
    min_abs_loo = min(abs(v) for v in rho_loo)

    pl(f"  4a. ROBUSTNESS: Leave-one-out Spearman rho")
    pl(f"      min rho = {rho_min:.6f}  (letter {NAMES[rho_loo.index(rho_min)]})")
    pl(f"      max rho = {rho_max:.6f}  (letter {NAMES[rho_loo.index(rho_max)]})")
    pl(f"      mean rho = {rho_mean:.6f}")
    pl(f"      p range: [{min_p_loo:.6e}, {max_p_loo:.6e}]")
    pl(f"      All LOO significant at alpha_bonf? {'YES' if all_sig_loo else 'NO'}")
    pl(f"      Min |rho| across all LOO: {min_abs_loo:.6f}")
    pl()

    # ── 4b. High-value exclusion ──
    lo_idx = [i for i in range(N) if ABJAD[i] < 100]
    hi_idx = [i for i in range(N) if ABJAD[i] >= 100]
    abjad_lo = [ABJAD[i] for i in lo_idx]
    freq_lo = [FREQ_REAL[i] for i in lo_idx]
    abjad_hi = [ABJAD[i] for i in hi_idx]
    freq_hi = [FREQ_REAL[i] for i in hi_idx]

    rho_lo, p_lo_val = spearmanr(abjad_lo, freq_lo)
    rho_hi, p_hi_val = spearmanr(abjad_hi, freq_hi)

    pl(f"  4b. ROBUSTNESS: High-value exclusion")
    pl(f"      Letters with abjad < 100:  {len(lo_idx)} letters")
    for i in lo_idx:
        pl(f"        {NAMES[i]:<6} abjad={ABJAD[i]:<4}  freq={FREQ_REAL[i]:.2f}%")
    pl(f"      Spearman (abjad < 100):  rho = {rho_lo:.6f}, p = {p_lo_val:.6e}")
    pl()
    pl(f"      Letters with abjad >= 100: {len(hi_idx)} letters")
    for i in hi_idx:
        pl(f"        {NAMES[i]:<6} abjad={ABJAD[i]:<4}  freq={FREQ_REAL[i]:.2f}%")
    pl(f"      Spearman (abjad >= 100): rho = {rho_hi:.6f}, p = {p_hi_val:.6e}")
    pl()

    # Data table
    pl("  -- Full letter data --")
    pl(f"  {'#':>2} {'Name':<7} {'Abjad':>6} {'LogAbj':>7} {'Freq%':>7} {'EstFreq':>8}")
    pl(f"  {'-'*44}")
    for i in range(N):
        pl(f"  {i+1:>2} {NAMES[i]:<7} {ABJAD[i]:>6} {log_abjad[i]:>6.3f}  {FREQ_REAL[i]:>5.2f}% {FREQ_EST[i]:>7.1f}")
    pl()

    # Original estimate comparison
    rho_est, p_est = spearmanr(ABJAD, FREQ_EST)
    r_est, p_est_p = pearsonr(ABJAD, FREQ_EST)
    r_log_est, p_log_est = pearsonr(log_abjad, FREQ_EST)

    pl("  -- Comparison: estimated vs real frequencies --")
    pl(f"  Claimed original: Pearson r = -0.693")
    pl(f"  On ESTIMATED frequencies (n=28):")
    pl(f"    Spearman rho = {rho_est:.4f},  p = {p_est:.6e}")
    pl(f"    Pearson r    = {r_est:.4f},  p = {p_est_p:.6e}")
    pl(f"    Pearson log  = {r_log_est:.4f},  p = {p_log_est:.6e}")
    pl(f"  On REAL corpus frequencies (n=28, 7.58M letters):")
    pl(f"    Spearman rho = {rho:.4f},  p = {p_rho:.6e}")
    pl(f"    Pearson r    = {r_raw:.4f},  p = {p_raw:.6e}")
    pl(f"    Pearson log  = {r_log:.4f},  p = {p_log:.6e}")
    pl()

    # ── VERDICT ──
    pl("=" * 72)
    pl("  PRE-REGISTERED VERDICT")
    pl("=" * 72)
    pl()
    pl(f"  Criteria:")
    pl(f"    SURVIVES:  |rho| >= 0.5 AND p < {alpha_bonf:.8f} (Bonferroni) AND LOO stable")
    pl(f"    COLLAPSES: |rho| < 0.3 OR not significant OR depends on <= 2 letters")
    pl(f"    GRAY:      0.3 <= |rho| < 0.5 and stable -> exploratory only")
    pl()

    abs_rho = abs(rho)
    significant = p_rho < alpha_bonf
    loo_stable = all_sig_loo and min_abs_loo >= 0.5

    # Letters whose removal drops |rho| below 0.5 (the SURVIVES threshold)
    critical_for_05 = [i for i, v in enumerate(rho_loo) if abs(v) < 0.5]
    n_critical = len(critical_for_05)
    # Letters whose removal drops |rho| below 0.3 (the COLLAPSES threshold)
    critical_for_03 = [i for i, v in enumerate(rho_loo) if abs(v) < 0.3]
    n_critical_03 = len(critical_for_03)
    # Depends on <= 2 letters: the result is carried by only 1-2 letters.
    # This means only <= 2 letters, when removed, cause |rho| to drop below 0.5.
    depends_on_few = (N - n_critical) <= 2  # at most 2 letters are carrying the result

    pl(f"  Checks:")
    pl(f"    |rho| = {abs_rho:.4f}  {'>= 0.5' if abs_rho >= 0.5 else '< 0.5'}")
    pl(f"    p = {p_rho:.6e}  {'<' if p_rho < alpha_bonf else '>='} {alpha_bonf:.8f}")
    pl(f"    LOO all significant?          {'YES' if all_sig_loo else 'NO'}")
    pl(f"    LOO min |rho| >= 0.5?          {'YES' if min_abs_loo >= 0.5 else 'NO'}")
    if n_critical <= 10:
        pl(f"    Letters whose removal drops |rho| below 0.5:")
        for i in critical_for_05:
            pl(f"      {NAMES[i]} (removed rho={rho_loo[i]:.4f})")
    pl(f"    N letters carrying |rho| >= 0.5: {N - n_critical} / {N}")
    pl()

    if abs_rho >= 0.5 and significant and loo_stable:
        branch = "SURVIVES"
        pl(f"  BRANCH: {branch}")
        pl(f"  -> The abjad-frequency negative correlation is real and robust.")
        pl(f"     Higher abjad value = rarer letter, confirmed on 7.58M letters.")
    elif abs_rho < 0.3 or not significant or depends_on_few:
        branch = "COLLAPSES"
        pl(f"  BRANCH: {branch}")
        if abs_rho < 0.3:
            pl(f"    Reason: |rho| = {abs_rho:.4f} < 0.3")
        if not significant:
            pl(f"    Reason: p = {p_rho:.6e} >= {alpha_bonf:.8f} (Bonferroni)")
        if depends_on_few:
            pl(f"    Reason: |rho| >= 0.5 carried by only {N - n_critical} letter(s)")
    else:
        branch = "GRAY"
        pl(f"  BRANCH: GRAY")
        pl(f"  -> 0.3 <= |rho| = {abs_rho:.4f} < 0.5, stable -> exploratory only")
        pl(f"     Not publishable as a core result; may merit a footnote.")

    pl()
    if abs(rho_est) >= 0.5 and abs_rho < 0.5:
        pl(f"  SUMMARY: The original r=-0.693 WAS an artifact of expert estimates.")
        pl(f"  On real corpus data the correlation drops from {rho_est:.3f} to {rho:.3f}.")
    elif abs_rho >= 0.5:
        pl(f"  SUMMARY: The negative correlation reproduces on real data.")
        pl(f"  Original rho_est = {rho_est:.3f}, real rho = {rho:.3f} - "
          f"magnitude {'similar' if abs(rho_est - rho) < 0.15 else 'divergent'}.")
    else:
        pl(f"  SUMMARY: The original correlation is substantially weaker on real data.")
    pl()
    pl(f"  Corpus: Leipzig ara_wikipedia_2021_100K (7.58M Arabic letters)")
    pl(f"  Commit: to be added")

    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    pl(f"\n  Saved to: {out}")


if __name__ == "__main__":
    main()
