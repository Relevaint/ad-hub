<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Remix of a proven ad (`ad-remix`)

**When the ask is:** "new hooks on our winning ad", "remix the winning ad", "put the proven hook on a new body", "make variants of the ad that worked", "iterate on the winner", "remix our best ad", "remix this ad", "a new version of our best ad", "more versions of the winner"

**Owner:** `ad-creative` (Remix)
**Part of:** [`ad-batch`](ad-batch.md)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-creative/SKILL.md](../core/skills/ad-creative/SKILL.md)
2. [core/skills/ad-creative/references/creative-passes.md](../core/skills/ad-creative/references/creative-passes.md)
3. [core/skills/ad-creative/references/copy-and-hooks.md](../core/skills/ad-creative/references/copy-and-hooks.md)
4. [core/skills/ad-creative/references/claims-and-policy.md](../core/skills/ad-creative/references/claims-and-policy.md)
5. [core/_system/schemas/creative.md](../core/_system/schemas/creative.md)

Also, when it applies:

- the remix changes the opening: [core/skills/ad-creative/references/opening-dynamics.md](../core/skills/ad-creative/references/opening-dynamics.md)
- a new image or video is authorised: [core/skills/ad-creative/references/composition-review.md](../core/skills/ad-creative/references/composition-review.md)
- the remix is a video: [core/skills/ad-creative/references/video-build.md](../core/skills/ad-creative/references/video-build.md)

## Needs

- Required: the original ad's creative file; the row for the remix from ad-strategy, as a revision or a new ID
- Helps, never blocks: the review or learning that calls the original proven

## Layers

1. **Name what stays fixed** (`fixed`): The proven element named exactly (the body, or the hook), the one variable that changes, and the remix row.
2. **Develop the change** (`change`): The new hooks or the new body, as real alternatives on the one variable.
3. **Copy per placement** (`copy`): The fields the remix changes, within the platform layer's lengths, and the claims map for anything new.
4. **Review the whole ad** (`review`): The adversarial review of each remixed ad, fixed element, change and the new copy together. Made as the review brief says: a fresh agent when one can be started, otherwise a separate pass answered in the notes file.
5. **Authorised production** (`production`): Only the new assets the request authorises, or the production brief when nothing here can make them.
6. **Render review** (`render-review`): An inspection of each new file at the size it will be seen.
7. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id ad-remix --layer fixed --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| The original's claim or proof changes | `fixed`, `copy`, `review`, `whole`, work order [`launch`](launch.md) | The fixed element is only fixed while it is still true. |
| A new result changes which element is proven | `fixed`, `change` | Ask ad-strategy for the row. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| copy-ready | **`fixed`**, `change`, **`copy`**, `review` | The remix's copy and claims are done; new assets are not made or not inspected. |
| creative-ready | **`fixed`**, `change`, **`copy`**, `review`, **`production`**, **`render-review`**, **`whole`** | Every authorised shape exists and was inspected. Not approved, not live, untested. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In ads/creative/<batch>/<ID>.md under ## Layer record. For a video remix, add the video-ad work order's build layers after review.

```markdown
## Layer record
Work order: ad-remix
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 fixed |  |  |  |
| 2 change |  |  |  |
| 3 copy |  |  |  |
| 4 review |  |  |  |
| 5 production |  |  |  |
| 6 render-review |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (ad-remix):`, every layer in order with a few words of evidence in brackets:

```
Layers (ad-remix): fixed pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
