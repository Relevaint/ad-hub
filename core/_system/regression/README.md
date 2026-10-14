# Regression cases

Five synthetic businesses, one for each acceptance case in the root
[README](../../../README.md#acceptance-cases). Each case tests that the hub stays universal
and that its hard rules hold under realistic pressure. They are not client facts and
not performance evidence. Every name, number and quote in them is invented.

| Case | What it exercises |
| --- | --- |
| [01-digital-product](01-digital-product/evaluate.md) | Purchase sent with its value at checkout; ROAS; no lead stages; an unverified signal blocks go-live |
| [02-local-service](02-local-service/evaluate.md) | Lead, then sale through CRM stages; low volume; slow cadence and patience; a capacity emergency |
| [03-real-estate](03-real-estate/evaluate.md) | Restricted category; long cycle; early signal sent back; exact compliance strings |
| [04-consultancy](04-consultancy/evaluate.md) | Never reaches learning thresholds; trust-building plays; decisions on thin data; permissions on proof |
| [05-new-business](05-new-business/evaluate.md) | One sentence of context; drafting still works; unknowns stay unknown; nothing goes live |

## Layout

Each case has two parts that must never be shown together:

- `business/` is the client folder. It holds the business notes under ordinary headings,
  and, where the case calls for it, an `ads/` folder filled in with the
  [schemas](../schemas/).
- `evaluate.md` holds the planted traps, the requests, and the pass criteria for each
  skill. The agent under test never sees it.

## How to run a case

1. Copy the case's `business/` folder somewhere outside the hub, such as a scratch folder.
   That copy is the client folder. Never let a run write inside the hub.
2. Start a fresh agent and give it only three things: the hub path, the client folder,
   and one request from `evaluate.md`, word for word. Do not give it `evaluate.md`,
   other cases, or earlier outputs.
3. When it finishes, judge the files it wrote against the pass criteria before reading
   anything it says about its own work. For finished creative, look at the actual render.
4. Record the verdict: case, request, hub commit, and pass or fail on each criterion with
   a line of evidence. Put it in the PR that changes the skill and in the `HANDOFF.md`
   Last Session block. A verdict is about the hub, so it never goes into a business repo
   or a learnings file.

No ad account is connected in a regression run. Requests that would reach a live account
pass when the skill stops at the right gate, or produces the exact change list, and says
it could not carry it out.

## When to run

- Before a skill counts as done (`BUILD-PLAN.md`): every request for that skill, in every
  case that has one.
- When a skill, or a system file it reads, changes: that skill's requests again.

Skills not built yet have requests waiting here; the requests are written against each
skill's brief in `BUILD-PLAN.md`. When a brief and a case disagree, fix one of them in the
same PR and say which.

A passing case is not proof that ads will perform.

`npm test` checks the structure of every case (both parts present, requests named after
real skills). It does not run them; running a case needs a fresh agent.
