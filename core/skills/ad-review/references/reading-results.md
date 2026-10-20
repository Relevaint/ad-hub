# Reading results: small numbers, explaining metrics, roll-ups and reports

Load every time. Defaults from the course review and the claude-workflows review unless
marked; the hard rules are in the skill and the memory contract.

## What the sample can say

Work it out before writing a word of judgment:

1. **Results in the window** on the deciding metric, per ad and for the account, from
   the result source, with the signal count from the platform beside it.
2. **The bar** from the test plan: about 90% confidence that one ad beats another, or
   the same direction across several independent periods.
3. **What the lag allows.** From the pipeline timings in the offer file or the
   business's notes: how many of the window's leads could have reached the result that
   counts by today. A six-month pipeline means a quarter's leads have mostly not closed;
   judge that window on the signal and the earlier stages, and say when the closings
   can be read.
4. **Expected results at break-even.** Spend divided by break-even gives the results
   that spend should have produced at break-even; the gap between that and the actual
   count is the size of the signal in the data. Illustrative, invented: $4,100 spent at
   a break-even of $846 per appointment should have produced about 4.8 appointments;
   6 arrived, so the account ran under break-even, but 6 is far too few to rank the ads
   that produced them.
5. **The reading**: a call above the bar; a direction only; or too few to say. Write
   which, and why. Two results tell nothing. One result in each of two ads is a coin
   flip.

Never round a direction up to a verdict because the business asked for one. The honest
answer to "which is winning" is often "none yet, and here is what would tell us, and
when".

## Explaining metrics (course review, 17.4 to 17.6)

| Reading | Suggests | Hand to |
| --- | --- | --- |
| Strong hook rate, good result | The hook works; reuse it on new bodies | `ad-strategy` (remix) |
| Weak hook rate, good result | The body carries it; test new hooks on it | `ad-strategy` (hook swap) |
| Fair hook, poor result | The body or the page | `ad-creative`, page owner |
| Strong link click rate, poor result | Ad and page do not match | page owner, `ad-creative` |
| Strong hook, weak click rate | Weak call to action | `ad-creative` |
| Many link clicks, few landing views | Page speed or link problem | page owner, `ad-setup` |
| Rising frequency with worsening cost | Fatigue; replacement needed | `ad-strategy`, `ad-manage` |
| CPM moving | Mostly the market and placements; context only | nobody, note it |

Hook rate is three-second plays over impressions; link click rate is link clicks over
impressions, not all clicks. Which platform fields hold these is in the platform layer
(`meta-system/references/reporting.md` for Meta), with the ones still to confirm marked.

## Roll-ups

Group results by each ledger tag and show spend, results and cost per result or ROAS
per group with the count of ads and results in it. A roll-up with two ads and three
results is still a direction. Compare groups only when both have enough results to
compare; otherwise say which group has the direction and what would confirm it.

## Outside events

Check, in order: the change log for anything changed in the window; the calendar for
seasons, promotions and capacity windows; what the business says happened (news, a
competitor's launch, weather, a price change, a stock-out). Note each in the review
with its date. Append observed events to the calendar's outside-events section, dated,
with the source. A change that coincides with a drop is a suspect, not a culprit, until
the outside events are ruled out (course review, 25.3).

## The weekly creative report (claude-workflows review)

- Where the money went: spend by ad, by batch, by tag, in the week.
- Movers: what rose and fell over seven days on the deciding metric, with counts.
- New hits: any ad that crossed the bar this week, and what it shares with earlier hits.
- Lessons: specific, with evidence; what goes to the next batch.
- Hit rate: launched ads that met the bar, by batch and overall, over time. A falling
  hit rate with rising volume is a creative problem; a rising one on fewer ads means
  the diagnosis is working.
- Second pass: re-add every total, re-check every per-ad figure against the snapshot,
  and say the check was done.

## Learnings

The bar: a clear difference on enough results to be confident; or the same direction
across several independent periods; or a prediction in the test plan that was plainly
refuted. One line each:

`- [YYYY-MM-DD] [offer] <finding> (n=<results the finding rests on>, source: <platform snapshot of date, and the result source>)`

Illustrative, invented: `- [2026-11-30] [gutter-cleaning] Founder-on-camera ads booked
estimates at half the cost of crew-only footage across two batches (n=31 booked
estimates, source: CRM matched by tag, snapshots 2026-10-29 and 2026-11-26)`.

Below the bar the observation goes in the review under "Direction, not yet a learning",
with what would make it one. A learning is never written from a roll-up with a handful
of results, from model knowledge, or from one period.

## Which questions belong to which skill

- "Which ones should go": `ad-manage`, at its session, under the rulebook. This skill
  supplies the evidence per ad against the pause line and the bar.
- "What should we make next": `ad-strategy`, with do more, do less, experiment.
- "Is the tracking right": `ad-setup`.
- "Is the offer the problem": `start-here`, when the review points there.
