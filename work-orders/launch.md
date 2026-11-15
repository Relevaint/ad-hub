<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Putting approved ads live (`launch`)

**When the ask is:** "launch the batch", "put them live", "launch the ads", "launch the two new ads", "go live with these ads", "activate the approved ads"

**Owner:** `ad-launch`
**Part of:** [`ad-program`](ad-program.md)
**Live account:** creates paused and activates, only under ads/authority.md and a recorded approval

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-launch/SKILL.md](../core/skills/ad-launch/SKILL.md)
2. [core/skills/ad-launch/references/launch-sequence.md](../core/skills/ad-launch/references/launch-sequence.md)
3. [core/_system/spend-authority.md](../core/_system/spend-authority.md)
4. [core/_system/schemas/change-entry.md](../core/_system/schemas/change-entry.md)
5. [core/_system/schemas/authority.md](../core/_system/schemas/authority.md)

Also, when it applies:

- the business runs on Meta, before writing the change list: [meta-system/SKILL.md](../meta-system/SKILL.md)

## Needs

- Required: ads/authority.md naming the offer; creative-ready rows; the platform file with the result test
- Helps, never blocks: a connected ads tool

## Layers

### 1. Check the eight gates (`gates`)

- **Build:** Each gate named with its state: authority, level, approval, measurable result, finished ads, category, spend, the ID thread.
- **Method:** [ad-launch/SKILL.md, "the gates"](../core/skills/ad-launch/SKILL.md#the-gates); [ad-launch/references/launch-sequence.md, "checking each gate"](../core/skills/ad-launch/references/launch-sequence.md#checking-each-gate)
- **Check:** Is each of the eight gates named with its state, read from the files, with any open gate stopping activation?
- **Evidence:** For each gate, the line that settles it: authority.md, the offer file, the platform file's result test, the creative files' verdicts, the ledger, the calendar.
- **If it fails:** Stop at the dry run. Say what clears the gate and who. Never activate past it.

### 2. Build the change list (`change-list`)

- **Build:** Every object to create or change, in order, with settings in plain words and before and after values.
- **Method:** [ad-launch/SKILL.md, "1 build the change list"](../core/skills/ad-launch/SKILL.md#1-build-the-change-list)
- **Check:** Is every object listed in order, created paused, named by ID with the ID on its link, with the plan's safe-to-bold mix kept?
- **Evidence:** The list against the platform file's change list and the test plan's batch.
- **If it fails:** Correct the list before anything is validated.

### 3. Validate as a dry run (`dry-run`)

- **Build:** The list validated where the tool allows, written as a dry-run entry marked nothing sent, and shown.
- **Method:** [ad-launch/SKILL.md, "2 validate as a dry run"](../core/skills/ad-launch/SKILL.md#2-validate-as-a-dry-run); [ad-launch/references/launch-sequence.md, "the dry run"](../core/skills/ad-launch/references/launch-sequence.md#the-dry-run)
- **Check:** Was the list validated where a tool can, written as a dry-run entry saying nothing was sent, and shown before anything was created?
- **Evidence:** The dry-run file in ads/changes/; the validate-only result, or the statement that no tool is connected.
- **If it fails:** Fix what validation rejects. With a gate open or no tool, the dry run is the deliverable.

### 4. Create, paused (`create-paused`)

- **Build:** Each object created paused through the business's connected tools, with the identifiers the platform returns.
- **Method:** [ad-launch/SKILL.md, "3 create paused"](../core/skills/ad-launch/SKILL.md#3-create-paused)
- **Check:** Did the platform confirm each object as created and paused, and are its identifiers recorded?
- **Evidence:** The platform's own response for each object.
- **If it fails:** A creation that failed is logged as failed. Nothing is retried around a rejection. With no tool this layer is not checked and the list stands as prepared.

### 5. Preview (`preview`)

- **Build:** Each ad's preview per placement, shown to the operator.
- **Method:** [ad-launch/SKILL.md, "4 preview"](../core/skills/ad-launch/SKILL.md#4-preview)
- **Check:** Was each ad's preview rendered for each placement and shown, so the approval is of the thing itself?
- **Evidence:** The previews; or the statement that none could be rendered and the operator looked in the platform's own interface.
- **If it fails:** Say no preview could be rendered; the operator looks before approving.

### 6. Record the approval (`approval`)

- **Build:** The approval line in the approvals log, in the approver's words.
- **Method:** [ad-launch/SKILL.md, "5 record the approval then activate"](../core/skills/ad-launch/SKILL.md#5-record-the-approval-then-activate); [ad-launch/references/launch-sequence.md, "what counts as an approval"](../core/skills/ad-launch/references/launch-sequence.md#what-counts-as-an-approval)
- **Check:** Is there a line in the approvals log from someone who can approve, covering exactly these ads, dated, in their words, written before any activation?
- **Evidence:** The approvals log line.
- **If it fails:** No line, a relayed approval the business's rules do not accept, or a restricted category without a fresh approval: nothing is activated.

### 7. Activate (`activate`)

- **Build:** Exactly what the approval covers, activated.
- **Method:** [ad-launch/SKILL.md, "5 record the approval then activate"](../core/skills/ad-launch/SKILL.md#5-record-the-approval-then-activate)
- **Check:** Was exactly what the approval covers activated, and did the platform confirm it?
- **Evidence:** The platform's confirmation for each object.
- **If it fails:** An activation the platform did not confirm is logged as failed, never as live.

### 8. Log every change (`log`)

- **Build:** One change entry per change with before, after, authority, result and undo; the last known good.
- **Method:** [ad-launch/SKILL.md, "6 log every change"](../core/skills/ad-launch/SKILL.md#6-log-every-change); [ad-launch/references/launch-sequence.md, "last known good"](../core/skills/ad-launch/references/launch-sequence.md#last-known-good)
- **Check:** Does every change have an entry with its undo, and does the activating entry record the last known good?
- **Evidence:** The entries in ads/changes/.
- **If it fails:** Write the missing entry now, marked as written after the fact.

### 9. Move the ledger rows (`rows`)

- **Build:** Rows moved to approved when the line is written and to live when the platform confirms.
- **Method:** [ad-launch/SKILL.md, "7 move the ledger rows"](../core/skills/ad-launch/SKILL.md#7-move-the-ledger-rows)
- **Check:** Do the ledger statuses match what is true on the account?
- **Evidence:** The ledger beside the platform's confirmations.
- **If it fails:** Set each row to what the platform confirms.

### Whole output (`whole`)

- **Method:** [ad-launch/SKILL.md, "quality gate"](../core/skills/ad-launch/SKILL.md#quality-gate)
- **Check:** Does the reply say what was done, what was not and why, with spend inside the ceilings and nothing recorded that the platform did not confirm?
- **Evidence:** The reply against the change entries and the ceilings in authority.md.
- **If it fails:** Correct the reply and any entry that overstates what happened.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| An ad's copy, claim or asset changes after approval | `gates`, `preview`, `approval` | The approval covered the old version. |
| The level, a ceiling or who can approve changes | `gates`, `approval` | Read authority.md again. |
| The result signal changes or goes silent | `gates`, work order [`tracking-setup`](tracking-setup.md) | Gate 4 is open until the real result is seen again. |
| The calendar adds a capacity hold | `gates` | Gate 7. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| dry run only | `gates`, `change-list`, `dry-run` | Nothing was sent: a gate is open or no tool is connected. The list is prepared, not carried out. |
| created paused | `gates`, `change-list`, `dry-run`, `create-paused`, `preview`, `log` | Objects exist on the account, paused. Nothing spends. Activation waits for a recorded approval. |
| live | `gates`, `change-list`, `dry-run`, `create-paused`, `preview`, `approval`, `activate`, `log`, `rows`, `whole` | The platform confirmed activation of exactly what was approved. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

## Layer record

Where it goes: In the last change entry the session writes (the dry run when it stops there, otherwise the activation entry), under ## Layer record. The gates table goes in the reply.

```markdown
## Layer record
Work order: launch
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 gates |  |  |  |
| 2 change-list |  |  |  |
| 3 dry-run |  |  |  |
| 4 create-paused |  |  |  |
| 5 preview |  |  |  |
| 6 approval |  |  |  |
| 7 activate |  |  |  |
| 8 log |  |  |  |
| 9 rows |  |  |  |
| whole |  |  |  |
State:
```

Verdicts: `pass` (name the evidence), `fail` (name the fix or where it went back), `n/a` (say why), `not checked` (say why and who can). In a reply with no file, one line: `Layers (launch): gates pass · change-list pass · dry-run pass · create-paused pass · preview pass · approval pass · activate pass · log pass · rows pass · whole pass. State: ...`

Check a saved record: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`
