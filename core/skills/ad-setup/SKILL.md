---
name: ad-setup
description: Makes the account able to measure the offer's real result and prepares the structure to run it. Chooses the signal to send back from the offer's funnel type, verifies tracking in browser and server, requires a test of the real result to be seen arriving on the platform before anything goes live, declares the restricted category, and records the settings baseline and the exact change list without creating anything itself. Use when tracking needs checking, when the question is which result to send back, or before a first launch on an offer.
when_to_use:
  - make sure we can tell which ads make sales
  - which result should we send back to the ad platform
  - check our tracking
  - set up the account for this offer
  - is the pixel working
  - prepare the campaign structure
metadata:
  adhub:
    version: 0.1.0
    layer: operations
    reads:
      - offers/
      - offers/<offer>.md
      - authority.md
      - platform/
      - strategy/test-plan.md
      - ledger.md
      - results/
    writes:
      - platform/<platform>.md
    live: prepare
---

# ad-setup

Makes the account able to measure the real result, and prepares the structure to run
the offer. Done means `ads/platform/<platform>.md` says which result is sent back and
why, how it travels, whether a test of that result has been seen arriving on the
platform and when, what the category and settings baseline are, and exactly what a
launch would create. The judgment this skill carries is choosing the one status worth
optimising on, telling verified from assumed, and refusing to call tracking ready until
the real result has been seen.

## Context

```
node <hub>/core/_system/scripts/context.mjs --for ad-setup --root <business repo> --offer <slug>
```

Read the offer's result loop first: funnel type, result source, result that counts,
deciding metric, and the line "Signal sent to the platform", which may still be blank.
Then `ads/authority.md` (what level, which account, who approves), the existing platform
file, the test plan (location, structure, batch), the ledger (IDs the names and tracking
parameters must carry), and any results snapshot (what has already been matched and
what has not). Then the platform layer for the platform the business runs on:
`meta-system/references/result-signals.md`, `events-and-matching.md`, `policy-notes.md`
and `platform-tools.md` for Meta, each with its date checked first.

Which platform: the one the business names. When the business names none and the hub
has one platform layer, say the assumption and write that platform's file with the
assumption marked Proposed.

## What reaches the account

This skill reads an account and runs dry runs; it creates nothing. Reading needs
`ads/authority.md` to exist, at any level, and the business's own connected tools. No
authority file, or no tool connected: skip the read, say so, and produce the checklist
a person follows instead. Creating campaigns, ad sets and ads, even paused, is
`ad-launch`'s, from the change list this skill writes. Nothing here changes a live
account.

## Method

### 1. Choose the signal

One status is sent back for the platform to optimise on. It is the earliest status that
marks a real buyer and arrives soon enough for the platform to learn from it (memory
contract, "Funnel types and the result loop"). `references/signal-path.md` carries the
decision table and the tests; load it every time. In short:

- Direct online sale: the purchase, with its value, at checkout.
- Lead, then sale: the first status that separates a buyer from a form fill and lands
  within days, not weeks: the booked estimate, the qualified call, the appointment set.
  Raw form leads fail when many are unqualified; the signed deal fails when it lands
  weeks later.
- Direct booking: the confirmed booking.
- In-person sale: the sale uploaded afterwards.

Later statuses are still recorded and reviewed on; they are not the signal. When the
signal would arrive too rarely for the platform to learn, an earlier real status is an
option, and the hub's conflicts note says so. Record the choice in the platform file
with its reasons, labelled Owner-confirmed when the business agreed, Proposed until
then; the offer file's own line is updated by `start-here` on the business's word.

### 2. Verify the path

The signal travels from the system that records it to the platform, in the browser and
from the server where both apply, deduplicated so one result is not counted twice. The
platform layer holds the mechanics and the fields. This skill checks what exists: is the
browser tag installed and firing, does the server send the event, do the two
deduplicate, does the event carry the value and the matching fields, is the source
healthy. Through the business's connected tools where authority allows; otherwise as a
checklist for a person, item by item.

Then the gate that matters: **a test of the real result seen arriving on the platform**,
with its value where there is one, on a stated date, recorded in the platform file. Not
a page view, not a form fill unless the form fill is the result, not a tracking tag
that "should" work. Until it has been seen, the file says `NOT YET SEEN: blocks going
live` and names who clears it. A snapshot that matched results by tracking tag proves
the tag, not the signal.

### 3. Choose the conversion location as a test

Where the result happens is a choice: a page, a platform-native form, a message thread,
a call. Defaults from the course review (claims): a page for lead quality and brand, a
native form for volume and cheap leads, with qualifying questions when quality is the
problem; message funnels run with a person before they are automated. No universal
answer: pick one, say why, and treat it as a test the results will judge.

### 4. Set the structure

Default: one campaign and one ad set per offer, with every ad inside it (Observed,
course review; hub conflicts note records the other position). Split only when offer
type, price point or country costs truly differ, or when each part would reach about
fifty results a week on its own. The objective matches the funnel; the performance goal
is the chosen signal, by value where order values vary. Location is exactly where the
business can serve, from the offer file and the test plan, with any "reach more people"
expansion off for a local business. Audiences as suggestions; placements automatic. Ad
names carry the ad ID and the destination link carries the ID as its tracking
parameter (memory contract, "The ad ID thread"). Platform setting names belong to the
platform layer; here they are described in plain words.

### 5. Declare the category

The offer file names any restricted category in plain words; the platform layer maps it
to the platform's own category. It is declared on the campaign before anything else is
built, and the platform file records that it was checked, how and when. An undeclared
category is a live gate. The business's compliance file governs the strings; this skill
points at it and copies nothing.

### 6. Record the baseline and the change list

Everything above goes into `ads/platform/<platform>.md` from
`core/_system/schemas/platform.md`: the account identifier and never a credential, the
signal and its test, the category check, the settings baseline, what was checked and
when, and the numbered change list a launch would carry out, each step with before and
after. `ad-launch` executes the list, paused, under authority; a person can follow it in
the platform's own interface when no tool is connected.

### What this skill never does

It never records a token, key or password anywhere; account identifiers are fine,
credentials live outside the repo. It never creates or changes anything on the account.
It never calls tracking ready without the test seen. It never guesses a platform
setting from memory; the platform layer or the platform's own documentation is the
source, with its date.

## Quality gate

Before writing the summary, check the file:

- The signal matches the offer's funnel type and is the earliest real-buyer status that
  arrives in time, with the rejected alternatives named and the reason for each.
- The test of the real result is recorded as seen, with date and what was seen, or as
  not yet seen with who clears it. No middle state.
- The category is declared and the check recorded, or named as a live gate.
- Location is exactly where the business can serve.
- Every platform fact cites the platform layer file and its last-verified date.
- No credential anywhere in the file or the chat. Account identifiers only.
- Nothing was created or changed on the account; the change list says what would be.
- Say what shaped the output and what could not be checked from this platform.

## Output

Files first: `ads/platform/<platform>.md`, from the schema, added to when it exists.
Then the chat summary, short: the signal and why in two lines, the test status in one
(seen on a date, or not yet and who clears it), the category line, the change list in
a few numbered steps or a pointer to it, what could not be checked here, and the next
skill.

## What's next

- `ad-launch` when the test has been seen, the ads are `creative-ready` and the business
  has approved them: it creates the structure paused from the change list and
  activates on approval.
- `start-here` to record the agreed signal in the offer file, and any decision the
  business made here, in its words.
- `ad-strategy` when the signal choice changes what volume the plan can expect.
- `ad-review` once results flow: it judges on the result that counts and on the signal,
  and matches by ad ID.
