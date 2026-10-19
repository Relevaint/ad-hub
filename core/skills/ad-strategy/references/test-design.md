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
keep decisions provisional; lean on trust-building plays aimed at people who already
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
  no budget moves.
- Judge nothing in the most recent two to three days. Fatigue check: frequency rising
  with cost worsening means a meaningfully different replacement, which the next batch
  should already hold.

## Writing the plan honestly

State every assumption once, in the plan, with what would replace it: "expected
purchases per week unknown; assumed about ten from the $40 daily ceiling and a $4 to $6
cost per purchase typical of nothing in this repo, to be replaced by the first
snapshot." Then the first snapshot replaces it and the plan says so.
