<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Refresh of the hub's plays library (`plays-refresh`)

**When the ask is:** "refresh the plays library", "scout new plays", "update the plays from new sources", "add this source to the hub"

**Not this:** Runs only from a hub session, never from a business repo, and never records any business's results.

**Owner:** `ad-strategy` (Scout)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-strategy/SKILL.md](../core/skills/ad-strategy/SKILL.md)
2. [core/_system/CONVENTIONS.md](../core/_system/CONVENTIONS.md)
3. [source-notes/README.md](../source-notes/README.md)
4. [core/skills/ad-strategy/references/plays.md](../core/skills/ad-strategy/references/plays.md)

## Needs

- Required: a hub session; the source material, supplied by the owner

## Layers

### 1. Review the source (`source-review`)

- **Build:** A written review in source-notes/, in our own words: why reviewed, what to retain, what not to import, where it conflicts.
- **Method:** [_system/CONVENTIONS.md, "10 outside sources"](../core/_system/CONVENTIONS.md#10-outside-sources); [source-notes/README.md, "adding a source"](../source-notes/README.md#adding-a-source)
- **Check:** Is the review in our own words, with no raw transcript or course file stored, and is it indexed and recorded in PROVENANCE.md?
- **Evidence:** The review file, the index row and the provenance row.
- **If it fails:** Rewrite in our own words; remove stored source text.

### 2. Write the plays (`plays`)

- **Build:** Each named tactic as a play with its source and date, as a claim to test.
- **Method:** [_system/CONVENTIONS.md, "7 plays"](../core/_system/CONVENTIONS.md#7-plays)
- **Check:** Is each play specific, labelled Observed as a creator's claim, and neither flattened into generic advice nor dropped because it may expire?
- **Evidence:** The new rows in plays.md beside the review.
- **If it fails:** Restore the specifics; relabel a rule as a claim.

### 3. Record conflicts and freshness (`conflicts`)

- **Build:** Rows in source-notes/conflicts.md where sources disagree, and the plays file's freshness header updated.
- **Method:** [_system/CONVENTIONS.md, "6 freshness"](../core/_system/CONVENTIONS.md#6-freshness)
- **Check:** Are disagreements kept side by side for results to settle, and is the freshness header valid?
- **Evidence:** conflicts.md and the output of freshness.mjs.
- **If it fails:** Add the missing row; fix the header.

### Whole output (`whole`)

- **Check:** Does the library hold claims to test and nothing about any business's results?
- **Evidence:** The diff of the hub, and npm test.
- **If it fails:** Remove business facts; fix what the gate reports.

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| refreshed | **`source-review`**, **`plays`**, **`conflicts`**, **`whole`** | New plays are in the library as dated claims; the gate passes. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the pull request description and the HANDOFF.md Last Session block.

```markdown
## Layer record
Work order: plays-refresh
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 source-review |  |  |  |
| 2 plays |  |  |  |
| 3 conflicts |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (plays-refresh):`, every layer in order with a few words of evidence in brackets:

```
Layers (plays-refresh): source-review pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
