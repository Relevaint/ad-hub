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

## Pass record
1. Fundamentals: audience/situation, awareness/surface, desire, offer, proof limits,
   one message/action, constraints and deliverables; destination/brand sources actually
   reviewed, cultural/voice cues from explicit direction, gaps and provisional choices.
2. Premise: mechanism, product-connected payoff; materially different route rejected.
3. Cast / rendering: separate choices and reasons; alternative treatment considered.
4. Attention: actual first frame/image, focal point, question/interest; visual-alone
   stop reason for cold visual feeds, or applicable test with reason; hierarchy,
   competing details changed or intentionally retained, premise preserved.
5. Connection: opening/development/turn/payoff/action for video; complete composition
   for static; key copy, CTA, claims mapped to supplied proof.
6. Review: self or independent; attention, relevance, promise/clarity, proof/policy,
   composition/hierarchy, distinctness/execution and brand/cultural continuity verdicts;
   batch sameness check when applicable; concrete reasons, revisions and return passes.

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

## Creative pass record
<Fundamentals; distinct premises; independent cast/rendering selection and rejected
alternative; visual stop and question; connected turn/payoff; separate review verdicts
and revisions. Link a saved concept record when it supplies these, then recheck after
execution. Do not replace this with "all passes passed".>

## Claims map
| Claim in the ad | Proof row | Status |
| --- | --- | --- |
| "<the words>" | <row from the offer's proof table> | Owner-confirmed / Observed / BLANK to confirm |

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

## Notes

- Shapes are named by ratio in the file name: `4x5`, `1x1`, `9x16`. The platform layer
  says which the placements need.
- A file at `copy-ready` has incomplete production or inspection; `creative-ready` has every shape required by the authorized placement scope made
  and inspected. A single preview does not complete a broader planned placement set. The ledger row says the same thing.
- Nothing in this folder is a performance record. Results live in `ads/results/`.
