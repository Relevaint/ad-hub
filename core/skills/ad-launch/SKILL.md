---
name: ad-launch
description: Puts approved ads live, and nothing else. Checks spend authority and every live gate, validates, creates campaigns, ad sets and ads paused and named by ad ID with the ID on the link, shows previews, records the approval in the approvals log in the approver's words before anything is activated, activates only what was approved, and logs every change with its undo. With no tool connected, or any gate open, it stops at the exact change list and says so. Use when a batch is creative-ready and approved, or when someone asks to launch, turn on or go live.
when_to_use:
  - launch the batch
  - put them live
  - turn the ads on
  - go live tomorrow
  - activate the approved ads
  - launch these two ads
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
      - creative/
      - changes/
    writes:
      - ledger.md#status-creative-ready-to-live
      - changes/#launch
    live: act
---

# ad-launch

Puts approved ads live. Done means the approved ads are active on the account, each one
created paused first and named by its ID, the approval recorded in the approvals log
before the first activation, and a change-log entry for every change with the way to
undo it. When a gate is open or no tool is connected, done means the exact change list,
written down, and a plain statement of what was not carried out. The judgment this skill
carries is knowing an approval when it sees one and when it does not, refusing to
activate past an open gate, and never claiming a change that did not happen.

## Context

```
node <hub>/core/_system/scripts/context.mjs --for ad-launch --root <business repo> --offer <slug>
```

Read `ads/authority.md` first: the level for this offer, the ceilings, who can approve,
what is pre-approved at level 2, and the approvals log. Then the offer file (the live
gates), the platform file (the result test, the category, the change list `ad-setup`
wrote), the test plan (the batch, the spend, the launch window), the ledger (which rows
are `creative-ready`), the creative folder (the files and assets for those rows, with
their check verdicts), the change log (the last known good state) and the calendar (any
hold). `references/launch-sequence.md` carries the gate checklist, the approval rules
and the dry-run format; load it every time.

## The gates

These are hard rules from `core/_system/spend-authority.md`. Each is checked and named
in the reply; any one open means nothing is activated.

1. **Authority exists.** `ads/authority.md` is present and names this offer. No file
   means read-only: nothing is created, not even paused. A spend figure said in chat is
   a wish, not authority; offer to have `start-here` record it as a ceiling if the
   business confirms it as a decision.
2. **The level allows the step.** Level 1 allows creating paused objects for review.
   Activation always needs an approval, and some things need a fresh one at any level:
   turning on anything that spends new money (a new campaign or ad set), anything in a
   restricted category, a budget outside the band, a change to objective, optimisation,
   attribution or tracking. Level 2 pre-approval covers only activating ads the
   business already approved inside an existing ad set, and only when that box is
   ticked.
3. **An approval is recorded.** A line in the approvals log, from a person named in "Who
   can approve", covering exactly these ads, before the first activation. An approval
   given in this session is written there first, in the approver's words, with the date
   and who said it. A relayed approval ("the broker approved them on the phone") is
   recorded as relayed, naming who relayed it; the business's own rules decide whether
   that is enough, and the reply says so.
4. **The result can be measured.** The offer file names the result and where it is
   recorded, and the platform file records a test of it seen arriving on the platform,
   on a date. Not seen means not live.
5. **The ads are finished and checked.** Every row to launch is `creative-ready`, its
   file's check verdict is ready for approval, every claim is mapped, and the required
   strings are in place. A `copy-ready` row has no inspected asset and does not launch.
6. **The category is declared.** Where the offer has a restricted category, the platform
   file records it declared, and the ads were checked against the category's rules.
7. **Spend fits.** The batch's spend, with what is already live, stays inside the daily
   and monthly ceilings. Capacity holds in the calendar or the test plan are honoured.
8. **The ID thread holds.** Every ad has its ID in the ledger, its name on the platform
   is the ID, and its link carries the ID as the tracking parameter.

## Method

### 1. Build the change list

From the platform file's change list and the test plan's batch: every object to create
or change, in order (campaign, ad set, ads), with its settings in plain words and its
before and after values; each created paused; each ad named by ID with the ID on the
link. Where the platform has a feature for introducing new ads into a live set with a
fixed share of budget, new batches enter through it (play `dist-test-slot`); the platform
layer says whether the connected tools can set it. Keep the safe-to-risky mix the plan
set: never activate only the bold ones.

### 2. Validate, as a dry run

Run the platform's validate-only option where the tool offers it, and write the change
list as a dry-run entry in `ads/changes/`, marked as a dry run with nothing sent. This
is the deliverable when a tool is missing or a gate is open: the exact list a person
could carry out, or the list that runs once the gate clears. Show it before anything is
created.

### 3. Create, paused

Through the business's connected tools, under the level. Every object paused. Record the
platform identifiers the tools return in the change-log entries; `ad-setup` carries them
into the platform file's baseline at its next run.

### 4. Preview

Render each ad's preview per placement with the platform's preview tool and show the
operator what was built, so the approval that follows is of the thing itself, not a
description. Where no preview can be rendered, say so; the operator looks in the
platform's own interface before approving.

### 5. Record the approval, then activate

Write the approval line to the approvals log first. Then activate exactly what the line
covers, nothing more: the ads named, and the ad set and campaign they sit in when those
are part of the approval. Pre-approved level 2 activation covers ads already approved
inside an existing set and nothing else.

### 6. Log every change

One entry per change in `ads/changes/`, from `core/_system/schemas/change-entry.md`:
creation, activation, each with its before and after, the authority behind it, whether
it was validated first, the platform's own result, and the undo. "Confirmed on the
platform" only when the platform confirmed it. The entry that activates a batch also
records the state it leaves behind as the last known good: which ads are live, at what
budgets and settings. Changes made in one session share a session ID.

### 7. Move the ledger rows

`creative-ready` to `approved` when the approval line is written; `approved` to `live`
when the platform confirms activation. Nothing else on the row changes.

### What this skill never does

It never activates past an open gate or without an approval line. It never treats a chat
message as recorded authority before writing it down. It never creates an object active.
It never raises a ceiling, moves budget, or changes objective, optimisation, attribution
or tracking; those are decisions for the business, carried out by `ad-manage` under its
rulebook or by a fresh approval. It never logs a change that did not happen. It never
works around a rejected ad, a restricted category or a disabled account.

## Quality gate

Before writing the summary, check:

- Every gate named with its state; any open gate means nothing was activated and the
  reply says what clears it and who.
- Every created object was paused first, is named by ID, and carries the ID on its link.
- The approval line exists in the approvals log, from someone who can approve, covering
  exactly what was activated, dated, in their words, before the activation entry.
- Every change has an entry with an undo; dry runs are marked as dry runs; nothing is
  recorded as confirmed that the platform did not confirm.
- Ledger statuses match what is true on the account.
- Spend fits the ceilings with what was already live.
- The reply says what was done, what was not, and why.

## Output

Files first: the change-log entries in `ads/changes/` (dry run, creations, activations),
the approval line in `ads/authority.md`, the ledger rows moved. Then the chat summary:
the gates as a short table, the change list or where it is, what was activated or that
nothing was and why, the first judging date from the test plan, and the next skill.

## What's next

- `ad-manage` starts the daily watch the day after launch and holds the first session
  on the test plan's date.
- `ad-review` after the first window.
- `ad-setup` when the result test or the category is the open gate.
- `start-here` to record a ceiling or a decision the business made in this session, in
  its words.
