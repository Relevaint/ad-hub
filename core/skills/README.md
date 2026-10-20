# Core skills

Platform-neutral. One folder per skill. All nine are built (2026-10-19 and 2026-10-20);
each has run against its regression requests and none has yet run in a real business repo.

| Skill | Job | Reaches live accounts |
|---|---|---|
| `start-here` (built) | Unclear requests; adding a business or an offer; what blocks going live | No |
| `audience-research` (built) | Who buys, in their own words, from sources read; ranked customer types | No |
| `competitor-ads` (built) | What others are running, observed apart from inferred; swipe file | No |
| `ad-strategy` (built) | Diagnosis, gaps, plays, the batch with IDs and tags, test design | No |
| `ad-creative` (built) | Copy and finished ads per placement; claims and policy gate | No |
| `ad-setup` (built) | Result signal, tracking verified, category, settings baseline, change list | Reads and dry runs only; creates nothing |
| `ad-launch` (built) | Gates, approval record, create paused, preview, activate, log with undo | Yes, under recorded authority |
| `ad-manage` (built) | Daily watch for emergencies only; scheduled sessions under the rulebook; rollback | Yes, under recorded authority |
| `ad-review` (built) | Results by ID from both sources; judged on the deciding metric; learnings at the bar only | No (read-only) |

`ad-strategy/references/plays.md` is the plays library; `ad-strategy` scout mode refreshes it
from a hub session.

The platform skill for Meta, `meta-system/SKILL.md`, is loaded by `ad-setup`, `ad-launch`,
`ad-manage` and `ad-review` when the business runs on Meta. It is not a core skill and gets
no pointer; it maps each account action to a tool call with a dated verification status.
