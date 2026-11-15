<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Scheduled management session (`management-session`)

**When the ask is:** "run the session", "which ads should go", "kill the ads", "kill the ads that are not working", "pause the losers and scale the winners", "manage the ads", "budget moves", "raise the budget", "replace the weak ads", "what should we change in the account this week", "this week's changes to the account", "scale the winning ad", "scale the winner", "turn off the ads that are wasting money", "cut the wasted spend", "increase the budget on the best ad"

**Owner:** `ad-manage` (Session)
**Part of:** [`ad-program`](ad-program.md)
**Live account:** changes under the level, the rulebook and the band; most changes need an approval

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-manage/SKILL.md](../core/skills/ad-manage/SKILL.md)
2. [core/skills/ad-manage/references/watch-and-sessions.md](../core/skills/ad-manage/references/watch-and-sessions.md)
3. [core/_system/spend-authority.md](../core/_system/spend-authority.md)
4. [core/_system/schemas/change-entry.md](../core/_system/schemas/change-entry.md)

Also, when it applies:

- the business runs on Meta, before any account read or change: [meta-system/SKILL.md](../meta-system/SKILL.md)

## Needs

- Required: ads/authority.md; the test plan's rulebook; a results snapshot for the window
- Helps, never blocks: a connected ads tool; the calendar

## Layers

### 1. The numbers (`numbers`)

- **Build:** The deciding metric per ad against the offer's break-even for the window.
- **Method:** [ad-manage/SKILL.md, "session scheduled"](../core/skills/ad-manage/SKILL.md#session-scheduled); [ad-manage/references/watch-and-sessions.md, "the session checklist"](../core/skills/ad-manage/references/watch-and-sessions.md#the-session-checklist)
- **Check:** Is the deciding metric per ad set against the offer's break-even from a dated snapshot, with the settling days set aside?
- **Evidence:** The snapshot with its window and pull date; the break-even quoted from the offer file.
- **If it fails:** No snapshot: ask ad-review for one, or read the platform and say the numbers are not yet a snapshot.

### 2. Apply the rulebook (`rulebook`)

- **Build:** Each rule in the test plan applied as written: pause rule, band, lookback, fatigue check.
- **Method:** [ad-manage/references/watch-and-sessions.md, "the pause rule illustrated"](../core/skills/ad-manage/references/watch-and-sessions.md#the-pause-rule-illustrated); [ad-manage/references/watch-and-sessions.md, "fatigue"](../core/skills/ad-manage/references/watch-and-sessions.md#fatigue)
- **Check:** Was each rule applied as written, or the reason it was not written down?
- **Evidence:** The rulebook lines beside each ad's figures.
- **If it fails:** A rule that cannot fire for this offer (a pause line above the monthly ceiling) goes to ad-strategy; it is not replaced by feel.

### 3. Hold the confidence bar (`bar`)

- **Build:** Which ads can be called, and which must wait and for how long.
- **Method:** [ad-manage/references/watch-and-sessions.md, "the confidence bar illustrated"](../core/skills/ad-manage/references/watch-and-sessions.md#the-confidence-bar-illustrated); [ad-manage/SKILL.md, "low volume"](../core/skills/ad-manage/SKILL.md#low-volume)
- **Check:** Is every winner or loser call at or above the confidence bar, with everything below it left alone and the time to settle stated?
- **Evidence:** The result counts and the arithmetic for each call.
- **If it fails:** Withdraw the call. Below the bar only the spend-with-no-result line may pause.

### 4. One type of change (`change-type`)

- **Build:** The one type of change this session makes.
- **Method:** [ad-manage/references/watch-and-sessions.md, "one type of change"](../core/skills/ad-manage/references/watch-and-sessions.md#one-type-of-change)
- **Check:** Is this session making one type of change only, with targeting, attribution, bidding and objective left out?
- **Evidence:** The decisions table.
- **If it fails:** Hold the second type for the next session.

### 5. Inside the band (`band`)

- **Build:** Any budget move, inside the band and the level.
- **Method:** [ad-manage/references/watch-and-sessions.md, "the band illustrated"](../core/skills/ad-manage/references/watch-and-sessions.md#the-band-illustrated); [_system/spend-authority.md, "budget bands"](../core/_system/spend-authority.md#budget-bands)
- **Check:** Is every budget move inside the band and the level, scaling the existing campaign rather than duplicating it?
- **Evidence:** The band in authority.md beside each move.
- **If it fails:** No band means no budget move: this layer is n/a and the move becomes a question for the business.

### 6. Capacity before the algorithm (`capacity`)

- **Build:** The calendar and the offer's limits read against the planned spend.
- **Method:** [ad-manage/SKILL.md, "session scheduled"](../core/skills/ad-manage/SKILL.md#session-scheduled)
- **Check:** Do the calendar and the offer's limits allow this spend, whatever the numbers say?
- **Evidence:** The calendar and the offer file's Limits.
- **If it fails:** Bring spend down or stop; say so.

### 7. Carry out, log and record (`log`)

- **Build:** Each change carried out and confirmed, one entry each with its undo; ledger rows moved; the last known good written.
- **Method:** [ad-manage/SKILL.md, "session scheduled"](../core/skills/ad-manage/SKILL.md#session-scheduled); [ad-manage/references/watch-and-sessions.md, "when no tool is connected"](../core/skills/ad-manage/references/watch-and-sessions.md#when-no-tool-is-connected)
- **Check:** Did the platform confirm each change, and does each have an entry with its undo, with the last known good updated?
- **Evidence:** The platform's confirmations; the entries in ads/changes/.
- **If it fails:** A change not confirmed is logged as not carried out. With no tool or no approval, the list is marked prepared, not carried out.

### Whole output (`whole`)

- **Method:** [ad-manage/SKILL.md, "quality gate"](../core/skills/ad-manage/SKILL.md#quality-gate)
- **Check:** Does the reply say what changed, what did not and why, with ledger statuses matching what is true on the account?
- **Evidence:** The reply against the change entries and the ledger.
- **If it fails:** Correct the reply, the entry or the row that overstates.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A late result arrives or the snapshot is corrected | `numbers`, `rulebook`, `bar` | A call made on the old numbers is withdrawn if it no longer clears the bar. |
| The band, the level or a ceiling changes | `band`, `log` | Read authority.md again. |
| A change hurts | `log`, work order [`rollback`](rollback.md) | Revert to the last known good before trying a new fix. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| changes prepared, not carried out | **`numbers`**, **`rulebook`**, **`bar`**, **`change-type`**, `capacity` | The decisions and the change list exist. Nothing was changed: an approval or a tool is missing. |
| session done | `numbers`, `rulebook`, `bar`, `change-type`, `band`, `capacity`, **`log`**, `whole` | Every change was confirmed by the platform and logged with its undo; the next session date is named. |
| session done, nothing changed | **`numbers`**, **`rulebook`**, **`bar`**, **`whole`** | Nothing met the rulebook or the bar. Waiting is the decision; the time to settle is stated. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the session's closing change entry, under ## Layer record; in the reply when nothing was changed.

```markdown
## Layer record
Work order: management-session
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 numbers |  |  |  |
| 2 rulebook |  |  |  |
| 3 bar |  |  |  |
| 4 change-type |  |  |  |
| 5 band |  |  |  |
| 6 capacity |  |  |  |
| 7 log |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (management-session):`, every layer in order with a few words of evidence in brackets:

```
Layers (management-session): numbers pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
