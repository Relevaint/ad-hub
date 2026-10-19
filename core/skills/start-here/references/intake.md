# Intake: the facts an offer needs, and where they hide

Load when recording a new business or offer, or when a readiness check finds gaps. Skip
it for a route-only request. Everything here is a default. The hard rules are in the
skill: record only what was supplied, with a status on each fact, never a guess.

## Where facts hide

Rank the sources: the operator's words in this session; the business's own files
(README, about pages, notes, pipeline or process notes, price lists, compliance or brand
rules); third-party exports (reviews, platform reports, CRM exports); nothing. Your own
knowledge of the industry is not a source for a fact about this business.

Read by meaning. Headings vary; the content does not. The phrases under each fact below
are what to look for.

## The facts

**What is sold.** The thing, in the business's words, with what comes bundled (bonuses,
installation, speed). Phrases: "we sell", "we offer", "our service". Without it there is
no offer; with it, drafting can start.

**Who it is for.** The buyer as the business describes them. For a local offer, include
the service area exactly: towns, radius, county, and anywhere the business will not go.
Phrases: "where we work", "we serve", "we don't go to", "within X miles". The service
area blocks going live for a local offer: the platform is told exactly where the
business can serve, and nothing else.

**Where the ad sends people.** A page, a form, a booking link, a phone number, a shop.
Blocks going live. A new business often has none yet: name it as a gap. A page or a
booking link has to exist before an ad can point at it.

**Funnel type.** Choose by how the business gets paid; the table is in the skill. Clues:
"checkout", "cart", "instant download" point to direct online sale. "Form, then we
call", "quote", "estimate", "consultation", "pipeline", "stages" point to lead, then
sale. "Book online", "appointment", "calendar link", "a van comes at a booked time"
point to direct booking, if the booking itself commits the customer; if someone calls
back to confirm or to quote, it is lead, then sale. "Walk in", "at the till", "invoice
after the job" point to in-person sale. When clues point two ways, record the nearer
one as Proposed and say what would settle it.

**Result source.** The system that records the real result: the checkout, the CRM, the
booking tool, the till. Blocks going live. A new business often has none: say so, and
list the lightest options as Proposed (a booking tool that confirms, a shared pipeline
sheet with a status column, the checkout's own order record). Do not pick one for them;
`ad-setup` needs the real one.

**Result that counts, and the signal sent.** The real outcome (a paid order, a signed
listing, a completed job) and the earliest status that marks a real buyer and arrives
soon enough for the platform to learn from it. Long cycles: the appointment or the
qualified call, not the closing months later. Phrases: pipeline tables with timings and
shares, "most leads who X end up buying". The result that counts blocks going live; the
signal is settled with `ad-setup`.

**Deciding metric.** Follows from the funnel type. Record it. Do not invent a blend.

**Average order value, or first transaction value.** Blocks confident scaling. Phrases:
"price", "$X for", "average ticket", "commission per side", "we keep X%". For lead
funnels, the first transaction's value to the business, not the gross figure a third
party keeps part of.

**Gross margin.** Blocks confident scaling. Phrases: "margin", "after fees", "we keep".
A service business may say "treat the fee as margin"; record that as their statement.

**Repeat purchases.** How often, over what period, or none. Phrases: "repeat", "comes
back every", "subscription", "one-off". Improves the work. It is the biggest lever on
what a customer is worth (Observed, course review), so when it exists, break-even may
include it, but only once the business confirms the repeat rate.

**Lead-to-customer rate.** Lead funnels only. Blocks confident scaling. Phrases:
pipeline shares, "X% of leads become", "we close about". It swings break-even more than
any other number. A rate the business says out loud with "about" is recorded
Owner-confirmed with the word "about" kept.

**Break-even cost per result.** Always Proposed, with the working shown. Direct sale:
value times margin. Lead funnel: value times margin times lead-to-customer rate.
Booking: value of a booked job times margin, times the show-up rate when the business
has one. Illustrative only, numbers invented to show the arithmetic: a $120 job at 60%
margin where 8 in 10 bookings happen is $120 x 0.60 x 0.80, $57.60 per booking. A
business may set its own target instead; record it as Owner-confirmed.

**Capacity or stock limit.** What should slow or stop spend: crews full, stock, hours,
seats, one van. Phrases: "both crews full by", "we can take X a week", "sold out",
"starting with one van". Improves the work now and feeds the emergency stop later.
Record it even when soft.

**Restricted ad category.** Housing, employment, credit and financial products, social
issues and politics, and categories a platform restricts in some places such as health,
alcohol, gambling or dating. In plain words; the platform layer maps it. Blocks going
live. Clues: real estate, lending, hiring, insurance, supplements, a past campaign that
was rejected or had its targeting limited. When in doubt, record "possibly <category>,
confirm" as Proposed and name it as a live gap.

**Proof the ads may use.** Reviews with counts and averages, credentials and licences,
years and numbers, results, stories. Each row names where it comes from and its date.
Permission matters: a story or testimonial the business is not cleared to use goes under
Gaps as "has, not cleared", not into the proof table. "Fully insured" or "11 years in
business" in the business's own README is Owner-confirmed proof, naming the file.

**Calendar.** Seasons, promotion dates with real end dates, capacity windows, known
outside events. Phrases: "busy season", "rush", "every spring", "sale ends", "we start
next month".

**Authority.** Who can approve, the level, daily and monthly ceilings, pre-approvals,
bands, testing share. Only explicit statements, in the person's words, dated. Nothing
here is inferred from the size of the business or the price of the offer.

## Budget, when asked

Two figures from the course review, both Observed and both to be stated as such. A
starter budget is an amount the business could lose without regret, held until the offer
is profitable and then scaled from strength. The platform's "ideal" is roughly the cost
per result times fifty results a week per ad set, a guideline many good accounts never
reach. Say both when asked, and say that a failing campaign is not fixed by more budget.
Neither figure is written anywhere as a ceiling. The ceiling is the business's decision
in `ads/authority.md`.

## What a new business usually cannot answer yet

Price, service area, booking tool, proof. Drafting works without all four. Going live
does not work without the area (for a local offer), the destination, the result source
and recorded authority. Say that in three lines, then move to the first ad's job.
