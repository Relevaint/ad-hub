# Schema: test plan

File in the business repo: `ads/strategy/test-plan.md`, one per offer. Written by
`ad-strategy` only. It holds the test design (bar, window, cadence, spend), the current
batch, and the per-offer rulebook that `ad-manage` applies at its sessions. The business
may keep its own shape; `ad-strategy` adds a dated section rather than rewriting earlier
ones. Rules behind it: [spend-authority.md](../spend-authority.md), "Watch daily, act on
a schedule" and "Budget bands"; [ledger-row.md](ledger-row.md) for the rows.

## Template

```markdown
---
offer: <slug>
updated: YYYY-MM-DD
updated-by: ad-strategy
---

# Test plan: <offer>

## Deciding metric and bar
- Deciding metric: <from the offer file>
- Break-even: <figure, with the offer file's working quoted>
- Judging bar: about 90% confidence on the deciding metric, or the same direction across several periods; the most recent two to three days are not judged

## Volume, window and cadence
- Expected results per week: <figure> (source: snapshot | ledger history | business figure | assumption, stated)
- Time to a confident answer: ...
- Action session cadence: ...; next session: YYYY-MM-DD
- Hold rule: no new ads faster than the last batch can be judged

## Spend inside authority
- Ceilings (ads/authority.md): daily ..., monthly ...
- Testing share: ...; safe-to-bold mix: ...
- Capacity and calendar limits: <what holds or stops spend, with dates>

## Batch <yymm>-<letter>
Planned YYYY-MM-DD. Rows are in ads/ledger.md; this table repeats the plan for reading.
| ID | Plays | Customer type | Awareness | Format | Style | Breadth | Origin | Risk | Why it is tested |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

- Launch window: ...
- Location, in business terms: <exactly where the business can serve>
- Blocks launch: <gates still open, and who clears each>

## Rulebook for this offer (Proposed until confirmed)
- Pause rule: ...
- Budget band: <from ads/authority.md, or "none set, so no budget moves">
- Lookback: ...; days ignored: the most recent 2 to 3
- Fatigue check: ...
- Emergency stop conditions from the offer's limits: ...

## Assumptions
- <each one once, with what will replace it>
```

## Notes

- Every number in "Deciding metric and bar" is quoted from the offer file. A rule of
  thumb is not a bar.
- The batch table and the ledger agree; the ledger is the record, this table is for
  reading.
- The rulebook is applied by `ad-manage` at a session. Nothing in this file pauses an
  ad or moves budget by itself.
