<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: What competitors run, and what can be learned (`competitor-report`)

**When the ask is:** "what are competitors running", "what are other sellers running", "competitor ads", "look at the ad library", "what ads does the competition run", "swipe file"

**Owner:** `competitor-ads`
**Part of:** [`ad-program`](ad-program.md)
**Live account:** read-only library search through the business's own connector, where one exists

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/competitor-ads/SKILL.md](../core/skills/competitor-ads/SKILL.md)
2. [core/skills/competitor-ads/references/reading-an-ad.md](../core/skills/competitor-ads/references/reading-an-ad.md)
3. [core/_system/schemas/competitors.md](../core/_system/schemas/competitors.md)

Also, when it applies:

- the library is Meta's: [meta-system/references/ad-library.md](../meta-system/references/ad-library.md)

## Needs

- Required: the offer, or the thing sold
- Helps, never blocks: research/audience.md for the alternatives buyers named; a real browser

## Layers

### 1. Set the question (`question`)

- **Build:** One line: what we are trying to learn, for this offer and these customer types.
- **Method:** [competitor-ads/SKILL.md, "1 set the question"](../core/skills/competitor-ads/SKILL.md#1-set-the-question); [competitor-ads/SKILL.md, "who to look at"](../core/skills/competitor-ads/SKILL.md#who-to-look-at)
- **Check:** Does the question say what will be learned, and are the advertisers chosen in the stated order rather than by fame?
- **Evidence:** The question and the who-and-why table.
- **If it fails:** Restate it; drop the giants whose brand makes their ads misleading models.

### 2. Pull each advertiser's active ads (`advertisers`)

- **Build:** Per advertiser: active ad count, oldest start date, starts in the last ninety days, format mix, versions, landing pages.
- **Method:** [competitor-ads/SKILL.md, "2 pull each advertisers active ads"](../core/skills/competitor-ads/SKILL.md#2-pull-each-advertisers-active-ads); [competitor-ads/references/reading-an-ad.md, "the measures claude workflows review"](../core/skills/competitor-ads/references/reading-an-ad.md#the-measures-claude-workflows-review); [competitor-ads/SKILL.md, "when the library cannot be opened"](../core/skills/competitor-ads/SKILL.md#when-the-library-cannot-be-opened)
- **Check:** Is every measure Observed with a library link and the date seen, with an empty result retried once and counts marked as lower bounds where only search worked?
- **Evidence:** The library pages opened, or the plain statement that the library could not be opened and what was read instead.
- **If it fails:** Record what was actually seen and label the data line to match. Nothing from the library is written as Observed when it was not opened.

### 3. Read the ads worth keeping (`breakdowns`)

- **Build:** A breakdown of each kept ad: hook as text, first frame and sound; style; message and proof; offer and ask; call-out; format.
- **Method:** [competitor-ads/SKILL.md, "3 read the ads worth keeping"](../core/skills/competitor-ads/SKILL.md#3-read-the-ads-worth-keeping); [competitor-ads/references/reading-an-ad.md, "what counts as seen"](../core/skills/competitor-ads/references/reading-an-ad.md#what-counts-as-seen)
- **Check:** Is each kept ad broken down from what was actually seen, with every unwatched video marked not seen and nothing described from a thumbnail?
- **Evidence:** Each kept ad's page or screenshot, and its watched or not-seen field.
- **If it fails:** An incomplete breakdown stays marked incomplete and cannot feed a pattern as fact.

### 4. Click through (`pages`)

- **Build:** Each kept ad's landing page read: headline, proof shown, offer, the one ask, friction, and where page and ad disagree.
- **Method:** [competitor-ads/SKILL.md, "4 click through"](../core/skills/competitor-ads/SKILL.md#4-click-through)
- **Check:** Was each kept ad's landing page opened and read, with any that could not be opened recorded as not reached?
- **Evidence:** The pages opened, by URL and date.
- **If it fails:** Mark the page not reached; the ad's offer and ask stay as seen in the ad only.

### 5. Keep observed apart from inferred (`observed-inferred`)

- **Build:** Every line labelled Observed with link and date, or Inferred.
- **Method:** [competitor-ads/SKILL.md, "5 keep observed apart from inferred"](../core/skills/competitor-ads/SKILL.md#5-keep-observed-apart-from-inferred); [competitor-ads/SKILL.md, "what a public ad library can and cannot tell you"](../core/skills/competitor-ads/SKILL.md#what-a-public-ad-library-can-and-cannot-tell-you)
- **Check:** Is every line either Observed with link and date or labelled Inferred, with no spend, result or word like winning written about any competitor's ad?
- **Evidence:** The file searched for unlabelled claims and for profitable, winning, working and best-performing.
- **If it fails:** Relabel or remove the line.

### 6. Patterns and gaps (`patterns`)

- **Build:** What everyone says, what nobody says, and each pattern written as a candidate for ad-strategy with how it would be adapted.
- **Method:** [competitor-ads/SKILL.md, "6 patterns and gaps"](../core/skills/competitor-ads/SKILL.md#6-patterns-and-gaps)
- **Check:** Does each pattern name the advertisers it was seen at and how it would be adapted, resting only on complete observations?
- **Evidence:** Each pattern traced to its swipe entries and observed rows.
- **If it fails:** A pattern resting on an unseen video or an unopened page is cut or marked a lead.

### 7. The swipe file (`swipe`)

- **Build:** One entry per kept ad, with its link, the date seen, a screenshot when one could be taken, and why it was kept.
- **Method:** [competitor-ads/SKILL.md, "7 the swipe file"](../core/skills/competitor-ads/SKILL.md#7-the-swipe-file)
- **Check:** Does each entry carry its link, date and what it teaches, with competitor words quoted only inside the entry?
- **Evidence:** The swipe folder read entry by entry.
- **If it fails:** Complete or drop the entry.

### Whole output (`whole`)

- **Method:** [competitor-ads/SKILL.md, "quality gate"](../core/skills/competitor-ads/SKILL.md#quality-gate)
- **Check:** Could ad-strategy weigh these patterns knowing exactly what was seen and what was not, with no competitor copy handed over as the business's own?
- **Evidence:** competitors.md read top to bottom, including the not-seen section.
- **If it fails:** Fix the layer that overstated what was seen.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A later run sees new ads or a page changed | `advertisers`, `breakdowns`, `patterns`, work order [`test-plan`](test-plan.md) | Add entries with the new date; delete nothing. |
| Audience research names a new alternative | `question`, `advertisers` | The alternatives buyers named come first. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| report ready, library not opened | `question`, `observed-inferred`, `patterns`, `whole` | Built from websites and pages only; nothing from a library is Observed. |
| report ready | `question`, `advertisers`, `breakdowns`, `pages`, `observed-inferred`, `patterns`, `swipe`, `whole` | Observed from the library with links and dates; what was not seen is listed. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

## Layer record

Where it goes: At the end of ads/research/competitors.md, under ## Layer record.

```markdown
## Layer record
Work order: competitor-report
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 question |  |  |  |
| 2 advertisers |  |  |  |
| 3 breakdowns |  |  |  |
| 4 pages |  |  |  |
| 5 observed-inferred |  |  |  |
| 6 patterns |  |  |  |
| 7 swipe |  |  |  |
| whole |  |  |  |
State:
```

Verdicts: `pass` (name the evidence), `fail` (name the fix or where it went back), `n/a` (say why), `not checked` (say why and who can). In a reply with no file, one line: `Layers (competitor-report): question pass · advertisers pass · breakdowns pass · pages pass · observed-inferred pass · patterns pass · swipe pass · whole pass. State: ...`

Check a saved record: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`
