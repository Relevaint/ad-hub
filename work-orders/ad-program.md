<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Ads for a business or an offer, end to end (`ad-program`)

**When the ask is:** "help me get more customers with ads", "help me get bookings with ads", "get more leads with ads", "set up ads for this business", "run ads for us", "where do we start with ads", "I want more bookings, leads or sales", "start advertising this offer", "take us from nothing to live ads", "I need ads for my new offer", "run ads for my business", "bring in customers through advertising", "start advertising", "ads for my new product", "I want to start running ads"

**Not this:** A request that names one job (write three ads, check our tracking, how are the ads doing) goes straight to that job's work order.

**Owner:** `start-here` (Route)
**Contains:** [`readiness`](readiness.md), [`audience-report`](audience-report.md), [`competitor-report`](competitor-report.md), [`test-plan`](test-plan.md), [`ad-batch`](ad-batch.md), [`tracking-setup`](tracking-setup.md), [`launch`](launch.md), [`daily-watch`](daily-watch.md), [`management-session`](management-session.md), [`results-review`](results-review.md)
**Live account:** only through launch and management, under recorded authority

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/start-here/SKILL.md](../core/skills/start-here/SKILL.md)
2. [core/_system/spend-authority.md](../core/_system/spend-authority.md)

## Needs

- Required: a sentence about the business and a goal
- Helps, never blocks: the business repo's own files; an existing ads/ folder

## Layers

1. **Readiness** (`readiness`): The offer, its result loop, the supplied facts with a status on each, and the gaps split by what they block. Runs [`readiness`](readiness.md).
2. **Research the plan needs** (`research`): Buyer language from sources actually read, and what others run, when the plan would otherwise rest on the business's own description. Runs [`audience-report`](audience-report.md), [`competitor-report`](competitor-report.md) (as the decision needs it; skipping it is n/a with the reason).
3. **Plan the batch** (`plan`): The diagnosis, the batch with IDs, tags and reasons, and the test design from this offer's numbers. Runs [`test-plan`](test-plan.md).
4. **Make the batch** (`creative`): Each planned ad through its own work order, then the batch checks. Runs [`ad-batch`](ad-batch.md).
5. **Make the result measurable** (`measurement`): The signal, the verified path and a test of the real result seen arriving. Runs [`tracking-setup`](tracking-setup.md).
6. **Launch** (`launch`): Gates checked, objects created paused, previews shown, approval recorded, then activation. Runs [`launch`](launch.md).
7. **Watch and manage** (`run`): A daily watch that acts only on emergencies, and scheduled sessions under the rulebook. Runs [`daily-watch`](daily-watch.md), [`management-session`](management-session.md).
8. **Review and learn** (`learn`): Results by ad ID from both sources, judged on the deciding metric, with hand-backs. Runs [`results-review`](results-review.md).
9. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id ad-program --layer readiness --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| The offer, price, proof or service area changes | `plan`, `creative`, `measurement` | Test-plan numbers, every claims map, the signal, and any approval that covered the old version. |
| Research adds or renames a customer type | `plan`, `creative` | Only the rows that address that type. |
| The result signal changes or goes silent | `measurement`, `launch`, `run` | Spend with a silent signal is an emergency for the daily watch. |
| A learning is written | `plan` | It outranks any play for the next batch. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| routed | **`readiness`** | The first move is made and the work orders that follow are named in order. |
| ready to launch | **`readiness`**, **`plan`**, **`creative`**, **`measurement`** | Ads are creative-ready and the real result has been seen arriving; the gates that are the business's to clear are named. |
| live | **`readiness`**, **`plan`**, **`creative`**, **`measurement`**, **`launch`**, **`whole`** | The platform confirmed activation of what the business approved. |
| reviewed | **`launch`**, **`learn`**, **`whole`** | A review of a judged window exists and its hand-backs are with their skills. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the reply, as one line. Each work order it runs keeps its own record.

```markdown
## Layer record
Work order: ad-program
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 readiness |  |  |  |
| 2 research |  |  |  |
| 3 plan |  |  |  |
| 4 creative |  |  |  |
| 5 measurement |  |  |  |
| 6 launch |  |  |  |
| 7 run |  |  |  |
| 8 learn |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (ad-program):`, every layer in order with a few words of evidence in brackets:

```
Layers (ad-program): readiness pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
