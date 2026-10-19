# Schema: audience file

File in the business repo: `ads/research/audience.md`, one per offer. Written by
`audience-research` only. It is the synthesis of `research/voc.md`: customer types
ranked, each claim citing line IDs. `ad-strategy` reads it for the gap checks and takes
the customer type names for the ledger tag; `ad-creative` writes in its words. Rules
behind it: [CONVENTIONS.md](../CONVENTIONS.md) section 5.

**Status of a type.** `Finding`: several lines from more than one source. `Lead`: one
line, or one source. `Assumption`: no line behind it; lives only under "Assumptions to
test", marked Proposed.

## Template

```markdown
---
offer: <slug>
updated: YYYY-MM-DD
updated-by: audience-research
---

# Who buys <offer>

Data: LIVE (n sources)
Shaped by: <files read, sources walked, date>

## Customer types, ranked
| Rank | Customer type | How often (lines / sources) | How strongly | Awareness when they start looking | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | <a person in a moment, in plain words> | 9 / 4 | <high: describes the moment of buying> | problem-aware | v001, v004, v007... | Finding |

## <Customer type name>
- Situation and trigger: ... (v001, v004)
- What they want, in their words: ... (v...)
- Objections and friction: ... (v...)
- What they compared or used before: ... (v...)
- Words to use: <three to six phrases, each from a line> (v...)
- Not for: ... (v...)

## Objections across types
- <objection> (v..., v...)

## Triggers across types
- <trigger> (v..., v...)

## Assumptions to test
Proposed. No line behind these yet; `ad-strategy` may test them as bold ads.
- ...

## Not reached, and next refresh
- <source>: <why>. Next run: <what would settle the open questions>.
```

## Notes

- The customer type name is the ledger tag. Keep it stable once an ad carries it; add a
  new type rather than renaming one.
- A type is a situation, never a protected attribute. In a regulated category, point at
  the business's compliance file here and do not restate its rules.
- Illustrative numbers in this template are not real.
