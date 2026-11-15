<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: A batch of planned ads, made and checked together (`ad-batch`)

**When the ask is:** "write the ads for this batch", "make the batch", "make the ads from the plan", "create the ads in the plan", "produce this batch of ads", "make three ads", "make ads for the sale", "create new ads for this offer", "a set of ads", "several ads for the campaign", "a couple of new ads", "a few new ads for the promotion"

**Owner:** `ad-creative` (Batch)
**Part of:** [`ad-program`](ad-program.md)
**Contains:** [`ad-concepts`](ad-concepts.md), [`ad-copy`](ad-copy.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md), [`ad-remix`](ad-remix.md)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-creative/SKILL.md](../core/skills/ad-creative/SKILL.md)
2. [core/skills/ad-creative/references/creative-passes.md](../core/skills/ad-creative/references/creative-passes.md)
3. [core/_system/schemas/creative.md](../core/_system/schemas/creative.md)
4. [core/_system/schemas/ledger-row.md](../core/_system/schemas/ledger-row.md)

## Needs

- Required: ledger rows marked planned
- Helps, never blocks: the test plan and diagnosis; research files; learnings

## Layers

1. **Read each row as a brief** (`briefs`): For each planned row: its one job, plays, customer type, awareness, format, style, and the proof rows it may lean on.
2. **Make each ad through its own work order** (`ads`): Each ad built layer by layer under its own work order, with its own layer record. Runs [`ad-concepts`](ad-concepts.md), [`ad-copy`](ad-copy.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md), [`ad-remix`](ad-remix.md) (one per row, chosen by the row's format and the scope asked for).
3. **Batch distinctness** (`distinctness`): All the batch's hooks, first frames, casts, settings and styles laid side by side against the rows' reasons.
4. **Ad against destination** (`destination`): Each ad's destination verdict collected in one table, with any mismatch across ads that point at the same page.
5. **Move the rows** (`rows`): Each row's status and date updated, nothing else.
6. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id ad-batch --layer briefs --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A claim, price, offer term or proof row changes | `ads`, `destination`, `rows`, work order [`launch`](launch.md) | Only the ads that carry the changed claim. Any approval that covered the old version no longer covers it. |
| A row is added, cut or changed by ad-strategy | `briefs`, `ads`, `distinctness` | Unchanged rows keep their records. |
| The landing page changes | `destination` | Each ad that points at it. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| batch concept-ready | **`briefs`**, **`ads`**, **`distinctness`**, **`whole`** | Concepts only; nothing generated, no ledger row promoted. |
| batch copy-ready | **`briefs`**, **`ads`**, **`distinctness`**, **`rows`**, **`whole`** | Every ready row has gated copy; assets are not made or not inspected. Destination gaps are named. |
| batch creative-ready | `briefs`, **`ads`**, `distinctness`, `rows`, **`whole`** | Every ready row has every authorised shape made and inspected. Not approved, not live, untested. Destination gaps are named and closed before launch. |
| batch partly ready | **`briefs`**, **`ads`** | Some rows are ready and some are withheld; the review names each and why. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In ads/creative/<batch>/batch-review.md, under ## Layer record.

```markdown
## Layer record
Work order: ad-batch
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 briefs |  |  |  |
| 2 ads |  |  |  |
| 3 distinctness |  |  |  |
| 4 destination |  |  |  |
| 5 rows |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (ad-batch):`, every layer in order with a few words of evidence in brackets:

```
Layers (ad-batch): briefs pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
