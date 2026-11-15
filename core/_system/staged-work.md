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
2. **Load everything it lists.** The owner skill and each file under "Load first", in full,
   plus the conditional ones that apply. Reading a file in an earlier session does not count.
3. **Work the layers in order.** For each layer: build that layer only, answer its check
   from the evidence it names, write its line in the layer record, then move on.
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
  platform read with no tool connected. It is never dropped silently.
- **A check that could not be made is `not checked` with the reason,** and the state drops
  to match (doctrine 15). An unchecked layer never reads as a pass.
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
- **Use a fresh reviewer for review layers when one is available,** given the brief, the
  constraints and the work, without the author's pitch or scores. Otherwise review in a
  separate pass and call it self-review.

## When something changes

A price, a claim, a proof row, an offer term, the landing page, the audience or the brief
changes after work has passed. The work order is `change-recheck`:

1. Record the change where the fact lives, with its status, source and date. Keep the old
   value with its date.
2. List what rested on the old version: search the business's `ads/` folder for the old
   value and its wording. Each hit has an owner and a work order, and that work order's
   "When something changes" table names the layers to check again.
3. Take each dependent back through those layers and update its layer record.
4. Set each state to what its new record supports. An approval that covered the old
   version does not cover the new one.

Work the change did not touch is left as it is: a new price does not regenerate an image
with no price in it.

## The layer record

One row per layer in the work order, in order, then the whole-output row and the state.
It goes at the end of the file the output writes, under the heading below. An output that
writes no file carries it in the reply as one line: every layer by name with its verdict,
then the state.

```markdown
## Layer record
Work order: <id>
| Layer | Verdict | Evidence: what was looked at | Fix made or return |
| --- | --- | --- | --- |
| 1 <layer id> | pass | <the thing looked at, specifically> | |
| 2 <layer id> | fail, then pass | <what failed; what was looked at after the fix> | returned to <layer>; changed <what> |
| 3 <layer id> | n/a | <why it does not apply> | |
| 4 <layer id> | not checked | <what could not be done here, and who can> | |
| whole | pass | <the assembled output, as it will be seen> | |
State: <one of the work order's states>
```

Verdicts are `pass`, `fail`, `n/a` and `not checked`. A `pass` names its evidence. A `fail`
names what was changed or where it went back. Keep each cell to a line; this is a proof
trail, not an essay. Check a saved record with
`node <hub>/core/_system/scripts/workorder.mjs --record <file>`: it fails on a missing layer,
a pass with no evidence, or a state the rows do not support.

Business facts in a record stay in the business repo with the file they belong to. Nothing
from a record is written into the hub.

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
