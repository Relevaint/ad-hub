<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: What the results mean (`results-review`)

**When the ask is:** "how are the ads doing", "which ad is winning", "are the ads failing", "only one sale, are the ads failing", "review the results", "what did we learn from the ads", "pull the results", "results snapshot"

**Not this:** A review pauses nothing and moves nothing. Which ads should go is answered at ad-manage's session, with this review's evidence.

**Owner:** `ad-review` (Snapshot, Review and Learnings)
**Part of:** [`ad-program`](ad-program.md)
**Live account:** read-only, under ads/authority.md

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

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

### 1. Two sources, kept apart (`snapshot`)

- **Build:** The window's numbers by ad ID: the platform's figures and the business's own results side by side, with unmatched results listed.
- **Method:** [ad-review/SKILL.md, "1 two sources kept apart"](../core/skills/ad-review/SKILL.md#1-two-sources-kept-apart)
- **Check:** Are the platform's numbers and the business's result source both shown per ad ID and kept apart, with unmatched results visible and every missing source or unsettled day named as a limit?
- **Evidence:** The two sources named with their pull dates; the unmatched list; the limits line.
- **If it fails:** A source or a date that was passed over is named as a limit, and the reading that follows is no stronger than the limit allows. An unmatched result stays unmatched.

### 2. Judge on the deciding metric (`metric`)

- **Build:** The deciding metric against break-even for the account and per ad, and the sample statement.
- **Method:** [ad-review/SKILL.md, "2 judge on the deciding metric"](../core/skills/ad-review/SKILL.md#2-judge-on-the-deciding-metric); [ad-review/references/reading-results.md, "what the sample can say"](../core/skills/ad-review/references/reading-results.md#what-the-sample-can-say)
- **Check:** Is the reading on the deciding metric against the quoted break-even, with the sample statement saying which of three readings holds: a call above the bar, direction only, or too few to say?
- **Evidence:** The offer file's break-even with its working; the result count; the bar from the test plan; what the lag allows by now.
- **If it fails:** Below the bar the answer is direction only or too few to say, and that is a finished answer: say what would settle it and when.

### 3. Explain with the secondary metrics (`explain`)

- **Build:** What the hook rate, click rate, landing views and frequency suggest about why.
- **Method:** [ad-review/SKILL.md, "3 explain with the secondary metrics"](../core/skills/ad-review/SKILL.md#3-explain-with-the-secondary-metrics)
- **Check:** Is every secondary-metric reading labelled as an explanation, never as the verdict?
- **Evidence:** The Explained, not decided section.
- **If it fails:** Relabel it; remove a verdict that rests on an explaining metric. With no explaining metrics in the snapshot this layer is not checked, and the review says who can pull them.

### 4. Roll up by tag (`rollups`)

- **Build:** Results pooled by the ledger's tags.
- **Method:** [ad-review/SKILL.md, "4 roll up by tag"](../core/skills/ad-review/SKILL.md#4-roll-up-by-tag); [ad-review/references/reading-results.md, "roll ups"](../core/skills/ad-review/references/reading-results.md#roll-ups)
- **Check:** Does every roll-up carry its count of ads and results?
- **Evidence:** The roll-up table.
- **If it fails:** Add the counts; drop a roll-up that has none.

### 5. Outside events before blame (`outside-events`)

- **Build:** The change log, the calendar and anything the business names, for the window.
- **Method:** [ad-review/SKILL.md, "5 outside events before blame"](../core/skills/ad-review/SKILL.md#5-outside-events-before-blame)
- **Check:** Were the change log and the calendar checked before any change was blamed or any ad credited?
- **Evidence:** The entries and events in the window, listed.
- **If it fails:** Check them now and revise any cause that rested on a coincidence.

### 6. Hand back, pause nothing (`hand-backs`)

- **Build:** Evidence handed to ad-strategy, ad-manage and ad-setup.
- **Method:** [ad-review/SKILL.md, "6 hand back pause nothing"](../core/skills/ad-review/SKILL.md#6-hand-back-pause-nothing); [ad-review/references/reading-results.md, "which questions belong to which skill"](../core/skills/ad-review/references/reading-results.md#which-questions-belong-to-which-skill)
- **Check:** Does each hand-back name its skill and carry its evidence, with nothing paused or changed from the review?
- **Evidence:** The Hand-backs section; the untouched ledger statuses and change log.
- **If it fails:** Undo nothing on the account from here: report it, and move the decision to its skill.

### 7. Learnings, at the bar only (`learnings`)

- **Build:** A learning line with sample size and source, or none.
- **Method:** [ad-review/SKILL.md, "8 learnings at the bar only"](../core/skills/ad-review/SKILL.md#8-learnings-at-the-bar-only); [ad-review/references/reading-results.md, "learnings"](../core/skills/ad-review/references/reading-results.md#learnings)
- **Check:** Does each learning clear the bar with a sample size and a source, or was none written?
- **Evidence:** The learning line against the sample statement.
- **If it fails:** Move it to Direction, not yet a learning, with what would make it one.

### Whole output (`whole`)

- **Method:** [ad-review/SKILL.md, "quality gate"](../core/skills/ad-review/SKILL.md#quality-gate)
- **Check:** Were the numbers checked twice, and does the review answer the question that was asked, including saying plainly when it cannot be answered yet?
- **Evidence:** A second pass that looks for errors in the first: totals re-added and each cost per result recomputed.
- **If it fails:** Say whether an input, the arithmetic or an inference was wrong, fix that layer, and re-read everything that rested on it.

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

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: At the end of ads/results/<date>-review.md, under ## Layer record.

```markdown
## Layer record
Work order: results-review
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

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`.

In a reply with no file, put the record on its own line, starting with `Layers (results-review):`, every layer in order with a few words of evidence in brackets:

```
Layers (results-review): snapshot pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
