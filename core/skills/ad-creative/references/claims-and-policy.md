# Claims and policy: the gate every ad passes before handoff

Load for every batch, every quick request and every check. The gate is a hard rule
(README hard rule 4; `core/_system/spend-authority.md`, "Gates before anything goes
live"). The platform's own policy text and examples live in the platform layer.

## What counts as a claim

Anything a reader could take as a fact about the business, the product or its results:

- numbers (customers, reviews, years, savings, sizes, speeds, prices, discounts)
- ratings and review counts
- quotes, testimonials, stories, before-and-after
- credentials, licences, insurance, awards, press
- guarantees and refund terms
- comparisons ("better than", "cheaper than", "the only")
- urgency ("ends Friday") and scarcity ("three slots left")
- any statement about what the product does or does not do

Implied claims count: a photo of a crowd implies customers; a lab coat implies a
credential; "trusted by" implies a count.

## The gate

1. List every claim the ad will make or imply.
2. Map each to its source. Facts about the offer itself (what it is, what it costs, how
   it is delivered, the refund or guarantee terms as stated, where the ad sends people)
   come from the offer file's `Owner-confirmed` lines. Anything that supports a claim
   about quality, results, trust or scale (a rating, a review, a credential, a number of
   customers, a story, a result) comes from the offer's proof table, `Owner-confirmed`
   or `Observed` with its source. A `Proposed` line is not proof of anything.
3. Anything unmapped is cut, or becomes a marked blank `[confirm: ...]` in the draft.
4. Testimonials and stories: a named, real person who gave permission the business
   recorded. No permission, no use, in any disguise, paraphrase or composite. Say so in
   one line and offer what is cleared.
5. People: an AI-made or stock person may present or demonstrate; they are never
   presented as a customer, a reviewer or the founder.
6. Urgency and scarcity: true, dated, and traceable to `ads/calendar.md` or the offer's
   limits. A promotion with no end date has no "ends soon".
7. Comparisons: against the default alternative in general terms, or against a named
   party only with proof on file and the business's say-so.
8. Before-and-after, health and money outcomes: some categories restrict or ban them on
   some platforms; check the platform layer and the offer's restricted category.
9. Generated imagery: backgrounds and settings may be generated; the product, the place
   and any real person are not altered into something they are not; generated text and
   figures are read letter by letter.
10. Write the claims map into the ad's file. The map is part of the deliverable.

## Personal attributes

Never assert or imply a personal attribute of the viewer: age or age group, family or
marital status, health or a condition, financial situation, race, ethnicity, religion,
sexual orientation, gender identity, disability, criminal record, or that you know their
name. Both direct ("are you over 50?") and indirect ("meet other parents") forms fail.
Describe the situation, the product or the service instead: "outgrown your home" not
"growing family"; "gutters full of leaves" not "older homeowner"; "a service for new
gardeners" is fine, "you're a beginner, aren't you" is not. "You" and "your" are fine
when the sentence names no attribute. Call-out plays pass this check or are not used.
The platform's own list and worked examples are in the platform layer; read them for
the platform the ad will run on.

## Restricted categories

The offer file names the category in plain words (housing, employment, credit and
financial products, social issues and politics, and locally restricted categories such
as health, alcohol, gambling or dating). For these: the platform's category rules apply
on top of everything above, targeting by protected attributes is off the table and must
not be suggested in a brief, and the business's compliance file governs required
strings and forbidden promises. Where the business bans describing a neighbourhood or a
buyer by who lives there, the ad describes the home, the move or the moment instead.

## Required strings

Legal names, licence lines, equal-opportunity lines, disclaimers: used exactly as the
business wrote them, where the format has room, read from the business's file each
time. Where a format has no room, the ad's file says which string was left off and why,
so the business can decide.

## The check report

For Check mode, and as the last section of every ad's file: one line per claim with its
row and status, one line per policy item with pass or fail, the blanks, and the verdict:
ready for approval, or not, and what would make it so.
