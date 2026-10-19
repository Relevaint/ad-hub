# Schema: creative files

Files in the business repo: one per ad under `ads/creative/<batch>/`, named by ad ID,
with the finished assets beside it named `<ID>-<shape>.<ext>`. Written by `ad-creative`
only. Drafts made before a plan exists live under `ads/creative/<yymm>-drafts/` as
`draft-01.md` onward until `ad-strategy` gives them IDs. Rules behind it:
[memory-contract.md](../memory-contract.md), "The ad ID thread" and "Who writes what";
[ledger-row.md](ledger-row.md) for the statuses.

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
- Glance: ... Score: n
- One job: ... Score: n
- Hook: ... Score: n
- Proof: ... Score: n
- Finish: ... Score: n
- Policy: personal attributes pass / fail; required strings pass / fail; restricted category: ...
- Copy standard: pass / fail
- Blanks for the business: ...
- Verdict: ready for approval | not yet, because ...
```

## Notes

- Shapes are named by ratio in the file name: `4x5`, `1x1`, `9x16`. The platform layer
  says which the placements need.
- A file at `copy-ready` has no inspected asset; `creative-ready` has every shape made
  and inspected. The ledger row says the same thing.
- Nothing in this folder is a performance record. Results live in `ads/results/`.
