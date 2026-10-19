---
name: audience-research
description: Finds who buys an offer and what they say in their own words, from sources it actually read, and writes the customer types ranked by how often and how strongly they show up, with every claim traced to a quoted, sourced line. Use when an offer needs research before strategy or creative, when the ads seem to speak to the wrong people, or when someone asks who to target.
when_to_use:
  - who should we target
  - who buys this and why
  - what do customers say about this
  - research the audience for this offer
  - mine the reviews
  - voice of customer
metadata:
  adhub:
    version: 0.1.0
    layer: research
    reads:
      - offers/
      - offers/<offer>.md
      - research/audience.md
      - research/voc.md
      - authority.md
      - platform/
      - learnings.md
    writes:
      - research/audience.md
      - research/voc.md
    live: none
---

# audience-research

Who buys, and what they say. Done means two files in the business repo: the verbatim
lines with where each one came from, and the customer types ranked by how often and how
strongly they show up, every claim pointing at lines. A strategist picks angles from it
and a copywriter writes in its words without having been there. The judgment this skill
carries is choosing where this business's buyers actually speak, knowing when to stop,
and never letting a plausible guess read as a finding.

## Context

```
node <hub>/core/_system/scripts/context.mjs --for audience-research --root <business repo> --offer <slug>
```

Read the offer file for what is sold, who the business thinks it is for, and the proof
it holds. Open the business's own files whose titles promise customer words: emails,
call notes, review exports, survey answers, notes on past campaigns. Existing research
files are added to, never restarted. Read the learnings for the offer; a learning about
who converted outranks a guess about who might.

No offer file yet is fine: work from the request and the business's description, name
the offer by the thing sold, and say that `start-here` records it. One offer at a time.

## Where buyers speak

Go where this business's buyers already talk. When the business has no customers yet,
go where buyers of the same kind of thing talk, and label it category research: those
people are not this business's customers. `references/sources.md` maps sources by
business type and lists the questions to ask of the material. Load it before the walk.

Default order:

1. The business's own material: the reviews it holds, customer emails and call notes,
   comments on its own posts, and comments on its own ads (see "Own ad comments").
2. Public reviews of the business, and of the nearest alternatives buyers compare it
   with.
3. Where buyers ask each other: forums, question threads, community groups, comments
   under videos about the problem.
4. The reputation walk: what a buyer sees when they search for the business and the
   category, including the first page of results and any press.

A local business leans on 1 and 2 and the owner's own conversations. An online product
has the deepest public record. A professional service lives in client conversations and
the places its buyers ask peers. The reference says how each restates "reviews".

## Method

### 1. Set the question

One line, kept in view the whole time: who buys this offer, what set them looking, what
they feared, and what words they use. Everything that does not answer it is noise.

### 2. Walk the sources and record lines as you read

Record verbatim lines into `research/voc.md` as you go, one row per line, each with
its source, date, link or file, and an ID. Record only what you read. A search result
snippet is a lead to a page, not a quote, until the page is opened; a line read on the
page is quoted exactly, with its link. Private material the business holds (emails, call
notes) is marked as held by the business: fine for research, usable in an ad only once
the business clears it in the offer's proof table.

Tag each line with what it shows: trigger (what set them looking), desire, objection,
complaint, praise, alternative (what they compared or used before), phrase (a striking
way of putting it), and any clue to who they are. Do not record reviewer names or
anything that identifies a private person. The link is the attribution.

### 3. Budget and stop rule

Default: stop when three sources in a row add no new type, objection or phrase, or at
about a dozen sources, whichever comes first. Record every source walked, with what it
gave, and every source that could not be reached from the platform, by name. A blocked
source is a gap in the table, never a gap filled from memory.

### 4. Build the customer types

Group the lines by situation and trigger, not by demographics. A customer type is a
person in a moment: "the first-year grower who lost a spring planting to frost", not
"women 35 to 54". Name each type in plain words a copywriter can use; the ledger's
customer type tag carries that exact name from here on.

Rank by how often (how many lines, from how many sources) and how strongly (intensity
of the language, whether the line describes the moment they bought). For each type,
write what set them looking, what they wanted in their words, what they feared or
disliked, what they compared, and the awareness level the lines show when they start
looking: unaware, problem-aware, solution-aware, product-aware or most aware. Record
who the material says it is not for; that is as useful as who it is for.

### 5. Keep findings apart from assumptions

A finding has several lines from more than one source. One line is a lead. A belief
with no line behind it is an assumption: it goes under "Assumptions to test", marked
Proposed, and nowhere else. Model knowledge never appears as a finding. It may appear
as an assumption, labelled, and the chat summary says so in plain words.

Label each file once: `Data: LIVE (n sources)` when the lines came from sources read
this run, or `Data: MODEL KNOWLEDGE (verify before spending)` when nothing could be
read. The label is true or the file is not finished.

### Own ad comments

Comments under the business's own ads are the richest objection source there is, and
reading them reaches a live account. Do it only through the business's own connected
tools, only when `ads/authority.md` exists (any level), read-only, and change nothing
there. No authority file: skip the source, list it as not reached, and say why.

## Quality gate

Before writing the summary, check the files:

- Every claim in `research/audience.md` cites IDs from `research/voc.md`. Every line in
  `voc.md` has a source, a date, and a link or a file in the repo.
- Every quote is exact. Nothing paraphrased sits inside quotation marks. No quote was
  invented or reconstructed from memory.
- No reviewer names or private details. Business-held material is marked as such.
- The ranking is honest: the type ranked first has the lines to show it, and a type with
  one line is marked a lead.
- The Sources walked table names what could not be reached.
- The data label is present and true.
- Nothing about this business was written into the hub; nothing was written outside
  `ads/research/`.

## Output

Files first, inside the business repo's `ads/research/`:

- `voc.md` from `core/_system/schemas/voc.md`: the sources walked and the lines.
- `audience.md` from `core/_system/schemas/audience.md`: the types ranked, one section
  each, objections and triggers across types, assumptions to test, what was not reached.

Both files are added to on a later run, with the run date on new rows; earlier lines
and IDs are never renumbered. Then the chat summary, short: the top two or three types
in a line each, the one line from the material most worth reading, what could not be
reached, and the next skill. Say what shaped the output.

## What's next

- `ad-strategy` compares these types with the people the current ads address, picks the
  angles, and gives each ad its ID and tags. It is the normal next step.
- `ad-creative` when a draft is wanted now: it writes in these words, and its claims
  still gate on the offer's proof table, not on this research.
- `competitor-ads` when the lines keep naming an alternative worth seeing in an ad
  library.
- `start-here` when the lines say the offer itself is the problem: the wrong people,
  the wrong price, the wrong ask. The offer is in scope before the ad is.
