# Meta's official tools for agents (perishable: check the header first)

last-verified: 2026-10-19 · ttl-days: 30 · refresh: re-read Meta's developer documentation for "ads AI connectors" (the Ads MCP server overview, get-started and the tool pages per category; the Ads CLI overview and command reference); run `pip index versions meta-ads` and `meta ads --help` for the command-line tool; update every line below and bump last-verified.
changes: 2026-10-03, first written from Meta's documentation and the tool's own help output (version 1.2.0). 2026-10-19, connector tool names and behaviours re-read from Meta's tool pages; command-line defaults re-read from the command reference. 2026-10-20, PyPI still lists 1.2.0 as the latest release; `meta ads --help` not run, the tool is not installed on this platform.

Load before any account read or write, and when deciding whether a step can be done by
the agent or must be handed to a person.

## What exists

Meta released official tools for AI agents on 2026-04-29: a connector (an MCP server)
and a command-line tool. On 2026-07-16 Meta added support for using your own developer
app, and rules that let whoever has full control of a business portfolio limit what an
AI agent may do on the ad account.

Use these before any hand-built API code. Earlier guides that start with creating a
developer app and a system-user token predate them.

Documentation lives under `developers.facebook.com/documentation/ads-commerce/`, with a
plain-text index at `.../llms.txt` that lists every page. The pages are readable from a
plain request on the verify date.

## Connector (MCP server)

Endpoint per Meta's documentation: `https://mcp.facebook.com/ads`. Sign-in is with the
business's own Meta login; the token scopes named on the get-started page include ads
management and ads read. Meta describes the tools as permission-scoped, in seven
categories: comprehensive reporting, ad creation and management, catalog creation and
management, signals and datasets, help and troubleshooting, A/B tests and conversion
lift studies, activity logs.

Tools documented on 2026-10-19, by what the hub's skills need:

- **Create, paused.** `ads_create_campaign`, `ads_create_ad_set` and `ads_create_ad` each
  create the object paused; Meta's page says write tools create entities in a paused
  state and the client asks for confirmation before activation.
- **Activate.** `ads_activate_entity` changes a paused campaign, ad set or ad to active
  and, in Meta's words, starts spending budget. It is the one call that spends.
- **Update.** `ads_update_entity` updates fields on an existing campaign, ad set or ad.
  The page does not describe a separate pause action; pausing is an update of status.
  Budget changes after creation are not described on the page.
- **Preview.** `ads_get_ad_preview` renders an ad or creative in a given placement.
- **Creative.** `ads_create_creative` makes a single-image link creative, with placement
  customisation and multi-media options of limited availability; image and video
  listings exist.
- **Query.** `ads_get_ad_entities` searches campaigns, ad sets and ads and is the main
  reporting tool; `ads_get_field_context` describes fields.
- **Ad Library.** `ads_library_search` searches the public library.
- **Audiences.** Custom audience create, read, update, user upload, delete.
- **Experiments.** `ads_experiment_check_eligibility`, `ads_experiment_abtest_create_test`
  (test cells), `..._get_test`, `..._update_test` (edit or cancel), lift study create and
  get. Nothing on the page names Ads Manager's creative testing feature or a budget split
  for new creatives.
- **Signals.** `ads_get_datasets`, `ads_get_dataset_details` (including Conversions API
  setup), `ads_get_dataset_stats` (event volume, up to 28 days, split by device or
  source), `ads_get_dataset_quality` (Event Match Quality, per-key coverage, freshness);
  pixel event rules and parameters, custom conversions. No tool sends a test event or
  reads the Test Events window.
- **Activity log.** `ads_account_get_activity_logs`, scoped by object, time window, event
  category or user, mirroring the campaign history page. The fields returned are not
  listed on the page.
- **Accounts and Pages.** Listing tools for ad accounts, Pages and Instagram accounts;
  `ads_boost_ig_post` boosts an organic post.

## Command-line tool

Package `meta-ads` on PyPI, command `meta`, version 1.2.0 on both verify dates. Needs
Python 3.12 or later.

Command groups (from the 2026-10-03 help output): `ad`, `adaccount`, `adset`, `campaign`,
`catalog`, `creative`, `dataset`, `guidance`, `insights`, `page`, `product-feed`,
`product-item`, `product-set`, `study`.

From the command reference, read 2026-10-19:

- `campaign create`, `adset create` and `ad create` take `--status`; the default is
  `PAUSED`. `campaign create` and `campaign update` take `validate_only`, a dry run that
  validates without creating or applying anything. The reference does not list it for
  ad set or ad creation.
- `campaign create` takes an objective (sales, leads, traffic, awareness, engagement,
  app promotion), a daily budget in cents, a special ad category (credit, employment,
  financial products and services, housing, issues and politics, online gambling, or
  none), and a lifetime spend cap.
- Updates take a new status (`ACTIVE`, `PAUSED`, `ARCHIVED`) and new daily or lifetime
  budgets in cents; only the flags passed are sent.
- `creative create` uploads an image or a video, builds multi-image and multi-text
  creatives, can reuse an existing post, supports catalogue creatives, and takes
  tracking parameters for the destination link.
- `insights get` prints the raw API response, filtered by campaign, ad set or ad, with
  date presets or ranges, a time increment and a breakdown. It has no "level" option.
- `dataset` manages pixels; `study` manages experiments; `guidance` returns Meta's
  recommendations. The reference does not mention ad previews.

## Not yet verified

Whether either tool can: set up Ads Manager's creative testing feature; create
automated budget rules; create or apply value rules; change the attribution setting;
switch off the local "reach more people" expansion; control individual creative
enhancements; set up partnership ads; send a test event or read the Test Events window.
Whether the connector offers a validate-only dry run. What the business-side rules
limiting an agent look like: Meta's overview calls the tools permission-scoped and
names no rules page. Check each when the skill that needs it runs against a real
account. Until then, plan for a short hand-off list a person completes in Ads Manager.

## Standing cautions

- Treat Meta's recommendations and its assistant's suggestions as input to check.
- Platform data for the most recent two to three days is still settling.
- Heavy reporting through the API has been reported to get accounts flagged. Take a
  small daily snapshot and analyse that.
- Activation is the one call that spends. Everything else can be undone without cost.
