<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Who buys, in their own words (`audience-report`)

**When the ask is:** "who should we target", "who buys this", "who are our customers and what do they say", "audience research", "voice of customer", "what do buyers say in their own words", "customer research for the ads", "who is our customer", "who is the customer", "who are we selling to", "describe our buyer"

**Owner:** `audience-research`
**Part of:** [`ad-program`](ad-program.md)
**Live account:** read-only, own ad comments only, and only when ads/authority.md exists

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/audience-research/SKILL.md](../core/skills/audience-research/SKILL.md)
2. [core/skills/audience-research/references/sources.md](../core/skills/audience-research/references/sources.md)
3. [core/_system/schemas/voc.md](../core/_system/schemas/voc.md)
4. [core/_system/schemas/audience.md](../core/_system/schemas/audience.md)

## Needs

- Required: the offer, or the thing sold in a sentence
- Helps, never blocks: the business's own emails, call notes and review exports; web access

## Layers

### 1. Set the question (`question`)

- **Build:** One line: who buys this offer, what set them looking, what they feared and what words they use.
- **Method:** [audience-research/SKILL.md, "1 set the question"](../core/skills/audience-research/SKILL.md#1-set-the-question)
- **Check:** Does the question name this offer and can sources answer it?
- **Evidence:** The offer file or the request, and the line itself.
- **If it fails:** Narrow it to one offer. A question about the offer itself goes to start-here.

### 2. Walk the sources (`source-walk`)

- **Build:** Verbatim lines in research/voc.md, one row each, with source, date, link or file, ID and tag; and the table of sources walked and not reached.
- **Method:** [audience-research/SKILL.md, "2 walk the sources and record lines as you read"](../core/skills/audience-research/SKILL.md#2-walk-the-sources-and-record-lines-as-you-read); [audience-research/SKILL.md, "3 budget and stop rule"](../core/skills/audience-research/SKILL.md#3-budget-and-stop-rule); [audience-research/references/sources.md, "what counts as reading"](../core/skills/audience-research/references/sources.md#what-counts-as-reading)
- **Check:** Was every recorded line read on its own page or file, never a search snippet, quoted exactly with its source, and is every source that could not be reached named?
- **Evidence:** A sample of voc.md rows opened against their pages; the sources-walked table including the blocked ones.
- **If it fails:** A line that cannot be traced is removed. A blocked source is a named gap, never filled from memory.

### 3. Build the customer types (`customer-types`)

- **Build:** Customer types grouped by situation and trigger, ranked, each claim citing line IDs.
- **Method:** [audience-research/SKILL.md, "4 build the customer types"](../core/skills/audience-research/SKILL.md#4-build-the-customer-types)
- **Check:** Is each type a person in a moment, ranked by the lines and sources it can show, with a one-line type marked a lead?
- **Evidence:** Each type's cited line IDs opened in voc.md; the counts of lines and sources.
- **If it fails:** An unsupported type drops to a lead or an assumption. Lines too thin to group return to the source walk.

### 4. Keep findings apart from assumptions (`findings`)

- **Build:** Findings, leads and assumptions in their own places, and one true data label per file.
- **Method:** [audience-research/SKILL.md, "5 keep findings apart from assumptions"](../core/skills/audience-research/SKILL.md#5-keep-findings-apart-from-assumptions)
- **Check:** Does model knowledge appear only under Assumptions to test, and is the data label true?
- **Evidence:** The Assumptions section and the label, read against the sources-walked table.
- **If it fails:** Move the belief under Assumptions as Proposed; correct the label.

### Whole output (`whole`)

- **Method:** [audience-research/SKILL.md, "quality gate"](../core/skills/audience-research/SKILL.md#quality-gate)
- **Check:** Could a strategist pick angles and a copywriter write in these words without having been there, with no private person identifiable?
- **Evidence:** Both files read as the next skill would read them.
- **If it fails:** Fix the layer the gap came from: a missing citation to customer-types, an untraceable quote to source-walk.

## When something changes

An old pass does not carry over. Check these again; leave unaffected work alone.

| If this changes | Check again | Note |
| --- | --- | --- |
| A later run adds lines or sources | `customer-types`, `findings`, work order [`test-plan`](test-plan.md) | Earlier lines and IDs are never renumbered; a type name already on a ledger tag is not renamed. |
| The offer changes who it is for | `question`, `source-walk` | Old lines stay on file with their dates. |

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| findings ready | **`question`**, **`source-walk`**, `customer-types`, **`findings`**, **`whole`** | At least one type is a finding: several lines from more than one source read this run. |
| leads only | **`question`**, **`source-walk`**, **`findings`**, **`whole`** | Sources were thin; every type is a lead to confirm. |
| model knowledge only | **`question`**, **`findings`** | Nothing could be read; everything is an assumption to test. Verify before spending. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: At the end of ads/research/audience.md, under ## Layer record.

```markdown
## Layer record
Work order: audience-report
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 question |  |  |  |
| 2 source-walk |  |  |  |
| 3 customer-types |  |  |  |
| 4 findings |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

In a reply with no file, put the record on its own line, starting with `Layers (audience-report):`, every layer in order with a few words of evidence in brackets:

```
Layers (audience-report): question pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
