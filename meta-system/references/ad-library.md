# Meta's Ad Library for competitor research (perishable: check the header first)

last-verified: 2026-10-19 · ttl-days: 60 · refresh: re-read Meta's developer documentation for the Ad Library API (the `ads_archive` search parameters and the `ArchivedAd` field reference), open the Ad Library web page in a real browser and confirm the fields and filters it shows for an ordinary commercial ad, confirm whether the ads connector's library search is still offered, update every line below and bump last-verified.
changes: 2026-10-19, first written from Meta's developer documentation (field reference and search parameters) and from this platform's own attempts to open the web page. The course review's library tips are marked as the course's claims.

Load during `competitor-ads`, before pulling an advertiser's ads. The core skill decides
what to look for; this file says what Meta shows, for which ads, and how to reach it.

## What the library shows, by Meta's documentation

For every ad in the library (no restriction stated by Meta):

- the library ID, the Page name and Page ID that ran it
- when the ad was created, and the delivery start and stop times the advertiser set
- the creative text: bodies, link titles, link captions, link descriptions, one of each
  per card of the ad
- the platforms it appeared on (Facebook, Instagram and the rest)
- the languages in the ad
- a snapshot link that displays the archived ad with its images and video
- total reach by location, for the EU, the UK and Brazil

Only for ads about social issues, elections or politics: impressions (as a range),
spend and its currency, the funding byline, estimated audience size, and the
demographic and regional distribution of the accounts reached.

Only for ads delivered in the EU: the estimated combined EU reach, the reported
beneficiary and payer, and the age, gender and location targeting selected. The UK and
EU targeting fields also appear for political and issue ads delivered in Brazil, along
with a Brazil reach figure.

So for an ordinary commercial ad shown outside the EU, the library gives: when it
started, whether it still runs, where it shows, its text, its creative, and how many
versions exist. It gives no spend and no results. Long runtime and version count are
the signals; nothing in the library says an ad is profitable.

## Search, by Meta's documentation

The API searches by terms, by Page ID, by ad type (default all), by the countries an ad
reached, and by active status (default active). Ads that reached no location in the EU
are returned only if they are about social issues, elections or politics, when the
search is for a country outside the EU.

## Reaching it

Three routes, in order of preference for an agent:

1. **A real browser, signed in as a person.** The web page at
   `facebook.com/ads/library` renders the search, the filters and each ad's card with its
   "started running on" date, platforms and versions, and a link through to the landing
   page. On the verify date, automated browsers and plain requests from this platform
   got a bot challenge or an empty results list (`HANDOFF.md`, capability notes). A
   platform where the operator's own browser is driven should work; test it.
2. **Meta's ads connector.** Its documented tool families include Ad Library search
   (`platform-tools.md`). It signs in with the business's own Meta login and reads the
   public library; it changes nothing on the account. Not yet tried from any session.
3. **The Ad Library API.** Documented as above. Access requirements were not verified
   on the verify date; check Meta's documentation before relying on it.

## The course review's library tips, as claims

From `source-notes/ben-heath-ads-academy-review.md`, module 13 (Observed, the course's
claims):

- Pick the delivery country, search by advertiser or keyword, read the active ad
  count, the start dates and the versions, and click through to the landing page to
  study the whole funnel.
- Sort by impressions from high to low, and treat long runtime as the best signal of
  a real performer. By Meta's documentation, impressions exist only for political and
  issue ads, so for commercial ads the sort is not available; runtime and versions are
  what remain.
- Model businesses a couple of steps ahead and adjacent, more sophisticated industries,
  not the giants. Adapt, do not duplicate.

## Notes

- A snapshot link displays the ad; it does not expose the video's content to a reader
  that cannot play it. Mark such a video `not seen: copy and thumbnail only`.
- Where the library cannot be opened, the core skill records nothing from it as
  Observed and works from competitors' websites and pages instead.
