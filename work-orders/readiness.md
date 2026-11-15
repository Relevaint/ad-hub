<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: New business or offer, and what still blocks going live (`readiness`)

**When the ask is:** "what do you still need before we can run ads", "are we ready to launch", "add a new offer", "add a second offer", "record this offer", "what is still missing", "new business intake", "onboard this business for ads"

**Owner:** `start-here` (Record, Readiness or Route)
**Part of:** [`ad-program`](ad-program.md)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/start-here/SKILL.md](../core/skills/start-here/SKILL.md)
2. [core/_system/memory-contract.md](../core/_system/memory-contract.md)

Also, when it applies:

- recording a new offer, or the readiness check finds gaps: [core/skills/start-here/references/intake.md](../core/skills/start-here/references/intake.md)
- writing or extending an offer file: [core/_system/schemas/offer.md](../core/_system/schemas/offer.md)
- the question is about going live or a spend amount is mentioned: [core/_system/spend-authority.md](../core/_system/spend-authority.md)

## Needs

- Required: a sentence about what is sold and a goal
- Helps, never blocks: the business's own files, read by meaning

## Layers

### 1. Find the offer (`offer`)

- **Build:** The one offer this request is about, with its slug.
- **Method:** [start-here/SKILL.md, "1 find the offer"](../core/skills/start-here/SKILL.md#1-find-the-offer)
- **Check:** Is this one thing sold, with one destination and one place its result is recorded, and did you say which offer you took and why?
- **Evidence:** The request and the business files read, by name.
- **If it fails:** Split into one offer file per thing sold. Ask only when the choice changes the work.

### 2. Work out the result loop (`result-loop`)

- **Build:** Funnel type, result source, the result that counts and the deciding metric.
- **Method:** [start-here/SKILL.md, "2 work out the result loop"](../core/skills/start-here/SKILL.md#2-work-out-the-result-loop)
- **Check:** Does the funnel type match how the business actually gets paid, and is the result source either a real system the business named or recorded as the first live gap?
- **Evidence:** The business's own words or file for how a sale completes; the system it named, or the gap line with who clears it.
- **If it fails:** A guessed result source is removed and the gap recorded as the first live gap, with the lightest options offered as Proposed. Do not pick one for them.

### 3. Record what was supplied (`facts`)

- **Build:** The offer file filled from what the business supplied, and nothing else.
- **Method:** [start-here/SKILL.md, "3 record what was supplied"](../core/skills/start-here/SKILL.md#3-record-what-was-supplied)
- **Check:** Does every fact carry a status and a source, with nothing taken from general knowledge of the industry and no compliance string copied?
- **Evidence:** Each line's status and source, read back against where it came from.
- **If it fails:** An unsourced fact goes back to unknown. A statement that contradicts a recorded fact is recorded beside it with both dates and asked about, never silently replaced.

### 4. Split the gaps (`gaps`)

- **Build:** Three short lists: what blocks going live, what blocks confident scaling, what only improves the work.
- **Method:** [start-here/SKILL.md, "4 split the gaps"](../core/skills/start-here/SKILL.md#4-split-the-gaps)
- **Check:** Is every item on the live list a real live gate with who clears it, and is nothing on it already recorded in a file?
- **Evidence:** The offer schema's live and scale markers; the files re-read for facts already on record.
- **If it fails:** Move the item to its right list; remove anything already recorded.

### 5. Make the first move (`first-move`)

- **Build:** A next step the person can act on today, in the same reply as the gaps.
- **Method:** [start-here/SKILL.md, "5 make the first move"](../core/skills/start-here/SKILL.md#5-make-the-first-move)
- **Check:** Can they act on it today without filling in a questionnaire, and does it carry no claim, number or quote the business did not supply?
- **Evidence:** The reply read as the operator: the step, and the questions asked, which are the live gaps only.
- **If it fails:** Cut the questions down to the live gaps; replace an invented detail with a marked blank.

### Whole output (`whole`)

- **Method:** [start-here/SKILL.md, "quality gate"](../core/skills/start-here/SKILL.md#quality-gate)
- **Check:** Could the next skill start from these files without re-asking anything, with nothing about the business outside ads/ or in the hub?
- **Evidence:** The files written, re-read in order; the hub checkout unchanged.
- **If it fails:** Fix the layer that left the hole: an unsourced fact to facts, a wrong bucket to gaps.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A new statement contradicts a recorded fact | `facts`, `gaps`, work order [`test-plan`](test-plan.md), work order [`tracking-setup`](tracking-setup.md) | Record both with their dates and ask. Work that used the old fact (plan numbers, claims maps, the signal, approvals) is flagged for its owner, not rewritten from here. |
| The destination, funnel type or result source changes | `result-loop`, `gaps`, work order [`tracking-setup`](tracking-setup.md), work order [`test-plan`](test-plan.md) | The signal and the deciding metric may no longer hold. |
| A spend amount or approval is stated in chat | `gaps` | A wish is not authority: ask once whether to record it, and record it only on a yes from someone who can approve. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| routed | **`offer`**, **`first-move`** | The first move was made or named; nothing needed recording. |
| recorded, live gaps open | **`offer`**, **`result-loop`**, **`facts`**, **`gaps`**, **`first-move`**, **`whole`** | Supplied facts are on file with status and source; the live gaps are named with who clears each. |
| recorded, no live gaps here | **`offer`**, **`result-loop`**, **`facts`**, **`gaps`**, **`first-move`**, **`whole`** | Nothing this skill records is missing; the remaining gates belong to ad-setup, ad-creative, ad-launch and the business. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state.

## Layer record

Where it goes: In the reply, as one line. The offer file's Gaps section holds the lists themselves.

```markdown
## Layer record
Work order: readiness
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 offer |  |  |  |
| 2 result-loop |  |  |  |
| 3 facts |  |  |  |
| 4 gaps |  |  |  |
| 5 first-move |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`.

In a reply with no file, put the record on its own line, starting with `Layers (readiness):`, every layer in order with a few words of evidence in brackets:

```
Layers (readiness): offer pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
