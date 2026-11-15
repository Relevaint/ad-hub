<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Ad concepts only (`ad-concepts`)

**When the ask is:** "give me video and image ad concepts only", "brainstorm ad ideas without generating assets", "ad concepts", "ad ideas", "pitch me some ad ideas", "storyboard ideas for an ad"

**Not this:** Concepts are not assets: no image, audio or video is generated and no ledger row is promoted.

**Owner:** `ad-creative` (Concepts)
**Part of:** [`ad-batch`](ad-batch.md)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: open it with `--layer` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. `head`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.

## Load first

1. [core/skills/ad-creative/SKILL.md](../core/skills/ad-creative/SKILL.md)
2. [core/skills/ad-creative/references/creative-passes.md](../core/skills/ad-creative/references/creative-passes.md)
3. [core/skills/ad-creative/references/opening-dynamics.md](../core/skills/ad-creative/references/opening-dynamics.md)
4. [core/skills/ad-creative/references/copy-and-hooks.md](../core/skills/ad-creative/references/copy-and-hooks.md)
5. [core/skills/ad-creative/references/composition-review.md](../core/skills/ad-creative/references/composition-review.md)
6. [core/skills/ad-creative/references/claims-and-policy.md](../core/skills/ad-creative/references/claims-and-policy.md)

Also, when it applies:

- the concepts will be saved: [core/_system/schemas/creative.md](../core/_system/schemas/creative.md)
- the business runs on Meta: [meta-system/references/policy-notes.md](../meta-system/references/policy-notes.md)

## Needs

- Required: the offer in a sentence, and who it is for
- Helps, never blocks: the offer file's proof table; research files; the destination page; brand material

## Layers

1. **Fundamentals** (`fundamentals`): A compact brief: audience and situation, awareness and surface, one desire or problem, the offer and its defensible benefit, proof available and claims forbidden, one message and action, constraints, the exact deliverables asked for; plus a source note for the destination page and brand material actually looked at.
2. **Premises** (`premises`): Several materially different premises, one sentence each, with why this audience would care and why the product belongs in the resolution.
3. **Cast and treatment** (`cast-treatment`): For the strongest premises: who or what acts, and separately how it is rendered, with the materially different alternative that was rejected.
4. **Visual stop and hierarchy** (`visual-stop`): The actual first frame or single image, described concretely: focal point, action or contrast, what is understood at once, the question it raises; then its hierarchy: first read, supporting cue, product or action read.
5. **Connected payoff** (`connection`): The hook as image, text and sound; then opening, development, turn, product payoff and action for video, or one complete proposition for a static; key copy and call to action.
6. **Claims and permissions** (`claims`): The claims map: every factual thing the ad says, shows or implies (a number, rating, review, credential, guarantee, price, result, story, comparison, urgency, and a result the picture implies without saying it, such as a before and after) set against the offer's proof, with the permission behind any review, testimonial or customer story; then the policy check.
7. **Adversarial review and revision** (`review`): A separate review of each concept as a distracted viewer: attention, relevance and one job, promise and clarity, proof and policy, composition, distinctness and execution, brand continuity; rubric scores; revisions. A fresh agent makes it when this session can start one, handed the review brief word for word with the paths filled in; its findings are repaired at the layer each one names and reviewed again as the review brief says. When none can be started, the same brief runs as a separate pass after the draft is finished, every item answered in writing in the notes file, and the row says so.
8. **Whole output** (`whole`): the assembled output, checked last.

Open the first layer:

```
node <hub>/core/_system/scripts/workorder.mjs --id ad-concepts --layer fundamentals --notes <notes file>
```

A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| The brief, the offer, the proof table or a claim changes | `fundamentals`, `claims`, `review`, `whole` | A concept whose payoff rested on the changed fact is also checked again at the connection layer. |
| The destination page or brand direction changes | `fundamentals`, `cast-treatment`, `review` | Continuity is judged against what the page shows now. |
| The operator fixes the cast, the style or the test variable | `cast-treatment`, `visual-stop`, `connection`, `review` | A fixed choice stays fixed; name the conflict if it prevents a viable ad. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| concept-ready | `fundamentals`, `premises`, `cast-treatment`, `visual-stop`, `connection`, **`claims`**, **`review`**, `whole` | A document verdict: untested, not a ledger status, not copy-ready and not a finished asset. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after `State:`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the reply, as one line. When concepts are saved, in the concept record under ## Layer record.

```markdown
## Layer record
Work order: ad-concepts
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
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.

In a reply with no file, put the record on its own line, starting with `Layers (ad-concepts):`, every layer in order with a few words of evidence in brackets:

```
Layers (ad-concepts): fundamentals pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
