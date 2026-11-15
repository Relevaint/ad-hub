<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Result signal, tracking and account structure (`tracking-setup`)

**When the ask is:** "make sure we can tell which ads make sales", "check our tracking", "which result should we send back to the ad platform", "set up tracking", "set up the ad account", "campaign structure", "what can you do in our ad account", "set up the pixel", "set up the pixel and conversions", "set up conversion tracking", "install the pixel", "are conversions tracked"

**Owner:** `ad-setup`
**Part of:** [`ad-program`](ad-program.md)
**Live account:** reads and dry runs only, under ads/authority.md; creates nothing

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

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

1. **Choose the signal** (`signal`): The one status sent back to the platform, with the alternatives rejected and why.
2. **Verify the path** (`path`): Each link checked: browser tag, server event, deduplication, value and matching fields, source health.
3. **See the real result arrive** (`result-test`): A test of the real result seen arriving on the platform, with its value where there is one, on a stated date.
4. **Choose the conversion location** (`conversion-location`): Where the result happens (a page, a native form, a message thread, a call), with the reason.
5. **Set the structure** (`structure`): The campaign and ad set baseline in plain words: objective, performance goal, location, naming and tracking parameter.
6. **Declare the category** (`category`): The restricted category mapped to the platform's own, and the check recorded.
7. **Record the baseline and the change list** (`change-list`): The platform file: account identifier, signal and test, category check, baseline, and the numbered change list a launch would carry out.
8. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id tracking-setup --layer signal --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

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

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: At the end of ads/platform/<platform>.md, under ## Layer record.

```markdown
## Layer record
Work order: tracking-setup
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
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

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (tracking-setup):`, every layer in order with a few words of evidence in brackets:

```
Layers (tracking-setup): signal pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
