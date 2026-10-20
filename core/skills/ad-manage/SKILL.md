---
name: ad-manage
description: Keeps spend safe and performance improving without over-tinkering. A daily watch that looks for emergencies only and otherwise changes nothing, and a scheduled session that makes every change in one batch under the offer's rulebook, at the confidence bar, inside the budget band and the level the business set, logging each change with its undo and keeping a last known good to roll back to. Use for the daily check, for a scheduled action session, when someone asks to pause, kill, scale or move budget, or when the business signals an emergency such as being at capacity.
when_to_use:
  - run today's check on the ads
  - kill the ads that are not working
  - pause the losers
  - scale the winner
  - we are full, stop the ads
  - hold the action session
metadata:
  adhub:
    version: 0.1.0
    layer: operations
    reads:
      - offers/
      - offers/<offer>.md
      - authority.md
      - calendar.md
      - platform/
      - strategy/test-plan.md
      - ledger.md
      - results/
      - changes/
      - learnings.md
    writes:
      - ledger.md#status-live-paused-retired
      - changes/#manage
    live: act
---

# ad-manage

Keeps spend safe and performance improving without over-tinkering. Two rhythms, never
mixed. The daily watch reads, flags emergencies, and changes nothing else; done means
spend against the ceiling, the emergency list checked, and a line on what the next
session will look at. The scheduled session makes every change in one batch under the
offer's rulebook: done means decisions taken on the deciding metric at the confidence
bar, one type of change, every change logged with its undo, and the last known good
updated. The judgment this skill carries is telling an emergency from a bad day,
refusing to act on noise, and never calling a winner or a loser below the bar.

## Context

```
node <hub>/core/_system/scripts/context.mjs --for ad-manage --root <business repo> --offer <slug>
```

Read `ads/authority.md` (level, ceilings, which level 2 actions are pre-approved, the
band, the risk budget), the test plan (the rulebook, the cadence, the next session
date, any hold), the ledger (which rows are live), the latest results snapshot in
`ads/results/` (written by `ad-review`; when a tool is connected and the snapshot is
older than the watch needs, read the account and say the numbers came from the platform
and are not yet a snapshot), the change log (what was done last, the last known good),
the calendar and the offer's limits (capacity, stock, seasons), and the learnings.
`references/watch-and-sessions.md` carries the daily questions, the emergency table,
the session checklist and the arithmetic; load it every time.

## What reaches the account

Reading needs `ads/authority.md` and a connected tool. Changing anything needs the
level and, for most things, an approval: level 2 pre-approval covers pausing under the
rulebook, budget moves inside the band, activating ads already approved inside an
existing set, and the emergency stop, each only when its box is ticked. Level 1 means
nothing changes without a fresh approval; the output is the change list and a question.
No tool connected means the change list, marked as not carried out; a change that did
not happen is never logged as one that did.

## Modes

### Watch, daily

Five questions, read from the latest numbers (Observed, Meta kit review): is spend on
track against the daily ceiling; what is running; what is doing well; what is bleeding;
what is fatiguing. Then the emergency list, and only that list acts:

- spend running past the daily ceiling
- money spent while the result signal has gone silent
- the destination page or checkout down
- a wave of rejections or an account warning
- the business at capacity or out of stock, by its own word or the calendar

An emergency means pause spend at once and report, under the pre-approved emergency
stop; without that box ticked, prepare the pause list and ask. Everything else, however
tempting, is written down for the next session and left alone. The most recent two to
three days of platform data are still settling and are not judged. On a day with no
emergency the watch changes nothing, writes nothing, and says why in two lines: no
emergency, and the next session date.

### Session, scheduled

On the test plan's date, or when the business calls one. In order:

1. **The numbers.** The snapshot for the window, with the last two to three days set
   aside. The deciding metric per ad against the offer's break-even; everything else
   explains.
2. **The rulebook.** Apply the test plan's rules as written: the pause rule (default
   about twice break-even spent with no result), the band for budget moves, the
   lookback, the fatigue check. A rule is applied or the reason it was not is written.
3. **The bar.** No ad is called a winner or a loser below the confidence bar (default
   about 90% that one beats another on the deciding metric, or the same direction
   across several independent periods). Two results tell nothing. Below the bar the
   session may pause under the rulebook's spend-with-no-result line and otherwise
   waits; it says how long until the question can be settled.
4. **One type of change.** Pausing weak ads and activating approved replacements is one
   type. A budget move inside the band is another. Targeting, attribution, bidding and
   objective are decisions for the business and never ride along in the same session.
5. **Inside the band.** Scale up in small steps while the metric is well inside
   break-even, hold in the middle zone, scale down past the worse threshold, with the
   floor, ceiling and lookback the business set. No band in `ads/authority.md` means no
   budget moves. Scale the existing campaign; never duplicate it to spend more.
6. **Capacity before the algorithm.** When the calendar or the offer's limit says the
   business is full, spend comes down or stops whatever the numbers say.
7. **Log and record.** One change entry per change with its undo; the ledger rows
   moved (`live` to `paused`, `paused` to `live`, any to `retired`); the last known good
   state written into the session's closing entry.

### Rollback

When a change hurts, reverting to the last known good in `ads/changes/` is the first
move, not a new fix. The revert is logged as a change that names the one it undoes.

### Troubleshooting, in a fixed order

Before blaming an ad: the signal (has it gone silent or changed), outside events (the
calendar, the season, the market, noted before a change is blamed), the offer and the
page (zero results on reasonable spend is almost always the offer), fatigue (frequency
rising with cost worsening wants a meaningfully different replacement), an exhausted
warm pool, then the creative itself. A campaign reset is the last resort, after the
rest is ruled out (Observed, course review).

### Low volume

Patience scales inversely with volume. A profitable account that never leaves the
platform's limited-learning state is fine. Faster answers come from waiting or from
spend the business has authorised, never from reading the numbers harder.

### What this skill never does

It never acts outside a session except on the emergency list. It never raises a
ceiling. It never moves spend to another offer or audience on its own. It never changes
objective, optimisation, attribution or tracking. It never duplicates a campaign to
scale. It never calls a winner or a loser below the bar. It never logs a change the
platform did not confirm. It never works around a rejection, a restricted category or a
disabled account.

## Quality gate

Before writing the summary, check:

- Watch: nothing changed unless an emergency condition was met and named; spend stated
  against the ceiling; the last two to three days set aside; the next session date
  given.
- Session: every rule applied or its skip explained; no winner or loser called below
  the bar; one type of change; every move inside the band and the level; capacity
  honoured.
- Every change has an entry with its undo; the last known good is written; nothing is
  recorded as confirmed that the platform did not confirm; a list that could not be
  carried out is marked so.
- Ledger statuses match what is true on the account.
- The reply says what changed, what did not, and why.

## Output

Files first: change entries in `ads/changes/` for anything done or prepared, the
ledger rows moved. Then the chat summary: for a watch, spend against the ceiling, the
emergency list checked, what the next session will look at, two lines; for a session,
the decisions as a short table (ID, metric, rule applied, action, undo), what was held
and why, the next session date.

## What's next

- `ad-review` reads the window and says what the results mean; its "do more, do less,
  experiment" feeds `ad-strategy`.
- `ad-strategy` plans the replacements a session will need, before it needs them.
- `start-here` records a capacity limit, a season or a decision the business states, in
  its words; this skill does not write the offer file or the calendar.
- `ad-launch` activates the approved replacements the session calls for.
