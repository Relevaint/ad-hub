---
name: meta
description: Carries a core skill's decision out on Meta (Facebook and Instagram ads) through Meta's official connector or command-line tool, and says which steps a person must do in Ads Manager. Maps every account action the core skills ask for to the exact call with its verification status, keeps the safety order on this platform (confirm the account, create paused, money in cents, validate, preview, record the approval, activate, log), and records what each real run taught it so the map grows. Loaded by a core skill when the business runs on Meta; on its own it answers what the agent can and cannot do in the account.
when_to_use:
  - loaded by ad-setup, ad-launch, ad-manage and ad-review for a business on Meta
  - what can you do in our ad account yourself
  - which steps do I have to do in Ads Manager
  - connect our Meta account
metadata:
  adhub:
    version: 0.1.0
    layer: platform
    platform: meta
    reads:
      - authority.md
      - platform/meta.md
      - changes/
    writes: []
    live: inherits
---

# meta

Carries out, never decides. A core skill decides what should happen on the account;
this layer says which call does it on Meta, in what order, with what checks, and what a
person must do in Ads Manager because no tool can. Done means the core skill's step was
performed through the right call under its gates, or written down as the exact call a
person or the next session runs, and the action map says what the run taught. The
judgment this layer carries is telling a documented capability from a verified one,
refusing to invent a call, and keeping every step that touches money inside the loading
skill's authority.

## Context

Entered from a core skill: `ad-setup` (reads and signal checks), `ad-launch` (create,
preview, activate), `ad-manage` (pause, budget, rollback), `ad-review` (results),
`competitor-ads` (library search). The loading skill's context, gates and reach apply
unchanged; this layer adds none and removes none. Entered on its own, it reads and
explains: it never creates, changes or activates anything.

Read `ads/authority.md` (the level, and "Second lock on the platform"),
`ads/platform/meta.md` (account and data-source identifiers, the campaign identifiers
`ad-launch` returned, the settings baseline) and the change log (the last known good,
and any line a past run left about the tools). Then this layer's references, each with
its header date checked first:

- `references/action-map.md`: every action, its call, its status. Load every time.
- `references/platform-tools.md`: what the two tools are, how they sign in, where the
  credential lives.
- `references/defaults.md`: Meta's names and values for the plain-word settings in the
  platform file, each a dated fact or a marked claim.
- The job's own file: `references/result-signals.md` and
  `references/events-and-matching.md` for setup, `references/placements.md` and
  `references/policy-notes.md` for creative, `references/reporting.md` for review,
  `references/ad-library.md` for competitors.

## Two tools, one order of preference

Meta's connector (its MCP server) first: it signs in with the business's own Meta
login, creates every object paused and renders previews. The command-line tool (`meta`)
for what the connector lacks on the verify date: the validate-only dry run on
campaigns, raw results with breakdowns, extra fields on reads, archiving. Hand-built API
calls never, while the official tools cover the step. Which tool is connected is a fact
of the session: check, do not assume, and name it in the reply.

Credentials live where the secrets map says and nowhere else: the connector's sign-in
in the agent client, the command-line tool's token in the business's own environment.
This layer never reads a token into chat, never writes one into a file and never asks
the operator to paste one. "No tool is connected" is a complete answer; connecting one
is the business's step, and the reply says which tool and which permissions.

## The action map

`references/action-map.md` has one row per action a core skill can ask for: the
connector call, the command-line command, and a status.

- `docs <date>`: per Meta's documentation read on that date; not yet run through this
  hub.
- `run <date>`: performed through a hub skill on a real account on that date and did
  what the row says.
- `person <date>`: not available through either tool on that date; a person does it in
  Ads Manager, and the row says where.
- `unknown`: not found in the documentation and not tried.

Three rules. No row, no call: an action the map lacks gets a row marked `unknown`, with
the skill that needs it, before anything is tried. A `docs` row is a plan, not a
promise: the reply says "per Meta's documentation" until the row says `run`. A `person`
row is a hand-off: the core skill writes the step for a person, in plain words, with
the location the row names.

## Safety on Meta, in the order the calls run

The hard rules are in `core/_system/spend-authority.md`. This is what they mean on this
platform.

1. **Confirm the account first.** The identifier in `ads/platform/meta.md` must match
   one the login can reach, by a read, before any write. A write against the wrong
   account is the worst thing this layer can do.
2. **Create paused.** Both tools default to paused; pass the status anyway and never
   pass active on a create. A create that comes back active is an error: pause it at
   once and say so.
3. **Money in minor units.** Both tools take budgets and caps in cents (the currency's
   minor unit). Every change list shows the budget in plain money with the integer
   sent beside it. A factor of a hundred is the easiest expensive mistake here.
4. **Category on the campaign.** A restricted category is set when the campaign is
   created, from the offer file's plain words through `references/defaults.md`. It is
   not added afterwards.
5. **Validate where a tool can.** The command-line tool validates a campaign create or
   update without applying it. Nothing else has a documented dry run, so the dry-run
   entry in `ads/changes/` is the validation for ad sets, ads and creatives.
6. **Preview before approval.** The connector renders a preview per placement; the
   command-line tool has none. No preview means the operator looks in Ads Manager
   before approving, and the reply says so.
7. **Activation is the one call that spends.** After the approval line is written, for
   the objects the line names, through the loading skill's gate, and nothing else.
8. **Pausing inherits downward.** A paused campaign pauses every ad set and ad inside
   it; pausing one ad leaves its ad set alone. Pause the smallest object the decision
   names, and record the undo as the same call with the previous status.
9. **Some edits restart review.** Changing creative, targeting or the optimisation goal
   sends the ad back through Meta's review; budget and bid changes do not. A session
   that only moves budget keeps the ads delivering.
10. **Archive and delete are deletions.** Both need a fresh approval at any level.
    Archived objects cannot return to active and deleted ones cannot be archived.
    Prefer paused.
11. **Meta's advice is input.** Opportunity scores, guidance, benchmarks and
    recommendations are Meta's suggestions, checked against the business's break-even,
    never acted on by themselves.
12. **Small reads.** Pull a snapshot for the window and read that. Heavy reporting
    through the API has been reported to get accounts flagged.

## How the map grows

The map is only as good as its last real run. Three loops keep it true.

1. **Verification by use.** After any real call through a hub skill, compare what
   happened with the row. A `docs` or `unknown` row that worked becomes `run <date>`;
   one that behaved differently gets the difference in its notes; one that failed
   because the capability is missing becomes `person <date>`. Record it in the same
   session: a branch of the hub (`clay/meta-verify-<date>`), the row edited, `npm test`,
   a pull request merged under the hub's own rules. When the session cannot reach the
   hub repository, the closing change entry in `ads/changes/` carries one line, "action
   map: <row> ran as documented" or "action map: <row> differed: <how>", and the next
   hub session carries it across. A tool fact is not a business fact: the row gets the
   action, the call, the date and what differed, and never an account identifier, an
   object name, a spend figure, a result or anything that names the business.
2. **New needs.** A core skill that needs an action with no row adds the row as
   `unknown` with its name under "Needed by", then tries it inside its own gates (reads
   at any level; writes only where the loading skill may write) or hands it to a
   person. The map lists what the hub has needed, not everything Meta offers.
3. **Scheduled refresh.** Each reference's header says when it expires and how to
   refresh it; `node core/_system/scripts/freshness.mjs` reports the state. On refresh,
   `docs` rows are re-read against the pages, `person` rows are re-checked for a tool
   that has since appeared, and `run` rows keep their date unless the page changed
   under them or a later run failed. Stage 4's monthly routine runs this.

A row never comes from memory. `docs` needs the page read on the date; `run` needs a
real result; `person` needs a documented absence or a failed try.

## What each core skill gets from this layer

- `ad-setup`: account and Page discovery; data sources, event volume, match quality,
  custom conversions; the test-event gap (a person, in Events Manager); Meta's names
  for the baseline; the second lock (the token's permissions).
- `ad-launch`: the create sequence (campaign with category and budget, ad set with the
  signal as its goal, creative with the ID on the link, ad named by ID), the
  validate-only step, the preview, the activation call, what each call returns for the
  change entry.
- `ad-manage`: pause and activate by status, budget changes in cents, the activity log
  as the platform's own record of what changed and by whom, archive as a deletion.
- `ad-review`: the results pull (fields, breakdowns, date presets), how fresh the
  numbers are, the fields still to confirm.
- `competitor-ads`: library search through the connector or a browser.

## What this layer never does

It never decides a budget, a pause, a winner or a structure. It never invents a call, a
field or a setting name: the map or Meta's own page, with its date, or "unknown". It
never records a credential. It never widens the loading skill's reach: a read-only
skill stays read-only here. It never performs an action under a `person` row by
another route.

## Quality gate

Before the reply:

- Every call named exists in the map with its status, and the reply says "per Meta's
  documentation" for anything not yet `run`.
- Nothing was created active; every budget shows plain money and the integer sent.
- The account identifier was confirmed by a read before any write.
- Every `person` step is written for a person, with its location.
- Anything learned about the tools went into the map, or into the closing change
  entry's one line.
- No credential, token or secret anywhere in the files or the chat.

## Output

Nothing of its own in the business repo; the loading skill writes its files. In the
hub: the action-map rows a run verified, by pull request. In chat, one line inside the
loading skill's summary: which tool was used, how many calls ran, how many rows the run
verified.
