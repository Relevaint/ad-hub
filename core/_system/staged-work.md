# Staged work: build in layers, check each one

Owner requirement (Clay, 2026-11-15). Every output this hub makes is built in layers.
Build one layer, check it against its one question, repair it if it fails, and only then
let the next layer rely on it. When the layers are done, check the assembled output as a
whole. This page is the contract. The work order for each output says which layers apply:
[work-orders/](../../work-orders/README.md).

Why it exists: an agent asked to be creative, follow the structure and judge the audience
fit in one pass locks onto one of them and lets the others slide, then reports the work as
done. One layer at a time means one kind of judgment at a time. The layer record makes a
skipped layer visible to the agent itself and to whoever reads the result.

## The loop

1. **Find the work order.** `node <hub>/core/_system/scripts/workorder.mjs --for "<the request>"`,
   or read [work-orders/README.md](../../work-orders/README.md) and open the file for the
   output. A request that is unclear or spans several outputs goes to `start-here`, which
   names the work orders in order.
2. **Load everything it lists.** The owner skill, each file under "Load first", the
   conditional ones that apply and the business's files the request rests on, each to its
   last line: `head`, a line range, a search or a reader that stops at a line limit is a
   read in part, and a file read in part is not read. An earlier session's read does not count.
3. **Work the layers in order.** For each layer: build that layer only, answer its check
   from the evidence it names, write its line in the layer record, then move on. The
   layer's result goes into the notes file, under a heading with the layer's id, before the
   next layer starts: the finished piece is assembled from the layer results, never drafted
   first and labelled afterward. Order is the agent's word: neither the files nor the checker
   can prove which layer was built first, which is why each result is written down as it
   is reached.
4. **Repair at the source.** A failed layer goes back where its "If it fails" line points,
   not to polishing a later layer. After a repair, check again every later layer that
   rested on it.
5. **Check the whole.** Parts that each pass can still fail together. The work order's
   whole-output check is its own line in the record.
6. **Deliver with the state the record supports.** Nothing stronger.

## Rules

- **One layer, one question.** Do not draft the finished piece and check it afterward.
  Do not fold two layers into one step to save time. The idea, the structure, the audience
  fit, the truth of the claims and the finished execution are different questions; each
  gets its own look.
- **Evidence is something that was looked at.** The actual render at delivery size, the
  page that was opened, the source line with its ID, the platform's own confirmation, the
  arithmetic shown. "Looks good", a prompt, a plan, a file's existence and a thumbnail are
  not evidence.
- **A layer that does not apply is `n/a` with the reason.** Sound on a static image, a
  budget move when the business set no band, the change log on a dry run that changed
  nothing. It is never dropped silently, and `n/a` is
  never a way around a layer the state depends on.
- **A check that could not be made is `not checked` with the reason,** and the state drops
  to match (doctrine 15): a platform read with no tool connected, a page that could not
  be opened, a file that could not be played. An unchecked layer never reads as a pass,
  and a pass whose evidence says the check was not made is a `not checked`.
- **`not checked` is not an exit.** It is for a check that cannot be made in this
  session: no tool, no access, an approval only a person can give. A check that is in
  your hands is made before delivery: a file read in part is opened to its end, and a
  review with no second reviewer is done in a separate pass and passes as a self-review. In
  an output that runs other work orders, a layer the work has not reached is `not
  checked`, saying `not started` and what comes first; it never supports a state.
- **Naming a gap is a pass.** A layer whose job is to find out whether something is
  there (a result source, a second set of numbers, permission to quote a review) passes
  when it records the gap plainly with who clears it. Writing as if the thing were
  there is the fail.
- **A part passing does not pass its parent.** A good hook and a good product shot can tell
  unrelated stories; two good ads can test the same thing by accident; a good ad can promise
  what its page does not deliver.
- **When something upstream changes, its dependents lose their pass.** The work order's
  "When something changes" table names what to check again. Check those again; leave
  unaffected work alone. An old verdict does not carry over a changed claim, offer, brief
  or promise.
- **Scope narrows the output, never the layers' standard.** Quick mode makes one thing, not
  a workshop; Concepts stops before production. The layers that apply to what was asked
  still run in full.
- **Layer checks are the agent's own work.** They are not a request for the operator to
  approve each step. The approvals that already exist (spend authority, the approvals log,
  the business's sign-off on proof) are unchanged and are never replaced by a layer verdict.
- **Three repair cycles, then stop.** The limit is a stopping point, not a pass. Work that
  still fails is withheld from the ready set and reported with what failed. A requested
  count is never padded with failed work.
- **Review with a fresh agent when one can be started,** handed [the review brief](#the-review-brief)
  without the author's pitch or scores. Otherwise run the brief as a separate pass and call
  it self-review.
- **Facts carry over; sentences do not.** The business's site, emails, earlier ads, brand
  files and brief supply facts. A line that is one of their sentences trimmed or reworded
  is rewritten for this surface, in the register of the owner's examples and corrections
  for the channel. Offer terms, names, prices and required legal or identity strings stay
  exact. Across a set, no sentence, opening or argument repeats from ad to ad; offer terms may.

## When something changes

A price, a claim, a proof row, an offer term, the landing page, the audience or the brief
changes after work has passed. The work order is `change-recheck`:

1. Record the change in the `ads/` file that owns the fact, with its status, source and
   date. Keep the old value with its date. A fact that lives in the business's own files
   outside `ads/` is the business's to change: list it, never edit it.
2. List what rested on the old version: search the business's `ads/` folder for the old
   value and its wording. Each hit has an owner and a work order, and that work order's
   "When something changes" table names the layers to check again.
3. Correct each dependent under its own work order: run again the layers its change
   table names, write the updated layer record into the dependent's own file, run the
   checker on it, and set its status to the state that record supports, no higher and
   no lower. An ad that has not been approved or
   run is corrected in place and its layer record updated. An ad that has been approved
   or has run is never edited: the change is a revision from `ad-strategy`
   ([ledger-row.md](schemas/ledger-row.md)), so the approval and the results stay with
   the version that earned them.
4. In the updated record, a layer the change did not touch is `carried`, with the date
   of the record it passed in. Only the layers the change table names are run again.
   For work made before layer records existed, a layer the change did not touch is
   `carried` from the ad's own dated status on file (its ledger status, its checks
   section, an approval), named in the row. A layer the change table names is always
   run again.
5. Set each state to what its new record supports. An approval that covered the old
   version does not cover the new one. A live ad that still carries the old claim goes
   at the top of the reply with a prepared pause list. Pausing it needs the go-ahead of
   someone who can approve: the emergency stop covers only the conditions on its own
   list.

Work the change did not touch is left as it is: a new price does not regenerate an image
with no price in it.

## The layer record

One row per layer in the work order, in order, then the whole-output row and the state.
It goes at the end of the file the output writes, under the heading below. An output that
writes no file carries it in the reply on its own line, starting with
`Layers (<work order>):`, every layer by name with its verdict and a few words of
evidence in brackets, then the state and the notes file (`... State: <state>. Notes: <path>`).
The work order prints the line to fill in.

The notes file holds each layer's result under a heading carrying the layer's id, written
as the work proceeds: the job, the premises kept and rejected, the claims, the reviewer's
findings and the repairs. It is the output's own file when the work order writes one;
for a reply, a scratch file outside the hub, and outside the business repo unless the
business says outputs go there. Only a session that cannot write files writes
`Notes: none (why)`.

```markdown
## Layer record
Work order: <id>
Notes: <path to the notes file>
Date: <YYYY-MM-DD>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 <layer id> | pass | <the thing looked at, specifically> | |
| 2 <layer id> | fail, then pass | <what failed; what was looked at after the fix> | returned to <layer>; changed <what> |
| 3 <layer id> | n/a | <why it does not apply> | |
| 4 <layer id> | not checked | <what could not be done here, and who can> | |
| whole | pass | <the assembled output, as it will be seen> | |
State: <one of the work order's states>
```

One verdict per row: `pass`, `fail`, `n/a`, `not checked`, `partial`, or `carried` (it
passed in an earlier record and nothing it rests on has changed; name that record's date). A `pass`
names its evidence. A `fail` names what was changed or where it went back; "fail, then
pass" records a repair that worked. The verdict cell holds the verdict and nothing else:
"pass after a fix" is written "fail, then pass". The date line is what a later `carried`
row points back to. A layer checked only in part is `partial`: say what
was done and what remains. It counts as not checked for every state. Keep each cell to a line; this is a proof trail, not an
essay.

Check a record before sending it, every time; a record that fails is fixed, not sent:
`node <hub>/core/_system/scripts/workorder.mjs --record <file>`, or pipe a reply in with
`--record -`. It fails on a missing layer, a pass with no evidence, a pass whose evidence
says the check was not made, two verdicts in one row, a state the rows do not support, a
failed, unchecked or partial layer not named by its id after `State:`, a missing
evidence item, a review row against [the review brief](#the-review-brief), or a pass whose
`own words:` marks a line `reworded`. A one-line or piped record with no `Notes:` line fails. Given a notes file,
it opens it: each passed layer needs its heading with at least 15 words under it, and the
loading layer names every file under Load first, none read in part, and has an `Examples:`
line naming the examples the channel rules point at (or `none` and why).
Each state lists the layers it needs. The ones the work order shows in bold must be
`pass` or `carried`; `n/a` is not accepted there. The whole-output row is never `n/a`,
and no state stands on `n/a` rows alone. A state takes no exceptions: `rechecked, except the
live ads` is not `rechecked`. Claim the weaker state and name what remains.

Business facts in a record stay in the business repo with the file they belong to. Nothing
from a record is written into the hub.

## The review brief

Handed word for word to the reviewer, with the paths filled in. The paths are the maker's
full list of files read, unchanged (whole files, never chosen sections), plus every example
the business's channel rules point at, opened or not. When no fresh agent can be started,
the maker runs it as a separate pass after the draft is finished and answers every item in
writing in the notes file. It adds to the review layer's own gates and scores.

Findings are repaired at the layer each one names, and the review runs again on what
changed, by a fresh agent whenever the first review was by one, until a review returns
nothing blocking or the three cycles run out. Text changed after the last fresh review and
re-checked only by the maker is not reviewed text: the row is `partial`, names the changed
lines, and the state falls to what the rows support. Only a session that cannot start a
fresh agent at all records a self re-check as a pass, with `reviewer: self`. The row gives
`reviewed:` (the file or version the reviewer was given) and `after review:` (`nothing
changed`, or the lines changed since and who re-checked them); a review that found anything
blocking is `fail, then pass` once repaired. Scores that hold for one audience only say so
in `audience:`, and the state names that audience.

> You did not make this. Trust nothing in the maker's notes until you have opened the file
> it points at. You have the request as typed, the output, the work-order page, the maker's
> notes file, the sources, and the owner's rules and examples for this channel (paths
> below). Answer each check with a quoted line and a verdict:
>
> 1. Open every source and every rules or examples file to its last line.
> 2. Every fact, price, date, name and claim traces to a source and keeps the conditions
>    its source attaches; nothing is implied that no source supports.
> 3. Own words: facts carry over, sentences do not. Quote the two closest existing passages
>    beside the lines that resemble them, each `new`, `offer term` or `reworded`.
> 4. The owner's register: quote each of the owner's corrections for this channel that the
>    piece follows or breaks, and say what the owner would cut first.
> 5. One job per piece, and nothing repeated across a set.
> 6. Each layer's check question from the work-order page, answered from the output, not
>    from the maker's record.
> 7. The record: something to open behind every pass, a state no stronger than the rows,
>    every failed or unchecked layer named beside the state.
>
> Return numbered findings (line, rule or source, fix), each marked blocking or not. Do not
> rewrite the work.

## What the operator sees

The work first. Then one line: the state, and any layer that failed or could not be
checked with what it needs. The full record stays in the file; show it in chat only when
asked. A state is a claim: `creative-ready` says a render was inspected, `live` says the
platform confirmed it. Tested structure is not tested performance, and no state here
predicts that an ad will win.

## Changing the map

The source is [work-orders.json](work-orders.json). Edit it, then run
`node core/_system/scripts/workorder.mjs --write` to regenerate `work-orders/`, and
`npm test`. The gate fails when an owner is not a built skill, a file or heading a layer
points at is missing, a built skill owns no work order, or the generated files are out of
date. A layer points at the method in its skill or reference; the method is never copied
into the map.
