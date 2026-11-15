<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: What the results mean (`results-review`)

**When the ask is:** "how are the ads doing", "which ad is winning", "are the ads failing", "only one sale, are the ads failing", "review the results", "what did we learn from the ads", "pull the results", "results snapshot"

**Not this:** A review pauses nothing and moves nothing. Which ads should go is answered at ad-manage's session, with this review's evidence.

**Owner:** `ad-review` (Snapshot, Review and Learnings)
**Part of:** [`ad-program`](ad-program.md)
**Live account:** read-only, under ads/authority.md

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-review/SKILL.md](../core/skills/ad-review/SKILL.md)
2. [core/skills/ad-review/references/reading-results.md](../core/skills/ad-review/references/reading-results.md)
3. [core/_system/schemas/results.md](../core/_system/schemas/results.md)

Also, when it applies:

- the business runs on Meta, before any account read: [meta-system/SKILL.md](../meta-system/SKILL.md)
- the business runs on Meta, for when figures stop changing: [meta-system/references/reporting.md](../meta-system/references/reporting.md)

## Needs

- Required: the offer file with the deciding metric and break-even; numbers for a window: a platform read or a snapshot the business pulled
- Helps, never blocks: the business's own result source; the test plan's bar; the change log and calendar

## Layers

1. **Two sources, kept apart** (`snapshot`): The window's numbers by ad ID: the platform's figures and the business's own results side by side, with unmatched results listed.
2. **Judge on the deciding metric** (`metric`): The deciding metric against break-even for the account and per ad, and the sample statement.
3. **Explain with the secondary metrics** (`explain`): What the hook rate, click rate, landing views and frequency suggest about why.
4. **Roll up by tag** (`rollups`): Results pooled by the ledger's tags.
5. **Outside events before blame** (`outside-events`): The change log, the calendar and anything the business names, for the window.
6. **Hand back, pause nothing** (`hand-backs`): Evidence handed to ad-strategy, ad-manage and ad-setup.
7. **Learnings, at the bar only** (`learnings`): A learning line with sample size and source, or none.
8. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id results-review --layer snapshot --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A late result arrives or a result is re-matched to an ad | `snapshot`, `metric`, `rollups`, `learnings`, `whole` | A learning that no longer clears the bar is not rewritten; a correcting line is appended. |
| The offer's break-even or deciding metric changes | `metric`, `hand-backs`, work order [`test-plan`](test-plan.md) | The same numbers may now read differently. |
| A change entry or an outside event is found in the window | `outside-events`, `hand-backs`, `learnings` | A cause named before the event was known is revisited. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| call above the bar | `snapshot`, **`metric`**, `explain`, `outside-events`, `hand-backs`, `learnings`, **`whole`** | The sample supports a call on the deciding metric. It is a reading of this window, not a forecast. |
| direction only | **`snapshot`**, **`metric`**, **`outside-events`**, `hand-backs`, **`whole`** | The numbers lean one way and cannot settle it. No winner, no loser, no learning. |
| inconclusive | **`snapshot`**, **`metric`**, **`whole`** | Too few results, or a source is missing. A finished answer: the review says what would settle it and when. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: At the end of ads/results/<date>-review.md, under ## Layer record.

```markdown
## Layer record
Work order: results-review
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 snapshot |  |  |  |
| 2 metric |  |  |  |
| 3 explain |  |  |  |
| 4 rollups |  |  |  |
| 5 outside-events |  |  |  |
| 6 hand-backs |  |  |  |
| 7 learnings |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (results-review):`, every layer in order with a few words of evidence in brackets:

```
Layers (results-review): snapshot pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
