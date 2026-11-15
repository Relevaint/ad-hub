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
- **Evidence:** The chosen cast and treatment, the rejected alternative and the reason, read against the fundamentals source note.
- **If it fails:** A default choice returns to treatment exploration here. A cast that changes the idea's logic returns to premises.

### 4. Visual stop and hierarchy (`visual-stop`)

- **Build:** The actual first frame or single image, described concretely: focal point, action or contrast, what is understood at once, the question it raises; then its hierarchy: first read, supporting cue, product or action read.
- **Method:** [ad-creative/references/creative-passes.md, "pass 4 build the visual stop"](../core/skills/ad-creative/references/creative-passes.md#pass-4-build-the-visual-stop); [ad-creative/references/composition-review.md, "make and challenge the hierarchy"](../core/skills/ad-creative/references/composition-review.md#make-and-challenge-the-hierarchy)
- **Check:** With the headline and sound taken away, would a distracted stranger have a specific reason to pause (or does the recorded opening dynamic's own test pass), and can the eye find the first read?
- **Evidence:** The frame description read alone with the copy hidden; the named reason to pause; the competing details removed, subordinated or kept on purpose.
- **If it fails:** A weak idea returns to premises or cast and treatment, never to headline polishing. Competing details are recomposed here.

### 5. Connected payoff and claims (`connection`)

- **Build:** The hook as image, text and sound; then opening, development, turn, product payoff and action for video, or one complete proposition for a static; key copy and call to action; every factual claim mapped to a proof row or left as a marked blank.
- **Method:** [ad-creative/references/creative-passes.md, "pass 5 connect opening turn payoff and action"](../core/skills/ad-creative/references/creative-passes.md#pass-5-connect-opening-turn-payoff-and-action); [ad-creative/SKILL.md, "2 run the claims gate before writing a word"](../core/skills/ad-creative/SKILL.md#2-run-the-claims-gate-before-writing-a-word); [ad-creative/SKILL.md, "3 run the policy and rules check"](../core/skills/ad-creative/SKILL.md#3-run-the-policy-and-rules-check)
- **Check:** Does the payoff answer the opening's promise with the product, and does every claim map to the offer's proof or stand as a marked blank?
- **Evidence:** The sequence or composition read start to end; the claims map against the offer file's proof table; the policy check: no personal attribute, required strings exact.
- **If it fails:** A payoff that does not fulfil the opening returns to premises or the visual stop. An unsupported claim is cut or becomes a marked blank. A policy failure is rewritten around the situation.

### 6. Adversarial review and revision (`review`)

- **Build:** A separate review of each concept as a distracted viewer: attention, relevance and one job, promise and clarity, proof and policy, composition, distinctness and execution, brand continuity; rubric scores; revisions.
- **Method:** [ad-creative/references/creative-passes.md, "pass 6 adversarial concept review then revision"](../core/skills/ad-creative/references/creative-passes.md#pass-6-adversarial-concept-review-then-revision); [ad-creative/references/copy-and-hooks.md, "the rubric"](../core/skills/ad-creative/references/copy-and-hooks.md#the-rubric)
- **Check:** Does every gate pass with a concrete reason, with Hook and Glance at 4 or more and One job and Proof at 3 or more, and no average hiding a failed gate?
- **Evidence:** The seven verdicts with their reasons, the rubric scores, who reviewed (a fresh reviewer or self-review), and what changed in each revision cycle.
- **If it fails:** Return to the pass that failed, change that part, review the connected whole again. Three cycles at most, then withhold the concept and report the shortfall.

### 7. Copy per placement (`copy`)

- **Build:** The fields each placement needs, within the platform layer's lengths: hook as text, first frame and sound; primary text; headlines; description; call to action; required strings; the final claims map.
- **Method:** [ad-creative/SKILL.md, "4 develop and reject concepts then write the copy"](../core/skills/ad-creative/SKILL.md#4-develop-and-reject-concepts-then-write-the-copy); [ad-creative/references/copy-and-hooks.md, "the hook"](../core/skills/ad-creative/references/copy-and-hooks.md#the-hook); [ad-creative/references/claims-and-policy.md, "the gate"](../core/skills/ad-creative/references/claims-and-policy.md#the-gate)
- **Check:** Is every word a person will read true to the claims map, free of personal attributes, in the business's voice and the copy standard, and does the hook still carry the concept that passed?
- **Evidence:** Each field read against the claims map and the offer file; required strings compared character by character with the business's file; the rubric scores.
- **If it fails:** Rewrite the failing field here. A claim with no proof row is cut or marked blank. Copy that only works by changing the idea returns to the connection layer.

### Whole output (`whole`)

- **Method:** [ad-creative/SKILL.md, "quality gate"](../core/skills/ad-creative/SKILL.md#quality-gate)
- **Check:** Read as the buyer will meet it, placement by placement: is it one job and one promise the destination delivers, with nothing invented and the file complete to the schema?
- **Evidence:** The creative file read top to bottom beside the destination page; the ledger row moved to copy-ready and nothing else changed.
- **If it fails:** A page mismatch returns to connection or goes to the business as a destination gap. A missing field returns to copy.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A claim, the price, an offer term or a proof row changes | `connection`, `copy`, `whole`, work order [`launch`](launch.md) | Every field that carried the old claim, the destination match, and any approval that covered the old wording. Assets with the old words in them go back through their own work order. |
| The landing page changes | `fundamentals`, `whole` | The promise and the next action must still match. |
| A placement is added or removed | `copy` | Only that placement's fields. |
| The audience, the awareness level or the test variable changes | `fundamentals`, `premises`, `review`, `copy` | Treat it as a new concept: every later layer follows. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| copy-ready | `fundamentals`, `premises`, `cast-treatment`, `visual-stop`, `connection`, `review`, `copy`, `whole` | Copy and claims map are done. No asset has been made or inspected. Untested. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

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
| 6 review |  |  |  |
| 7 copy |  |  |  |
| whole |  |  |  |
State:
```

Verdicts: `pass` (name the evidence), `fail` (name the fix or where it went back), `n/a` (say why), `not checked` (say why and who can). In a reply with no file, one line: `Layers (ad-copy): fundamentals pass · premises pass · cast-treatment pass · visual-stop pass · connection pass · review pass · copy pass · whole pass. State: ...`

Check a saved record: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`
