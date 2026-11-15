<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Result signal, tracking and account structure (`tracking-setup`)

**When the ask is:** "make sure we can tell which ads make sales", "check our tracking", "which result should we send back to the ad platform", "set up tracking", "set up the ad account", "campaign structure", "what can you do in our ad account"

**Owner:** `ad-setup`
**Part of:** [`ad-program`](ad-program.md)
**Live account:** reads and dry runs only, under ads/authority.md; creates nothing

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-setup/SKILL.md](../core/skills/ad-setup/SKILL.md)
2. [core/skills/ad-setup/references/signal-path.md](../core/skills/ad-setup/references/signal-path.md)
3. [core/_system/schemas/platform.md](../core/_system/schemas/platform.md)
4. [core/_system/spend-authority.md](../core/_system/spend-authority.md)

Also, when it applies:

- the business runs on Meta: [meta-system/SKILL.md](../meta-system/SKILL.md)
- the business runs on Meta, before any platform fact is written: [meta-system/references/result-signals.md](../meta-system/references/result-signals.md)
- the business runs on Meta, for test events and deduplication: [meta-system/references/events-and-matching.md](../meta-system/references/events-and-matching.md)

## Needs

- Required: the offer's result loop
- Helps, never blocks: ads/authority.md; a connected ads tool; the test plan

## Layers

### 1. Choose the signal (`signal`)

- **Build:** The one status sent back to the platform, with the alternatives rejected and why.
- **Method:** [ad-setup/SKILL.md, "1 choose the signal"](../core/skills/ad-setup/SKILL.md#1-choose-the-signal); [ad-setup/references/signal-path.md, "the three tests a candidate signal must pass"](../core/skills/ad-setup/references/signal-path.md#the-three-tests-a-candidate-signal-must-pass)
- **Check:** Is it the earliest status that marks a real buyer and arrives in time, with each rejected alternative named with its reason?
- **Evidence:** The offer file's result loop; the decision table; the pipeline's real timings from the business.
- **If it fails:** Choose again from the decision table. A result source that does not exist is a live gap for start-here and the business.

### 2. Verify the path (`path`)

- **Build:** Each link checked: browser tag, server event, deduplication, value and matching fields, source health.
- **Method:** [ad-setup/SKILL.md, "2 verify the path"](../core/skills/ad-setup/SKILL.md#2-verify-the-path); [ad-setup/references/signal-path.md, "verifying the path in order"](../core/skills/ad-setup/references/signal-path.md#verifying-the-path-in-order)
- **Check:** For each link in the path, is it recorded as verified by a named check on a date, or as a checklist item nobody has verified yet?
- **Evidence:** Per item in the Checked table: how it was checked, the date and the result; a tool read under authority, or the person's checklist.
- **If it fails:** An unverified item stays not checked with who can check it. Never write that it should work.

### 3. See the real result arrive (`result-test`)

- **Build:** A test of the real result seen arriving on the platform, with its value where there is one, on a stated date.
- **Method:** [ad-setup/SKILL.md, "2 verify the path"](../core/skills/ad-setup/SKILL.md#2-verify-the-path)
- **Check:** Has a test of the real result been seen arriving on the platform's own events view, with its value, on a stated date?
- **Evidence:** What was seen, where and when; or NOT YET SEEN with who clears it.
- **If it fails:** Record NOT YET SEEN: blocks going live. A page view, a tag that fires or a snapshot matched by tag is not this test.

### 4. Choose the conversion location (`conversion-location`)

- **Build:** Where the result happens (a page, a native form, a message thread, a call), with the reason.
- **Method:** [ad-setup/SKILL.md, "3 choose the conversion location as a test"](../core/skills/ad-setup/SKILL.md#3-choose-the-conversion-location-as-a-test)
- **Check:** Is the choice stated with its reason and treated as a test the results will judge?
- **Evidence:** The platform file's conversion-location line.
- **If it fails:** State it as a test, not a rule.

### 5. Set the structure (`structure`)

- **Build:** The campaign and ad set baseline in plain words: objective, performance goal, location, naming and tracking parameter.
- **Method:** [ad-setup/SKILL.md, "4 set the structure"](../core/skills/ad-setup/SKILL.md#4-set-the-structure); [ad-setup/references/signal-path.md, "structure defaults"](../core/skills/ad-setup/references/signal-path.md#structure-defaults)
- **Check:** Is it one campaign and one ad set per offer unless a stated reason splits it, with location exactly where the business serves and the ad ID on names and links?
- **Evidence:** The test plan's location and the offer file's service area; the platform layer's defaults with their date.
- **If it fails:** Correct the location or the split; cite the platform layer file, never memory.

### 6. Declare the category (`category`)

- **Build:** The restricted category mapped to the platform's own, and the check recorded.
- **Method:** [ad-setup/SKILL.md, "5 declare the category"](../core/skills/ad-setup/SKILL.md#5-declare-the-category)
- **Check:** Is the restricted category declared, or none confirmed, with how and when it was checked?
- **Evidence:** The offer file's category line; the platform layer's mapping; the check row.
- **If it fails:** An undeclared category is a live gate: name it and who clears it.

### 7. Record the baseline and the change list (`change-list`)

- **Build:** The platform file: account identifier, signal and test, category check, baseline, and the numbered change list a launch would carry out.
- **Method:** [ad-setup/SKILL.md, "6 record the baseline and the change list"](../core/skills/ad-setup/SKILL.md#6-record-the-baseline-and-the-change-list)
- **Check:** Could ad-launch or a person carry out each numbered step from its before and after, creating nothing active?
- **Evidence:** The change list read step by step.
- **If it fails:** Add the missing before or after; remove any step that activates.

### Whole output (`whole`)

- **Method:** [ad-setup/SKILL.md, "quality gate"](../core/skills/ad-setup/SKILL.md#quality-gate)
- **Check:** Does the platform file say plainly whether this account can measure the real result, with every platform fact dated, no credential anywhere and nothing changed on the account?
- **Evidence:** The platform file read top to bottom; the chat searched for tokens and keys.
- **If it fails:** Remove the credential and say it must be rotated; date the fact; correct the test status.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| The offer's result source, funnel type or pipeline changes | `signal`, `path`, `result-test`, work order [`launch`](launch.md) | The old test no longer proves the new signal. |
| The site, checkout, CRM or tag changes | `path`, `result-test` | See the real result arrive again. |
| ad-manage or ad-review reports the signal silent or shifted | `path`, `result-test`, work order [`daily-watch`](daily-watch.md) | Spend with a silent signal is an emergency. |
| The service area, the batch or the ceilings change | `structure`, `change-list` | Location is exactly where the business can serve. |
| A platform layer file is refreshed | `structure`, `category` | Facts cite the new date. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| checklist prepared | **`signal`**, **`change-list`** | No account read was possible. Every path item is a checklist for a person; the real result has not been seen. Blocks going live. |
| path checked, test not seen | **`signal`**, **`path`**, **`structure`**, **`change-list`** | The path was checked item by item; the real result has not been seen arriving. Blocks going live. |
| test seen | `signal`, `path`, **`result-test`**, `conversion-location`, `structure`, `category`, `change-list`, `whole` | The real result was seen arriving on a stated date. The account can measure this offer. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: At the end of ads/platform/<platform>.md, under ## Layer record.

```markdown
## Layer record
Work order: tracking-setup
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 signal |  |  |  |
| 2 path |  |  |  |
| 3 result-test |  |  |  |
| 4 conversion-location |  |  |  |
| 5 structure |  |  |  |
| 6 category |  |  |  |
| 7 change-list |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`.

In a reply with no file, put the record on its own line, starting with `Layers (tracking-setup):`, every layer in order with a few words of evidence in brackets:

```
Layers (tracking-setup): signal pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
