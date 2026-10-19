---
name: start-here
description: Turns an unclear or multi-step paid-ads request into the right first move, and records a new business or offer into the ads/ workspace from the facts the business supplies, with what blocks going live listed apart from what only improves the work. Use it first when a request does not name one job, when a business or an offer is new, or to check what is still missing before ads can run.
when_to_use:
  - help me get customers with ads
  - where do we start with ads
  - set up ads for this business
  - add a new offer
  - what do you still need before we can run ads
  - are we ready to launch
  - I want more bookings, leads or sales
metadata:
  adhub:
    version: 0.1.0
    layer: strategy
    reads:
      - ads.yaml
      - authority.md
      - calendar.md
      - offers/
      - offers/<offer>.md
      - platform/
      - ledger.md
      - learnings.md
    writes:
      - offers/<offer>.md
      - calendar.md
      - authority.md#who-can-approve
      - authority.md#per-offer
      - authority.md#pre-approved-at-level-2
      - authority.md#budget-band-per-offer
      - authority.md#risk-budget-per-offer
      - authority.md#second-lock-on-the-platform
    live: none
---

# start-here

The front door. A request arrives that does not name one job, or a business or an offer
is new, or someone asks what is still missing before ads can run. Done means three
things in one pass: the first useful move is made or named, the facts the business
supplied are recorded in `ads/` with a status on each, and the short list of what blocks
going live stands apart from what only improves the work. The judgment this skill
carries is knowing which facts gate what, and how to be useful from one sentence without
turning the session into a questionnaire.

## Context

Load what this skill declares:

```
node <hub>/core/_system/scripts/context.mjs --for start-here --root <business repo> [--offer <slug>]
```

The loader prints the `ads/` files that exist, names the absent ones, and lists the
business repo's other Markdown files by title. Open the ones whose titles promise facts:
what is sold, prices, how people book or buy, where the business works, reviews,
pipeline stages, compliance or brand rules. Read them by meaning. No file name is
required, and nothing is created outside `ads/`.

No `ads/` folder is normal for a new business. A sentence and a goal are enough to
start. Context improves the work; it never gates it. Going live has gates, and naming
them is this skill's job.

## Modes

- **Route.** The request is vague ("help me get customers") or spans several skills
  ("set up ads for this"). Decide the first useful move, do it when it is small, and
  name what follows.
- **Record.** A business or an offer is new. Create or extend the `ads/` workspace from
  the facts supplied, nothing more.
- **Readiness.** "What do you still need", "are we ready". Compare what is recorded
  against the gates and answer with the gaps, not with a form.

One request often uses two: record, then route. A specific single-asset request ("write
three ads") is not this skill's: say which skill owns it in one line and hand it over.

## Method

### 1. Find the offer

One offer is one thing sold, with one place the ad sends people and one place its real
result is recorded. A business with several things to sell gets one offer file per
thing, because funnel type and result source are set per offer. When the request does
not say which, take the one it is about, or the one with the clearest result and the
most value, and say which you took and why.

The slug is lowercase letters, digits and hyphens, short enough to live inside every ad
ID (`<offer>-<yymm>-<nnn>`). Once an ad ID exists for it, the slug never changes.

### 2. Work out the result loop

This is the decision the rest of the hub depends on. Pick from the four funnel types in
the memory contract by how the business actually gets paid, not by what its website
looks like:

| If the sale... | Funnel type | Result source | Deciding metric |
| --- | --- | --- | --- |
| completes online at the moment of purchase | direct online sale | checkout or payment platform | ROAS |
| needs a conversation first, and a status is recorded as it moves | lead, then sale | CRM or pipeline status | cost per qualified lead, then revenue |
| is a booked appointment or job that the booking itself commits | direct booking | scheduling or booking tool | cost per booking |
| happens in person, recorded at a till or on an invoice | in-person sale | point of sale or invoice | ROAS, uploaded afterwards |

Default shape (Observed, course review): send people straight to the offer. A low-value
offer has no other viable option. A high-value or considered offer changes the ask, not
the structure: a free estimate, a booking, a call. That ask is what makes it "lead, then
sale" or "direct booking".

The result that counts is the real outcome in plain words. The signal sent to the
platform is the earliest status that marks a real buyer and arrives soon enough for the
platform to learn from it; later statuses are still recorded for review. How that
signal is sent is the platform layer's business and `ad-setup`'s job. Core files never
carry it.

When the business has no system that records the result yet, that is the first live
gap. Name it, and offer the lightest options as Proposed. Do not pick one for them.

### 3. Record what was supplied

Every fact in a file carries a status and names its source:

- **Owner-confirmed**: the operator said it in this session, or the business wrote it
  about itself in its own files. Name the file.
- **Observed**: seen in a third-party source, such as a review export or a platform
  report. Name the source and its date.
- **Proposed**: something you worked out, such as a break-even figure or a funnel type
  the business did not state. Show the working.
- **unknown**: nothing supplied. It stays `unknown`. A typical figure for the industry is
  not a fact about this business.

Fill the offer file from the schema (`core/_system/schemas/offer.md`).
`references/intake.md` lists each fact, why it matters, where it tends to sit in a
business's own files, and what it blocks; load it when recording a new offer or when
the readiness check finds gaps. Work out break-even when the numbers exist and mark it
Proposed with the arithmetic visible, so a wrong input is easy to spot.

Proof is the only source of claims an ad may make. Record only what is traceable: the
review export, the credential, the number with where it comes from. Where the business
requires a release for testimonials, a story without one is recorded with that note,
not as usable proof.

Three things never go in the offer file: a guess, a platform setting, and a compliance
or identity string. Where the business keeps exact legal or brand strings, point to that
file and leave the strings there.

### 4. Split the gaps

The schema's markers decide the buckets. Report them apart, and keep each short:

- **Blocks going live.** The `[live]` fields: where the ad sends people, funnel type,
  result source, result that counts, deciding metric, restricted category. Plus two the
  offer file does not hold: recorded spend authority (`ads/authority.md`; no file means
  read-only), and a test of the real result seen arriving on the platform (recorded by
  `ad-setup` in `ads/platform/`). For a local offer, the service area belongs here too:
  the platform is told exactly where the business can serve, and nothing else.
- **Blocks confident scaling.** The `[scale]` fields: order value, margin,
  lead-to-customer rate where there is one, and break-even. Drafting and a first small
  test proceed without them; raising budget with confidence does not.
- **Improves the work.** Everything else. Write these into the file's Gaps section and
  do not ask for them now.

Say who clears each live gap: the business (a decision or a fact), or which skill (a
test event is `ad-setup`'s). Never ask for a fact that is already recorded; the
readiness check reads the files first and names only what is still missing.

### 5. Make the first move

The answer carries a next step the person can act on today, in the same reply as the
gaps. Shapes:

- **New business, a sentence of context.** Name the first ad's job in one line (the ask
  that fits the offer's value), give two to four angle directions in plain words with
  the fact each would need confirmed before it could run, and the order of skills with
  why. Angles here are proposals that point `ad-strategy` and `ad-creative`; they carry
  no claim, number or quote the business did not supply. Label the whole thing
  `Data: MODEL KNOWLEDGE (verify before spending)`.
- **Existing offer, vague request.** Read the ledger and the latest results if any,
  name the one job that moves things, and start it or hand it to its skill with what it
  needs.
- **Multi-step request.** Three to five steps, each naming the skill and what it
  produces, with the first done now when it is small.

Not a workshop: the only questions asked out loud are the live gaps, and only when the
request is about running ads. Everything else waits in the Gaps section for when it
matters. "Help me get bookings" gets a path and three questions, not a template to fill.

### Authority

`ads/authority.md` is the business's file. This skill records a decision the business
states explicitly in the session, with the date, who said it and what exactly, in their
words. It never infers a level, a ceiling, a band or a pre-approval, and it never fills
a blank with a safe-looking default: a blank already reads as the safest value (no level
means read-only, no ceiling means nothing may spend).

A spend amount mentioned in passing ("put them live with $20 a day") is a wish, not a
decision. Ask once whether to record it as the daily ceiling and at which level; record
it only on a yes, from someone named in "Who can approve", or from the owner when no file
exists yet. When no file exists and no decision is stated, do not create one.

An approval heard in chat is appended to the approvals log before anything acts on it,
by whichever skill heard it, quoting the words used. This skill does the same and
changes nothing else in the file.

### Calendar

Record into `ads/calendar.md` only what the business supplies: recurring seasons and
what they mean for spend, fixed-date promotions with their real end dates, capacity
windows, and any outside event the business names. Schema:
`core/_system/schemas/calendar.md`. A date written here is a true date; urgency in an ad
later rests on it (README hard rule 4). Capacity windows go here and in the offer's
Limits.

## Quality gate

Before writing the summary, check the files:

- Every fact carries a status and a source. Nothing came from your own knowledge of the
  industry.
- The funnel type matches how the business gets paid, and the result source is a real
  system the business named, or the gap is recorded.
- Break-even, if present, shows its working and is marked Proposed.
- The live list is short, each item names who clears it, and nothing on it is already
  recorded in a file.
- No platform setting, click path or spec appears in any core file. No compliance or
  identity string was copied or paraphrased.
- Nothing about this business was written into the hub, and nothing was written outside
  `ads/`.
- Say in a line what shaped the output (which files, how old), so stale context gets
  caught.

## Output

Files first, inside the business repo's `ads/`:

- `offers/<slug>.md` from the offer schema, `updated-by: start-here`. Change an existing
  file by adding to it; the repo's history keeps the earlier version. When a new
  statement contradicts a fact the business wrote, record both with their dates and ask;
  never silently replace it.
- `calendar.md` when the business supplied dates or seasons.
- `authority.md` only from an explicit decision, as above.
- `ads.yaml`, the manifest (`core/_system/schemas/manifest.md`), created with the first
  offer and updated for each file written.

Then the summary in chat. It is not a second copy of the file: one line on what was
recorded and where, the first move, the live gaps as a list with who clears each, and
the next two to four skills. About twenty lines for a new business; a readiness check is
often ten. Detail belongs in the files, where the next skill will read it. A specific
request gets a direct answer, not a tour of the hub.

## What's next

- `ad-setup` when the result loop is defined but no test of the real result has been
  seen on the platform, or no platform file exists. It owns the signal path and the
  account baseline.
- `audience-research` when the offer file says who it is for but nothing in the repo
  says what those people say in their own words.
- `ad-strategy` when research exists, or the business wants a test plan before
  creative: it owns the diagnosis, the angles, the ad IDs and the plays to test.
- `ad-creative` when a first draft is what the person wants to see today. It drafts
  from a sentence; its claims gate on the proof table, not on the research.
