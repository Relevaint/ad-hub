# Schema: voice of customer file

File in the business repo: `ads/research/voc.md`, one per offer (a business with one
offer may keep one file). Written by `audience-research` only. It holds the evidence:
verbatim lines, one per row, each with where it came from. `research/audience.md` cites
these rows by ID. Rules behind it: [CONVENTIONS.md](../CONVENTIONS.md) section 5 and
[memory-contract.md](../memory-contract.md), "What never goes in a repo".

**Data label.** One per file, true or the file is not finished: `Data: LIVE (n sources)`
when the lines came from sources read, or `Data: MODEL KNOWLEDGE (verify before
spending)` when nothing could be read.

## Template

```markdown
---
offer: <slug>
updated: YYYY-MM-DD
updated-by: audience-research
---

# Voice of customer: <offer>

Data: LIVE (n sources)

## Sources walked
| Source | What it is | Reached | Lines taken | Note |
| --- | --- | --- | --- | --- |
| <name> | <own reviews, map reviews, forum thread, video comments, customer emails...> | yes / no (blocked, login, not found) | <n> | <date read; what it gave or why it was skipped> |

## Lines
| ID | Quote, verbatim | Source | Date | Link or file | Signals | Who |
| --- | --- | --- | --- | --- | --- | --- |
| v001 | "<exact words>" | <source name> | YYYY-MM-DD | <url, or path in this repo> | trigger, objection, desire, complaint, praise, alternative, phrase | <customer type name, or ?> |
```

## Notes

- IDs count up from `v001` and are never reused or renumbered. A later run appends.
- The quote is exact, spelling included. Trim with `...` only at the ends. Nothing
  paraphrased goes inside quotation marks.
- No reviewer names, handles or identifying details. The link is the attribution.
- A line from the business's own private material (emails, call notes) names the repo
  file and is marked `held by business` in Signals. It is research language; it may be
  used in an ad only once the business clears it in the offer's proof table.
- Category research for a business with no customers yet: say so in the data label
  line, for example `Data: LIVE (6 sources), category research, not this business's
  customers`.
