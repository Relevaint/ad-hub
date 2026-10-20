# Meta names for the plain-word baseline (perishable: check the header first)

last-verified: 2026-10-20 · ttl-days: 60 · refresh: re-read the Ads CLI command reference for the objective, optimisation goal, billing event, special ad category, custom event and button values; read Meta's Marketing API targeting reference for the location, placement and audience expansion fields and replace every MODEL KNOWLEDGE line with Meta's own names; re-check the course review's defaults against results in the business repos; bump last-verified.
changes: 2026-10-20, first written. Enum values from the command reference read the same day. Operating defaults are the course review's claims and are marked as such. Field names not yet read from Meta's own reference are marked MODEL KNOWLEDGE.

Load when a core skill writes or executes the settings baseline in `ads/platform/meta.md`.
The platform file describes settings in plain words; this file says what each one is
called on Meta and whether that name was read from Meta or is still a guess. Three
labels: **Meta** (read from Meta's documentation on the verify date), **claim** (a
source's default, kept as a dated claim to test), **MODEL KNOWLEDGE** (confirm before
relying on it; never pass it to a tool unchecked).

## Settings

| Plain words in the platform file | On Meta | Label | Note |
| --- | --- | --- | --- |
| Objective for a direct online sale or an in-person sale | `OUTCOME_SALES` | Meta (value); claim (choice) | Course review 2.5: results campaigns use Sales or Leads and avoid Traffic, Awareness and Engagement. |
| Objective for lead then sale, or a direct booking | `OUTCOME_LEADS` | Meta (value); claim (choice) | The other values: `OUTCOME_TRAFFIC`, `OUTCOME_AWARENESS`, `OUTCOME_ENGAGEMENT`, `OUTCOME_APP_PROMOTION`. The omnipresent play runs on awareness. |
| Performance goal: the chosen signal, counted | `--optimization-goal OFFSITE_CONVERSIONS` with `--custom-event-type` set to the event: `PURCHASE`, `LEAD`, `SCHEDULE`, `CONTACT`, `COMPLETE_REGISTRATION` and others | Meta (values) | The data source (`--pixel-id`) plus the event is the promoted object. |
| Performance goal: the signal, by value | `--optimization-goal VALUE` | Meta (value); claim (when) | Course review 2.5: by value when customer value varies a lot. |
| Performance goal: leads on Meta's own form | `--optimization-goal LEAD_GENERATION` | Meta (value) | Whether either tool creates the form is unknown (action map). |
| Billing event for a results goal | `--billing-event IMPRESSIONS` | MODEL KNOWLEDGE | The reference lists the flag as required and its values; it does not say which pairs with which goal. Confirm on the first run. |
| Campaign budget on | `--daily-budget <cents>` on `campaign create`; the ad set then carries none | Meta (where it goes); claim (that it is on) | Course review 5.2. Lifetime budgets need an end time. |
| Budget at the ad set instead | `--daily-budget <cents>` on `adset create`; omit the bid strategy on the campaign | Meta | The reference says to omit `--bid-strategy` for ad-set budgets. |
| Bid strategy | `LOWEST_COST_WITHOUT_CAP` | Meta (default) | Cost caps and bid caps are a decision for the business, never a default. |
| Restricted category: housing | `--special-ad-categories HOUSING` | Meta | Set on the campaign at creation. |
| Restricted category: jobs | `EMPLOYMENT` | Meta | |
| Restricted category: credit or loans | `CREDIT` | Meta | |
| Restricted category: financial products and services | `FINANCIAL_PRODUCTS_SERVICES` | Meta | |
| Restricted category: social issues, elections, politics | `ISSUES_ELECTIONS_POLITICS` | Meta | Political creatives also take `--authorization-category`. |
| Restricted category: gambling | `ONLINE_GAMBLING_AND_GAMING` | Meta | |
| Location exactly where the business serves | the `geo_locations` object in the targeting JSON (`countries`, `regions`, `cities` with a radius, `zips`) | MODEL KNOWLEDGE | Read Meta's targeting reference before passing it. `--targeting-countries US,CA` exists for whole countries (Meta). |
| Location expansion off ("reach more people") | field unknown | unknown | Course review 4.2 says off for a local business. Check in Ads Manager after creation until the field is known. |
| Audience as suggestions | `--advantage-audience` on `adset create` | Meta (flag); claim (default on) | Course review 5.2. Interests and ages as suggestions, never as limits, in the default structure. |
| Placements automatic | leave placement fields out of the targeting JSON | MODEL KNOWLEDGE | Course review 5.2 keeps them automatic except for the traffic objective. Confirm what an ad set created without placement fields shows. |
| Attribution: 7-day click, 1-day view | `--attribution-spec` JSON on `adset create` | Meta (flag); MODEL KNOWLEDGE (the JSON) | Course review 20.3 keeps 7-day click. Attributed values follow this setting (`reporting.md`). Set at creation; a later change is a person's step and a fresh approval. |
| Conversion location: a page | a link creative: `--link-url` with the ID in `--url-tags` | Meta | |
| Conversion location: Meta's own form | `LEAD_GENERATION` goal | Meta (goal); unknown (form creation) | |
| Conversion location: messages | `--optimization-goal CONVERSATIONS` with `--destination-type` | Meta (values) | Course review 10.4: availability varies by market; start with a person answering. |
| Ad name | the ad ID | hub rule | Memory contract, "The ad ID thread". |
| Tracking parameter on the link | `--url-tags "<parameter>=<ad ID>"`, using the parameter the business's result source already reads | Meta (flag); hub rule (value) | The parameter name belongs to the business's tracking, not to the hub. |
| Several texts and headlines in one ad | `--bodies`, `--titles`, `--descriptions`, up to five each, with `--link-url` | Meta | Course review 16.5 tests copy inside one ad this way. |
| Creative enhancements off for a first ad | `--degrees-of-freedom-spec @file.json` | Meta (flag); unknown (contents); claim (off) | Course review 14.3. Check the ad in Ads Manager after creation. |
| Second lock on the platform: a spend cap | `--spend-cap <cents>` on the campaign | Meta (flag); proposal (use) | A lifetime cap at the monthly ceiling from `ads/authority.md` puts the ceiling on the platform itself. The business decides. |
| Pacing | `standard` | Meta (default) | `day_parting` exists on ad sets; not a default. |
| Buying type | `AUCTION` | Meta (default) | |

## Operating claims from the sources (not Meta facts)

- Learning phase about 24 to 48 hours after a launch or a major edit, longer at low
  volume; some ad sets never leave it, and a profitable account in that state is fine
  (course review 17.2, 19.5). The hub already sets the last two to three days aside.
- Budget and bid edits do not send an ad back through review; creative, targeting and
  optimisation-goal edits do (Meta's best-practices page, read 2026-10-20).
- Fatigue shows as frequency above about 3 with worsening cost (course review 24.1).
- Budget steps: about 3% a day by rule, or bigger and rarer by hand, inside the band the
  business set (course review 18.2, 18.3). The band itself comes from `ads/authority.md`.
- Keep the first ad's enhancements off and the ad's own crop (course review 2.5).
