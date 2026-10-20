---
name: ad-review
description: Says what the results mean and writes what was learned. Reads results by ad ID from the platform and from the offer's own result source, kept apart, judges on the deciding metric against break-even with the small numbers handled honestly, uses hook rate, click rate and landing views only to explain, rolls results up by tag, writes the weekly creative report and the hit rate, hands do more, do less and experiment to ad-strategy, notes outside events before blaming a change, and writes a learning only with a sample size and a source. Use when someone asks how the ads are doing, which is winning or whether they are failing, and for the scheduled review.
when_to_use:
  - how are the ads doing
  - which ad is winning
  - are the ads failing
  - weekly creative report
  - what did we learn
  - pull the results
metadata:
  adhub:
    version: 0.1.0
    layer: review
    reads:
      - offers/
      - offers/<offer>.md
      - authority.md
      - calendar.md
      - platform/
      - strategy/diagnosis.md
      - strategy/test-plan.md
      - ledger.md
      - results/
      - changes/
      - learnings.md
    writes:
      - results/
      - learnings.md
      - calendar.md#outside-events
    live: none
---

# ad-review

Says what the results mean, and writes what was learned. Done means a snapshot by ad ID
with the platform's numbers and the business's own results kept apart, a review that
judges on the deciding metric against break-even and says plainly what the sample can
and cannot say, roll-ups by tag, the hand-back to `ad-strategy` of do more, do less and
experiment, outside events noted, and a learning written only when the bar is met, with
its sample size and source. The judgment this skill carries is knowing when numbers
cannot answer the question, keeping the two sources of truth apart, and refusing to
write a learning the data cannot carry.

## Context

```
node <hub>/core/_system/scripts/context.mjs --for ad-review --root <business repo> --offer <slug>
```

Read the offer file (deciding metric, break-even with its working, the result source
and the lag between a click and the result that counts), the test plan (the window, the
bar, the cadence, the rulebook), the diagnosis (what the batch set out to test), the
ledger (IDs and tags), earlier snapshots and reviews in `ads/results/`, the change log
(every change is a candidate cause), the calendar (seasons, promotions, outside
events), the platform file (which signal is sent) and the learnings already written.

Numbers come from two places and stay apart: the platform, read through the business's
connected tools when `ads/authority.md` exists, or from a snapshot the business pulled;
and the offer's own result source (the CRM, the checkout, the booking tool, the till).
No tool and no fresh snapshot: review what is on file and say how old it is.
`references/reading-results.md` carries the small-number arithmetic, the explaining
metrics and the report shapes; load it every time.

## Modes

- **Snapshot.** Assemble the window's numbers by ad ID into `results/<date>-snapshot.md`.
- **Review.** Answer the question asked, on the deciding metric, in
  `results/<date>-review.md`. The default when someone asks how the ads are doing.
- **Weekly creative report.** Where the money went, what moved, any new hit, the
  lessons, and the hit rate over time.
- **Learnings.** Append to `ads/learnings.md` when, and only when, the bar is met.

A review usually includes a snapshot when none exists for the window.

## Method

### 1. Two sources, kept apart

The platform reports the signal it optimises on and its own view of spend, delivery and
engagement. The business's result source records the result that counts, which arrives
after the lag the pipeline sets. Both are written per ad ID; neither is substituted for
the other. A result that cannot be tied to an ad stays visible as unmatched with the
reason; it is never given to an ad because one looks likely (memory contract, "The ad ID
thread"). The most recent two to three days of platform data are still settling and are
set aside; the platform layer says when its numbers stop changing.

### 2. Judge on the deciding metric

ROAS or cost per result, against the break-even quoted from the offer file with its
working, for the account and per ad. Then the honest statement of what the sample can
say: how many results, what the bar in the test plan needs, how many results the lag
could have delivered by now, and therefore which of three things is true: a call above
the bar, a direction only, or too few to say anything. Two results tell nothing. A
quarter of leads in a six-month pipeline has not had time to close, so a closings count
says little about that quarter's ads; the signal and the earlier stages carry the
reading until the lag passes.

### 3. Explain with the secondary metrics

Hook rate, link click rate, landing views and frequency explain why; they never decide
(hub decision 9). The reading from the course review: a strong hook with a weak result
points at the body or the page; a weak hook with a good result means the body carries
it and new hooks are worth testing; a strong click rate with a poor result points at the
page; many link clicks and few landing views point at the page loading or the link. The
reference carries the table. Every explanation is labelled as such.

### 4. Roll up by tag

The ledger's tags are how results pool: customer type, awareness, format, style, play,
breadth, origin, risk. Roll-ups give a direction sooner than per-ad reads and still
need counts; say the count beside every roll-up. Where the business's learnings already
speak to a roll-up, cite them.

### 5. Outside events before blame

Before any change is blamed or any ad credited: the change log (what changed in the
window and when), the calendar (season, promotion, capacity), and anything the business
names (a news event, a competitor, the weather). Note them in the review and append the
observed ones to the calendar's outside-events section with their source. Results move
for outside reasons; a change that coincides is not a cause (Observed, course review).

### 6. Hand back, pause nothing

"Which ones should go" is `ad-manage`'s question, answered at its session under the
rulebook: this skill hands it the evidence per ad against the pause line and the bar,
and changes nothing. "What next" is `ad-strategy`'s: do more of what the data supports,
do less of what it does not, and the experiments the gaps suggest, each with its
evidence. A silent or shifted signal goes to `ad-setup`.

### 7. The weekly creative report

Where the money went across ads, what rose or fell over seven days, any new hit, the
specific lessons, and the hit rate: the share of launched ads that met the bar, tracked
by batch over time (Observed, claude-workflows review). Check the numbers twice: a second
pass that looks for errors in the first, before anything is reported (CONVENTIONS section
8).

### 8. Learnings, at the bar only

The default bar (memory contract, "Learnings"): a clear difference on enough results to
be confident, or the same direction across several independent periods, or a prediction
that was plainly refuted. Below the bar the observation stays in the review. A learning
is one line, `- [date] [offer] finding (n=<sample>, source: <where the numbers came from>)`,
appended to `ads/learnings.md`, which only this skill writes. Nothing about this
business's results is ever written into the hub.

### What this skill never does

It never pauses, moves budget or changes anything on an account. It never calls a winner
or a loser below the bar, in either direction. It never gives an unmatched result to an
ad. It never writes a learning without a sample size and a source, or from model
knowledge. It never blames a change without checking the outside events first.

## Quality gate

Before writing the summary, check:

- The deciding metric and break-even are quoted from the offer file with their working.
- Platform numbers and the result source are shown apart, by ID; unmatched results are
  visible as unmatched; the settling days are set aside.
- The sample statement is present: results, bar, what the lag allows, and which of the
  three readings follows.
- No winner or loser is called below the bar; explanations are labelled as explanations.
- Outside events and the change log were checked and are noted.
- Nothing was paused or changed; hand-backs name the skill and carry the evidence.
- Every learning has a sample size and a source and clears the bar; otherwise none was
  written.
- The numbers were checked twice.

## Output

Files first, inside the business repo's `ads/`: `results/<date>-snapshot.md` and
`results/<date>-review.md` from `core/_system/schemas/results.md` (or the weekly report
from the same schema), lines appended to `learnings.md` when the bar is met, observed
events appended to `calendar.md`. Then the chat summary: the answer to the question in
two lines, the per-ad table, what the sample cannot say, what would settle it and when,
and the hand-backs.

## What's next

- `ad-strategy` takes do more, do less and experiment into the next batch.
- `ad-manage` takes the per-ad evidence into its next session.
- `ad-setup` when the signal has gone silent or shifted.
- `start-here` when the review shows the offer, not the ads, is the problem.
