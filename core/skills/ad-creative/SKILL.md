---
name: ad-creative
description: Writes the copy and makes the finished ads for a planned batch, per placement, and checks each one against the offer's proof table, the platform's policies and the business's own rules before handoff. Every claim traces to recorded proof or is a marked blank, every ad does one job at a glance, and a finished ad is a produced, inspected asset, not a brief. Use when a planned batch needs its ads, when one ad or copy variant is wanted now, when a winner needs new hooks, or when existing copy needs a claims and policy check.
when_to_use:
  - write the ads for this batch
  - write copy for the planned ads
  - write three ads
  - make an ad from this story
  - new hooks on our winning ad
  - check this copy for claims and policy
metadata:
  adhub:
    version: 0.1.0
    layer: creative
    reads:
      - offers/
      - offers/<offer>.md
      - calendar.md
      - research/audience.md
      - research/voc.md
      - research/competitors.md
      - research/swipe/
      - strategy/diagnosis.md
      - strategy/test-plan.md
      - ledger.md
      - creative/
      - learnings.md
    writes:
      - creative/<batch>/
      - ledger.md#status-planned-to-creative-ready
    live: none
---

# ad-creative

Makes the ads. Done means, for each planned row, the copy per placement, the finished
asset at the shapes those placements need, the render inspected at the size it will be
seen, and the ledger row moved to copy-ready or creative-ready. Every claim in the ad
traces to a row in the offer's proof table or stands as a marked blank. Every ad does
one job and is understood at a glance. The judgment this skill carries is knowing what
counts as a claim, knowing when a hook is a hook, and knowing when an ad is not
finished yet.

## Context

```
node <hub>/core/_system/scripts/context.mjs --for ad-creative --root <business repo> --offer <slug>
```

Read, in this order: the offer file (the proof table is the only source of claims; the
limits and the restricted category set the rules), the business's own files by meaning
for its compliance strings, identity strings and voice (read them from the file that
holds them; never paraphrase a required string), the research files for the words
buyers use, the diagnosis for the pillar and angle each row serves, the test plan for
the batch, the ledger rows marked `planned`, the existing creative folders, and the
learnings for this offer. A learning that a hook or format failed here outranks a play.

Thin context is normal. No research: write from the offer and the business's own
description, and label the output `Data: MODEL KNOWLEDGE (verify before spending)`. No
plan and no ledger: Quick mode below. Nothing is ever gated on research; claims are
gated on proof.

## Modes

- **Batch.** Make every `planned` row in a batch. The default when a plan exists.
- **Quick.** One ad or a copy variant now, from a specific request. The asset, not a
  workshop. Rows that do not exist yet are drafted under `creative/<yymm>-drafts/`,
  numbered, with a line saying `ad-strategy` gives them IDs; the file moves under its
  ID then. Quick mode never waives a hard rule.
- **Remix.** New hooks on a proven body, or a proven hook on a new body (plays
  `hook-swap-on-winner`, `hook-body-hybrid`). The row for a remix comes from
  `ad-strategy` as a revision or a new ID; this skill makes it.
- **Check.** A claims and policy check of copy that already exists, written as a check
  report in the batch folder. No rewrite unless asked.

## Method

### 1. Take the brief from the row

The ledger row is the brief: the plays, the customer type, the awareness level, the
format, the style, the breadth, and the sentence saying what this ad tests. That
sentence is the ad's one job. Select the opening dynamic from
`references/opening-dynamics.md` using the row's awareness level plus the surface;
the dynamic sets when the product enters and which mechanisms fit. Add the pillar
and angle from the diagnosis, the lines
from `research/voc.md` for that customer type (by ID), and the proof rows the ad may
lean on. One customer type, one awareness level, one goal per focused ad (Observed,
static-ads review). A broad ad is tagged broad and still has one goal.

### 2. Run the claims gate before writing a word

List every factual thing the ad will say or show: a number, a rating, a review, years,
a credential, a guarantee, a speed, a price, a result, a story, a comparison, urgency,
scarcity. Each one maps to a row in the offer's proof table, Owner-confirmed or
Observed with its source, or it is cut. A fact that would help and is not on file
becomes a marked blank in the draft, `[confirm: years in business]`, never a guess.
Testimonials are real people who gave permission; a story without permission is not
used, in any disguise, and the reply says so in one line. An AI-made person is never
presented as a customer. Urgency and scarcity are true and dated from the calendar or
the offer's limits. `references/claims-and-policy.md` has the full gate; load it for
every batch and every check.

### 3. Run the policy and rules check

Never describe the viewer by a personal attribute, directly or by implication: not
their age, family status, health, money troubles, race, religion, or anything the
platform lists. Describe the situation or the product instead: "outgrown your home" is
a situation; "young family" is an attribute. Call-out plays (`copy-callout`,
`hook-if-you`) pass this check or are not used. Where the business keeps compliance
strings, use them exactly as written where the format has room, and read them from the
file every time. A restricted category brings its own rules from the offer file and the
platform layer; apply them before writing. The platform's own list and examples live in
the platform layer (`meta-system/references/policy-notes.md` for Meta).

### 4. Write the copy

The hook first. A hook is three things at once, what the viewer reads, what they hear,
and what is in the first frame (Observed, hooks review); write all three, even for a
static (the first frame is the image). Then the body, per the play. Copy principles
from the reviews, all defaults: specific beats broad; lead with a real number when one
exists; call out the situation; clear beats clever, no puns; the desire is the headline
and the product is the means; open a loop the landing page closes; name the fear
yourself; lift a striking phrase from a real review when it is cleared; say who it is
not for. Use the buyers' own words from `research/voc.md`, quoted accurately and cited
by ID in the brief; a private line is language, never a testimonial, until cleared.

Customer-facing copy follows the hub's copy standard: no em dashes, no emojis, plain
language, no filler, no hedging (`AGENTS.md`, doctrine 10). The business's voice comes
from its own files; the hub has none. Write the fields each placement needs, within the
platform layer's lengths, and up to several texts and headlines inside one ad where the
platform allows it (`copy-multi-text`). `references/copy-and-hooks.md` carries the hook
spec, the structures and the rubric anchors.

### 5. Make the asset

Production tools are whatever the operator has connected: an image model, a video or
avatar tool, a design tool, a camera roll the business supplied. None is hard-coded, and
none is required: when nothing can produce the asset here, the output is the copy plus a
production brief (shot list, on-screen text, first frame, sound, shapes), the row stays
`copy-ready`, and the reply says so. Shapes come from the platform layer
(`meta-system/references/placements.md` for Meta): a square or 4:5 base and a dedicated
vertical edit, never a crop (Observed, course review); text and logos inside the safe
zones; captions burned in so the ad reads with sound off. Generated imagery may change a
background or a setting; it never misrepresents the product, the place or a person, and
generated text and figures are checked letter by letter.

### 6. Inspect the render

Open the actual file at the size it will be seen: a phone-width feed card, a full-screen
vertical. Check the glance test (what is sold, for whom, in one second), the one job, the
hook in the first frame and first three seconds, text inside the safe zones, nothing cut
off, no typo, every claim identical to the gated draft. Score against the rubric in
`references/copy-and-hooks.md`, revise the weak part, rescore; three passes at most,
then present the best with its history (CONVENTIONS section 8). A video is inspected by
watching the render. When the platform cannot render or play the file, say so and leave
the row at `copy-ready`; an uninspected asset is not a finished one.

### 7. Move the row

`planned` to `copy-ready` when the copy and the claims map are done; `copy-ready` to
`creative-ready` when every shape exists and was inspected. Update the row's status and
date, nothing else. IDs, tags and the reason belong to `ad-strategy`.

### What this skill never does

It never invents a claim, a quote, a number or a person. It never claims an ad was
tested or will perform. It never copies a competitor's words or images; a swipe entry is
modelled for structure only. It never touches a live account; approved ads reach it
through `ad-launch`.

## Quality gate

Before writing the summary, check every ad:

- Glance test: a stranger says what is sold and for whom in one second.
- One job, and it is the sentence in the ledger row.
- Hook written as text, sound and first frame.
- Every claim maps to a proof row; every missing fact is a marked blank; no testimonial
  without permission; no AI-made customer; urgency and scarcity true.
- No personal attribute asserted or implied; required strings exact and in place;
  restricted-category rules applied.
- Copy standard met: no em dashes, no emojis, plain, specific.
- Every shape the placements need exists, in the platform layer's dimensions, with text
  in the safe zones; the vertical is an edit, not a crop.
- Render inspected, or the row left at `copy-ready` with the reason.
- Buyers' words quoted accurately and cited.
- The output is labelled with the data it rests on, and says it is untested.

## Output

Files first, inside the business repo's `ads/creative/<batch>/`:

- `<ID>.md` per ad from `core/_system/schemas/creative.md`: brief, claims map, copy per
  placement, asset table, checks, production brief where needed.
- `<ID>-<shape>.<ext>` per shape made and inspected, beside it.
- Drafts without IDs under `creative/<yymm>-drafts/`, named `draft-01.md` onward.

Then the ledger rows moved, and the chat summary, short: the ads in a table (ID, hook,
job, status), the blanks the business must confirm, anything that could not be made or
inspected here, and the next skill.

## What's next

- `ad-setup` when the offer's result signal has not been seen arriving on the platform;
  nothing goes live before it has.
- `ad-launch` when the rows are `creative-ready` and the business has approved them in
  `ads/authority.md`.
- `ad-strategy` for IDs and rows when drafts were made in Quick mode, and for the next
  batch when results are in.
- `ad-review` after the window: it says which hooks and bodies earned a remix.
