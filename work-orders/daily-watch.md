<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Daily watch (`daily-watch`)

**When the ask is:** "run today's check on the ads", "daily check", "daily watch", "anything wrong with the ads today", "check the ads this morning", "we filled every slot", "we are at capacity, stop the ads", "we are out of stock, pause the ads", "the checkout is down"

**Not this:** The watch reads and acts only on an emergency. Pausing a weak ad, a budget move or a new ad waits for the scheduled session.

**Owner:** `ad-manage` (Watch)
**Part of:** [`ad-program`](ad-program.md)
**Live account:** reads; pauses only under the pre-approved emergency stop

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-manage/SKILL.md](../core/skills/ad-manage/SKILL.md)
2. [core/skills/ad-manage/references/watch-and-sessions.md](../core/skills/ad-manage/references/watch-and-sessions.md)
3. [core/_system/spend-authority.md](../core/_system/spend-authority.md)

Also, when it applies:

- the business runs on Meta, before any account read or change: [meta-system/SKILL.md](../meta-system/SKILL.md)

## Needs

- Required: ads/authority.md; the latest numbers: a snapshot or a platform read
- Helps, never blocks: the calendar; the test plan's next session date

## Layers

### 1. Read the numbers (`numbers`)

- **Build:** Spend against the daily ceiling and the five daily questions, from the latest numbers.
- **Method:** [ad-manage/SKILL.md, "watch daily"](../core/skills/ad-manage/SKILL.md#watch-daily); [ad-manage/references/watch-and-sessions.md, "the five daily questions meta kit review"](../core/skills/ad-manage/references/watch-and-sessions.md#the-five-daily-questions-meta-kit-review)
- **Check:** Are today's numbers from a named source with its date, with the last two to three days set aside as still settling?
- **Evidence:** The snapshot file or the platform read, with its date and the authority that allowed it.
- **If it fails:** No numbers: say so, check what can be checked (the page, the calendar) and mark this layer not checked.

### 2. Check the emergency list (`emergencies`)

- **Build:** Each of the five emergency conditions checked and named as met or not met.
- **Method:** [ad-manage/references/watch-and-sessions.md, "the emergency list"](../core/skills/ad-manage/references/watch-and-sessions.md#the-emergency-list); [ad-manage/references/watch-and-sessions.md, "what a bad day is not"](../core/skills/ad-manage/references/watch-and-sessions.md#what-a-bad-day-is-not)
- **Check:** Was each of the five emergency conditions checked and named as met or not met, with a bad day not mistaken for one?
- **Evidence:** Per condition, the figure or fact checked: spend against the ceiling, the signal, the page opened, rejections, capacity in the calendar.
- **If it fails:** A condition that could not be checked is named as not checked, never assumed clear.

### 3. Act on an emergency, or leave it (`action`)

- **Build:** An emergency pause under the pre-approved stop, a prepared pause list with a question, or nothing.
- **Method:** [ad-manage/SKILL.md, "watch daily"](../core/skills/ad-manage/SKILL.md#watch-daily); [_system/spend-authority.md, "emergency stop"](../core/_system/spend-authority.md#emergency-stop)
- **Check:** Was anything changed only because an emergency condition was met and the emergency stop is pre-approved, with everything else left for the session?
- **Evidence:** The emergency-stop box in authority.md; the platform's confirmation of the pause, or the entry marked not carried out.
- **If it fails:** A change made outside the list is rolled back and reported. A pause the platform did not confirm is logged as not carried out.

### Whole output (`whole`)

- **Method:** [ad-manage/SKILL.md, "quality gate"](../core/skills/ad-manage/SKILL.md#quality-gate)
- **Check:** Does the reply give spend against the ceiling, the emergency list as checked and the next session date, and did a quiet day change and write nothing?
- **Evidence:** The reply; the unchanged ads/ folder on a quiet day.
- **If it fails:** Remove what was written on a quiet day; add the missing line.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| New numbers arrive the same day, or the business reports capacity or stock | `emergencies`, `action` | Capacity by the business's own word is an emergency condition. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| no emergency | **`numbers`**, **`emergencies`**, `action`, **`whole`** | Nothing changed, nothing written. The next session date is named. |
| emergency paused | `emergencies`, **`action`**, `whole` | Spend was paused under the pre-approved emergency stop; the platform confirmed it; the entry has its undo. |
| pause list prepared | **`emergencies`**, **`action`** | An emergency condition is met and nothing was carried out: the stop is not pre-approved, or no tool is connected. The list and the question are in the reply. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the reply, as one line. An emergency pause also carries it in its change entry.

```markdown
## Layer record
Work order: daily-watch
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 numbers |  |  |  |
| 2 emergencies |  |  |  |
| 3 action |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (daily-watch):`, every layer in order with a few words of evidence in brackets:

```
Layers (daily-watch): numbers pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
