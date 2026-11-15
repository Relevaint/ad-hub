<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Weekly creative report (`weekly-creative-report`)

**When the ask is:** "weekly creative report", "weekly ads report", "where did the money go this week", "what moved this week", "hit rate of our ads"

**Owner:** `ad-review` (Weekly creative report)
**Live account:** read-only, under ads/authority.md

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-review/SKILL.md](../core/skills/ad-review/SKILL.md)
2. [core/skills/ad-review/references/reading-results.md](../core/skills/ad-review/references/reading-results.md)
3. [core/_system/schemas/results.md](../core/_system/schemas/results.md)

Also, when it applies:

- the business runs on Meta, before any account read: [meta-system/SKILL.md](../meta-system/SKILL.md)

## Needs

- Required: seven days of numbers by ad ID
- Helps, never blocks: earlier weekly reports for the hit rate over time

## Layers

### 1. Where the money went (`money`)

- **Build:** Spend across ads for the seven days, by ID.
- **Method:** [ad-review/SKILL.md, "7 the weekly creative report"](../core/skills/ad-review/SKILL.md#7-the-weekly-creative-report); [ad-review/references/reading-results.md, "the weekly creative report claude workflows review"](../core/skills/ad-review/references/reading-results.md#the-weekly-creative-report-claude-workflows-review)
- **Check:** Does the spend by ad add up to the account total for the window, from a named source?
- **Evidence:** The snapshot or the platform read, with its date; the sum.
- **If it fails:** Find the missing or doubled row before anything else is read.

### 2. Movers and new hits (`movers`)

- **Build:** What rose or fell over seven days, and any ad that met the bar.
- **Method:** [ad-review/SKILL.md, "7 the weekly creative report"](../core/skills/ad-review/SKILL.md#7-the-weekly-creative-report); [ad-review/references/reading-results.md, "what the sample can say"](../core/skills/ad-review/references/reading-results.md#what-the-sample-can-say)
- **Check:** Is every mover shown with its counts, and is a hit only an ad that met the bar on the deciding metric?
- **Evidence:** The counts beside each mover; the bar from the test plan.
- **If it fails:** Below the bar it is a mover, not a hit.

### 3. Lessons and hit rate (`lessons`)

- **Build:** The specific lessons, and the hit rate by batch over time.
- **Method:** [ad-review/references/reading-results.md, "the weekly creative report claude workflows review"](../core/skills/ad-review/references/reading-results.md#the-weekly-creative-report-claude-workflows-review)
- **Check:** Is each lesson specific to an ad or a tag with its evidence, and is the hit rate launched ads that met the bar over ads launched?
- **Evidence:** The hit-rate table; the ledger's batches.
- **If it fails:** Cut the general remark; recompute the rate.

### Whole output (`whole`)

- **Method:** [ad-review/SKILL.md, "quality gate"](../core/skills/ad-review/SKILL.md#quality-gate)
- **Check:** Was a second pass made that looks for errors in the first, before anything was reported?
- **Evidence:** The second pass: totals re-added, rates recomputed.
- **If it fails:** Fix the figure and everything that used it.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| Figures for the window settle or a result is re-matched | `money`, `movers`, `lessons`, `whole` | Say which week's report was corrected. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| report ready | **`money`**, **`movers`**, `lessons`, **`whole`** | The week is reported with counts; hits are only ads that met the bar. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state.

## Layer record

Where it goes: At the end of ads/results/<date>-weekly.md, under ## Layer record.

```markdown
## Layer record
Work order: weekly-creative-report
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 money |  |  |  |
| 2 movers |  |  |  |
| 3 lessons |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`.

In a reply with no file, put the record on its own line, starting with `Layers (weekly-creative-report):`, every layer in order with a few words of evidence in brackets:

```
Layers (weekly-creative-report): money pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
