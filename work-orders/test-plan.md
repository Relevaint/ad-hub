<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: What to make and test next (`test-plan`)

**When the ask is:** "plan the first test batch", "plan the next batch", "what should we test next", "plan our ads for the next month", "test plan", "what should we make next", "ad strategy for this offer"

**Owner:** `ad-strategy` (Plan)
**Part of:** [`ad-program`](ad-program.md)
**Live account:** not reached

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-strategy/SKILL.md](../core/skills/ad-strategy/SKILL.md)
2. [core/skills/ad-strategy/references/test-design.md](../core/skills/ad-strategy/references/test-design.md)
3. [core/skills/ad-strategy/references/plays.md](../core/skills/ad-strategy/references/plays.md)
4. [core/_system/schemas/diagnosis.md](../core/_system/schemas/diagnosis.md)
5. [core/_system/schemas/test-plan.md](../core/_system/schemas/test-plan.md)
6. [core/_system/schemas/ledger-row.md](../core/_system/schemas/ledger-row.md)

## Needs

- Required: the offer file, or the offer in a sentence
- Helps, never blocks: research files; the ledger and latest snapshot; authority ceilings; learnings

## Layers

### 1. Diagnose (`diagnosis`)

- **Build:** One or two sentences: why these ads, for whom, and what is wrong or missing right now.
- **Method:** [ad-strategy/SKILL.md, "1 diagnose in one or two sentences"](../core/skills/ad-strategy/SKILL.md#1-diagnose-in-one-or-two-sentences)
- **Check:** Is it one or two sentences a stranger could act on, naming who the ads are for and what is missing now?
- **Evidence:** The ledger, the latest snapshot and the learnings that were read; the sentence itself.
- **If it fails:** Pick one diagnosis. When the data cannot support one, say results are too few to judge and plan for that.

### 2. Check the offer first (`offer-check`)

- **Build:** A read of the offer before any creative: the ask against the value, the proof an ad can lean on, true urgency.
- **Method:** [ad-strategy/SKILL.md, "2 check the offer before any creative"](../core/skills/ad-strategy/SKILL.md#2-check-the-offer-before-any-creative)
- **Check:** Does the ask fit the value, and is there proof an ad can lean on, before any creative is planned?
- **Evidence:** The offer file's price, ask, proof table and limits.
- **If it fails:** Say the offer needs a change first. Plan around the changed offer, or hand back to start-here when the change is the business's decision.

### 3. Run the gap checks (`gaps`)

- **Build:** A gap table across customer type, awareness, format, style, breadth and origin; three or four message pillars.
- **Method:** [ad-strategy/SKILL.md, "3 run the gap checks"](../core/skills/ad-strategy/SKILL.md#3-run-the-gap-checks)
- **Check:** Does each gap come from comparing the research and the ledger's tags with what the live ads address, not from a guess?
- **Evidence:** The gap table with the research sections and ledger rows it was built from, or the stated absence of research.
- **If it fails:** Without research, say the customer types are the business's own description and label the gaps as assumptions.

### 4. Choose the plays (`plays`)

- **Build:** The plays to test, each with its one-sentence reason, inside the risk budget.
- **Method:** [ad-strategy/SKILL.md, "4 choose the plays"](../core/skills/ad-strategy/SKILL.md#4-choose-the-plays); [ad-strategy/references/test-design.md, "mix and risk"](../core/skills/ad-strategy/references/test-design.md#mix-and-risk)
- **Check:** Can each play's reason be said in one sentence for this offer, inside the risk budget, with none picked against a learning?
- **Evidence:** The plays library rows, the authority file's risk budget, the learnings.
- **If it fails:** Drop the play, or give it the new angle a failed learning asks for.

### 5. Build the batch (`batch`)

- **Build:** One ledger row per ad, created as planned: ID, tags, and one sentence saying what it tests that the others do not; one testing focus for the batch.
- **Method:** [ad-strategy/SKILL.md, "5 build the batch"](../core/skills/ad-strategy/SKILL.md#5-build-the-batch); [ad-strategy/references/test-design.md, "what each batch tests the ladder"](../core/skills/ad-strategy/references/test-design.md#what-each-batch-tests-the-ladder)
- **Check:** Does every row have an ID in the right form, every tag filled, and a reason no other row shares?
- **Evidence:** The rows read side by side; the plan's focus line.
- **If it fails:** Two rows with the same reason are one ad: cut or change one. Padding is removed.

### 6. Design the test from this offer's numbers (`test-design`)

- **Build:** The bar, the time to a confident answer, cadence, batch size, spend inside the ceilings, and the rulebook ad-manage will apply.
- **Method:** [ad-strategy/SKILL.md, "6 design the test from this offers numbers"](../core/skills/ad-strategy/SKILL.md#6-design-the-test-from-this-offers-numbers); [ad-strategy/references/test-design.md, "time to a confident answer"](../core/skills/ad-strategy/references/test-design.md#time-to-a-confident-answer); [ad-strategy/references/test-design.md, "the rulebook per offer"](../core/skills/ad-strategy/references/test-design.md#the-rulebook-per-offer)
- **Check:** Do the bar, window, cadence, batch size and spend come from this offer's own numbers and ceilings, with volume sourced or stated once as an assumption?
- **Evidence:** The offer file's break-even with its working; the authority ceilings; the calendar; the arithmetic shown.
- **If it fails:** Replace the rule of thumb with the offer's figure. When volume is too low to judge the batch, make the batch smaller or the window longer and say so.

### Whole output (`whole`)

- **Method:** [ad-strategy/SKILL.md, "quality gate"](../core/skills/ad-strategy/SKILL.md#quality-gate)
- **Check:** Could ad-creative make this batch and ad-manage apply this rulebook without asking anything, with no live ad, budget or ID touched?
- **Evidence:** The diagnosis, test plan and ledger read in order; the account untouched.
- **If it fails:** Fix the layer that left the question open.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| The offer's price, numbers, ask or proof change | `offer-check`, `batch`, `test-design`, work order [`ad-batch`](ad-batch.md) | Break-even and every row that leaned on the old proof. |
| Audience research adds or renames a customer type | `gaps`, `batch` | A type name already carried by a live ad is not renamed. |
| A learning is written for this offer | `plays`, `batch` | A learning outranks a play. |
| Ceilings, the risk budget or the testing share change | `plays`, `test-design` | The plan's spend must still fit. |
| The calendar adds a capacity hold or a season ends | `test-design` | Business before algorithm. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| plan ready | `diagnosis`, `offer-check`, `gaps`, `plays`, `batch`, `test-design`, `whole` | Rows are planned with IDs and reasons; what still blocks launch is named in the plan. |
| batch held | `diagnosis`, `offer-check`, `test-design` | No new ads now, for capacity, volume or an offer change; the reason and the next date are in the plan. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

## Layer record

Where it goes: At the end of the dated section in ads/strategy/test-plan.md, under ## Layer record.

```markdown
## Layer record
Work order: test-plan
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 diagnosis |  |  |  |
| 2 offer-check |  |  |  |
| 3 gaps |  |  |  |
| 4 plays |  |  |  |
| 5 batch |  |  |  |
| 6 test-design |  |  |  |
| whole |  |  |  |
State:
```

Verdicts: `pass` (name the evidence), `fail` (name the fix or where it went back), `n/a` (say why), `not checked` (say why and who can). In a reply with no file, one line: `Layers (test-plan): diagnosis pass · offer-check pass · gaps pass · plays pass · batch pass · test-design pass · whole pass. State: ...`

Check a saved record: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`
