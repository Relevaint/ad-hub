<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Rollback to the last known good (`rollback`)

**When the ask is:** "roll back the last change", "undo the last change", "revert the ads to how they were", "put it back", "go back to how the account was", "put the account back the way it was", "revert the account to last week"

**Owner:** `ad-manage` (Rollback)
**Live account:** changes under the level; logged as a change that names the one it undoes

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-manage/SKILL.md](../core/skills/ad-manage/SKILL.md)
2. [core/skills/ad-manage/references/watch-and-sessions.md](../core/skills/ad-manage/references/watch-and-sessions.md)
3. [core/_system/spend-authority.md](../core/_system/spend-authority.md)
4. [core/_system/schemas/change-entry.md](../core/_system/schemas/change-entry.md)

Also, when it applies:

- the business runs on Meta, before any account read or change: [meta-system/SKILL.md](../meta-system/SKILL.md)

## Needs

- Required: ads/changes/ with the entry to undo; ads/authority.md

## Layers

### 1. Find the last known good (`last-good`)

- **Build:** The entry to undo, its undo steps, and the last known good state it leads back to.
- **Method:** [ad-manage/SKILL.md, "rollback"](../core/skills/ad-manage/SKILL.md#rollback); [ad-manage/references/watch-and-sessions.md, "rollback"](../core/skills/ad-manage/references/watch-and-sessions.md#rollback)
- **Check:** Is the entry to undo identified, with its recorded undo and the last known good it restores?
- **Evidence:** The change entry and the closing entry that records the last known good.
- **If it fails:** No recorded undo: say so, and write the revert as a new change for approval rather than guessing.

### 2. Revert (`revert`)

- **Build:** The revert carried out and confirmed.
- **Method:** [_system/spend-authority.md, "rollback"](../core/_system/spend-authority.md#rollback)
- **Check:** Did the platform confirm the revert, under the level or an approval?
- **Evidence:** The platform's confirmation.
- **If it fails:** Not confirmed, no tool or no approval: the revert is prepared, not carried out.

### 3. Log the revert (`log`)

- **Build:** A new change entry that names the one it reverses.
- **Method:** [ad-manage/references/watch-and-sessions.md, "rollback"](../core/skills/ad-manage/references/watch-and-sessions.md#rollback)
- **Check:** Is the revert logged as its own entry naming the entry it reverses, with ledger rows matching the account?
- **Evidence:** The new entry's Reverses line; the ledger.
- **If it fails:** Write the entry; an old entry is never edited.

### Whole output (`whole`)

- **Check:** Is the account back at the last known good, and was no new fix slipped in with the revert?
- **Evidence:** The account state against the last-known-good record.
- **If it fails:** Remove the extra change; a new fix waits for a session.

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| reverted | `last-good`, **`revert`**, `log`, `whole` | The platform confirmed the account is back at the last known good. |
| revert prepared, not carried out | **`last-good`** | The steps are written; an approval or a tool is missing. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the revert's change entry, under ## Layer record.

```markdown
## Layer record
Work order: rollback
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 last-good |  |  |  |
| 2 revert |  |  |  |
| 3 log |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (rollback):`, every layer in order with a few words of evidence in brackets:

```
Layers (rollback): last-good pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
