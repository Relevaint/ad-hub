# Test design: the working behind the plan

Load when writing the test design and the rulebook. Everything here is a default from
the course review unless marked otherwise; the hard rules are in the skill. Numbers in
examples are illustrative, not real.

## The bar comes from the offer file

The deciding metric is ROAS where value is tracked, otherwise cost per result (hub
decision 9). The break-even is the one in `ads/offers/<offer>.md`, with its working;
quote it. A business may have set its own target instead; use that and say so. Never
replace either with a rule of thumb.

Illustrative: a $29 digital product at 92% margin breaks even at $26.68 per purchase, a
ROAS of about 1.09. A $340 service job at 50% margin where 45% of booked estimates are
won breaks even at $76.50 per booked estimate.

**Target.** Where the business has set no target, propose one about 25% better than
break-even: ROAS times 1.25, or cost per result divided by 1.25 (Observed, Ecommerce
Alley playbook). Illustrative: break-even ROAS 1.8 gives a target of 2.25; break-even
$30 per purchase gives $24. It marks the line above which the budget band may scale;
it is Proposed until the business confirms it.

## Time to a confident answer

Enough data is not a number of days. It depends on how many results arrive and how far
apart the ads are: a $45 against a $125 cost per result needs little; $45 against $48
needs a lot. Default bar: about 90% confidence that one ad is better than another on
the deciding metric, or the same direction across several independent periods. Two
results tell nothing. Faster answers come from waiting or from spending more, not from
reading the numbers harder (Observed, course review, 17.1).

Expected results per week come from, in order: the latest results snapshot, the ledger's
history, the business's own volume figures (leads a month, jobs a month, orders a
month), or a stated assumption. Say which.

The most recent two to three days of platform data are still settling and are not
judged. The learning phase after a launch or a major edit runs about one to two days,
longer at low volume; discount it when comparing a new ad with an established one.

## Cadence

Changes happen in one batch at a scheduled session; the daily run only watches for
emergencies (hub decision 8). Set the session cadence from volume:

| Results per week on the deciding metric | Session cadence | Judging window |
| --- | --- | --- |
| Dozens or more | daily or every few days | days |
| Several to a dozen | weekly to every two weeks | two to three weeks |
| A few | every two weeks to monthly | a month or more |
| Fewer than one | monthly, on thin data | a quarter; decisions stay provisional |

One type of account change per session. Killing weak ads and adding new ones is one
change. Write the next session date in the plan.

**Direct online sales: a weekly launch option.** For a store selling online, the
Ecommerce Alley playbook launches a new batch every week regardless of volume, and lets
the platform's spend allocation and the campaign's own result do the early judging
(Observed). Where the business picks this, write it into the plan: analyse and build
early in the week, launch on the store's best converting day by its own data (the
playbook's default is Thursday, ahead of Friday and Saturday), launch whatever is ready
rather than skip a week. Judging individual ads still follows the bar above; the
weekly batch adds swings, it does not shorten the window for calling a winner. The
hub's conflicts note records the tension with the hold rule below.

## Batch size and the hold rule

Default production target from the course: about twenty genuinely different ads per ad
set, four as a floor, mixing formats, customer types and styles (Observed, 11.2). The
cadence rule cuts it down: never add new ads faster than the last batch can be judged
(Observed, 19.4). For most small accounts that means a batch of four to eight, judged
over two to three weeks or more. Two great ads beat ten mediocre ones.

Testing share of spend: 10 to 20% when results are strong, 20 to 30% as the usual
default, up to 100% while there is no proven ad (Observed, 19.1). A separate testing
campaign only when it would itself reach about fifty results a week; otherwise test
inside the one campaign and ad set (Observed, 19.2; the hub's conflicts note records
the other position). Where the platform has a creative testing feature, new ads enter
through it so they get spend (play `dist-test-slot`).

## What each batch tests: the ladder

A default order for choosing a batch's one testing focus, cheapest variable first
(Observed, Ecommerce Alley playbook; play `test-ladder`):

1. **Angles.** The umbrella message. Several angles, one hook each, until one wins.
2. **Hooks.** Many ways to say the winning angle: what is seen, read, heard, and the
   sound. Images have hooks too (the image and its text).
3. **Styles.** The winning hook shown different ways: comparison, founder story,
   advertorial, sticky notes, demonstration, and so on.
4. **Formats.** Move the winning static into video (9:16), or the reverse.

One testing focus per batch, written in the plan, so the result can be read; mixing
angle, hook and style changes in one batch leaves nothing to follow. Lock a winner at
one rung, then test the next rung on it. Dropping back to test fresh angles beside a
higher rung is fine when production and budget allow. Start with images where they are
faster to make. Rule of thumb for angle versus hook: if fewer than ten hooks fit under
it, it is a hook. This sits on top of the gap checks in the skill: the gap table says
which customer type and awareness level the batch serves; the ladder says what varies
inside it.

## Mix and risk

Safe-to-bold mix: most of a batch near-certain approvals, a minority bold, to protect
the account's approval record while unusual plays run (Observed, 24.6). Default three
safe to one bold where the business set none; `ads/authority.md` overrides.

## Budget stays inside authority

Daily and monthly ceilings are the business's, in `ads/authority.md`. The plan's spend
across the batch, at the testing share, fits under them with room for the ads already
live. A starter budget is an amount the business could lose without regret, held until
profitable; a failing campaign is not fixed by more budget (Observed, 9.1, 9.2). The
plan proposes spend; it never raises a ceiling.

## Business before algorithm

Capacity and the calendar override the schedule (Observed, 9.3). Full crews, a sold-out
line, a season about to end: hold new ads, or plan the batch for the window that
follows, and write the date. A real sale, launch or peak may break a hold on purpose.
Where the offer file names a capacity limit, the plan names what happens when it is
reached: that is the emergency stop `ad-manage` watches for.

## Very low volume

Platforms learn from volume this offer may never produce. Say so plainly. Then:
optimise on the earliest real status that arrives in time (the booked call, not the
signed engagement months later); judge on thin data with long windows and small batches;
keep decisions provisional; keep the batch to two to four ads, since every extra ad
halves again what can be read; lean on trust-building plays aimed at people who already
know the business (`dist-omnipresent`, `fmt-founder-interview`, `offer-lead-magnet` and
the like, each still a play to test); and treat a profitable account that never leaves
"learning limited" as fine (Observed, 19.5). Never read a winner into a month of two
results.

## The rulebook, per offer

Defaults for `ad-manage` to apply at a session, written as Proposed until the business
or results confirm them:

- Pause an ad at a session once it has spent about twice break-even with no result on
  the deciding metric. Illustrative: break-even $76.50 per booked estimate, pause at
  about $153 with none booked. The faster kill rule from the second creator (twice the
  average cost per result with no result; two and a half times with one) is an option
  with the multiples set per offer; by chance alone it cuts about one in seven ordinary
  ads, so it suits accounts with plenty of new ads waiting.
- Budget band: scale up in small steps while the metric is well inside break-even, hold
  in the middle zone, scale down past a worse threshold, with a floor, a ceiling and a
  short lookback, all from the business's band in `ads/authority.md`. No band set means
  no budget moves. A simple band to propose for a direct online sale (Observed,
  Ecommerce Alley playbook): below break-even, run the pause rule; between break-even
  and target, hold; above target over the last seven days, raise the campaign budget
  20 to 30% a week, expect a two to three day dip, and step back if it does not
  settle. Proposed until the business records it.
- Judge nothing in the most recent two to three days. Fatigue check: frequency rising
  with cost worsening means a meaningfully different replacement, which the next batch
  should already hold.

## Writing the plan honestly

State every assumption once, in the plan, with what would replace it: "expected
purchases per week unknown; assumed about ten from the $40 daily ceiling and a $4 to $6
cost per purchase typical of nothing in this repo, to be replaced by the first
snapshot." Then the first snapshot replaces it and the plan says so.
