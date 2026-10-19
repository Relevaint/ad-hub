---
name: competitor-ads
description: Shows what other advertisers are running and what can be learned from it, from ads actually seen in a public ad library and landing pages actually read, with what was observed kept apart from what is inferred and no competitor ad ever called profitable. Use when strategy needs outside reference points, when the business names a competitor, or when buyers keep comparing the offer with an alternative.
when_to_use:
  - what are competitors running
  - what ads is this company running
  - show me examples from other brands
  - build a swipe file
  - what do other businesses like us advertise
metadata:
  adhub:
    version: 0.1.0
    layer: research
    reads:
      - offers/
      - offers/<offer>.md
      - research/audience.md
      - research/competitors.md
      - research/swipe/
      - learnings.md
    writes:
      - research/competitors.md
      - research/swipe/
    live: none
---

# competitor-ads

What others run, and what can be learned from it. Done means two things in the business
repo: `research/competitors.md`, with what was observed about each advertiser's ads (how
many, how long, which formats, which messages, which offers, which pages) kept apart
from what is inferred, and the patterns worth testing handed to `ad-strategy`; and
`research/swipe/`, the few ads worth keeping, each with a link and the date it was seen.
The judgment this skill carries is reading public signals for exactly what they are,
choosing who is worth looking at, and saying plainly what was not seen.

## Context

```
node <hub>/core/_system/scripts/context.mjs --for competitor-ads --root <business repo> --offer <slug>
```

Read the offer file for what is sold and who it is for. Read `research/audience.md` for
the alternatives buyers named in their own words; those are the first advertisers to
look at. Existing competitor research and swipe entries are added to, never restarted.
Read the learnings for the offer: if an ad modelled on a competitor has run for this
business before, its result outranks any new observation.

No research files yet is fine. Work from the offer and the request.

## Who to look at

In this order, until five to eight advertisers are in hand or the patterns repeat:

1. The alternatives buyers named in `research/audience.md`, including the alternative
   that is not a company (the shop, doing it yourself, doing nothing) when a business
   advertises against it.
2. Direct competitors the business names.
3. Businesses a few steps ahead in the same category. Not the giants: brand equity makes
   their ads misleading models (Observed, course review).
4. Adjacent, more sophisticated industries with the same buying moment. A mobile
   mechanic learns from mobile dog grooming; a consultant from a law firm.

## What a public ad library can and cannot tell you

A library shows what runs: when an ad started, whether it is active, where it shows,
how many versions it has, and in some regions and categories a reach or spend range.
The platform layer says exactly which fields exist on which platform and for which ads
(`meta-system/references/ad-library.md` for Meta). It never shows results, and outside
restricted categories it does not show spend.

So the only honest signals are these, and they are signals, not proof:

- **Long-running.** An ad active for months is one the advertiser keeps paying for.
- **Many versions.** An ad with many active variants is one they keep iterating.
- **Launch pace.** Many new ads in ninety days means a creative engine, not a winner.

"Profitable", "winning", "working" and "best-performing" are never written about a
competitor's ad. Write "has run since", "has N active versions", "was relaunched on".
Two sources in the hub disagree about how much to lean on competitor ads at all
(`source-notes/conflicts.md`); this skill supplies the input, `ad-strategy` weighs it
against the business's own gaps, and the ledger's origin tag lets results decide.

## Method

### 1. Set the question

One line: what are we trying to learn, for this offer and these customer types. Usually
one of: the formats and messages in use, the offers and asks, the pages the ads send
people to, or where the gaps are. Everything that does not answer it is noise.

### 2. Pull each advertiser's active ads

Record per advertiser, as Observed with the link and the date seen: the active ad
count, the oldest start date among active ads, how many started in the last ninety
days, the format mix, the number of versions on the longest-running ads, and the
landing pages. `references/reading-an-ad.md` says how each measure is counted from the
library's fields; load it before the pull.

### 3. Read the ads worth keeping

Keep the long-running ones, the ones with many versions, and the ones that do something
nobody else does. For each, break it down: the hook as text, first frame and sound; the
style; the message and the proof offered for it; the offer and the ask; who it calls
out; the format and shapes; whether it is a creator or partnership ad. A video not
watched is recorded as `not seen: copy and thumbnail only`. Nothing about a video's
content is written from its thumbnail.

### 4. Click through

The landing page is part of the ad. Open it and read it: the headline, the proof shown,
the offer, the one ask, the friction. Note where the page and the ad disagree. A page
that could not be opened is recorded as not reached.

### 5. Keep Observed apart from Inferred

Observed is what was on the screen or the page, with a link and a date. Inferred is who
the ad addresses, why it might keep running, what it suggests about the advertiser's
strategy; it is labelled Inferred every time. A number the library did not show (spend,
results, budget) is never written, not even as a guess. Verbatim lines from a
competitor's copy are quoted and attributed in the swipe entry, and used nowhere else.

### 6. Patterns and gaps

Across the advertisers: what everyone says (table stakes), what nobody says (the gap),
formats and customer types nobody addresses, how much everyone leans on discounts and
free offers. Write each pattern as a candidate for `ad-strategy`, with the advertisers
it was seen at and how it would be adapted. Adapt, never duplicate: a copied ad is a
policy risk, a legal risk and the weakest strategy two of the hub's sources agree on.

### 7. The swipe file

One entry per kept ad in `research/swipe/`, named `<yyyymmdd>-<advertiser-slug>-<nn>.md`,
from the schema. When the platform can take a screenshot, save it beside the entry
with the same base name. Keep few: the entries that teach something, not everything
seen. The entry carries the link; the library page is the record, not a copy of it.

### When the library cannot be opened

Some platforms cannot open a public ad library (bot challenge, login wall, a page that
needs a real browser). Then: say so first, in the file and in chat; record nothing from
the library as Observed; use what can be read, which is usually the competitors'
websites and landing pages, their public posts where reachable, and directory listings;
and label the file's data line with what was actually seen. A library that half works is
common: an empty result on one attempt is unconfirmed, so retry once before writing that
an advertiser has no ads, and when only keyword search works, record every count as a
lower bound. Where a platform's official
connector offers library search with the business's own login, use it read-only
(`meta-system/references/platform-tools.md`); it changes nothing on any account.

## Quality gate

Before writing the summary, check the files:

- Every Observed line has a link and the date seen. Every inference is labelled Inferred.
- No competitor ad is called profitable, winning, working or best-performing. No spend
  or result figure appears unless the library showed it, with the field named.
- Every video not watched is marked not seen. Nothing is described from a thumbnail as
  if watched.
- No competitor copy is handed over as the business's own copy. Claims the business may
  make still come from its own proof table, not from what a competitor claims.
- Nothing about this business was written into the hub; nothing was written outside
  `ads/research/`.

## Output

Files first, inside the business repo's `ads/research/`:

- `competitors.md` from `core/_system/schemas/competitors.md`: who was looked at and why,
  the observed table per advertiser, the ads kept, the measures, the inferences, the
  patterns worth testing, and what was not seen.
- `swipe/<entry>.md` per kept ad, from the same schema, with a screenshot beside it when
  one could be taken.

Then the chat summary, short: who was looked at, two or three patterns, the gap, what
was not seen, and the next skill. Say what shaped the output.

## What's next

- `ad-strategy` weighs these patterns against the business's own research and gaps,
  picks what to test, and tags each ad's origin. It is the normal next step.
- `ad-creative` may model the structure of a swipe entry, never its words or images.
- `audience-research` when the public comments on a competitor's ads show objections
  worth mining; those are buyers speaking, and that skill owns them.
