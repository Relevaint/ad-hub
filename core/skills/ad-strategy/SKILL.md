---
name: ad-strategy
description: Decides what to make and how it is tested. Writes a one or two sentence diagnosis, the gaps across customer type, awareness, format, style and message, the plays to test inside the risk budget, and a batch where every ad has an ID, tags and a stated reason, sized and timed by how long this offer takes to give a confident answer. Use when planning a first or next batch, when results are in and the question is what to do next, or when live ads need auditing.
when_to_use:
  - plan the first test batch
  - plan the next batch
  - what should we test next
  - plan our ads for the next month
  - audit our live ads
  - which plays should we try
metadata:
  adhub:
    version: 0.1.0
    layer: strategy
    reads:
      - offers/
      - offers/<offer>.md
      - authority.md
      - calendar.md
      - research/audience.md
      - research/voc.md
      - research/competitors.md
      - strategy/diagnosis.md
      - strategy/test-plan.md
      - ledger.md
      - results/
      - learnings.md
      - platform/
    writes:
      - strategy/diagnosis.md
      - strategy/test-plan.md
      - ledger.md#ids-and-tags
    live: none
---

# ad-strategy

Decides what to make and how it is tested. Done means three things in the business repo:
a diagnosis a stranger could act on, a test plan whose numbers come from this offer's
own economics and volume, and a ledger row for every planned ad with its ID, its tags
and one sentence saying what it tests that the others do not. The judgment this skill
carries is reading an account's situation honestly, choosing swings worth taking inside
the limits the business set, and refusing to plan faster than results can be judged.

## Context

```
node <hub>/core/_system/scripts/context.mjs --for ad-strategy --root <business repo> --offer <slug>
```

Read the offer file first: the deciding metric, the break-even and its working, the
proof table, the limits. Then authority (ceilings, testing share, safe-to-bold mix),
the calendar (seasons, capacity windows), the research files, the ledger, the latest
results snapshot, and the learnings for this offer. Learnings outrank everything else
here: a finding from this business's own results beats any play or pattern.

Thin context is normal. No research yet: plan from the offer and say the customer
types are the business's own description, to be replaced by `audience-research`. No
results yet: plan the first batch. Missing numbers are reported as assumptions, stated
once, never silently filled.

## Modes

- **Plan.** A first batch, or the next one. Diagnosis, offer check, gaps, plays, the
  batch, the test design. The default mode.
- **Audit.** Classify every live ad by customer type, awareness, format, style, breadth,
  origin and risk; compare spend and results by class where results exist; list the
  classes that are missing. The missing classes become the production list.
- **Scout.** Refresh the hub's plays library from new source notes and check old plays
  against current ad libraries. Runs only from a hub session, never from a business
  repo, and never records any business's results (README hard rule 6).

Plan usually includes a short audit when live ads exist.

## Method

### 1. Diagnose in one or two sentences

Why these ads, for whom, and what is wrong or missing right now. Without it there is
testing but no strategy (Observed, creator-ads review). The usual diagnoses: nothing
has run yet; ads run but address the wrong people; one message is carried by everything;
a winner is fatiguing with no replacement ready; results are too few to judge; the offer
itself is the problem. Pick one. Two at most.

### 2. Check the offer before any creative

A good offer rescues weak ads; the reverse does not hold (Observed, course review). Zero
results on a reasonable spend almost always means the offer, not the targeting. Check:
the ask fits the value (buy now for low prices; an estimate, a booking or a call for
considered ones); a low price point may need a bundle before ads can pay; the proof
table holds something an ad can lean on; urgency and scarcity, if used, are true. When
the offer needs a change, say so first and plan the batch around the changed offer, or
hand back to `start-here` if the change is the business's decision.

### 3. Run the gap checks

Three lenses from the research routine, plus the hub's tags (Observed, creative-strategy
review): the customer types in the research against the ones the live ads address; the
awareness levels addressed, since accounts lean too hard on ready-to-buy messages;
variety across customer type, angle and awareness. Then format mix, style mix, breadth
and origin. Write the gaps as a table. Each gap is a candidate for the batch.

Message pillars: three or four, each tied to customer types and to proof the business
holds. Angles come two or three per customer type, as pillars to work for months, not
one-off concepts.

### 4. Choose the plays

From `references/plays.md`. Every entry is a creator's claim to test, never a rule;
pick the ones whose "fits" column matches this offer and whose reason you can state in
one sentence. Plays that conflict may both be in the batch; the tags let results decide.
Respect the risk budget from `ads/authority.md`: most of a batch near-certain approvals,
a minority bold. Default when the business has set none: three safe to one bold.
Patterns from `research/competitors.md` enter with origin "modelled on a competitor",
adapted, never copied. Remixes of the business's own winners enter with origin "remix".
A learning that says a play failed here is a reason not to pick it again without a new
angle.

### 5. Build the batch

One row per ad in `ads/ledger.md`, created as `planned`, from
`core/_system/schemas/ledger-row.md`:

- **ID** `<offer>-<yymm>-<nnn>`, `yymm` the month planned, `nnn` the next number after
  the highest in the ledger for this offer, never reused, never renamed. Batch
  `<yymm>-<letter>`.
- **Tags**: plays, customer type (the name from `research/audience.md`, or the business's
  own description with that said), awareness, format, style, breadth, origin, risk.
- **Why it is tested**: one sentence naming what this ad tests that the others do not.
  Two ads with the same sentence are one ad.

Every planned ad is one of these three things, and the sentence says which: a test of a
customer type or awareness level nobody addresses, a test of a play, or a remix of a
winner. Anything else is padding.

### 6. Design the test from this offer's numbers

`references/test-design.md` carries the working. The short form:

- **The bar.** The deciding metric and the break-even from the offer file, never a rule
  of thumb. An ad is judged on that metric alone; hook rate and click rate explain, they
  never decide (hub decision 9).
- **Time to a confident answer.** From expected results per week: the ledger's history,
  the latest snapshot, the business's own volume figures, or a stated assumption. The
  default bar is about 90% confidence that one ad beats another, or the same direction
  across several independent periods. Two results tell nothing.
- **Cadence.** Changes happen in one batch at a scheduled session: daily for high
  volume, every one to two weeks or monthly for low. Write the next session date.
  Nothing new is added faster than the last batch can be judged; often that means fewer
  ads. Two great ads beat ten mediocre ones (Observed, course review).
- **Batch size and testing share.** What the window can judge and the business can
  produce, inside the testing share from authority (default 20 to 30% of spend; up to
  100% while there is no proven ad). Spend in the plan stays inside the daily and
  monthly ceilings.
- **Business before algorithm.** Capacity and calendar override the schedule: full
  crews, sold-out stock or a season's end mean hold new ads or plan them for the window
  that follows, and say so. A real sale or launch may break the hold.
- **Very low volume.** Say plainly when this offer will never reach the volume a
  platform needs to optimise on its deep result. Optimise on the earliest real status
  that arrives in time, judge on thin data with long windows and small batches, lean on
  trust-building plays aimed at people who already know the business, and never
  pretend a month of two results named a winner.
- **The rulebook.** Write the per-offer defaults `ad-manage` will apply: pause rule from
  break-even (default: pause at a session once an ad has spent about twice break-even
  with no result), the band where the business set one, the lookback, the days ignored.
  Proposed until the business or results confirm them.

### What this skill never does

It never touches a live account, pauses an ad, or moves budget; those are `ad-manage`'s
and happen in a session under the rulebook. It never renames an ID or changes a status
beyond creating rows as planned. It never claims a winner below the bar. It never adopts
a competitor's claim as the business's own.

## Quality gate

Before writing the summary, check the files:

- The diagnosis is one or two sentences and names who the ads are for.
- Every planned ad has an ID in the right form, every tag filled, and a reason no other
  row shares.
- The deciding metric and break-even are quoted from the offer file with their working.
  Volume is sourced or stated as an assumption, once.
- The plan's spend fits the ceilings; the batch fits the testing share and the
  safe-to-bold mix; capacity and calendar limits are honoured and named.
- Location, where the plan states it, is exactly where the business can serve.
- No live ad was paused, no budget moved, no ID changed.
- Say what shaped the output and how old it is.

## Output

Files first, inside the business repo's `ads/`:

- `strategy/diagnosis.md` from `core/_system/schemas/diagnosis.md`.
- `strategy/test-plan.md` from `core/_system/schemas/test-plan.md`. An existing plan is
  added to with a dated section; earlier sections stay.
- `ledger.md`: new rows as `planned`, from the ledger schema; the file is created with
  its header when absent.

Then the chat summary, short: the diagnosis, the batch as a table of ID, play, customer
type and reason, the test design in three lines (bar, window and cadence, spend), what
blocks launch, and the next skill.

## What's next

- `ad-creative` makes the batch: copy and finished ads per row, claims gated on the
  proof table.
- `ad-setup` when the offer's result signal has not been seen arriving on the platform;
  nothing in the batch can go live before it has.
- `audience-research` when the plan had to use the business's own description of its
  buyers; the next batch should not.
- `ad-review` once the window has passed: it says what the results mean and hands back
  do more, do less, experiment.
