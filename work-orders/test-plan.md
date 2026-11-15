<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: What to make and test next (`test-plan`)

**When the ask is:** "plan the first test batch", "plan the next batch", "what should we test next", "plan our ads for the next month", "test plan", "what should we make next", "ad strategy for this offer"

**Owner:** `ad-strategy` (Plan)
**Part of:** [`ad-program`](ad-program.md)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-strategy/SKILL.md](../core/skills/ad-strategy/SKILL.md)
2. [core/skills/ad-strategy/references/test-design.md](../core/skills/ad-strategy/references/test-design.md)
3. [core/skills/ad-strategy/references/plays.md](../core/skills/ad-strategy/references/plays.md)
4. [core/_system/schemas/diagnosis.md](../core/_system/schemas/diagnosis.md)
5. [core/_system/schemas/test-plan.md](../core/_system/schemas/test-plan.md)
6. [core/_system/schemas/ledger-row.md](../core/_system/schemas/ledger-row.md)

## Needs

- Required: the offer file, or the offer in a sentence
- Helps, never blocks: research files; the ledger and latest snapshot; authority ceilings; learnings

## Layers

1. **Diagnose** (`diagnosis`): One or two sentences: why these ads, for whom, and what is wrong or missing right now.
2. **Check the offer first** (`offer-check`): A read of the offer before any creative: the ask against the value, the proof an ad can lean on, true urgency.
3. **Run the gap checks** (`gaps`): A gap table across customer type, awareness, format, style, breadth and origin; three or four message pillars.
4. **Choose the plays** (`plays`): The plays to test, each with its one-sentence reason, inside the risk budget.
5. **Build the batch** (`batch`): One ledger row per ad, created as planned: ID, tags, and one sentence saying what it tests that the others do not; one testing focus for the batch.
6. **Design the test from this offer's numbers** (`test-design`): The bar, the time to a confident answer, cadence, batch size, spend inside the ceilings, and the rulebook ad-manage will apply.
7. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id test-plan --layer diagnosis --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| The offer's price, numbers, ask or proof change | `offer-check`, `batch`, `test-design`, work order [`ad-batch`](ad-batch.md) | Break-even and every row that leaned on the old proof. |
| Audience research adds or renames a customer type | `gaps`, `batch` | A type name already carried by a live ad is not renamed. |
| A learning is written for this offer | `plays`, `batch` | A learning outranks a play. |
| Ceilings, the risk budget or the testing share change | `plays`, `test-design` | The plan's spend must still fit. |
| The calendar adds a capacity hold or a season ends | `test-design` | Business before algorithm. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| plan ready | **`diagnosis`**, **`offer-check`**, **`gaps`**, `plays`, **`batch`**, **`test-design`**, **`whole`** | Rows are planned with IDs and reasons; what still blocks launch is named in the plan. |
| batch held | **`diagnosis`**, **`offer-check`**, **`test-design`** | No new ads now, for capacity, volume or an offer change; the reason and the next date are in the plan. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: At the end of the dated section in ads/strategy/test-plan.md, under ## Layer record.

```markdown
## Layer record
Work order: test-plan
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 diagnosis |  |  |  |
| 2 offer-check |  |  |  |
| 3 gaps |  |  |  |
| 4 plays |  |  |  |
| 5 batch |  |  |  |
| 6 test-design |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (test-plan):`, every layer in order with a few words of evidence in brackets:

```
Layers (test-plan): diagnosis pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
