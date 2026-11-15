<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Remix of a proven ad (`ad-remix`)

**When the ask is:** "new hooks on our winning ad", "remix the winning ad", "put the proven hook on a new body", "make variants of the ad that worked", "iterate on the winner"

**Owner:** `ad-creative` (Remix)
**Part of:** [`ad-batch`](ad-batch.md)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

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

### 1. Name what stays fixed (`fixed`)

- **Build:** The proven element named exactly (the body, or the hook), the one variable that changes, and the remix row.
- **Method:** [ad-creative/references/creative-passes.md, "scope first"](../core/skills/ad-creative/references/creative-passes.md#scope-first)
- **Check:** Is the fixed element identical to the proven one, and is exactly one thing changing?
- **Evidence:** The original creative file and the result that calls it proven, beside the remix row.
- **If it fails:** No row: ad-strategy gives it one. No evidence it is proven: say so and treat it as a new ad.

### 2. Develop the change (`change`)

- **Build:** The new hooks or the new body, as real alternatives on the one variable.
- **Method:** [ad-creative/references/creative-passes.md, "pass 2 premises not polished headlines"](../core/skills/ad-creative/references/creative-passes.md#pass-2-premises-not-polished-headlines); [ad-creative/references/creative-passes.md, "pass 4 build the visual stop"](../core/skills/ad-creative/references/creative-passes.md#pass-4-build-the-visual-stop); [ad-creative/references/creative-passes.md, "pass 5 connect opening turn payoff and action"](../core/skills/ad-creative/references/creative-passes.md#pass-5-connect-opening-turn-payoff-and-action)
- **Check:** Is each variant a different approach on the one variable rather than a rewording, and does it still connect to the fixed element's promise and payoff?
- **Evidence:** The variants beside the fixed element, read as whole ads.
- **If it fails:** Write new variants here. A change that breaks the connection is dropped.

### 3. Review the whole ad (`review`)

- **Build:** The adversarial review of each remixed ad, fixed element and change together.
- **Method:** [ad-creative/references/creative-passes.md, "pass 6 adversarial concept review then revision"](../core/skills/ad-creative/references/creative-passes.md#pass-6-adversarial-concept-review-then-revision)
- **Check:** Does the whole ad pass every gate, and is the experiment still the one the row describes?
- **Evidence:** The verdicts with reasons; the row's sentence against what was made.
- **If it fails:** Return to the change layer. A second variable that crept in is removed.

### 4. Copy per placement (`copy`)

- **Build:** The fields the remix changes, within the platform layer's lengths, and the claims map for anything new.
- **Method:** [ad-creative/SKILL.md, "4 develop and reject concepts then write the copy"](../core/skills/ad-creative/SKILL.md#4-develop-and-reject-concepts-then-write-the-copy); [ad-creative/references/claims-and-policy.md, "the gate"](../core/skills/ad-creative/references/claims-and-policy.md#the-gate)
- **Check:** Is every new word true to the claims map, free of personal attributes and in the copy standard, with the fixed element's words unchanged?
- **Evidence:** The new fields read against the claims map; the fixed element compared word for word with the original.
- **If it fails:** Rewrite the failing field here; copy that only works by changing a second thing returns to the change layer.

### 5. Authorised production (`production`)

- **Build:** Only the new assets the request authorises, or the production brief when nothing here can make them.
- **Method:** [ad-creative/SKILL.md, "5 make only the authorized asset"](../core/skills/ad-creative/SKILL.md#5-make-only-the-authorized-asset)
- **Check:** Is each new asset the variant that passed review, in an authorised shape, with its text correct letter by letter?
- **Evidence:** Each new file opened; its on-asset text read against the gated copy.
- **If it fails:** Regenerate that asset. With no tool, or when the remix is copy only, this layer is not checked or n/a with the reason.

### 6. Render review (`render-review`)

- **Build:** An inspection of each new file at the size it will be seen.
- **Method:** [ad-creative/SKILL.md, "6 inspect the render"](../core/skills/ad-creative/SKILL.md#6-inspect-the-render)
- **Check:** At delivery size, does each new asset read clearly, keep the proven element intact and show only the gated claims?
- **Evidence:** The actual file viewed or played at delivery size beside the original.
- **If it fails:** Repair and inspect again, three cycles at most; a file that cannot be opened here is not checked and the row stays copy-ready.

### Whole output (`whole`)

- **Method:** [ad-creative/SKILL.md, "quality gate"](../core/skills/ad-creative/SKILL.md#quality-gate)
- **Check:** Would the result tell the business something about the one variable, with the proven element untouched?
- **Evidence:** The original and the remix read side by side.
- **If it fails:** Restore the fixed element; return to the change layer.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| The original's claim or proof changes | `fixed`, `copy`, `whole`, work order [`launch`](launch.md) | The fixed element is only fixed while it is still true. |
| A new result changes which element is proven | `fixed`, `change` | Ask ad-strategy for the row. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| copy-ready | `fixed`, `change`, `review`, `copy` | The remix's copy and claims are done; new assets are not made or not inspected. |
| creative-ready | `fixed`, `change`, `review`, `copy`, `production`, `render-review`, `whole` | Every authorised shape exists and was inspected. Not approved, not live, untested. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

## Layer record

Where it goes: In ads/creative/<batch>/<ID>.md under ## Layer record. For a video remix, add the video-ad work order's build layers after copy.

```markdown
## Layer record
Work order: ad-remix
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 fixed |  |  |  |
| 2 change |  |  |  |
| 3 review |  |  |  |
| 4 copy |  |  |  |
| 5 production |  |  |  |
| 6 render-review |  |  |  |
| whole |  |  |  |
State:
```

Verdicts: `pass` (name the evidence), `fail` (name the fix or where it went back), `n/a` (say why), `not checked` (say why and who can). In a reply with no file, one line: `Layers (ad-remix): fixed pass · change pass · review pass · copy pass · production pass · render-review pass · whole pass. State: ...`

Check a saved record: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`
