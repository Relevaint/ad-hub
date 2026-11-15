<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Ads for a business or an offer, end to end (`ad-program`)

**When the ask is:** "help me get more customers with ads", "help me get bookings with ads", "get more leads with ads", "set up ads for this business", "run ads for us", "where do we start with ads", "I want more bookings, leads or sales", "start advertising this offer", "take us from nothing to live ads", "I need ads for my new offer", "run ads for my business", "bring in customers through advertising", "start advertising", "ads for my new product", "I want to start running ads"

**Not this:** A request that names one job (write three ads, check our tracking, how are the ads doing) goes straight to that job's work order.

**Owner:** `start-here` (Route)
**Contains:** [`readiness`](readiness.md), [`audience-report`](audience-report.md), [`competitor-report`](competitor-report.md), [`test-plan`](test-plan.md), [`ad-batch`](ad-batch.md), [`tracking-setup`](tracking-setup.md), [`launch`](launch.md), [`daily-watch`](daily-watch.md), [`management-session`](management-session.md), [`results-review`](results-review.md)
**Live account:** only through launch and management, under recorded authority

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/start-here/SKILL.md](../core/skills/start-here/SKILL.md)
2. [core/_system/spend-authority.md](../core/_system/spend-authority.md)

## Needs

- Required: a sentence about the business and a goal
- Helps, never blocks: the business repo's own files; an existing ads/ folder

## Layers

### 1. Readiness (`readiness`)

- **Build:** The offer, its result loop, the supplied facts with a status on each, and the gaps split by what they block.
- **Run:** [`readiness`](readiness.md)
- **Check:** Is there one offer with a real result source, and is every live gap named with who clears it?
- **Evidence:** The offer file and the gap lists.
- **If it fails:** Stay here until the offer and its result loop are settled. Nothing downstream is planned on a guessed offer.

### 2. Research the plan needs (`research`)

- **Build:** Buyer language from sources actually read, and what others run, when the plan would otherwise rest on the business's own description.
- **Run:** [`audience-report`](audience-report.md), [`competitor-report`](competitor-report.md) (as the decision needs it; skipping it is n/a with the reason)
- **Check:** Does the plan have buyer language and alternatives from sources that were read, or is the gap stated as an assumption?
- **Evidence:** The research files with their data labels, or the plan's assumption line.
- **If it fails:** Run the research work order, or carry the gap forward as a labelled assumption. Never fill it from general knowledge.

### 3. Plan the batch (`plan`)

- **Build:** The diagnosis, the batch with IDs, tags and reasons, and the test design from this offer's numbers.
- **Run:** [`test-plan`](test-plan.md)
- **Check:** Does every planned ad have an ID and a reason no other row shares, with the bar and spend taken from the offer and authority files?
- **Evidence:** The ledger rows and the test plan.
- **If it fails:** Back to the test-plan work order at the layer that failed.

### 4. Make the batch (`creative`)

- **Build:** Each planned ad through its own work order, then the batch checks.
- **Run:** [`ad-batch`](ad-batch.md)
- **Check:** Is every row at the state its file and assets support, with the batch checked for sameness and each ad checked against its destination?
- **Evidence:** The batch review and each creative file's layer record.
- **If it fails:** Back to the ad's own work order at the layer that failed.

### 5. Make the result measurable (`measurement`)

- **Build:** The signal, the verified path and a test of the real result seen arriving.
- **Run:** [`tracking-setup`](tracking-setup.md)
- **Check:** Has the real result been seen arriving on the platform on a stated date, or is it recorded as not yet seen with who clears it?
- **Evidence:** The platform file's result-signal section.
- **If it fails:** Nothing goes live. The gap goes to the tracking-setup work order or to the person who can run the test.

### 6. Launch (`launch`)

- **Build:** Gates checked, objects created paused, previews shown, approval recorded, then activation.
- **Run:** [`launch`](launch.md)
- **Check:** Was every gate named, and is anything live covered by an approval line written before it was activated?
- **Evidence:** The gates table, the approvals log and the change entries.
- **If it fails:** Stop at the dry run and say what clears the open gate and who.

### 7. Watch and manage (`run`)

- **Build:** A daily watch that acts only on emergencies, and scheduled sessions under the rulebook.
- **Run:** [`daily-watch`](daily-watch.md), [`management-session`](management-session.md)
- **Check:** Did every change come from an emergency condition or a scheduled session, with an entry and an undo?
- **Evidence:** The change log.
- **If it fails:** Roll back to the last known good, then find the cause with the troubleshooting work order.

### 8. Review and learn (`learn`)

- **Build:** Results by ad ID from both sources, judged on the deciding metric, with hand-backs.
- **Run:** [`results-review`](results-review.md)
- **Check:** Does the review say which reading the sample supports, and was a learning written only at the bar?
- **Evidence:** The review file.
- **If it fails:** Back to the results-review work order; an inconclusive review is a finished answer when it says what would settle it.

### Whole output (`whole`)

- **Check:** Does one promise run from the ad to the page to the result that is measured, does every ad carry its ID from the ledger to its link to the snapshot, and is nothing live that a gate should have held?
- **Evidence:** An ad read beside its destination page; one ID followed through the ledger, the creative file, the platform name and the link; the gates table from launch.
- **If it fails:** Go to the work order that owns the break: a promise mismatch to ad-batch or the offer, an ID gap to test-plan, an open gate to tracking-setup or the business.

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

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the reply, as one line. Each work order it runs keeps its own record.

```markdown
## Layer record
Work order: ad-program
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

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

In a reply with no file, put the record on its own line, starting with `Layers (ad-program):`, every layer in order with a few words of evidence in brackets:

```
Layers (ad-program): readiness pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
