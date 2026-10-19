# Schema: platform file

File in the business repo: `ads/platform/<platform>.md`, one per platform the business
runs ads on (`meta.md` for Meta). Written by `ad-setup` only. It records how the real
result reaches the platform, whether that has been seen working, the category check,
the settings baseline and the change list a launch carries out. Rules behind it:
[spend-authority.md](../spend-authority.md), "Gates before anything goes live";
[memory-contract.md](../memory-contract.md), "What never goes in a repo".

**Never a credential.** Account, tag, data source and campaign identifiers may be written.
Tokens, keys and passwords never are, in any field.

## Template

```markdown
---
platform: <platform>
offer: <slug, or all>
updated: YYYY-MM-DD
updated-by: ad-setup
---

# <Platform>

Shaped by: <offer file, authority, test plan, platform layer files with their last-verified dates>

## Account
- Account: <identifier, or "held by <role>, not recorded here">. No credential is recorded anywhere.
- Access: <connected tool | command-line tool | a person in the platform's interface>; authority level <n> for <offer> (ads/authority.md)

## Result signal
- Funnel type (offer file): ...
- Signal sent to the platform: <status>, from <system>, because it is the earliest status that marks a real buyer and lands within <time> (status label)
- Kept for review, not optimised on: <later statuses, with values>
- Rejected as the signal: <status>: <reason>; <status>: <reason>
- How it travels: browser tag <yes/no>; server event from <system> <yes/no>; deduplicated by event name and ID <yes/no/unknown> (<platform layer file>, last-verified YYYY-MM-DD)
- Test of the real result seen arriving: YYYY-MM-DD, <what was seen, where, with value> | NOT YET SEEN: blocks going live. Cleared by: <who, how>
- Source health: <match quality, coverage, warnings, or "not checked: <why>">

## Category and compliance
- Restricted category (offer file): <category or none>
- Declared on the platform: yes, on <campaign>, checked YYYY-MM-DD by <how> | no | not checked: <why>. An undeclared category blocks going live.
- Compliance strings: in <business file>; not copied here

## Structure and settings baseline
- Campaign: <name by offer>, objective <sales | leads | ...>, one per offer
- Ad set: <name>, performance goal <the signal, by value or count>, budget <from ads/authority.md>, location exactly <where the business serves>, expansion <off | on>, audience as suggestions, placements automatic, attribution <window>
- Conversion location: <page | native form | messages | call>, chosen because <...>; a test, judged on revenue
- Ad naming: <ad ID>; tracking parameter on the link carries the ID
- Deliberately off: <settings left off and why>
- Exists on the account: <created paused by ad-launch on YYYY-MM-DD, with identifiers> | not yet; see the change list

## Change list for ad-launch, or for a person
1. <step>: before <value>, after <value>
2. ...

## Checked, and when
| Item | How checked | Date | Result |
| --- | --- | --- | --- |

## Open
- <what could not be checked from this platform, and who can>
```

## Notes

- Every platform fact names the platform layer file and its last-verified date, so a
  stale fact is caught at the next run.
- "Seen arriving" means seen on the platform's own events view with the value, on a
  date. A snapshot matched by tracking tag proves the tag, not the signal.
- The change list is executed by `ad-launch`, which logs each creation in
  `ads/changes/`. This file records that it happened and with what identifiers.
