# Meta layer

The thin layer that carries core decisions out on Meta (Facebook and Instagram ads).
It holds Meta's dated facts and tool how-to. It makes no strategic decisions; those
belong to the core skills.

**Status (2026-10-20): skill built from Meta's documentation; nothing has run on a real
account yet.** `SKILL.md` is the entry. `ad-setup`, `ad-launch`, `ad-manage` and
`ad-review` load it when the business runs on Meta; `competitor-ads` and `ad-creative`
load the references they name. Every row of the action map is `docs`, `person` or
`unknown` until a real run makes it `run`. See `BUILD-PLAN.md`, stage 3.

## What this layer owns

- `SKILL.md`: how a core skill's step is performed on Meta, the safety order on this
  platform, and how the action map grows from real runs (verification by use, new
  needs, scheduled refresh).
- `references/action-map.md`: one row per action a core skill can ask for, with the
  connector call, the command-line command and a dated status.
- `references/defaults.md`: Meta's names and values for the plain-word settings the
  platform file records; the sources' defaults kept as marked claims.
- The dated references below: placement shapes, policy wording, result-signal routes,
  event verification, reporting, the Ad Library, and the tools themselves.

## References

| File | Holds | Load when |
|---|---|---|
| `references/action-map.md` | Which call does which hub action, and whether it has run | Every time the Meta skill is loaded |
| `references/platform-tools.md` | What Meta's official connector and command-line tool are, how they sign in, where credentials live | Before any account read or write |
| `references/defaults.md` | Meta's names for the settings baseline; defaults as claims | When writing or executing `ads/platform/meta.md` |
| `references/result-signals.md` | How each funnel type sends its result back to Meta | During `ad-setup` |
| `references/events-and-matching.md` | Test events, deduplication, customer matching fields; how to see a result arrive | During `ad-setup`, after the signal is chosen |
| `references/ad-library.md` | What Meta's Ad Library shows for which ads, and how to reach it | During `competitor-ads` |
| `references/placements.md` | Shapes, durations and copy field lengths per placement | During `ad-creative`, before making assets |
| `references/policy-notes.md` | Meta's personal-attributes standard with its examples; special ad categories | During `ad-creative` and `ad-setup` |
| `references/reporting.md` | How fresh Meta's numbers are, how to pull them, the fields for the explaining metrics | During `ad-review`, before a snapshot |

Every file here carries a last-verified date and a refresh instruction. Check it before
relying on the content. `node core/_system/scripts/freshness.mjs` reports every file's
state.
