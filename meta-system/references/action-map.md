# Meta action map: what each hub action is on Meta (perishable: check the header first)

last-verified: 2026-10-20 · ttl-days: 30 · refresh: re-read the Ads MCP server tool pages (available tools, ad creation and management, comprehensive reporting, signals and datasets, activity logs, A/B tests) and the Ads CLI command reference; for every `docs` row confirm the call still exists and behaves as written; for every `person` and `unknown` row look for a tool that now covers it; keep `run` dates unless the page changed under them or a later run failed; bump last-verified.
changes: 2026-10-20, first written from Meta's tool pages and the command reference read the same day. No row has run on a real account yet.

Load every time the Meta skill is loaded. One row per action a core skill can ask for.
The status column is the point of the file:

- `docs <date>`: per Meta's documentation read on that date; not yet run through this hub.
- `run <date>`: performed through a hub skill on a real account on that date and did what
  the row says.
- `person <date>`: not available through either tool on that date; a person does it in
  Ads Manager, where the notes say.
- `unknown`: not found in the documentation and not tried.

A status never comes from memory. Connector calls are the tool names on Meta's pages;
command-line entries are `meta ads ...` commands with the flags the reference lists.
Budgets, bids and caps are in the account currency's minor unit (cents). Never put a
pipe character inside a cell; the build gate reads this table.

## Discover and read (authority level 0 and above)

| Action | Needed by | Connector | Command line | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| List the ad accounts the login can reach | ad-setup, ad-launch, ad-manage, ad-review | `ads_get_ad_accounts` | `adaccount list`, `adaccount current` | docs 2026-10-20 | Name, status, currency, time zone. Confirms the identifier in `ads/platform/meta.md` before any write. |
| Pages and Instagram accounts to advertise from | ad-setup, ad-launch | `ads_get_ad_account_pages`, `ads_get_ig_accounts` | `page list`, `page get <id>` | docs 2026-10-20 | A creative needs a Page. |
| Read campaigns, ad sets and ads with status and settings | ad-setup, ad-launch, ad-manage, ad-review | `ads_get_ad_entities`, after `ads_get_field_context` for field names | `campaign list`, `adset list [campaign id]`, `ad list [ad set id]`, `get <id>`, `--fields` for more | docs 2026-10-20 | The baseline and the last known good. Archived objects are not returned unless asked for. |
| Pull results for a window, per ad, with breakdowns | ad-review, ad-manage | `ads_get_ad_entities` with metrics, date range and breakdowns | `insights get --fields <list> --since <date> --until <date> --breakdown <name> --campaign-id <id>` | docs 2026-10-20 | The command prints the raw API response and has no level flag: filter per object. Field names to confirm are in `reporting.md`. |
| Read the account's activity log | ad-manage, ad-review | `ads_account_get_activity_logs`, scoped by object, window, category or user | none | docs 2026-10-20 | Meta's own record of what changed and by whom (Ads Manager: campaign history). The fields returned are not listed on the page. |
| Data sources: list, setup details, event volume, match quality | ad-setup | `ads_get_datasets`, `ads_get_dataset_details`, `ads_get_dataset_stats` (up to 28 days, by device or source), `ads_get_dataset_quality` | `dataset list`, `dataset get <id>` | docs 2026-10-20 | Whether the volume tool names the events received is not stated. |
| List custom conversions | ad-setup | `ads_get_customconversions` | none | docs 2026-10-20 | |
| Event rules and parameters on a data source | ad-setup | `ads_pixel_event_read`, `ads_pixel_event_create` (starts inactive), `ads_pixel_event_update`, `ads_pixel_event_delete`, the four `ads_pixel_parameter_` tools | none | docs 2026-10-20 | Creating or changing a rule changes what the account counts: a tracking change, so always a fresh approval. |
| Send a test event, or read the Test Events window | ad-setup | none | none | person 2026-10-20 | Events Manager, the data source, Test events. A person with the business's login clears the gate and `ad-setup` records the date (`events-and-matching.md`). |
| Search the public Ad Library | competitor-ads | `ads_library_search` | none | docs 2026-10-19 | A browser works without a login (`ad-library.md`). |
| Meta's own recommendations | ad-review, ad-manage | `ads_get_opportunity_score`, `ads_insights_performance_trend`, `ads_insights_anomaly_signal`, `ads_insights_industry_benchmark`, `ads_insights_auction_ranking_benchmarks`, `ads_insights_advertiser_context` | `guidance list` | docs 2026-10-20 | Input to check against break-even, never a decision. |
| Search Meta's help centre | ad-setup, ad-manage | the help tool (searches Business Help Center articles; its name is not given on the overview page) | none | docs 2026-10-20 | Answers are Meta's text, not a verified fact. |

## Create, paused (level 1 and above)

| Action | Needed by | Connector | Command line | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Create the campaign: objective, category, budget | ad-launch | `ads_create_campaign` (creates paused) | `campaign create --name <offer> --objective <OUTCOME_SALES or OUTCOME_LEADS> --special-ad-categories <category> --daily-budget <cents> --status PAUSED` | docs 2026-10-20 | Budget here means campaign budget on. Bid strategy defaults to lowest cost without a cap. `--spend-cap <cents>` is a lifetime limit, usable as a second lock. Enum values: `defaults.md`. |
| Validate a campaign create or update without applying it | ad-launch, ad-manage | unknown | `campaign create` or `campaign update` with `--execution-options validate_only` | docs 2026-10-20 | Not listed for ad set, ad or creative. |
| Create the ad set: the signal as the goal, budget, location, attribution | ad-launch | `ads_create_ad_set` (creates paused; targeting, budget, optimisation goal) | `adset create --campaign-id <id> --name <offer> --optimization-goal <OFFSITE_CONVERSIONS, VALUE or LEAD_GENERATION> --billing-event <value> --pixel-id <data source> --custom-event-type <PURCHASE, LEAD, SCHEDULE or other> --targeting @file.json --advantage-audience --attribution-spec '<json>' --status PAUSED` | docs 2026-10-20 | The data source plus the event is the promoted object. Location, placements and expansion sit in the targeting JSON; field names and their status are in `defaults.md`. No validate-only listed. |
| Upload an image or video | ad-launch | unknown; `ads_get_ad_images` and `ads_get_ad_videos` only list what is uploaded | `creative create --image <file>` or `--video <file>` uploads with the creative; `--image-hash` or `--video-id` reuses an upload | docs 2026-10-20 | Whether the connector uploads a file is not on its page. |
| Create the creative: copy, link with the ID, button | ad-launch | `ads_create_creative` (single-image link creative; placement customisation and multi-media of limited availability) | `creative create --name <ad ID> --page-id <id> --image-hash <hash> --body <text> --title <headline> --description <text> --link-url <url> --call-to-action <LEARN_MORE, GET_QUOTE, SHOP_NOW, SIGN_UP, CONTACT_US or other> --url-tags "<parameter>=<ad ID>"` | docs 2026-10-20 | `--url-tags` puts the ad ID on the link. Several texts and headlines in one ad: `--bodies`, `--titles`, `--descriptions`, up to five each, with `--link-url`. The full button list is in the command reference. |
| Create the ad, named by ID | ad-launch | `ads_create_ad` (creates paused) | `ad create --adset-id <id> --name <ad ID> --creative-id <id> --status PAUSED` | docs 2026-10-20 | The name is the ad ID and nothing else. `--pixel-id` attaches the data source for tracking. |
| Preview per placement | ad-launch | `ads_get_ad_preview` (Feed, Story, Reels) | none | docs 2026-10-20 | Without the connector, the operator opens the ad in Ads Manager before approving. |
| Boost an organic Instagram post | none | `ads_boost_ig_post` | none | docs 2026-10-20 | Not used: no ID thread and no paused step documented. |

## Change (level 2 pre-approved actions, or a fresh approval)

| Action | Needed by | Connector | Command line | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Activate | ad-launch, ad-manage | `ads_activate_entity` (Meta's page: starts spending budget) | `campaign update`, `adset update` or `ad update` with `--status ACTIVE` | docs 2026-10-20 | The one call that spends. After the approval line, for the named objects only. |
| Pause | ad-manage | `ads_update_entity` with the status (its fields are not listed on the page) | `campaign update`, `adset update` or `ad update` with `--status PAUSED` | docs 2026-10-20 | A paused campaign pauses everything inside it; pause the smallest object the decision names. Undo: the same call with ACTIVE. Does not restart review. |
| Change a budget inside the band | ad-manage | `ads_update_entity` (budget fields not described on the page) | `campaign update --daily-budget <cents>` or `adset update --daily-budget <cents>`, on whichever object holds the budget | docs 2026-10-20 | Cents. Does not restart review. Undo: the previous integer. |
| Rename an object | ad-manage | `ads_update_entity` | `campaign update --name`, `adset update --name`, `ad update --name` | docs 2026-10-20 | Ad names stay the ad ID; renaming an ad is never routine. |
| Swap the creative on a live ad | none | `ads_update_entity` | `ad update --creative-id <id>` | docs 2026-10-20 | Never: it blends two creatives' results under one ID (Meta kit review). A new creative is a new ad with a new ID. |
| Archive | ad-manage | unknown | `campaign update`, `adset update` or `ad update` with `--status ARCHIVED` | docs 2026-10-20 | A deletion under spend authority: fresh approval. Cannot return to active; only name and status can change afterwards. |
| Delete | ad-manage | none | `campaign delete`, `adset delete`, `ad delete` (`--force` skips the tool's own confirmation; never pass it) | docs 2026-10-20 | Never routine. Fresh approval. Results may keep counting for 28 days after delivery. |
| Custom audiences: create, update, add or remove people, delete | ad-setup | `ads_create_custom_audience`, `ads_update_custom_audience`, `ads_update_custom_audience_users` (hashed data), `ads_delete_custom_audience`, plus the three read tools | none | docs 2026-10-20 | A people upload is the business's decision and the business's data; it never passes through a repo. Audiences are suggestions in the default structure. |
| A/B test (split test) | ad-strategy, ad-launch | `ads_experiment_check_eligibility`, `ads_experiment_abtest_create_test` (test cells), `ads_experiment_abtest_get_test`, `ads_experiment_abtest_update_test` (edit or cancel), `ads_experiment_list_tests` | `study list` | docs 2026-10-20 | Not Ads Manager's creative testing feature. What can be split and how budget divides is not on the page. |
| Conversion lift study | none | `ads_experiment_lift_create_test`, `ads_experiment_lift_get_test` | none | docs 2026-10-20 | Not used at the hub's volumes. |

## A person, in Ads Manager (nothing found in either tool on the date)

| Action | Needed by | Connector | Command line | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Creative testing feature: new ads into a live set with a fixed budget share | ad-launch | none found | none found | person 2026-10-20 | Ads Manager, ad level, creative testing (course review 19.3). Otherwise the new ads enter the set directly at the test plan's share. |
| Automated rules | ad-manage | none found | none found | person 2026-10-20 | The hub's scheduled sessions do this job; rules are optional (course review 18.2). |
| Value rules | ad-setup | none found | none found | person 2026-10-20 | Advertising settings. A play, not a default. |
| Change the attribution setting after creation | ad-setup | unknown | `--attribution-spec` exists on `adset create` only; no update flag | person 2026-10-20 | Set at creation. A later change is a tracking change: fresh approval, and a person. |
| Location expansion toggle ("reach more people") | ad-setup | unknown | unknown; the targeting JSON field is not confirmed | unknown | `defaults.md`. Until known: check the ad set in Ads Manager after creation and record what it shows. |
| Creative enhancements | ad-launch | unknown | `creative create --degrees-of-freedom-spec @file.json` exists; its contents are not confirmed | unknown | Default off for a first ad (course review 14.3). Check in Ads Manager after creation until known. |
| Partnership ads (a creator's handle on the ad) | ad-launch | unknown | unknown | unknown | |
| Limit what an agent may do on the account (the second lock) | ad-setup | the token's permissions: `ads_read` without `ads_management` is read-only; `ads_mcp_management` is always required | the system user's token scopes and asset access | docs 2026-10-20 | Meta's get-started page names no other rule for agents. Record the lock in `ads/authority.md`. |
| Account standing: rejections, warnings, payment, appeals | ad-manage | the help tool reads; nothing acts | none | person 2026-10-20 | Appeals and payment methods are the business's, in Ads Manager (launch sequence, account protection). |
