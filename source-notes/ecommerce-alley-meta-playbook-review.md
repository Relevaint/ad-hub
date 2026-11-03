# Ecommerce Meta Ads Playbook, Tier 1 (The Ecommerce Alley): evaluation notes

Source: "Ecommerce Meta Ads Playbook, Tier 1, Under $300 / Day", an 18-page PDF by The
Ecommerce Alley, supplied by the owner on 2026-11-03. Reviewed 2026-11-03 by reading the
whole document. The PDF is not stored here.

## Why it was reviewed

The owner found it and asked how it compares with the hub. He described the hub as a
collection of best practices, not an authority, and asked for both to be judged on
merit.

## What it is

A weekly operating routine for online stores spending under $300 a day on Meta. One
evergreen sales campaign per product or offer, a new ad set of three to five ads every
week, a fixed order for what to test, a two-block weekly schedule, and a few numeric
rules for killing, holding and scaling. Tiers 2 and 3 (higher spend) are referenced but
not included. It names the publisher's own paid tools along the way (an analytics tool,
a hooks library, a KPI calculator, coaching) and one research tool.

## Concepts worth retaining

- **A testing order.** Angles first, then hooks, then styles, then formats, cheapest to
  most expensive. One testing focus per batch so the result can be read. Lock a winner
  at one rung, then test the next rung on it. Dropping back a rung to test fresh
  angles alongside is allowed when budget and production allow. Start with images
  because they are faster to make; rebuild a winning static as a 9:16 video.
- **Angle versus hook.** An angle is an umbrella message; a hook is one way to say it.
  Rule of thumb: if you cannot write ten hooks under it, it is a hook, not an angle.
  When testing angles, each angle gets one hook until one wins.
- **F.O.C.U.S.** Five places strong angles come from: Frustration (what they are sick
  of), Outcome (what they want or who they want to be), Constraint (what blocks them),
  Unspoken cost (what staying stuck costs them), Skepticism (what they no longer
  believe). A brainstorm prompt, not a proof source.
- **Three numbers.** Break-even, a target set about 25% better than break-even (ROAS
  times 1.25, or CPA divided by 1.25), and a kill threshold. Three budget zones: below
  break-even, optimise at ad set level; between break-even and target, change nothing;
  above target, raise the campaign budget 20 to 30% a week. Expect a two to three day
  dip after a raise; if it does not settle, go back.
- **Spend as Meta's vote.** Judge each ad on two axes: amount spent (Meta's vote) and
  results (the customer's vote). High on both is the ad to chase. High results on low
  spend is a sleeper to give room. High spend with poor results means the ad needs
  more buying intent. Filter by spend first, then read results.
- **A funnel check in order.** Cost per link click (claim: under $1.50), then cost per
  add to cart (claim: under 10% of order value), then conversion rate (claim: 2 to 5%,
  lower can be fine for high prices). Clear each step before reading the next. Most
  failures are still the ad: not intriguing enough, or not matching the page.
- **Crisis first step.** When results crash, check for a platform or store outage
  first. If there is none, widen the window to 14 days, assume the creative, message or
  offer is the cause, and make no changes for 48 to 72 hours.
- **A fixed weekly rhythm.** Analyse and create early in the week (about four hours),
  launch and optimise on Thursday (about two hours) so new ads have momentum into
  Friday and Saturday, usually the biggest converting days for online stores. Better:
  launch on the store's own best day by its conversion data. Never skip a week; launch
  whatever is ready.
- **Setup specifics.** A single UTM string on every ad using Meta's name macros
  (`utm_source=meta&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}`);
  ad set names that carry the batch number and the test focus; three primary texts,
  two headlines and one description per creative; 4:5 at 1440 x 1800 for images and
  9:16 at 1080 x 1920 for videos, under 90 seconds; keep ad names short and log the
  test details in a tracker instead.
- **One campaign at this spend.** A second campaign splits the budget; a new campaign is
  almost never the fix. Agrees with the hub's default.

## What not to import as doctrine

- **E-commerce only.** It assumes a purchase on a website with a value. Lead then sale,
  local services, restricted categories and very low volume are out of its scope.
- **The benchmarks.** The $1.50 click, the 10% add-to-cart cost and the 2 to 5%
  conversion rate are the publisher's rules of thumb across its own clients. They vary
  by niche and price. They explain; the hub's deciding metric still decides.
- **The kill switch.** Kill an ad set only once it has spent ten times target CPA and
  run seven days, and never turn off individual ads. Generous for small budgets and in
  tension with the hub's per-ad pause rule. Recorded as a conflict.
- **Spend as a verdict.** Meta's spend allocation is a useful signal, not proof of
  profit, and the playbook itself says high spend can come with poor results.
- **Settings stated without primary sources.** Multi-advertiser ads on, Advantage+
  creative touch-ups on, catalog off, various website add-ons off. These are the
  publisher's preferences; verify against Meta's documentation before any becomes a
  platform default.
- **Tool plugs.** Anything that depends on the publisher's paid tools.
- **The 50-conversion note** says accounts sometimes leave learning without 50
  conversions and the publisher cannot explain why. An observation, nothing more.

## Conflicts with other sources

Added to `conflicts.md`: per-ad pausing versus ad-set-level kills; one ad set per
weekly batch versus one ad set for everything; launching weekly regardless versus no
faster than the last batch can be judged; spend allocation as a signal. Creative
enhancements: this source favours touch-ups on, the course review favours off for a
first ad; the hub keeps off for a first ad and leaves the rest to testing.

## Result

- Testing ladder, angle versus hook rule, the weekly launch rhythm for direct online
  sales, the target-above-break-even default and the 20 to 30% weekly budget step:
  `core/skills/ad-strategy/references/test-design.md`.
- F.O.C.U.S. and the ladder as plays: `core/skills/ad-strategy/references/plays.md`
  (source key EA).
- Spend versus results grid and the e-commerce funnel check:
  `core/skills/ad-review/references/reading-results.md`.
- Outage check first: `core/skills/ad-manage/references/watch-and-sessions.md`.
- UTM string, copy fields per creative, ad set naming and ratios as claims:
  `meta-system/references/defaults.md`.
