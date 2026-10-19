# Schema: diagnosis file

File in the business repo: `ads/strategy/diagnosis.md`, one per offer. Written by
`ad-strategy` only. It says, in one or two sentences, why these ads and for whom, and
shows the gaps the batch is built to fill. `ad-creative` reads the pillars and angles;
`ad-review` reads it to judge whether the batch answered its own question. Rules behind
it: [memory-contract.md](../memory-contract.md), "Who writes what".

## Template

```markdown
---
offer: <slug>
updated: YYYY-MM-DD
updated-by: ad-strategy
---

# Diagnosis: <offer>

Shaped by: <files read, with dates; what was missing>

## Diagnosis
<One or two sentences: why these ads, for whom, what is wrong or missing right now.>

## Offer check
- The ask fits the value: <yes, or what should change> (status)
- Price point and bundle: ... (status)
- Proof an ad can lean on: <rows from the offer's proof table, or none>
- Verdict: ready to advertise | needs <change> first (Proposed)

## Gaps
| Lens | In the research or available | In the live ads | Gap |
| --- | --- | --- | --- |
| Customer types | ... | ... | ... |
| Awareness levels | ... | ... | ... |
| Formats | ... | ... | ... |
| Styles | ... | ... | ... |
| Message pillars | ... | ... | ... |
| Breadth, origin, risk | ... | ... | ... |

## Message pillars
- <pillar>: for <customer types>; proof: <row>; angles: <two or three>

## What the results say
<From the latest snapshot and learnings, judged against the bar; or "no results yet".>

## Audit of live ads
| ID | Customer type | Awareness | Format | Style | Breadth | Origin | Risk | Spend | Result on the deciding metric |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
<Classes missing from the table are the production list.>
```

## Notes

- A diagnosis longer than two sentences is a report, not a diagnosis. Put the detail
  under the headings below it.
- Customer type names come from `ads/research/audience.md`. When that file does not
  exist, say the names are the business's own description.
- Nothing here changes a live ad. A finding that an ad should be paused goes to the
  rulebook in the test plan and waits for `ad-manage`'s session.
