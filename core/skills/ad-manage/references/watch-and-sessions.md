# The watch and the session: questions, emergencies, rules and arithmetic

Load every time. The hard rules are in `core/_system/spend-authority.md` and the skill;
the rest are defaults from the course review, the Meta kit review and the second
creator's review, each marked.

## The five daily questions (Meta kit review)

1. Is spend on track? Yesterday's spend and the month to date against the daily and
   monthly ceilings in `ads/authority.md`.
2. What is running? Live rows in the ledger against what the account shows.
3. What is doing well? Read, not judged: the deciding metric per ad over the window,
   with the last two to three days set aside.
4. What is bleeding? Spend with no result, against the rulebook's pause line. Noted for
   the session; paused only at the session, unless an emergency.
5. What is fatiguing? Frequency rising while cost per result worsens. Noted for the
   session, with the replacement the next batch should hold.

## The emergency list

| Condition | Evidence | Action under a ticked emergency stop | Without the box ticked |
| --- | --- | --- | --- |
| Spend past the daily ceiling | Platform spend today above the ceiling | Pause the ad set; report | Prepare the pause; ask now |
| Spend while the signal is silent | Spend continues, no result events arriving since a stated time | Pause; report; `ad-setup` checks the path | Prepare; ask |
| Destination down | Page or checkout unreachable | Pause; report | Prepare; ask |
| Rejections or an account warning | Several ads rejected at once, or a platform warning | Pause the affected ads; report; never resubmit unchanged | Prepare; ask |
| At capacity or out of stock | The business says so, or the calendar's window has arrived | Pause spend for the offer; report; recommend the business records the limit and the end date through `start-here` | Prepare; ask |

A pause for an emergency is logged like any change, with its undo (resume) and the
condition that called for it. Budget is never moved to another offer or audience as a
substitute for pausing.

## What a bad day is not

One bad day is noise. A week of rising cost is a signal (Observed, basics review). The
most recent two to three days are still settling. A new ad looks worse than an
established one for its first day or two. None of these is an emergency; all of them
wait for the session.

## The session checklist

1. Confirm the session is due: the test plan's date, or the business called one. A
   session on a different day is a decision, written down.
2. Pull the snapshot for the window; set the last two to three days aside.
3. Per live ad: spend, results on the deciding metric, cost per result or ROAS against
   break-even, frequency, and the explaining metrics (hook rate, link click rate,
   landing views) only to explain.
4. Apply the rulebook, rule by rule, writing the outcome of each.
5. Decide inside the bar; write the confidence or the direction-across-periods behind
   each call, or write "below the bar, waiting".
6. Choose the one type of change for this session.
7. Check the level and the ticked boxes; anything outside them becomes a question with
   a prepared change list.
8. Carry out, log, move rows, write the last known good.
9. Say the next session date and what would settle the open questions.

## The pause rule, illustrated

Default from the test plan: pause at a session once an ad has spent about twice
break-even with no result on the deciding metric. Illustrative, invented numbers:
break-even $76.50 per booked estimate, pause line about $153; an ad at $55 with no
result is below the line and waits; at $160 with no result it is paused at the session.
The second creator's faster rule (twice the account's average cost per result with no
result; two and a half times with one) is an option with the multiples set per offer;
by chance alone it cuts about one in seven ordinary ads, so it suits accounts with
plenty of replacements ready (claude-mcp-update review).

## The confidence bar, illustrated

About 90% that one ad beats another on the deciding metric, or the same direction
across several independent periods (course review, 17.1). A $45 against a $125 cost
per result settles on few results; $45 against $48 needs many. Two results tell
nothing. Below the bar the session may still pause under the spend-with-no-result
line, because that rule is about money at risk, not about who is better.

## Fatigue

Check frequency at the ad level. Around three or above with worsening cost reads as
fatigue; under two, look elsewhere (the warm pool exhausted, the offer too weak for
cold traffic). The fix is a meaningfully different creative: a new format, style or
hook, not a small edit. Keep testing so replacements are ready before they are needed
(course review, 24.1).

## The band, illustrated

From `ads/authority.md`: scale up by a small step while the metric is better than the
upper threshold, hold between the thresholds, scale down past the lower one, inside a
floor and a ceiling, judged on the lookback. Illustrative: break-even $100, scale up
under $60, hold $60 to $80, scale down over $80, step 3% a day or one manual step a
week, lookback seven days, minimum impressions before any move. Manual steps are
bigger and rarer and shrink as the budget grows; after a step, hold about a week
(course review, 18.2, 18.3). No band set means no moves.

## One type of change

Pausing weak ads and activating approved replacements is one type. A budget move
inside the band is another. Changing targeting, attribution, bidding or objective is a
business decision carried out only under a fresh approval, and never in the same
session as anything else. Every change resets the platform's learning; batching keeps
the resets to one (course review, 17.7).

## Rollback

The last known good is the state written into the closing entry of the last session
that left results healthy: which ads were live, at what budgets and settings. When a
change hurts, revert to it first. The revert is its own entry, naming the one it
undoes (spend-authority, "Rollback").

## Troubleshooting order (course review, 24)

1. Signal: has it gone silent or changed? Hand to `ad-setup`.
2. Outside events: the calendar, the season, the market, competitors. Note before
   blaming a change (25.3).
3. Offer and page: zero results on reasonable spend is almost always the offer (7.1).
4. Fatigue: frequency and cost together (24.1).
5. The warm pool: exhausted when frequency is low but results fall (24.1).
6. Creative: the hook or the body, by the explaining metrics (17.4, 17.5).
7. Campaign reset: relaunch the same ads in a new campaign, last resort (24.2).

## What each level permits here

| Action | Level 1 | Level 2 with the box ticked | Any level, always a fresh approval |
| --- | --- | --- | --- |
| Pause under the rulebook | Ask, with the list | Do, log | |
| Emergency stop | Ask, with the list | Do, log | |
| Budget move inside the band | Ask | Do, log | Outside the band |
| Activate approved replacements in the existing set | Ask | Do, log | New campaign or ad set |
| Change objective, optimisation, attribution, tracking | | | Always |
| Anything in a restricted category | | | Always |
| Raise a ceiling | | | Never by this skill; the business only |

## When no tool is connected

The session or the watch still runs on the files: the snapshot, the ledger, the test
plan. Decisions are written as a change list in `ads/changes/`, each entry marked
`Result: not carried out, no tool connected`, with the undo for each line, and the reply
says a person can carry it out in the platform's own interface and report back so the
entry can be completed. Nothing is recorded as confirmed.
