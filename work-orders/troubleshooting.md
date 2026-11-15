<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->

# Work order: Why the ads stopped working (`troubleshooting`)

**When the ask is:** "why did results drop", "the ads stopped working", "why is performance down", "troubleshoot the ads", "what went wrong with the ads", "why did my cost per lead go up", "cost per result went up", "results dropped, what happened", "what happened to the ads", "my ads stopped getting leads", "the leads dried up", "sales from the ads fell", "the numbers got worse"

**Owner:** `ad-manage` (Troubleshooting)
**Live account:** reads only; any fix goes through a session or its owning skill

Build this one layer at a time, in order, under [staged work](../core/_system/staged-work.md). For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.

## Load first

1. [core/skills/ad-manage/SKILL.md](../core/skills/ad-manage/SKILL.md)
2. [core/skills/ad-manage/references/watch-and-sessions.md](../core/skills/ad-manage/references/watch-and-sessions.md)

Also, when it applies:

- the business runs on Meta, before any account read: [meta-system/SKILL.md](../meta-system/SKILL.md)

## Needs

- Required: the numbers for the window
- Helps, never blocks: the change log; the calendar; the platform file

## Layers

### 1. The signal (`signal`)

- **Build:** Whether the result signal has gone silent or changed.
- **Method:** [ad-manage/SKILL.md, "troubleshooting in a fixed order"](../core/skills/ad-manage/SKILL.md#troubleshooting-in-a-fixed-order); [ad-manage/references/watch-and-sessions.md, "troubleshooting order course review 24"](../core/skills/ad-manage/references/watch-and-sessions.md#troubleshooting-order-course-review-24)
- **Check:** Is the result signal still arriving, unchanged, on the platform?
- **Evidence:** The platform's events for the signal, or the platform file's last test date.
- **If it fails:** A silent or shifted signal goes to ad-setup, and spend against a silent signal is a daily-watch emergency.

### 2. Outside events (`outside-events`)

- **Build:** The calendar, the season, the market and the change log for the window.
- **Method:** [ad-manage/SKILL.md, "troubleshooting in a fixed order"](../core/skills/ad-manage/SKILL.md#troubleshooting-in-a-fixed-order)
- **Check:** Were the calendar, the season and the change log checked before any ad or change was blamed?
- **Evidence:** The events and changes in the window, listed with dates.
- **If it fails:** Name the event as a candidate cause; a change that coincides is not a cause.

### 3. The offer and the page (`offer-page`)

- **Build:** The offer and the destination page, checked as a buyer.
- **Method:** [ad-manage/SKILL.md, "troubleshooting in a fixed order"](../core/skills/ad-manage/SKILL.md#troubleshooting-in-a-fixed-order)
- **Check:** Does the page load, match the ad's promise and let a buyer complete the result?
- **Evidence:** The page opened and the result path walked.
- **If it fails:** A page or offer problem goes to the business or start-here; zero results on reasonable spend is almost always the offer.

### 4. Fatigue and the warm pool (`fatigue`)

- **Build:** Frequency against cost, and whether the warm audience is exhausted.
- **Method:** [ad-manage/references/watch-and-sessions.md, "fatigue"](../core/skills/ad-manage/references/watch-and-sessions.md#fatigue)
- **Check:** Is frequency rising while cost worsens, or the warm pool exhausted?
- **Evidence:** Frequency and cost per result over the window.
- **If it fails:** Fatigue wants a meaningfully different replacement: hand to ad-strategy and ad-creative.

### 5. The creative itself (`creative`)

- **Build:** The ad's own explaining metrics, read last.
- **Method:** [ad-manage/SKILL.md, "troubleshooting in a fixed order"](../core/skills/ad-manage/SKILL.md#troubleshooting-in-a-fixed-order)
- **Check:** With everything above ruled out, what do the hook, click and landing figures say about the ad itself?
- **Evidence:** The explaining metrics for the ad, labelled as explanations.
- **If it fails:** Hand the evidence to ad-review and ad-strategy. A campaign reset is the last resort, after the rest is ruled out.

### Whole output (`whole`)

- **Check:** Is the cause named with its evidence and handed to the skill that owns the fix, or is it stated plainly that the cause is not yet known?
- **Evidence:** The order followed, with what each step showed.
- **If it fails:** Go back to the first step that was skipped.

## What it can be called

| State | Only when these passed | Means |
| --- | --- | --- |
| cause found | **`signal`**, **`outside-events`**, **`whole`** | The most likely cause is named with its evidence and handed to its owner. |
| inconclusive | **`signal`**, **`outside-events`** | The steps checked did not show a cause; the reply says what would settle it and when. |
| not ready | nothing yet | A layer failed or could not be checked; say which and what it needs. |

A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.

## Layer record

Where it goes: In the reply, as one line.

```markdown
## Layer record
Work order: troubleshooting
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 signal |  |  |  |
| 2 outside-events |  |  |  |
| 3 offer-page |  |  |  |
| 4 fatigue |  |  |  |
| 5 creative |  |  |  |
| whole |  |  |  |
State:
```

One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.

In a reply with no file, put the record on its own line, starting with `Layers (troubleshooting):`, every layer in order with a few words of evidence in brackets:

```
Layers (troubleshooting): signal pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>
```

Check it before you send it: `node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe the reply in with `--record -`.
