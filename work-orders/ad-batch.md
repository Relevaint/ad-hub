<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: A batch of planned ads, made and checked together (`ad-batch`)

**When the ask is:** "write the ads for this batch", "make the batch", "make the planned ads", "create the ads in the plan", "produce this batch of ads"

**Owner:** `ad-creative` (Batch)
**Part of:** [`ad-program`](ad-program.md)
**Contains:** [`ad-concepts`](ad-concepts.md), [`ad-copy`](ad-copy.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md), [`ad-remix`](ad-remix.md)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-creative/SKILL.md](../core/skills/ad-creative/SKILL.md)
2. [core/skills/ad-creative/references/creative-passes.md](../core/skills/ad-creative/references/creative-passes.md)
3. [core/_system/schemas/creative.md](../core/_system/schemas/creative.md)
4. [core/_system/schemas/ledger-row.md](../core/_system/schemas/ledger-row.md)

## Needs

- Required: ledger rows marked planned
- Helps, never blocks: the test plan and diagnosis; research files; learnings

## Layers

### 1. Read each row as a brief (`briefs`)

- **Build:** For each planned row: its one job, plays, customer type, awareness, format, style, and the proof rows it may lean on.
- **Method:** [ad-creative/SKILL.md, "1 take the brief from the row"](../core/skills/ad-creative/SKILL.md#1-take-the-brief-from-the-row)
- **Check:** Is each ad's one job the sentence in its ledger row, with the scope of the request (concepts, copy, or finished assets and which shapes) written down?
- **Evidence:** The ledger rows and the request, read literally.
- **If it fails:** A row with no reason, or two rows with one reason, goes back to ad-strategy. Never invent a row or rename an ID.

### 2. Make each ad through its own work order (`ads`)

- **Build:** Each ad built layer by layer under its own work order, with its own layer record.
- **Run:** [`ad-concepts`](ad-concepts.md), [`ad-copy`](ad-copy.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md), [`ad-remix`](ad-remix.md) (one per row, chosen by the row's format and the scope asked for)
- **Check:** Does every row have its own layer record ending in a state, with failed ads withheld rather than padded in?
- **Evidence:** Each creative file's layer record.
- **If it fails:** Return that ad to the layer that failed in its own work order.

### 3. Batch distinctness (`distinctness`)

- **Build:** All the batch's hooks, first frames, casts, settings and styles laid side by side against the rows' reasons.
- **Method:** [ad-creative/references/creative-passes.md, "pass 6 adversarial concept review then revision"](../core/skills/ad-creative/references/creative-passes.md#pass-6-adversarial-concept-review-then-revision)
- **Check:** Does each ad still test what its row says the others do not, with no accidental sameness in people, settings, styles or hooks?
- **Evidence:** The side-by-side list.
- **If it fails:** Return the duplicate to its own work order at premises or cast and treatment. A deliberately matched pair is named as one.

### 4. Ad against destination (`destination`)

- **Build:** Each ad read beside the page it sends people to.
- **Method:** [ad-creative/references/creative-passes.md, "pass 1 fundamentals before creative"](../core/skills/ad-creative/references/creative-passes.md#pass-1-fundamentals-before-creative)
- **Check:** Does every ad promise what its landing page delivers: the same offer, price, qualifications and next action?
- **Evidence:** Each ad beside its opened destination page, or the page gap named.
- **If it fails:** Fix the ad at its connection layer, or report the page gap to the business. The offer is never changed to match an ad.

### 5. Move the rows (`rows`)

- **Build:** Each row's status and date updated, nothing else.
- **Method:** [ad-creative/SKILL.md, "7 move the row"](../core/skills/ad-creative/SKILL.md#7-move-the-row)
- **Check:** Is each row's status exactly what its file and assets support, with IDs, tags and reasons untouched?
- **Evidence:** The ledger beside each creative file's state.
- **If it fails:** Set the row back to the state the record supports.

### Whole output (`whole`)

- **Method:** [ad-creative/SKILL.md, "quality gate"](../core/skills/ad-creative/SKILL.md#quality-gate)
- **Check:** Could the business approve this batch from what is in the folder, knowing which ads are ready, which are withheld and why?
- **Evidence:** The batch folder read as the approver would read it.
- **If it fails:** Name the missing piece in the batch review; do not present a partly ready batch as ready.

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
| batch concept-ready | `briefs`, `ads`, `distinctness`, `whole` | Concepts only; nothing generated, no ledger row promoted. |
| batch copy-ready | `briefs`, `ads`, `distinctness`, `destination`, `rows`, `whole` | Every ready row has gated copy; assets are not made or not inspected. |
| batch creative-ready | `briefs`, `ads`, `distinctness`, `destination`, `rows`, `whole` | Every ready row has every authorised shape made and inspected. Not approved, not live, untested. |
| batch partly ready | `briefs`, `ads` | Some rows are ready and some are withheld; the review names each and why. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

## Layer record

Where it goes: In ads/creative/<batch>/batch-review.md, under ## Layer record.

```markdown
## Layer record
Work order: ad-batch
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

Verdicts: `pass` (name the evidence), `fail` (name the fix or where it went back), `n/a` (say why), `not checked` (say why and who can). In a reply with no file, one line: `Layers (ad-batch): briefs pass · ads pass · distinctness pass · destination pass · rows pass · whole pass. State: ...`

Check a saved record: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`
