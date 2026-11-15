<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Something changed: check again what rested on it (`change-recheck`)

**When the ask is:** "the price changed, update the ads", "we changed the offer", "the landing page changed", "that claim is no longer true", "the proof changed", "update everything for the new price", "the guarantee changed", "we no longer offer that"

**Not this:** A new ad or a new batch. This is for a fact, a page or a brief that changed after work had already passed.

**Owner:** `start-here` (Record, then Route)
**Contains:** [`ad-copy`](ad-copy.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md), [`ad-remix`](ad-remix.md), [`test-plan`](test-plan.md), [`tracking-setup`](tracking-setup.md), [`launch`](launch.md)
**Live account:** not reached from here; a live ad that carries the old claim is reported first with a prepared pause list, and paused only on the go-ahead of someone who can approve

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/start-here/SKILL.md](../core/skills/start-here/SKILL.md)
2. [core/_system/staged-work.md](../core/_system/staged-work.md)
3. [core/_system/memory-contract.md](../core/_system/memory-contract.md)
4. [core/_system/schemas/ledger-row.md](../core/_system/schemas/ledger-row.md)

Also, when it applies:

- the changed fact belongs in an offer file: [core/_system/schemas/offer.md](../core/_system/schemas/offer.md)
- an approved or live ad is affected: [core/_system/spend-authority.md](../core/_system/spend-authority.md)

## Needs

- Required: what changed, in the business's words, and from when
- Helps, never blocks: the ads/ folder

## Layers

### 1. Record the change where the fact lives (`record`)

- **Build:** The changed fact in the ads/ file that owns it, with its status, source and date, and the old value kept with its date. A fact that lives in the business's own files outside ads/ (its README, its site copy, its compliance file) is listed as the business's to change.
- **Method:** [start-here/SKILL.md, "3 record what was supplied"](../core/skills/start-here/SKILL.md#3-record-what-was-supplied)
- **Check:** Is the new fact recorded in its ads/ file with a status, a source and the date it takes effect, with the old value kept rather than overwritten and nothing edited outside ads/?
- **Evidence:** The offer file read back; the list of files outside ads/ that still state the old fact.
- **If it fails:** A change the business has not confirmed is recorded as Proposed and asked about once. Nothing downstream is rewritten on a guess. An edit made outside ads/ is undone and listed for the business.

### 2. List what rested on the old version (`dependents`)

- **Build:** Every file, field, asset, number and approval in ads/ that used the old fact, each with the work order that owns it. The list goes in the reply, one line per hit: the file or ad ID, its owner work order, the layers to check again, and what was done.
- **Method:** [_system/staged-work.md, "when something changes"](../core/_system/staged-work.md#when-something-changes)
- **Check:** Was ads/ searched for the old value and its wording, and does each hit name its owner and the layers its work order says to check again?
- **Evidence:** The search of ads/ for the old value; each hit against its work order's change table.
- **If it fails:** Search again with the other ways the fact was written (a price in words, a rounded number, a paraphrase).

### 3. Check each dependent again (`recheck`)

- **Build:** Each dependent corrected by its owner under its own work order. An ad that has not been approved or run is corrected in place and its layer record updated. An ad that has been approved or has run is never edited: the change is a revision from ad-strategy. Layers the change did not touch are carried; for work made before layer records, from the ad's dated status on file.
- **Run:** [`ad-copy`](ad-copy.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md), [`ad-remix`](ad-remix.md), [`test-plan`](test-plan.md), [`tracking-setup`](tracking-setup.md), [`launch`](launch.md) (only the ones on the list, and only the layers their change tables name)
- **Method:** [_system/staged-work.md, "when something changes"](../core/_system/staged-work.md#when-something-changes); [_system/schemas/ledger-row.md, "ad id"](../core/_system/schemas/ledger-row.md#ad-id)
- **Check:** Has every dependent on the list been checked again through the layers its change table names, with untouched layers carried and nothing else redone?
- **Evidence:** The list of dependents with a verdict beside each; each dependent's layer record, dated after the change.
- **If it fails:** If any dependent could not be checked here, this layer is partial when some were and not checked when none were: name each one and who can check it. The state is then partly rechecked.

### 4. Set the states the new records support (`states`)

- **Build:** Ledger statuses and approvals brought in line: a changed ad drops to the state its new record supports, and an approval that covered the old version is named as no longer covering it.
- **Method:** [ad-creative/SKILL.md, "7 move the row"](../core/skills/ad-creative/SKILL.md#7-move-the-row)
- **Check:** Is every changed ad at the state its new record supports, and is every approval that covered an old version named as needing a fresh one?
- **Evidence:** The ledger beside the updated records; the approvals log.
- **If it fails:** Each status is moved by the skill that owns that transition. A live ad that carries a claim the business says is no longer true goes at the top of the reply with a prepared pause list. Pausing it needs the go-ahead of someone who can approve: the emergency stop covers only the conditions on its own list, and a restricted category always needs a fresh approval.

### Whole output (`whole`)

- **Check:** Is there nothing left in ads/ that states the old fact as current, and was nothing regenerated that the change did not touch?
- **Evidence:** A second search of ads/ for the old value; the list of files changed.
- **If it fails:** Return to the dependents layer for what the search still finds.

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| recheck list prepared | **`record`**, **`dependents`** | The change is recorded and everything that rested on it is listed with its owner. The rechecks themselves are still to do. |
| partly rechecked | **`record`**, **`dependents`** | At least one dependent was corrected and its own record is dated after the change; the rest are listed as not checked with who can check them. With none corrected, the state is recheck list prepared. |
| rechecked | **`record`**, `dependents`, **`recheck`**, `states`, `whole` | Every dependent was checked again and carries the state its new record supports. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the reply, as one line, followed by the list of dependents, one line per hit: `<file or ad ID> · <owner work order> · <layers checked again> · <verdict>`. Each dependent keeps its own updated record.

```markdown
## Layer record
Work order: change-recheck
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 record |  |  |  |
| 2 dependents |  |  |  |
| 3 recheck |  |  |  |
| 4 states |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

In a reply with no file, put the record on its own line, starting with `Layers (change-recheck):`, every layer in order with a few words of evidence in brackets:

```
Layers (change-recheck): record pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
