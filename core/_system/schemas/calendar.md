# Schema: calendar file

File in the business repo: `ads/calendar.md`, one per business. The business owns it.
`start-here` records the dates and seasons the business supplies; `ad-review` appends
observed outside events. Rules behind it: [memory-contract.md](../memory-contract.md),
"The ad workspace" and "Who writes what".

**Why it exists.** Ads should spend into strong seasons, pull back when the business is
full, and stop before a promotion's real end date. An urgency claim in an ad later rests
on a date written here, so every date is a true date (README hard rule 4).

**Status labels.** As in every file: `Owner-confirmed`, `Observed` (with the source), or
`Proposed`. The business may keep its own flat list instead of the headings below;
`start-here` adds to whatever shape it finds and does not reorganise it.

## Template

```markdown
# Calendar

One line per item. Recurring patterns first, then fixed dates, then outside events.

## Recurring
- Every year, <months or dates>: <what happens, and what it means for spend: full by..., quiet...> (status)

## Fixed dates
- YYYY-MM-DD to YYYY-MM-DD: <promotion, launch or opening, with its real end date> (status)

## Outside events
Appended by ad-review. Dated, one line each, with the source.
- YYYY-MM-DD: <something outside the account that could have moved results> (Observed, <source>)
```

## Notes

- A capacity window ("both crews full by mid-October") goes here and in the offer file's
  Limits, because it feeds the emergency stop in
  [spend-authority.md](../spend-authority.md).
- A promotion with no fixed end date is recorded without one. The ad copy then cannot
  claim one.
- Outside events are observations, never excuses: `ad-review` notes them before blaming
  a change, and still reports the numbers.
