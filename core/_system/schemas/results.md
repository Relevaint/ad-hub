# Schema: results snapshot and review

Folder in the business repo: `ads/results/`. Written by `ad-review` only, except that a
business may drop in a snapshot it pulled by hand (a plain table by ad ID is read as it
is). Two kinds of file: a snapshot (the numbers for a window, by ad ID, from both
sources) and a review (what they mean). The weekly creative report is a review with a
fixed shape. Rules behind it: [memory-contract.md](../memory-contract.md), "The ad ID
thread" and "Learnings"; [CONVENTIONS.md](../CONVENTIONS.md) section 8.

## Template: `results/<date>-snapshot.md`

```markdown
---
offer: <slug>
window: YYYY-MM-DD to YYYY-MM-DD
pulled: YYYY-MM-DD
updated-by: ad-review
platform-source: <connected tool | command-line tool | export by <role> on YYYY-MM-DD>
result-source: <CRM | checkout | booking tool | till>, matched by <tracking tag | ad ID in the record>
settling: platform figures for YYYY-MM-DD to YYYY-MM-DD are not final
---

# Snapshot, <window>

## By ad
| ID | Spend | Impressions | Reach | Frequency | Link clicks | 3-second plays | Landing views | Signal results (platform) | Results that count (source) | Value |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Columns the source did not give are left blank, not estimated. A hand-pulled snapshot
with fewer columns is read as it is.

## Unmatched
- YYYY-MM-DD: <a result that could not be tied to an ad, and why>. Stays unmatched.

## Notes
- Attribution setting in force; breakdowns pulled; anything missing and why.
```

## Template: `results/<date>-review.md`

```markdown
---
offer: <slug>
window: YYYY-MM-DD to YYYY-MM-DD
updated: YYYY-MM-DD
updated-by: ad-review
---

# Review, <window>

Question asked: "<the operator's words>"

## On the deciding metric
- Metric and break-even (offer file): <metric>, <break-even with working>
- Account: spend <...>, results <...>, <cost per result or ROAS> against break-even
- What the sample can say: n=<results>; bar <...>; the lag allows <...>; reading: <a call above the bar | direction only | too few to say>

## By ad
| ID | Spend | Signal results | Results that count | Cost per result or ROAS | Against break-even | Reading | Why |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Explained, not decided
- <ID>: hook rate <...>, link click rate <...>, landing views <...>: suggests <...>

## Roll-ups by tag
| Tag | Value | Ads | Spend | Results | Cost per result or ROAS |
| --- | --- | --- | --- | --- | --- |

## Outside events and changes in the window
- <date>: <change from ads/changes/ or event from the calendar or the business>

## Hand-backs
- To ad-strategy: do more <...>; do less <...>; experiment <...>
- To ad-manage: for the next session, <ID> against the pause line and the bar: <evidence>. Nothing paused here.
- To ad-setup: <signal issues, or none>

## Direction, not yet a learning
- <observation>, would become a learning when <...>

## Learnings written
- <the lines appended to ads/learnings.md>, or: none, below the bar

## What would settle the open questions, and when
- <evidence needed, and roughly how long at the current spend>

Numbers checked twice: yes, on YYYY-MM-DD.
```

## The weekly creative report

A review file named `results/<date>-weekly.md` with these sections in place of "By ad"
onward: Where the money went; Movers over seven days; New hits; Lessons; Hit rate (a
table of batch, launched, met the bar, rate); Second pass done.

## Notes

- A review pauses nothing and moves nothing. Its hand-backs carry the evidence.
- A learning line has a sample size and a source or it is not written.
- Results never leave the business repo. The hub holds no business's numbers.
