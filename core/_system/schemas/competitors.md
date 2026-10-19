# Schema: competitor research and swipe entries

Files in the business repo: `ads/research/competitors.md`, one per offer, and one file
per kept ad under `ads/research/swipe/`. Both written by `competitor-ads` only.
`ad-strategy` reads the patterns and tags any ad it plans from them with origin
"modelled on a competitor"; `ad-creative` may model structure from a swipe entry, never
words or images. Rules behind it: [CONVENTIONS.md](../CONVENTIONS.md) section 5.

**Two statuses only.** `Observed`: on the screen or the page, with a link and the date
seen. `Inferred`: a judgment about why or for whom. Nothing in between, and no number
the library did not show.

## Template: `research/competitors.md`

```markdown
---
offer: <slug>
updated: YYYY-MM-DD
updated-by: competitor-ads
---

# What others run: <offer>

Data: LIVE (n advertisers, m ads seen, k videos watched, YYYY-MM-DD)
Library opened: yes | no (<reason>). Where no: everything below comes from websites and pages, not from a library.
Shaped by: <offer file, audience file, learnings read>

## Who was looked at and why
| Advertiser | Why (alternative buyers named / direct / a few steps ahead / adjacent) | Library link | Date seen |
| --- | --- | --- | --- |

## Observed, per advertiser
| Advertiser | Active ads | Oldest active start | Started in last 90 days | Formats (image / video / carousel) | Longest-running ad: versions | Landing page(s) |
| --- | --- | --- | --- | --- | --- | --- |

## Observed, the ads kept
| Swipe entry | Advertiser | Started | Format | Hook (quoted) | Style | Message and proof | Offer and ask | Page | Seen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 20261008-example-01 | ... | YYYY-MM-DD | video | "..." | ... | ... | ... | <url> | watched / not seen: copy and thumbnail only |

## Measures across advertisers
- Launch pace: ... (Observed; counted as ...)
- Lifespan: ... (Observed)
- New concepts against variations: ... (Inferred)
- Format mix: ... (Observed)
- Core messages: ... (Inferred, from the ads kept)
- Repeated phrases: "..." (<advertiser>), "..." (<advertiser>) (Observed)
- Customer types addressed, by share of ads: ... (Inferred; names from research/audience.md)
- Reliance on offers: ... (Observed)
- What is missing: ... (Inferred)

## Patterns worth testing
For ad-strategy. Origin tag: modelled on a competitor. Adapt the structure, never the words.
- <pattern>, seen at <advertisers> (<swipe entries>). Adapt by: ... Tags it would carry: ...

## Not seen, and next refresh
- <what could not be opened or watched, and why>. Next run: ...
```

## Template: `research/swipe/<yyyymmdd>-<advertiser-slug>-<nn>.md`

```markdown
---
swipe: <yyyymmdd>-<advertiser-slug>-<nn>
advertiser: <name as the library shows it>
seen: YYYY-MM-DD
link: <library link to this ad>
started: YYYY-MM-DD
format: image | video | carousel
watched: full | not seen: copy and thumbnail only
screenshot: <same base name>.png | none
---

# <advertiser>: <what the ad does, in one line>

## Observed
- Hook: "<on-screen text or first line, quoted>"
- Style: ...
- Message and proof: ...
- Offer and ask: ...
- Call-out: ...
- Shapes and placements: ...
- Versions active: n
- Landing page: <url>. Headline "<quoted>". Proof shown: ... The ask: ... Friction: ...

## Inferred
- Who it addresses: ...
- Why it may keep running: ...

## Why kept
- What it teaches, and how it would be adapted for this offer without copying it.
```

## Notes

- Entry names sort by date. `<nn>` counts up within the day for one advertiser.
- Competitor copy is quoted only inside these files, attributed, and never carried
  into a brief or an ad as the business's own words.
- A screenshot is kept only when the platform took it. No file, no `screenshot:` value
  other than `none`.
- Delete nothing on a later run; add entries and update the tables with the new date.
