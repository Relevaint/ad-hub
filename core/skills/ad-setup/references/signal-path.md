# Signal path: choosing the result to send back, and verifying it

Load every time. Defaults from the course review and the Meta reference unless marked;
the hard rule is in the skill: nothing goes live until a test of the real result has
been seen arriving on the platform.

## The decision table

| Funnel type (offer file) | Signal sent for optimisation | Kept for review, not optimised on | Reject as the signal |
| --- | --- | --- | --- |
| Direct online sale | The purchase, with its value, at the moment of sale | Refunds, repeat purchases | Add to cart, checkout started: not a buyer |
| Lead, then sale | The earliest status that marks a real buyer and lands within days: estimate booked, appointment set, qualified call | Every later stage: estimate done, job won, signed, closed, with values | Raw form leads when many are unqualified; any stage that lands weeks or months later |
| Direct booking | The confirmed booking | Show-up, job done, paid | Page views of the booking tool |
| In-person sale | The sale, uploaded afterwards from the till or invoice | Repeat visits | Directions clicks, calls, unless the business sells by phone |

## The three tests a candidate signal must pass

1. **It marks a real buyer.** A status unqualified people reach fails (a form anyone can
   fill when many are out of area). The first status a person reaches by doing
   something only a buyer does passes.
2. **It arrives in time.** The platform learns from events it can connect to the click
   within days. A status that lands five to ten days out is borderline; weeks or months
   out fails. Platform-specific windows are in the platform layer.
3. **The system that holds it can send it.** The checkout, the CRM, the booking tool,
   the till: each has to be able to send the status with a match key (the click
   identifier or hashed contact details). A status nobody records, or that lives only
   in someone's head, cannot be the signal until it is recorded somewhere.

A candidate that passes all three is the signal. Where two pass, pick the deeper one
unless its volume would be too low for the platform to learn; then the earlier one is
an option, and the plan says so (hub conflicts note, "Conversion event").

## Volume

The platform wants dozens of the signal a week per ad set; many good accounts never
get there and run fine (course review, 19.5). Do not pick a shallow event just to hit a
number. Pick the deepest real-buyer event that arrives in time, and let `ad-strategy`
set cadence from the volume it produces. Lighter alternatives when volume is low:
qualifying questions on the form so unqualified answers never count, and value rules
that tell the platform a segment is worth more; both are plays.

## Verifying the path, in order

1. **Browser side.** Is the platform's tag on every page of the destination, firing on
   load, and firing the result event on the page or action that marks the result? Check
   with the platform's own helper where one exists.
2. **Server side.** Does the system that holds the result send it to the platform as a
   server event, with the event name the browser uses, the same event ID for the same
   result, the value and currency where there is one, and the matching fields the
   platform needs? The platform layer lists the fields and what is hashed.
3. **Deduplication.** The browser and server copies of one result are matched by event
   name and event ID within the platform's window; without it, one sale counts twice.
4. **The test.** Send one real result through the whole path, or the platform's test
   mode where it has one, and see it arrive on the platform's events view with its value
   and a match. Record the date, what was seen, and where. This is the gate.
5. **Health.** The platform's own diagnostics for the data source: match quality,
   coverage, warnings, duplicates. Note them; they explain weak optimisation later.

Through the business's connected tools when `ads/authority.md` exists and a tool is
connected; otherwise write each step as a line a person can follow and tick, with what
they should see. Never fill a step from memory. "Should work" is not a check.

## Conversion location, as a test

Defaults from the course review, all claims to test for this business:

- A page costs more per click and gives better lead quality and a brand impression.
  Structure: the result in the headline, one simple next step repeated, proof over
  features, say who you serve.
- A platform-native form gives volume and cheaper leads; quality drops unless
  qualifying questions filter, and the platform then learns only from qualified leads.
- Message funnels live or die on execution; run them with a person before automating.
- Judge the choice on revenue, not on cost per lead. Follow-up speed is a bigger lever
  than the choice itself.

## Structure defaults

Claims from the course review, recorded in the test plan by `ad-strategy` and carried
out here:

- One campaign, one ad set per offer, every ad inside. Split only for truly different
  offer types, price points or country costs, or when each part reaches about fifty
  results a week.
- Objective matches the funnel (sales or leads); performance goal is the signal, by
  value when order values vary widely.
- Location exactly where the business can serve, expansion off for a local business.
  Audience as suggestions; placements automatic. A restricted category changes what
  may be targeted; declare it first.
- Attribution: keep the platform's default click window rather than the shortest one;
  the platform layer says what the options are on the verify date.
- Names: campaign and ad set by offer; ads by ad ID; the link's tracking parameter
  carries the ID.

## What never goes in the platform file

Tokens, keys, passwords, session cookies. Account identifiers, tag or data source
identifiers and campaign identifiers are fine. If a value looks like a secret, it is
one; leave it where it lives and record only where that is.
