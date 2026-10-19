# Verifying events on Meta: test events, deduplication, matching (perishable: check the header first)

last-verified: 2026-10-19 · ttl-days: 60 · refresh: re-read Meta's Conversions API documentation (using the API, deduplicating pixel and server events, customer information parameters) and the connector's Signals tool family in platform-tools.md; confirm the test-event flow, the deduplication rule and window, the hashing rules and the required web parameter; update and bump last-verified.
changes: 2026-10-19, first written from Meta's developer documentation read the same day. The course review's attribution and expansion claims at the end are marked as claims.

Load during `ad-setup`, after the signal is chosen, to verify the path and record the
test. `result-signals.md` says which route each funnel type takes; this file says how to
see that it works.

## Test events, by Meta's documentation

- Events Manager has a Test Events tool under the data source (the pixel or dataset)
  that generates a test ID. A server event sent with that ID as `test_event_code`
  appears in the Test Events window once the request is sent. The field is for testing
  only; events sent with it are not dropped.
- Without the test code, events are confirmed in Events Manager, which shows the
  number of raw, matched and attributed events received. Meta says events should be
  verifiable within about 20 minutes of sending.

So the gate "a test of the real result seen arriving" is met by one of two things,
recorded with the date: the real result event appearing in the Test Events window with
its value, or the same event counted in Events Manager for the data source after a real
or test transaction.

## Deduplication, by Meta's documentation

- Browser (pixel) and server (Conversions API) copies of the same result are matched
  when the pixel's `eventID` equals the server `event_id` and the pixel's event name
  equals the server `event_name`. Meta keeps only the first copy.
- Deduplication happens only when the second copy arrives within 48 hours of the first
  with that event ID.
- A fallback matches on event name plus the browser identifier (`fbp`) or `external_id`
  when no event ID is sent; server events are not discarded if no browser event with
  the same name arrived in the past 48 hours.

A path that sends both copies without a shared event ID counts each sale twice. Check
for the ID before anything else.

## Customer information parameters, by Meta's documentation

- Hashed before sending (Meta's examples use SHA-256): email, phone, first name, last
  name, date of birth, gender, city, state, zip, country. `external_id`: hashing
  recommended.
- Never hashed: client IP address, client user agent, `fbc`, `fbp`, lead ID and the
  other platform identifiers.
- For website events sent through the Conversions API, the client user agent is
  required; at least one customer information parameter must be present.
- Meta's systems are designed to reject unhashed contact information except where its
  documentation notes otherwise; Meta's business SDK hashes automatically.

## Through the official tools

- The connector's Signals tool family reports dataset (pixel and server events) health
  and diagnostics, and the command-line tool's `dataset` group manages pixels
  (`platform-tools.md`, last-verified 2026-10-03). Reading either needs
  `ads/authority.md` to exist and the business's own login. Neither was tried from any
  session yet.
- Whether either tool can send a test event, or read the Test Events window, is not
  verified. Until it is, the test is done by a person with the business's login, and
  the result is recorded in the platform file.

## Operating defaults from the course review (claims, not Meta facts)

- Attribution: keep the 7-day click setting; the 1-day click setting is said to lose
  about half of recorded conversions. View-through has value; trim only if it clearly
  over-reports (20.3).
- Local businesses: switch off the "reach more people likely to respond" location
  expansion, which pulls in people merely interested in the area (4.2).
- Instant Forms: conditional logic can route unqualified answers to a separate end page
  so they are not counted as leads, and Meta then learns from qualified leads only
  (20.4). Whether the connector or command-line tool can set this is not verified.
- Declare the special ad category before building anything else, or risk the account
  (2.5). The category list the command-line tool accepts is in `policy-notes.md`.
