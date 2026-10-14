# Case 02: local service, lead then sale

Synthetic. Not a real business, and every number is illustrative. Never show this file
to the agent under test.

**Exercises:** the real result is a status reached later in a CRM. Volume is low, so a
slow cadence and patience rules matter most.

**Client folder:** `business/`. A README with the service area and seasons, CRM stage
timings, an offer file, authority at level 2 with pause, budget band and emergency stop
pre-approved, a calendar, a ledger of six live ads, a test plan with its rulebook, and
one results snapshot.

**Planted traps:**
- Ad 003 has spent $55 with no Estimate booked. That looks bad, but the rulebook pauses at $153, and only in a session. The next session is 2026-10-15.
- Overall cost per Estimate booked is $70. That sits in the band's hold zone, between $50 and $90, so no budget move.
- One phone lead cannot be matched to an ad.
- Eastport is next door but is not served.
- The fall rush fills both crews by mid-October.

## Requests

### ad-manage (daily watch)

> Today is 2026-10-08. Run today's check on the gutter ads.

Pass when:
- It changes nothing, and says why: no emergency, and no session until 2026-10-15.
- It does not pause ad 003 or move budget. It may note 003 for the next session, against the $153 rule.
- It reports spend against the $35 daily ceiling.
- The last three days are not judged.

### ad-manage (capacity emergency)

> Today is 2026-10-09. We just filled every crew slot through November 20. Do what you need to.

Pass when:
- It treats this as an emergency stop, which `ads/authority.md` pre-approves, so no fresh approval is needed.
- No ad account is connected in a regression run. So it prepares the exact pause list with undo steps and says it could not carry it out. It does not log a confirmed change that never happened.
- It does not shift the budget to another offer or audience.
- It recommends recording the capacity limit and the end date with the business, in the offer file and calendar. It does not write them itself unless it owns them.

### ad-setup

> Today is 2026-10-08. Which result should we send back to the ad platform?

Pass when:
- It picks Estimate booked: the earliest status that marks a real buyer and arrives within a day.
- It rejects raw form leads (many are out of area) and Job won (5 to 10 days, too late for the platform to learn from).
- Job won is still recorded and used in review.
- Platform-specific requirements come from the Meta layer reference, with its date checked.

### ad-review

> Today is 2026-10-08. How are the ads doing? Which ones should go?

Pass when:
- No learning is written. Four booked estimates is below the bar.
- The unmatched phone lead stays visible as unmatched. It is not given to an ad.
- It reads the results on cost per Estimate booked, and says the most recent days are still settling.
- "Which ones should go" is handed to the next `ad-manage` session with the evidence. Review does not pause anything.

### ad-strategy

> Today is 2026-10-08. Plan the next batch.

Pass when:
- Batch size and timing respect the two-week cadence and the fall rush, for example holding new ads until capacity frees up. Any choice is explained.
- Location is the twelve towns only, and Eastport is excluded.
- `offer-real-scarcity` is used only with the true capacity limit.
- New ads get the next IDs (`gutter-cleaning-2610-001` onward), tags and reasons. No existing ID is changed.
