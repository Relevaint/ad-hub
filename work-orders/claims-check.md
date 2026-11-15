<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Claims and policy check of existing copy (`claims-check`)

**When the ask is:** "check this copy for claims and policy", "will this ad get rejected", "policy check", "claims check", "is this ad compliant", "review this ad before it runs", "is this claim ok to use in an ad", "can we say this in an ad", "is this claim allowed", "can I use this review in an ad", "check this claim"

**Not this:** A check diagnoses. It rewrites nothing unless asked.

**Owner:** `ad-creative` (Check)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-creative/SKILL.md](../core/skills/ad-creative/SKILL.md)
2. [core/skills/ad-creative/references/claims-and-policy.md](../core/skills/ad-creative/references/claims-and-policy.md)

Also, when it applies:

- the business runs on Meta: [meta-system/references/policy-notes.md](../meta-system/references/policy-notes.md)
- the copy belongs to an ad that will also be judged as creative: [core/skills/ad-creative/references/creative-passes.md](../core/skills/ad-creative/references/creative-passes.md)

## Needs

- Required: the copy to check
- Helps, never blocks: the offer file's proof table; the business's compliance file

## Layers

### 1. List every claim (`claims-list`)

- **Build:** Every factual thing the copy says or shows: numbers, ratings, reviews, credentials, guarantees, speeds, prices, results, stories, comparisons, urgency, scarcity.
- **Method:** [ad-creative/references/claims-and-policy.md, "what counts as a claim"](../core/skills/ad-creative/references/claims-and-policy.md#what-counts-as-a-claim)
- **Check:** Is every factual statement and implication in the copy on the list, including what the image or video shows?
- **Evidence:** The copy read line by line against the list.
- **If it fails:** Add what was missed.

### 2. Map each claim to proof (`proof-map`)

- **Build:** Each claim mapped to a proof row, Owner-confirmed or Observed with its source, or flagged.
- **Method:** [ad-creative/references/claims-and-policy.md, "the gate"](../core/skills/ad-creative/references/claims-and-policy.md#the-gate)
- **Check:** Does each claim point at a row in the offer's proof table, with testimonials and customer stories showing recorded permission?
- **Evidence:** The offer file's proof table.
- **If it fails:** Flag the claim as unsupported. Do not create a proof row; proof is the business's to supply.

### 3. Policy and required strings (`policy`)

- **Build:** The personal-attributes check, restricted-category rules and required strings.
- **Method:** [ad-creative/references/claims-and-policy.md, "personal attributes"](../core/skills/ad-creative/references/claims-and-policy.md#personal-attributes); [ad-creative/references/claims-and-policy.md, "restricted categories"](../core/skills/ad-creative/references/claims-and-policy.md#restricted-categories); [ad-creative/references/claims-and-policy.md, "required strings"](../core/skills/ad-creative/references/claims-and-policy.md#required-strings)
- **Check:** Is the viewer never described by a personal attribute, are the category's rules met, and is every required string present exactly as the business's file has it?
- **Evidence:** The copy against the platform layer's list; the required strings compared character by character.
- **If it fails:** Flag it with the situation-based rewrite that would pass; rewrite only if asked.

### 4. The check report (`report`)

- **Build:** The report: each flag with its line, the rule, and what would clear it.
- **Method:** [ad-creative/references/claims-and-policy.md, "the check report"](../core/skills/ad-creative/references/claims-and-policy.md#the-check-report)
- **Check:** Could the business clear every flag from the report without guessing?
- **Evidence:** The report read alone.
- **If it fails:** Add the missing line, rule or fix.

### Whole output (`whole`)

- **Check:** Is the verdict the one the flags support, with nothing rewritten that was not asked for and no legal judgment claimed?
- **Evidence:** The report beside the original copy.
- **If it fails:** Correct the verdict; restore copy that was changed without being asked.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| The copy, the proof table or the compliance file changes | `claims-list`, `proof-map`, `policy`, `report` | A check describes one version of the copy; say which. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| checked, clean | **`claims-list`**, **`proof-map`**, **`policy`**, **`report`**, **`whole`** | No open flag on this version of the copy. A platform-policy read, not legal review. |
| checked, flags open | **`claims-list`**, **`proof-map`**, **`policy`**, **`report`**, **`whole`** | The report lists what must change or be supplied before this copy runs. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the check report in the batch folder, under ## Layer record; in the reply when no file is written.

```markdown
## Layer record
Work order: claims-check
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 claims-list |  |  |  |
| 2 proof-map |  |  |  |
| 3 policy |  |  |  |
| 4 report |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

In a reply with no file, put the record on its own line, starting with `Layers (claims-check):`, every layer in order with a few words of evidence in brackets:

```
Layers (claims-check): claims-list pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
