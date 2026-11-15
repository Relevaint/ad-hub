<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Ad copy, no media (`ad-copy`)

**When the ask is:** "write copy for the planned ads", "write three ads", "write ads", "write an ad", "write the ad copy", "ad copy only", "write headlines and primary text", "write a script for the ad"

**Not this:** A copy request does not authorise generating an image or a video.

**Owner:** `ad-creative` (Batch or Quick, copy only)
**Part of:** [`ad-batch`](ad-batch.md), [`static-ad`](static-ad.md), [`video-ad`](video-ad.md)
**Its parts:** hook: text, first frame, sound; primary text; headlines; description; call to action; required strings; claims map
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-creative/SKILL.md](../core/skills/ad-creative/SKILL.md)
2. [core/skills/ad-creative/references/creative-passes.md](../core/skills/ad-creative/references/creative-passes.md)
3. [core/skills/ad-creative/references/opening-dynamics.md](../core/skills/ad-creative/references/opening-dynamics.md)
4. [core/skills/ad-creative/references/copy-and-hooks.md](../core/skills/ad-creative/references/copy-and-hooks.md)
5. [core/skills/ad-creative/references/composition-review.md](../core/skills/ad-creative/references/composition-review.md)
6. [core/skills/ad-creative/references/claims-and-policy.md](../core/skills/ad-creative/references/claims-and-policy.md)
7. [core/_system/schemas/creative.md](../core/_system/schemas/creative.md)

Also, when it applies:

- the business runs on Meta, for field lengths per placement: [meta-system/references/placements.md](../meta-system/references/placements.md)
- the business runs on Meta, for the personal-attributes standard and special categories: [meta-system/references/policy-notes.md](../meta-system/references/policy-notes.md)

## Needs

- Required: the offer in a sentence, and who it is for
- Helps, never blocks: a planned ledger row; the proof table; research/voc.md; learnings

## Layers

### 1. Fundamentals (`fundamentals`)

- **Build:** A compact brief: audience and situation, awareness and surface, one desire or problem, the offer and its defensible benefit, proof available and claims forbidden, one message and action, constraints, the exact deliverables asked for; plus a source note for the destination page and brand material actually looked at.
- **Method:** [ad-creative/references/creative-passes.md, "pass 1 fundamentals before creative"](../core/skills/ad-creative/references/creative-passes.md#pass-1-fundamentals-before-creative); [ad-creative/SKILL.md, "1 take the brief from the row"](../core/skills/ad-creative/SKILL.md#1-take-the-brief-from-the-row)
- **Check:** Can this ad do one clear job for this audience inside the brief, with every unknown fact left unknown?
- **Evidence:** The offer file's proof table and limits; the destination page opened and viewed, or the gap named; the ledger row's sentence when there is one.
- **If it fails:** Resolve the brief or ask only for the blocking choice. Never invent a customer story or a fact to move on.

### 2. Premises (`premises`)

- **Build:** Several materially different premises, one sentence each, with why this audience would care and why the product belongs in the resolution.
- **Method:** [ad-creative/references/creative-passes.md, "pass 2 premises not polished headlines"](../core/skills/ad-creative/references/creative-passes.md#pass-2-premises-not-polished-headlines); [ad-creative/references/opening-dynamics.md, "the table awareness decides the opening"](../core/skills/ad-creative/references/opening-dynamics.md#the-table-awareness-decides-the-opening)
- **Check:** Do the candidates differ in the underlying idea rather than the wording, and does each have a payoff the product is part of?
- **Evidence:** The premises side by side, with the ones rejected and why.
- **If it fails:** Write new premises here. A category slogan or a novelty with no product payoff is rejected, not polished.

### 3. Cast and treatment (`cast-treatment`)

- **Build:** For the strongest premises: who or what acts, and separately how it is rendered, with the materially different alternative that was rejected.
- **Method:** [ad-creative/references/creative-passes.md, "pass 3 cast and treatment are independent decisions"](../core/skills/ad-creative/references/creative-passes.md#pass-3-cast-and-treatment-are-independent-decisions)
- **Check:** Were cast and rendering chosen as two separate decisions, each for a stated reason tied to the brief and the brand evidence, not by default?
- **Evidence:** The chosen cast and the cast that was rejected; the chosen rendering and, separately, the rendering that was rejected for that cast; the reason for each, read against the fundamentals source note.
- **If it fails:** A default choice returns to treatment exploration here. A cast that changes the idea's logic returns to premises.

### 4. Visual stop and hierarchy (`visual-stop`)

- **Build:** The actual first frame or single image, described concretely: focal point, action or contrast, what is understood at once, the question it raises; then its hierarchy: first read, supporting cue, product or action read.
- **Method:** [ad-creative/references/creative-passes.md, "pass 4 build the visual stop"](../core/skills/ad-creative/references/creative-passes.md#pass-4-build-the-visual-stop); [ad-creative/references/composition-review.md, "make and challenge the hierarchy"](../core/skills/ad-creative/references/composition-review.md#make-and-challenge-the-hierarchy)
- **Check:** With the headline and sound taken away, would a distracted stranger have a specific reason to pause (or does the recorded opening dynamic's own test pass), and can the eye find the first read?
- **Evidence:** The frame description read alone with the copy hidden; the named reason to pause; the competing details removed, subordinated or kept on purpose.
- **If it fails:** A weak idea returns to premises or cast and treatment, never to headline polishing. Competing details are recomposed here.

### 5. Connected payoff (`connection`)

- **Build:** The hook as image, text and sound; then opening, development, turn, product payoff and action for video, or one complete proposition for a static; key copy and call to action.
- **Method:** [ad-creative/references/creative-passes.md, "pass 5 connect opening turn payoff and action"](../core/skills/ad-creative/references/creative-passes.md#pass-5-connect-opening-turn-payoff-and-action)
- **Check:** Does the payoff answer the opening's promise with the product, so a viewer remembers the benefit and not only the opening?
- **Evidence:** The sequence or composition read start to end as a stranger would meet it.
- **If it fails:** A payoff that does not fulfil the opening returns to premises or the visual stop. Never attach a product screen to an unrelated opening.

### 6. Claims and permissions (`claims`)

- **Build:** The claims map: every factual thing the ad says, shows or implies (a number, rating, review, credential, guarantee, price, result, story, comparison, urgency, and a result the picture implies without saying it, such as a before and after) set against the offer's proof, with the permission behind any review, testimonial or customer story; then the policy check.
- **Method:** [ad-creative/SKILL.md, "2 run the claims gate before writing a word"](../core/skills/ad-creative/SKILL.md#2-run-the-claims-gate-before-writing-a-word); [ad-creative/SKILL.md, "3 run the policy and rules check"](../core/skills/ad-creative/SKILL.md#3-run-the-policy-and-rules-check); [ad-creative/references/claims-and-policy.md, "the gate"](../core/skills/ad-creative/references/claims-and-policy.md#the-gate)
- **Check:** Does every claim the ad states or implies, in words or in the picture, map to a proof row or stand as a marked blank, with recorded permission behind every review, testimonial or customer story, and no personal attribute asserted?
- **Evidence:** The claims map read against the offer file's proof table, row by row; for each quote or story, where the reviewer and the permission to use it in advertising are recorded; required strings compared character by character with the business's file.
- **If it fails:** An unsupported claim is cut or becomes a marked blank. A review or story with no recorded permission is withheld and named as a blank for the business, whatever status its proof row carries. A personal attribute is rewritten around the situation. An idea that only works with the unsupported claim returns to the connection layer.

### 7. Adversarial review and revision (`review`)

- **Build:** A separate review of each concept as a distracted viewer: attention, relevance and one job, promise and clarity, proof and policy, composition, distinctness and execution, brand continuity; rubric scores; revisions.
- **Method:** [ad-creative/references/creative-passes.md, "pass 6 adversarial concept review then revision"](../core/skills/ad-creative/references/creative-passes.md#pass-6-adversarial-concept-review-then-revision); [ad-creative/references/copy-and-hooks.md, "the rubric"](../core/skills/ad-creative/references/copy-and-hooks.md#the-rubric)
- **Check:** Does every gate pass with a concrete reason, with Hook and Glance at 4 or more and One job and Proof at 3 or more, and no average hiding a failed gate?
- **Evidence:** The seven verdicts with their reasons, the rubric scores, who reviewed (a fresh reviewer or self-review), and what changed in each revision cycle.
- **If it fails:** Return to the pass that failed, change that part, review the connected whole again. Three cycles at most, then withhold the concept and report the shortfall.

### 8. Copy per placement (`copy`)

- **Build:** The fields each placement needs, within the platform layer's lengths: hook as text, first frame and sound; primary text; headlines; description; call to action; required strings; the final claims map.
- **Method:** [ad-creative/SKILL.md, "4 develop and reject concepts then write the copy"](../core/skills/ad-creative/SKILL.md#4-develop-and-reject-concepts-then-write-the-copy); [ad-creative/references/copy-and-hooks.md, "the hook"](../core/skills/ad-creative/references/copy-and-hooks.md#the-hook); [ad-creative/references/claims-and-policy.md, "the gate"](../core/skills/ad-creative/references/claims-and-policy.md#the-gate)
- **Check:** Is every word a person will read true to the claims map, free of personal attributes, in the business's voice and the copy standard, and does the hook still carry the concept that passed?
- **Evidence:** Each field read against the claims map; a quote appears only where the claims layer recorded its permission; required strings compared character by character with the business's file; the rubric scores.
- **If it fails:** Rewrite the failing field here. A claim with no proof row is cut or marked blank. Copy that only works by changing the idea returns to the connection layer.

### 9. Ad against destination (`destination`)

- **Build:** The ad read beside the page it sends people to.
- **Method:** [ad-creative/references/creative-passes.md, "pass 1 fundamentals before creative"](../core/skills/ad-creative/references/creative-passes.md#pass-1-fundamentals-before-creative)
- **Check:** Does the page deliver what the ad promises: the same offer, price, qualifications and next action?
- **Evidence:** The opened page beside the ad; or the page copy held in the business repo; or the operator's dated confirmation of what the page says.
- **If it fails:** A mismatch is fixed at the connection layer or reported to the business as a page gap; the offer is never changed to match an ad. A page that cannot be seen from here is not checked: name it as an open item and say who can open it.

### Whole output (`whole`)

- **Method:** [ad-creative/SKILL.md, "quality gate"](../core/skills/ad-creative/SKILL.md#quality-gate)
- **Check:** Read placement by placement as the buyer will meet it: is it one job with nothing invented, and is the file complete to the schema?
- **Evidence:** The creative file read top to bottom; the ledger row moved to copy-ready and nothing else changed.
- **If it fails:** A missing field returns to copy. An invented or unmapped claim returns to claims.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A claim, the price, an offer term or a proof row changes | `claims`, `copy`, `destination`, `whole`, work order [`launch`](launch.md) | Every field that carried the old claim, the page match, and any approval that covered the old wording. Assets with the old words in them go back through their own work order. |
| The landing page changes | `fundamentals`, `destination` | The promise and the next action must still match. |
| A placement is added or removed | `copy` | Only that placement's fields. |
| The audience, the awareness level or the test variable changes | `fundamentals`, `premises`, `review`, `copy` | Treat it as a new concept: every later layer follows. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| copy-ready | `fundamentals`, `premises`, `cast-treatment`, `visual-stop`, `connection`, **`claims`**, `review`, **`copy`**, `whole` | Copy and claims map are done. No asset has been made or inspected. Untested. A destination that was not checked is named beside the state. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state.

## Layer record

Where it goes: In ads/creative/<batch>/<ID>.md under ## Layer record; a draft with no ID, in creative/<yymm>-drafts/draft-NN.md.

```markdown
## Layer record
Work order: ad-copy
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
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`.

In a reply with no file, put the record on its own line, starting with `Layers (ad-copy):`, every layer in order with a few words of evidence in brackets:

```
Layers (ad-copy): fundamentals pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
