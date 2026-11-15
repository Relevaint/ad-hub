<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: What competitors run, and what can be learned (`competitor-report`)

**When the ask is:** "what are competitors running", "what are other sellers running", "competitor ads", "look at the ad library", "what ads does the competition run", "swipe file"

**Owner:** `competitor-ads`
**Part of:** [`ad-program`](ad-program.md)
**Live account:** read-only library search through the business's own connector, where one exists

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/competitor-ads/SKILL.md](../core/skills/competitor-ads/SKILL.md)
2. [core/skills/competitor-ads/references/reading-an-ad.md](../core/skills/competitor-ads/references/reading-an-ad.md)
3. [core/_system/schemas/competitors.md](../core/_system/schemas/competitors.md)

Also, when it applies:

- the library is Meta's: [meta-system/references/ad-library.md](../meta-system/references/ad-library.md)

## Needs

- Required: the offer, or the thing sold
- Helps, never blocks: research/audience.md for the alternatives buyers named; a real browser

## Layers

1. **Set the question** (`question`): One line: what we are trying to learn, for this offer and these customer types.
2. **Pull each advertiser's active ads** (`advertisers`): Per advertiser: active ad count, oldest start date, starts in the last ninety days, format mix, versions, landing pages.
3. **Read the ads worth keeping** (`breakdowns`): A breakdown of each kept ad: hook as text, first frame and sound; style; message and proof; offer and ask; call-out; format.
4. **Click through** (`pages`): Each kept ad's landing page read: headline, proof shown, offer, the one ask, friction, and where page and ad disagree.
5. **Keep observed apart from inferred** (`observed-inferred`): Every line labelled Observed with link and date, or Inferred.
6. **Patterns and gaps** (`patterns`): What everyone says, what nobody says, and each pattern written as a candidate for ad-strategy with how it would be adapted.
7. **The swipe file** (`swipe`): One entry per kept ad, with its link, the date seen, a screenshot when one could be taken, and why it was kept.
8. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id competitor-report --layer question --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A later run sees new ads or a page changed | `advertisers`, `breakdowns`, `patterns`, work order [`test-plan`](test-plan.md) | Add entries with the new date; delete nothing. |
| Audience research names a new alternative | `question`, `advertisers` | The alternatives buyers named come first. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| report ready, library not opened | **`question`**, **`observed-inferred`**, **`patterns`**, **`whole`** | Built from websites and pages only; nothing from a library is Observed. |
| report ready | **`question`**, **`advertisers`**, **`breakdowns`**, **`pages`**, **`observed-inferred`**, **`patterns`**, `swipe`, **`whole`** | Observed from the library with links and dates; what was not seen is listed. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: At the end of ads/research/competitors.md, under ## Layer record.

```markdown
## Layer record
Work order: competitor-report
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 question |  |  |  |
| 2 advertisers |  |  |  |
| 3 breakdowns |  |  |  |
| 4 pages |  |  |  |
| 5 observed-inferred |  |  |  |
| 6 patterns |  |  |  |
| 7 swipe |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (competitor-report):`, every layer in order with a few words of evidence in brackets:

```
Layers (competitor-report): question pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
