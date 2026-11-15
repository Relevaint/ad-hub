<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Putting approved ads live (`launch`)

**When the ask is:** "launch the batch", "put them live", "launch the ads", "launch the two new ads", "go live with these ads", "activate the approved ads"

**Owner:** `ad-launch`
**Part of:** [`ad-program`](ad-program.md)
**Live account:** creates paused and activates, only under ads/authority.md and a recorded approval

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-launch/SKILL.md](../core/skills/ad-launch/SKILL.md)
2. [core/skills/ad-launch/references/launch-sequence.md](../core/skills/ad-launch/references/launch-sequence.md)
3. [core/_system/spend-authority.md](../core/_system/spend-authority.md)
4. [core/_system/schemas/change-entry.md](../core/_system/schemas/change-entry.md)
5. [core/_system/schemas/authority.md](../core/_system/schemas/authority.md)

Also, when it applies:

- the business runs on Meta, before writing the change list: [meta-system/SKILL.md](../meta-system/SKILL.md)
- the business runs on Meta, for the call and its status on each step of the change list: [meta-system/references/action-map.md](../meta-system/references/action-map.md)

## Needs

- Required: ads/authority.md naming the offer; creative-ready rows; the platform file with the result test
- Helps, never blocks: a connected ads tool

## Layers

1. **Check the eight gates** (`gates`): Each of the eight gates named clear or open: authority, level, approval, measurable result, finished ads, category, spend, the ID thread.
2. **Build the change list** (`change-list`): Every object to create or change, in order, with settings in plain words and before and after values.
3. **Validate as a dry run** (`dry-run`): The list validated where the tool allows, written as a dry-run entry marked nothing sent, and shown.
4. **Create, paused** (`create-paused`): Each object created paused through the business's connected tools, with the identifiers the platform returns.
5. **Preview** (`preview`): Each ad's preview per placement, shown to the operator.
6. **Record the approval** (`approval`): The approval line in the approvals log, in the approver's words.
7. **Read the gates again before activating** (`all-clear`): The eight gates read again once the approval is recorded, just before anything is turned on.
8. **Activate** (`activate`): Exactly what the approval covers, activated.
9. **Log every change** (`log`): One change entry per change with before, after, authority, result and undo; the last known good. On a dry run that changed nothing on the account this is n/a: the dry-run entry belongs to the dry-run layer.
10. **Move the ledger rows** (`rows`): Rows moved to approved when the line is written and to live when the platform confirms. On a dry run that changed nothing this is n/a: the rows stay where they are, and the account was not read.
11. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id launch --layer gates --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| An ad's copy, claim or asset changes after approval | `gates`, `preview`, `approval`, `all-clear` | The approval covered the old version. |
| The level, a ceiling or who can approve changes | `gates`, `approval`, `all-clear` | Read authority.md again. |
| The result signal changes or goes silent | `gates`, work order [`tracking-setup`](tracking-setup.md) | Gate 4 is open until the real result is seen again. |
| The calendar adds a capacity hold | `gates` | Gate 7. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| dry run only | **`gates`**, **`change-list`**, **`dry-run`** | Nothing was sent: a gate is open (the gates row lists which) or no tool is connected. The list is prepared, not carried out. |
| created paused | **`gates`**, **`change-list`**, `dry-run`, **`create-paused`**, `preview`, **`log`** | Objects exist on the account, paused. Nothing spends. Activation waits for a recorded approval. |
| live | **`gates`**, `change-list`, `dry-run`, `create-paused`, `preview`, **`approval`**, **`all-clear`**, **`activate`**, **`log`**, **`rows`**, **`whole`** | The platform confirmed activation of exactly what was approved. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the last change entry the session writes (the dry run when it stops there, otherwise the activation entry), under ## Layer record. The gates table goes in the reply.

```markdown
## Layer record
Work order: launch
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 gates |  |  |  |
| 2 change-list |  |  |  |
| 3 dry-run |  |  |  |
| 4 create-paused |  |  |  |
| 5 preview |  |  |  |
| 6 approval |  |  |  |
| 7 all-clear |  |  |  |
| 8 activate |  |  |  |
| 9 log |  |  |  |
| 10 rows |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (launch):`, every layer in order with a few words of evidence in brackets:

```
Layers (launch): gates pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
