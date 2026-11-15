<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Finished static image ad (`static-ad`)

**When the ask is:** "make a static ad", "make an image ad", "make an ad", "create an ad", "create a finished ad", "make the ad with its image", "design an ad", "make an ad from this story", "carousel ad", "make me an ad", "create a facebook ad", "one ad for the feed", "make static ads", "two finished ads", "static ads for the feed", "an ad built around a generated photo"

**Not this:** A row or a request that says video uses the video-ad work order. With no image tool connected this still runs: it ends at copy-ready with a production brief.

**Owner:** `ad-creative` (Batch or Quick)
**Part of:** [`ad-batch`](ad-batch.md)
**Contains:** [`ad-copy`](ad-copy.md)
**Its parts:** hook: text and first frame; primary text; headline; description; call to action; required strings; image; one variant per authorised placement shape
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-creative/SKILL.md](../core/skills/ad-creative/SKILL.md)
2. [core/skills/ad-creative/references/creative-passes.md](../core/skills/ad-creative/references/creative-passes.md)
3. [core/skills/ad-creative/references/opening-dynamics.md](../core/skills/ad-creative/references/opening-dynamics.md)
4. [core/skills/ad-creative/references/copy-and-hooks.md](../core/skills/ad-creative/references/copy-and-hooks.md)
5. [core/skills/ad-creative/references/composition-review.md](../core/skills/ad-creative/references/composition-review.md)
6. [core/skills/ad-creative/references/claims-and-policy.md](../core/skills/ad-creative/references/claims-and-policy.md)
7. [core/_system/schemas/creative.md](../core/_system/schemas/creative.md)

Also, when it applies:

- the business runs on Meta, for shapes, safe zones and field lengths: [meta-system/references/placements.md](../meta-system/references/placements.md)
- the business runs on Meta, for the personal-attributes standard and special categories: [meta-system/references/policy-notes.md](../meta-system/references/policy-notes.md)
- judging hierarchy against the paired teaching images: [core/skills/ad-creative/references/composition-examples/README.md](../core/skills/ad-creative/references/composition-examples/README.md)

## Needs

- Required: the offer in a sentence, and who it is for
- Helps, never blocks: a planned ledger row; the proof table; research/voc.md; the destination page; a connected image tool

## Layers

1. **Fundamentals** (`fundamentals`): A compact brief: audience and situation, awareness and surface, one desire or problem, the offer and its defensible benefit, proof available and claims forbidden, one message and action, constraints, the exact deliverables asked for; plus a source note for the destination page and brand material actually looked at.
2. **Premises** (`premises`): Several materially different premises, one sentence each, with why this audience would care and why the product belongs in the resolution.
3. **Cast and treatment** (`cast-treatment`): For the strongest premises: who or what acts, and separately how it is rendered, with the materially different alternative that was rejected.
4. **Visual stop and hierarchy** (`visual-stop`): The actual first frame or single image, described concretely: focal point, action or contrast, what is understood at once, the question it raises; then its hierarchy: first read, supporting cue, product or action read.
5. **Connected payoff** (`connection`): The hook as image, text and sound; then opening, development, turn, product payoff and action for video, or one complete proposition for a static; key copy and call to action.
6. **Claims and permissions** (`claims`): The claims map: every factual thing the ad says, shows or implies (a number, rating, review, credential, guarantee, price, result, story, comparison, urgency, and a result the picture implies without saying it, such as a before and after) set against the offer's proof, with the permission behind any review, testimonial or customer story; then the policy check.
7. **Adversarial review and revision** (`review`): A separate review of each concept as a distracted viewer: attention, relevance and one job, promise and clarity, proof and policy, composition, distinctness and execution, brand continuity; rubric scores; revisions. A fresh agent makes it when this session can start one, handed the review brief word for word with the paths filled in; its findings are repaired at the layer each one names and reviewed again as the review brief says. When none can be started, the same brief runs as a separate pass after the draft is finished, every item answered in writing in the notes file, and the row says so.
8. **Copy per placement** (`copy`): The fields each placement needs, within the platform layer's lengths: hook as text, first frame and sound; primary text; headlines; description; call to action; required strings; the final claims map.
9. **Ad against destination** (`destination`): The ad read beside the page it sends people to.
10. **Authorised production** (`production`): Only the image and the shapes the request authorises, in the platform layer's dimensions, with text and logos inside the safe zones; or, when nothing here can make it, the production brief.
11. **Render review** (`render-review`): An inspection of each actual file at the size it will be seen: a phone-width feed card or a full-screen vertical.
12. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id static-ad --layer fundamentals --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A claim, the price, an offer term or a proof row changes | `claims`, `copy`, `destination`, `render-review`, `whole`, work order [`launch`](launch.md) | Fields and pixels that carry the old claim, the page match, and any approval that covered the old version. Regenerate only assets with the changed words or facts in them. |
| The headline or on-image text changes | `copy`, `production`, `render-review`, `whole` | Only the shapes that show that text. |
| The image changes | `render-review`, `whole` | Copy that still fits is not rewritten. |
| A placement shape is added | `production`, `render-review`, `whole` | Only the new shape; a dedicated edit, not a crop. |
| The landing page changes | `fundamentals`, `destination` | The promise and the next action must still match. |
| The audience, the awareness level or the test variable changes | `fundamentals`, `premises`, `review` | Treat it as a new concept: every later layer follows. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| copy-ready | `fundamentals`, `premises`, `cast-treatment`, `visual-stop`, `connection`, **`claims`**, `review`, **`copy`** | Copy and claims are done; the asset is not made, not inspected, or a planned shape is missing. |
| creative-ready | `fundamentals`, `premises`, `cast-treatment`, `visual-stop`, `connection`, **`claims`**, `review`, **`copy`**, **`production`**, **`render-review`**, **`whole`** | Every authorised shape exists and was inspected at delivery size. Not approved, not live, untested. A destination that was not checked is named beside the state and closed before launch. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In ads/creative/<batch>/<ID>.md under ## Layer record.

```markdown
## Layer record
Work order: static-ad
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 fundamentals |  |  |  |
| 2 premises |  |  |  |
| 3 cast-treatment |  |  |  |
| 4 visual-stop |  |  |  |
| 5 connection |  |  |  |
| 6 claims |  |  |  |
| 7 review |  |  |  |
| 8 copy |  |  |  |
| 9 destination |  |  |  |
| 10 production |  |  |  |
| 11 render-review |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (static-ad):`, every layer in order with a few words of evidence in brackets:

```
Layers (static-ad): fundamentals pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
