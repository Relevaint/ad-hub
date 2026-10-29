---
name: ad-creative
description: Develops ad concepts through separate creative passes and rejection gates, then writes copy and produces only the assets requested. Cast and rendering are independent choices; openings earn attention and product payoffs fulfill them. Use for video or image concepts, planned ads, a single asset, new hooks, or claims and policy checks. Concepts are not finished assets.
when_to_use:
  - give me video and image ad concepts only
  - brainstorm ad ideas without generating assets
  - write the ads for this batch
  - write copy for the planned ads
  - write three ads
  - make an ad from this story
  - new hooks on our winning ad
  - check this copy for claims and policy
metadata:
  adhub:
    version: 0.4.0
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

Develops concepts and makes ads, within the requested scope. Run the required passes
in [creative-passes.md](references/creative-passes.md) for every new concept or creative
change. A concept is done after rejection/revision; a finished ad additionally requires
a produced, inspected asset. Claims trace to the offer's proof or remain marked blanks.

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
plan and no ledger: Concepts or Quick mode below, according to the request. Nothing is ever gated on research; claims are
gated on proof.

## Modes

- **Concepts.** Ideas, pitches or storyboards only, even when a production plan exists.
  Run Passes 1–6, present only survivors, and stop. Do not generate media or move ledger
  rows to `copy-ready` or `creative-ready`. Default to chat for a concepts-only request;
  save a concept record only when requested or an existing business workflow requires
  it. A mixed request (concepts plus one image) authorizes only that image's production.
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

Read `references/creative-passes.md`, `references/opening-dynamics.md`,
`references/copy-and-hooks.md`, `references/composition-review.md` and
`references/claims-and-policy.md` before drafting.
The required sequence is fundamentals -> premises -> independent casting/treatment ->
visual stop -> connected hook/turn/offer -> adversarial concept review -> authorized
production/render review. Each pass produces a short decision record and has a return
path. Do not collapse them into one checklist performed after writing. Steps below
supply the brief, truth checks, copy and production mechanics inside those passes.


### 1. Take the brief from the row

The ledger row is the brief: the plays, the customer type, the awareness level, the
format, the style, the breadth, and the sentence saying what this ad tests. That
sentence is the ad's one job. Select the opening dynamic from
`references/opening-dynamics.md` using the row's awareness level plus the surface;
the dynamic sets when the product enters and which mechanisms fit. Add the pillar
and angle from the diagnosis, the lines
from `research/voc.md` for that customer type (by ID), and the proof rows the ad may
lean on. One customer type, one awareness level, one goal per focused ad (Observed,
static-ads review). A broad ad is tagged broad and still has one goal. Before concepts,
apply Pass 1's actual-destination and brand/cultural-context review. Record reviewed
sources and unavailable-page gaps; derive creative choices without inferring people's
demographics or importing another client's casting direction.

### 2. Run the claims gate before writing a word

List every factual thing the ad will say or show: a number, a rating, a review, years,
a credential, a guarantee, a speed, a price, a result, a story, a comparison, urgency,
scarcity. Each one maps to a row in the offer's proof table, Owner-confirmed or
Observed with its source, or it is cut. A fact that would help and is not on file
becomes a marked blank in the draft, `[confirm: years in business]`, never a guess.
Testimonials and purported real customer stories require recorded permission; an
uncleared customer story is not used in any disguise, and the reply says so in one line. An AI-made person is never
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

### 4. Develop and reject concepts, then write the copy

Complete Passes 2–4 of `references/creative-passes.md` before polishing language:
compare distinct premises, choose cast separately from rendering, and test the actual
opening image. Pass 5 connects the opening, turn, product payoff and action. Pass 6
rejects failures before presenting concepts or producing assets; use its explicit
thresholds and revision paths. Concepts mode stops there.

For production copy, the hook first. A hook is three things at once, what the viewer reads, what they hear,
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

### 5. Make only the authorized asset

Only after the concept passes. Concepts-only and copy-only requests do not authorize
media generation. A requested image does not authorize producing the accompanying video.

Production tools are whatever the operator has connected: an image model, a video or
avatar tool, a design tool, a camera roll the business supplied. None is hard-coded, and
none is required: when nothing can produce the asset here, the output is the copy plus a
production brief (shot list, on-screen text, first frame, sound, shapes), the row stays
`copy-ready`, and the reply says so. Produce only the requested number of assets and shapes. Use the platform layer
(`meta-system/references/placements.md` for Meta) for the chosen shape's specs. When a
batch explicitly needs both feed and vertical, make a dedicated vertical edit, not a
crop (Observed, course review); a one-image request does not authorize extra ratios.
Text and logos stay inside the safe zones; captions burned in so the ad reads with sound off. Generated imagery may change a
background or a setting; it never misrepresents the product, the place or a person, and
generated text and figures are checked letter by letter.

### 6. Inspect the render

Open the actual file at the size it will be seen: a phone-width feed card, a full-screen
vertical. Check initial attention separately from product clarity at the reveal (or the whole
static at a glance), the one job, the hook in the first frame and first three seconds, text inside the safe zones, nothing cut
off, no typo, every claim identical to the gated draft. Repeat the composition /
hierarchy review on the actual render: remove or subordinate competing details without
losing the premise, context, disclosures or product/action clarity. Richness may be
intentional; minimalism is not the gate. Score against the rubric in
`references/copy-and-hooks.md`, revise the weak part, rescore; three passes at most,
then present only passing work with its history (CONVENTIONS section 8). Failed work
is labelled not ready; reaching the revision limit does not waive a gate. A video is inspected by
watching the render. When the platform cannot render or play the file, say so and leave
the row at `copy-ready`; an uninspected asset is not a finished one.

### 7. Move the row

`planned` to `copy-ready` when the copy and the claims map are done; `copy-ready` to
`creative-ready` only when every shape required by the authorized placement scope
exists and was inspected. A single requested preview does not complete a broader
planned placement set; leave that row `copy-ready` and name the missing shapes. Update the row's status and
date, nothing else. IDs, tags and the reason belong to `ad-strategy`.

### What this skill never does

It never invents factual claims, quotes, numbers or customer identities. Clearly
fictional casts and illustrative scenes are allowed, never as fabricated proof. It never claims an ad was
tested or will perform. It never copies a competitor's words or images; a swipe entry is
modelled for structure only. It never touches a live account; approved ads reach it
through `ad-launch`.

## Quality gate

Before writing the summary, check every ad:

- Required creative passes recorded; cast and rendering chosen independently.
- Destination/brand sources reviewed or gaps stated; casting, setting, visual language
  and voice grounded in the explicit brief. Batch checked for unintentional sameness
  and ad-to-page mismatch, without quotas, stereotypes or targeting changes.
- Cold visual openings pass the visual-alone stop test; other dynamics have the
  applicable test and reason recorded. No headline rescue for a generic frame.
- Product clarity at the reveal/complete proposition; static understood at a glance.
- Composition / hierarchy reviewed separately; competing details reworked, distinctive
  premise preserved, purposeful richness allowed. Actual pixels checked if produced.
- Concept review passes all gates and rubric thresholds. No weak idea padded into the
  set to reach a count; no aggregate score hides a failed gate.
- One job, and it is the sentence in the ledger row.
- Hook written as text, sound and first frame.
- Every claim maps to a proof row; every missing fact is a marked blank; no testimonial
  without permission; no AI-made customer; urgency and scarcity true.
- No personal attribute asserted or implied; required strings exact and in place;
  restricted-category rules applied.
- Copy standard met: no em dashes, no emojis, plain, specific.
- Only authorized assets/shapes produced, in the platform layer's dimensions and safe
  zones. Missing planned placement shapes are named, not generated beyond scope.
  An authorized vertical is an edit, not a crop.
- For production, render inspected or row left at `copy-ready` with the reason.
  Concepts remain concept records, not asset statuses; no ledger promotion.
- Buyers' words quoted accurately and cited.
- The output is labelled with the data it rests on, and says it is untested.

## Output

Concepts-only: concise concepts in chat by default, including audience/job, concrete
visual, cast/treatment, turn/product payoff, key copy/CTA and one-line review verdict.
Do not show every worksheet unless requested. If saved, use the concept record in
`core/_system/schemas/creative.md`; do not create assets or promote ledger statuses.

Copy and production: files first, inside the business repo's `ads/creative/<batch>/`:

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
