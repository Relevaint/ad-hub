# Reading results from Meta (perishable: check the header first)

last-verified: 2026-10-20 · ttl-days: 60 · refresh: re-read the Ads CLI insights page, the Ads MCP server comprehensive-reporting page and Meta's Insights API best-practices page; find and read the Insights API fields reference to confirm the field names marked below; update and bump last-verified.
changes: 2026-10-20, first written from Meta's Ads CLI insights page, the Ads MCP server reporting page and the Insights API limits and best-practices page, all read 2026-10-19 and 2026-10-20. The per-field reference for the explaining metrics was not reachable on the verify date; those names are marked to confirm.

Load during `ad-review` before pulling or reading a snapshot. The core skill decides how
to judge; this file says what Meta gives, how fresh it is, and how to pull it.

## How fresh the numbers are, by Meta's documentation

- Insights refresh every 15 minutes and do not change after 28 days of being reported.
- Metrics may keep updating for a couple of days after an ad has completed.
- Since 2025-06-10, attributed values follow the ad set's attribution setting.
- The API's default behaviour differs from Ads Manager's; a figure read through a tool
  and one read on screen can differ for that reason alone. Say which was used.

So the hub's rule to set the most recent two to three days aside matches Meta's own
notes; a snapshot older than 28 days is final.

## Pulling through the official tools

- **Command-line tool** `insights get`: fields include spend, impressions, reach, clicks,
  ctr, cpc, cpm, frequency, conversions, cost per conversion and purchase ROAS, and
  Meta says any valid Insights API field can be requested. Breakdowns: age, gender,
  country, publisher platform, device platform, platform position, impression device.
  Date presets today, yesterday, last 3, 7, 14, 30 and 90 days, this month, last month;
  or a since and until pair. Time increments all days, daily, weekly, monthly. Filter by
  campaign, ad set or ad identifier; there is no level option, so per-ad figures are
  pulled per ad or by filter (`platform-tools.md`).
- **Connector**: `ads_get_ad_entities` is the main reporting tool (spend, impressions,
  CTR, CPC, CPM, conversions, with filtering, breakdowns, sorting and date ranges);
  `ads_insights_performance_trend` tracks CPC, CPM, cost per result, ROAS, CTR and
  conversion rate; anomaly, benchmark and opportunity-score tools exist. Treat benchmark
  and opportunity figures as Meta's input to check, not as results.
- Pull a small snapshot and read that; heavy reporting through the API has been
  reported to get accounts flagged (`platform-tools.md`, standing cautions). Meta's own
  best-practices page asks for a back-off when throttled and prefers date presets to
  custom ranges.

## Fields for the explaining metrics (to confirm)

The names below are the ones the Insights API has used; the fields reference was not
reachable on the verify date, so confirm each before relying on it:

- Hook rate: three-second video plays over impressions. Three-second plays appear in the
  `actions` list under a video-view action type; `video_thruplay_watched_actions` is the
  longer view. Confirm the exact action type for three seconds.
- Link click rate: `inline_link_click_ctr` (link clicks over impressions), distinct from
  `ctr`, which counts all clicks.
- Landing views: the `landing_page_view` action type in `actions`.
- Results and values: `actions` and `action_values` by action type for the signal the ad
  set optimises on; `purchase_roas` for purchase value over spend.
- Frequency and reach: `frequency`, `reach`. Reach is omitted on breakdown queries with
  a start date more than 13 months old.

## Matching to the business's own results

The platform reports the signal; the business's result source reports the result that
counts. Match on the ad ID carried in the link's tracking parameter and in the ad's
name. Phone leads and walk-ins carry no tag and stay unmatched unless the business
records "how did you hear about us" with the ad named.
