<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Daily watch (`daily-watch`)

**When the ask is:** "run today's check on the ads", "daily check", "daily watch", "anything wrong with the ads today", "check the ads this morning", "we filled every slot", "we are at capacity, stop the ads", "we are out of stock, pause the ads", "the checkout is down"

**Not this:** The watch reads and acts only on an emergency. Pausing a weak ad, a budget move or a new ad waits for the scheduled session.

**Owner:** `ad-manage` (Watch)
**Part of:** [`ad-program`](ad-program.md)
**Live account:** reads; pauses only under the pre-approved emergency stop

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

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

1. **Read the numbers** (`numbers`): Spend against the daily ceiling and the five daily questions, from the latest numbers.
2. **Check the emergency list** (`emergencies`): Each of the five emergency conditions checked and named as met or not met.
3. **Act on an emergency, or leave it** (`action`): An emergency pause under the pre-approved stop, a prepared pause list with a question, or nothing.
4. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id daily-watch --layer numbers --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

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

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (daily-watch):`, every layer in order with a few words of evidence in brackets:

```
Layers (daily-watch): numbers pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
