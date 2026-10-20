# Launch sequence: gates, approvals and the dry run

Load every time. The gates are hard rules from `core/_system/spend-authority.md`; the
rest are defaults from the course review and the Meta kit review.

## Checking each gate

| Gate | Where to look | Open when |
| --- | --- | --- |
| Authority exists | `ads/authority.md`, Per offer table | No file, or no row for this offer |
| Level allows the step | Per offer level; Pre-approved list; the always-fresh list in spend-authority | Level 0; or activation without an approval; or a new campaign, ad set, restricted category, budget outside the band, or a tracking or optimisation change without a fresh approval |
| Approval recorded | Approvals log; Who can approve | No line covering these ads from a person who can approve |
| Result measurable | Offer file Result loop; platform file "Test of the real result seen arriving" | Result or source blank; test NOT YET SEEN |
| Ads finished and checked | Ledger status; the ad's file in `creative/<batch>/`: check verdict, claims map, required strings, assets inspected | Row not `creative-ready`; verdict not ready; a BLANK still unconfirmed in the copy |
| Category declared | Offer file Limits; platform file Category | Category named but not recorded as declared |
| Spend fits | Test plan spend; `ads/authority.md` ceilings; what is already live | Batch plus live spend above a ceiling; a calendar or capacity hold in force |
| ID thread | Ledger; the ad's name and link in the change list | An ad without a row, or a name or link without the ID |

## What counts as an approval

- From a person named in "Who can approve", with rights that cover the action
  (everything, launches only, budget moves only).
- For exactly this: the ad IDs, the batch, the budget, the activation. "Go ahead" in a
  conversation about this batch counts for this batch and nothing else.
- Written to the approvals log before acting: date, who, approved what exactly, for
  which offer or IDs, in their words (`core/_system/schemas/authority.md`). Any skill
  that hears an approval appends it; this skill always does before activation.
- Relayed approvals ("the broker approved them on the phone this morning") are recorded
  as relayed: who approved, who relayed it, when. Record it, say it is relayed, and
  follow the business's own rule on whether a relayed approval is enough; where the
  business has no rule, treat a relayed approval as enough to create paused and to
  activate only when the approver is named in "Who can approve" and the operator is a
  named person too, and say in the reply that the approver's own written word would be
  the cleaner record.
- Not an approval: a budget figure in passing, a wish to launch, a question, silence,
  an approval from someone not in the table, an approval for a different batch.

## Restricted categories at any level

Anything in a restricted category always needs a fresh approval, even at level 2 with
every box ticked (spend-authority, "Always needs a fresh approval"). The approval line
names the category. The ads were already checked against the category's rules by
`ad-creative`; this skill confirms the check verdict and that the category is declared on
the campaign in the platform file.

## The dry run

A dry-run entry goes in `ads/changes/`, named like any entry with the action `dry-run`,
and says `Result: dry run, nothing sent`. It lists every object in order with its
settings in plain words and before and after values:

1. Campaign `<offer>`: objective, special category (if any), budget type. Before: does
   not exist. After: exists, paused.
2. Ad set `<offer>`: performance goal (the signal), budget, location exactly, audience
   as suggestions, placements automatic, attribution. Before: does not exist. After:
   exists, paused.
3. Ad `<ID>`: creative file and shapes, primary texts, headlines, link with `<ID>` as
   the tracking parameter, name `<ID>`. Before: does not exist. After: exists, paused.
   One line per ad.
4. Activation: which objects, in which order, under which approval line. Before:
   paused. After: active.

The platform's validate-only option is run where the tool has one, and the result
recorded. Without a tool, the entry says so and a person can follow it in the platform's
own interface; the entry is the record of what was asked for.

## Introducing new ads into a live set

The course review's default (claims): new creatives enter through the platform's
creative testing feature, two to five at a time with a fixed share of budget, so they
get spend while the existing ads run undisturbed, and they become normal ads afterward
(19.3). Whether the connected tools can set that feature is a platform fact
(`meta-system/references/platform-tools.md`, "Not yet verified"). Until it is, the
feature is set by a person, or the new ads enter the existing set directly at the test
plan's share.

Keep the safe-to-risky mix the plan set, around eight safe to two bold, to protect the
account's approval record while unusual plays run (24.6). Never activate only the bold
ones.

## Account protection

- A rejected ad is fixed or dropped, never resubmitted unchanged in the hope it passes.
- A restricted category is declared, never worked around.
- A disabled account is appealed through the platform's own routes; opening another
  account or using another person's profile is evading enforcement and is never done
  (spend-authority hard rule 6; course review, what not to import).
- A backup payment method on the account keeps delivery from stopping for a card
  failure; it is the business's to add, and worth a line in the reply when missing.

## Last known good

The activation entry records the state it leaves behind: which ads are live, at what
budget and settings, on which date. `ad-manage` reverts to it when a later change hurts.
Keep it in the entry, not in chat.
