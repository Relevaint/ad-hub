# Schema: creative files

Files in the business repo: one per ad under `ads/creative/<batch>/`, named by ad ID,
with the finished assets beside it named `<ID>-<shape>.<ext>`. Written by `ad-creative`
only. Drafts made before a plan exists live under `ads/creative/<yymm>-drafts/` as
`draft-01.md` onward until `ad-strategy` gives them IDs. Rules behind it:
[memory-contract.md](../memory-contract.md), "The ad ID thread" and "Who writes what";
[ledger-row.md](ledger-row.md) for the statuses.

## Concept record (only when saving concepts is requested or required)

Concept-only output normally stays in chat. If saved, use a clearly named
`concept-<name>.md` in the creative folder, link any planned ad ID, and keep the ledger
unchanged. `concept-ready` below is a document verdict, **not a new ledger status**.
Do not claim a concept is copy-ready, creative-ready or tested.

```markdown
# Concept: <name>
Scope: concepts only. Untested. No media generated.
Data: <sources used, or MODEL KNOWLEDGE (verify before spending)>
Planned ad ID: <existing ID if any; otherwise not assigned>

## Layer record
Work order: ad-concepts
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 fundamentals | | audience/situation, awareness/surface, desire, offer, proof limits, one message/action, constraints and deliverables; destination/brand sources actually reviewed, gaps and provisional choices | |
| 2 premises | | mechanism, product-connected payoff; the materially different route rejected; closest earlier: the business's closest earlier ad for this offer or service, by path, and how this idea differs (or none on file and what was searched) | |
| 3 cast-treatment | | cast and rendering as separate choices with reasons; the alternative considered | |
| 4 visual-stop | | actual first frame/image, focal point, question; visual-alone stop reason for cold visual feeds, or the applicable test with its reason; hierarchy, competing details changed or kept | |
| 5 connection | | opening/development/turn/payoff/action for video, or the complete composition for a static; key copy and CTA | |
| 6 claims | | every claim mapped to supplied proof or left as a marked blank; where the permission behind any review or story is recorded; policy; condition: each condition's own words and shown in: every surface that carries it (scope limit: the same way), or condition: none | |
| 7 review | | reviewer: fresh agent or self, with the reason; findings: how many, which blocked, the layers they sent work back to in square brackets, what was repaired, each repaired layer reopened with --repair (blocking found and repaired is fail, then pass); reviewed: the file or version given; after review: nothing changed, cut: each cut with its finding, or the lines changed since, each with the finding it repairs, and who re-checked them; audience: any, or the one the scores hold for; register: at register beside the owner's example quoted, or n/a: no owner examples for this channel; hook:, glance:, one job:, proof: each score with its reason; the seven verdicts with concrete reasons; batch sameness when applicable; revisions and the passes returned to | |
| whole | | the set read as the operator sees it; nothing generated, no row promoted | |
State: concept-ready | not ready, because ...

## Concept scores
- Glance: n; Hook: n; One job: n; Proof: n; Finish: not applicable.
- Verdict: concept-ready and untested | withheld, because ...
- Execution risks or facts to confirm: ...
```

## Template: `creative/<batch>/<ID>.md`

```markdown
---
id: <offer>-<yymm>-<nnn>
offer: <slug>
batch: <yymm>-<letter>
status: copy-ready | creative-ready
updated: YYYY-MM-DD
updated-by: ad-creative
data: LIVE (proof rows n, voice lines m) | MODEL KNOWLEDGE (verify before spending)
---

# <ID>: <the ad's one job, in a line>

Untested. Nothing here predicts performance; the test plan says how it will be judged.

## Brief
- Job (why it is tested, from the ledger): ...
- Customer type / awareness / format / style / breadth: ...
- Plays: ...
- Pillar and angle (diagnosis): ...
- Words they use (voc IDs): ...
- Proof available (offer file rows): ...

## Layer record
Work order: <ad-copy | static-ad | video-ad | ad-remix>
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| <one row per layer in the work order, in order> | pass / fail / n/a / not checked | <the decision and what was looked at: the premise chosen and the one rejected; cast and rendering and the alternative; the visual stop and its question; the connected turn and payoff; the review verdicts> | <what changed, or the layer it went back to> |
| whole | | <the ad as a buyer sees it, beside the destination> | |
State: copy-ready | creative-ready | not ready, because ...
<This is the creative pass record. A saved concept record may supply the first six rows;
link it, then check them again after execution. Do not replace the rows with "all passes
passed". Check it: `node <hub>/core/_system/scripts/workorder.mjs --record <this file>`.>

## Claims map
| Claim in the ad | Proof row | Status | Condition and where it is shown |
| --- | --- | --- | --- |
| "<the words>" | <row from the offer's proof table> | Owner-confirmed / Observed / BLANK to confirm | condition: "<its words>"; shown in: <each surface> (scope limit: the same way), or none |

## Copy
### Hook
- Text: "..."
- First frame: ...
- Sound: ...
### Primary text
1. ...
### Headline(s)
1. ...
### Description
...
### Call to action
...
### Required strings
- "<exact string>" from <business file>, placed in <field>; or: no room in <format>, left off, business to decide

## Assets
| Shape | File | Made with | Inspected | Notes |
| --- | --- | --- | --- | --- |
| 4:5 | <ID>-4x5.png | <tool, or "not made here"> | yes, at feed size / no | ... |
| 9:16 | <ID>-9x16.mp4 | ... | ... | ... |

## Production brief
<Only when an asset could not be made here: shot list, on-screen text by second, first frame, sound, shapes, what the operator needs to supply.>

## Checks
- Glance at reveal / complete static: ... Score: n
- Attention test (visual alone for cold visual feeds): ... pass / fail
- Promise fulfilled and audience relevance: ... pass / fail
- Composition / hierarchy: first read, support, product/action; competing details
  changed or intentionally retained; premise preserved ... pass / fail
- Actual render hierarchy at delivery size: inspected / not inspected / not applicable
- Brand/cultural continuity: reviewed sources, grounded choices, gaps; batch defaults
  or mismatch corrected / intentional consistency explained
- Review: self / independent, with failure reasons and changes
- One job: ... Score: n
- Hook: ... Score: n
- Proof: ... Score: n
- Finish: ... Score: n
- Policy: personal attributes pass / fail; required strings pass / fail; restricted category: ...
- Copy standard: pass / fail
- Blanks for the business: ...
- Verdict: copy-ready (render pending) | creative-ready for approval | not yet, because ...
```

## Template: `creative/<batch>/batch-review.md`

Written by `ad-creative` when a batch is made together (work order `ad-batch`). It holds
the checks no single ad's file can: whether the ads differ the way their rows say, and
whether each ad promises what its page delivers.

```markdown
---
batch: <yymm>-<letter>
offer: <slug>
updated: YYYY-MM-DD
updated-by: ad-creative
---

# Batch review: <batch>

## The ads
| ID | State | Hook, first frame | Cast and treatment | What the row says it tests |
| --- | --- | --- | --- | --- |

## Distinctness
<Hooks, first frames, casts, settings and styles side by side. Accidental sameness
corrected, or the matched pair named as deliberate.>

## Ad against destination
| ID | Destination | Same offer, price, qualifications and next action? | Gap |
| --- | --- | --- | --- |

## Withheld
- <ID>: <the layer that failed, and what it needs>

## Layer record
Work order: ad-batch
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 briefs |  |  |  |
| 2 ads |  |  |  |
| 3 distinctness |  |  |  |
| 4 destination |  |  |  |
| 5 rows |  |  |  |
| whole |  |  |  |
State: batch concept-ready | batch copy-ready | batch creative-ready | batch partly ready
```

## Notes

- Every file here ends with its layer record: one row per layer of its work order
  ([staged work](../staged-work.md)). The record is the proof trail for the status the
  ledger row carries.
- Shapes are named by ratio in the file name: `4x5`, `1x1`, `9x16`. The platform layer
  says which the placements need.
- A file at `copy-ready` has incomplete production or inspection; `creative-ready` has every shape required by the authorized placement scope made
  and inspected. A single preview does not complete a broader planned placement set. The ledger row says the same thing.
- Nothing in this folder is a performance record. Results live in `ads/results/`.
