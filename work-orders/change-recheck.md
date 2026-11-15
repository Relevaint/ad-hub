<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Something changed: check again what rested on it (`change-recheck`)

**When the ask is:** "the price changed, update the ads", "we changed the offer", "the landing page changed", "that claim is no longer true", "the proof changed", "update everything for the new price", "the guarantee changed", "we no longer offer that"

**Not this:** A new ad or a new batch. This is for a fact, a page or a brief that changed after work had already passed.

**Owner:** `start-here` (Record, then Route)
**Contains:** [`ad-copy`](ad-copy.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md), [`ad-remix`](ad-remix.md), [`test-plan`](test-plan.md), [`tracking-setup`](tracking-setup.md), [`launch`](launch.md)
**Live account:** not reached from here; a live ad that now carries a false claim is reported at once and paused through ad-manage under authority

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/start-here/SKILL.md](../core/skills/start-here/SKILL.md)
2. [core/_system/staged-work.md](../core/_system/staged-work.md)
3. [core/_system/memory-contract.md](../core/_system/memory-contract.md)

Also, when it applies:

- the changed fact belongs in an offer file: [core/_system/schemas/offer.md](../core/_system/schemas/offer.md)
- an approved or live ad is affected: [core/_system/spend-authority.md](../core/_system/spend-authority.md)

## Needs

- Required: what changed, in the business's words, and from when
- Helps, never blocks: the ads/ folder

## Layers

### 1. Record the change where the fact lives (`record`)

- **Build:** The changed fact in the file that owns it, with its status, source and date; the old value kept with its date.
- **Method:** [start-here/SKILL.md, "3 record what was supplied"](../core/skills/start-here/SKILL.md#3-record-what-was-supplied)
- **Check:** Is the new fact recorded by its owner with a status, a source and the date it takes effect, with the old value kept rather than overwritten?
- **Evidence:** The owning file read back: the offer file for an offer fact, the business's own file for a page or a compliance string.
- **If it fails:** A change the business has not confirmed is recorded as Proposed and asked about once. Nothing downstream is rewritten on a guess.

### 2. List what rested on the old version (`dependents`)

- **Build:** Every file, field, asset, number and approval in ads/ that used the old fact, each with the work order that owns it.
- **Method:** [_system/staged-work.md, "when something changes"](../core/_system/staged-work.md#when-something-changes)
- **Check:** Was ads/ searched for the old value and its wording, and does each hit name its owner and the layers its work order says to check again?
- **Evidence:** The search of ads/ for the old value; each hit against its work order's change table.
- **If it fails:** Search again with the other ways the fact was written (a price in words, a rounded number, a paraphrase).

### 3. Check each dependent again (`recheck`)

- **Build:** Each dependent taken back through the layers its own work order names, with its layer record updated.
- **Run:** [`ad-copy`](ad-copy.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md), [`ad-remix`](ad-remix.md), [`test-plan`](test-plan.md), [`tracking-setup`](tracking-setup.md), [`launch`](launch.md) (only the ones on the list, and only the layers their change tables name)
- **Check:** Does every dependent have an updated layer record, with unaffected work left untouched?
- **Evidence:** Each dependent's layer record, dated after the change.
- **If it fails:** A dependent that cannot be checked here is listed as not checked with its owner.

### 4. Set the states the new records support (`states`)

- **Build:** Ledger statuses and approvals brought in line: a changed ad drops to the state its new record supports, and an approval that covered the old version is named as no longer covering it.
- **Method:** [ad-creative/SKILL.md, "7 move the row"](../core/skills/ad-creative/SKILL.md#7-move-the-row)
- **Check:** Is every changed ad at the state its new record supports, and is every approval that covered an old version named as needing a fresh one?
- **Evidence:** The ledger beside the updated records; the approvals log.
- **If it fails:** Each status is moved by the skill that owns that transition. A live ad carrying a claim that is now false is reported to the operator at once with a prepared pause list.

### Whole output (`whole`)

- **Check:** Is there nothing left in ads/ that states the old fact as current, and was nothing regenerated that the change did not touch?
- **Evidence:** A second search of ads/ for the old value; the list of files changed.
- **If it fails:** Return to the dependents layer for what the search still finds.

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| recheck list prepared | `record`, `dependents` | The change is recorded and everything that rested on it is listed with its owner. The rechecks themselves are still to do. |
| rechecked | `record`, `dependents`, `recheck`, `states`, `whole` | Every dependent was checked again and carries the state its new record supports. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

## Layer record

Where it goes: In the reply, as one line, with the list of dependents. Each dependent keeps its own updated record.

```markdown
## Layer record
Work order: change-recheck
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 record |  |  |  |
| 2 dependents |  |  |  |
| 3 recheck |  |  |  |
| 4 states |  |  |  |
| whole |  |  |  |
State:
```

Verdicts: `pass` (name the evidence), `fail` (name the fix or where it went back), `n/a` (say why), `not checked` (say why and who can). In a reply with no file, one line: `Layers (change-recheck): record pass · dependents pass · recheck pass · states pass · whole pass. State: ...`

Check a saved record: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`
