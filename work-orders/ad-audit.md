<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Audit of the live ads by class (`ad-audit`)

**When the ask is:** "audit our ads", "classify the live ads", "what are we missing in the account", "what kinds of ads are we running", "audit my ad account", "audit the ad account", "audit the account", "review what is running in the account"

**Owner:** `ad-strategy` (Audit)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-strategy/SKILL.md](../core/skills/ad-strategy/SKILL.md)
2. [core/_system/schemas/diagnosis.md](../core/_system/schemas/diagnosis.md)
3. [core/_system/schemas/ledger-row.md](../core/_system/schemas/ledger-row.md)

## Needs

- Required: a ledger with live rows
- Helps, never blocks: the latest results snapshot; research files

## Layers

### 1. Classify every live ad (`classify`)

- **Build:** Every live ad tagged by customer type, awareness, format, style, breadth, origin and risk.
- **Method:** [ad-strategy/SKILL.md, "modes"](../core/skills/ad-strategy/SKILL.md#modes)
- **Check:** Was every live row classified from its creative file or the ad itself, not from its name?
- **Evidence:** The ledger's live rows and each one's creative file or preview.
- **If it fails:** A row that cannot be seen is classified unknown and named.

### 2. Compare by class (`compare`)

- **Build:** Spend and results by class, where results exist.
- **Method:** [ad-strategy/SKILL.md, "3 run the gap checks"](../core/skills/ad-strategy/SKILL.md#3-run-the-gap-checks)
- **Check:** Does every class comparison show its counts, with nothing called a winner below the bar?
- **Evidence:** The latest snapshot rolled up by tag, counts beside each figure.
- **If it fails:** No snapshot: say so and skip the comparison as not checked. Judging results is ad-review's.

### 3. Name the missing classes (`missing`)

- **Build:** The classes nobody addresses, as the production list.
- **Method:** [ad-strategy/SKILL.md, "3 run the gap checks"](../core/skills/ad-strategy/SKILL.md#3-run-the-gap-checks)
- **Check:** Is each missing class a real gap against the research and the tags, written as a candidate rather than a finding?
- **Evidence:** The gap table against research/audience.md and the ledger tags.
- **If it fails:** Label it an assumption when there is no research behind it.

### Whole output (`whole`)

- **Method:** [ad-strategy/SKILL.md, "quality gate"](../core/skills/ad-strategy/SKILL.md#quality-gate)
- **Check:** Does the audit tell the next plan what to make, with no ad paused, moved or renamed?
- **Evidence:** The diagnosis file and the untouched ledger statuses.
- **If it fails:** Remove any action taken from here; pausing is ad-manage's.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| Ads go live, pause or retire | `classify`, `missing` | The audit describes a date; say which. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| audit done | **`classify`**, **`missing`**, **`whole`** | Live ads are classified and the missing classes are listed as candidates. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: At the end of ads/strategy/diagnosis.md, under ## Layer record.

```markdown
## Layer record
Work order: ad-audit
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 classify |  |  |  |
| 2 compare |  |  |  |
| 3 missing |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

In a reply with no file, put the record on its own line, starting with `Layers (ad-audit):`, every layer in order with a few words of evidence in brackets:

```
Layers (ad-audit): classify pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
