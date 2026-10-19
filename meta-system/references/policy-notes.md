# Meta policy notes for ad copy (perishable: check the header first)

last-verified: 2026-10-19 · ttl-days: 90 · refresh: re-read Meta's Advertising Standards page on privacy violations and personal attributes and quote its current statement and examples; re-check the special ad categories the command-line tool accepts; look up the current standards on personal health (before-and-after imagery) and on financial products, which were not read on the verify date; update and bump last-verified.
changes: 2026-10-19, first written from Meta's Advertising Standards page on personal attributes, read the same day, plus the special ad category list from the command-line tool's help (verified 2026-10-03 in platform-tools.md).

Load during `ad-creative` for the policy check, and during `ad-setup` when a restricted
category is declared. The core rule (never assert or imply a personal attribute) is in
`core/skills/ad-creative/references/claims-and-policy.md`; this file holds Meta's own
wording and examples.

## Personal attributes, Meta's standard

Meta's statement, read 2026-10-19: ads must not contain content that asserts or implies
personal attributes, including direct or indirect assertions or implications about a
person's race, ethnicity, religion, beliefs, age, sexual orientation or practices,
gender identity, disability, physical or mental health (including medical conditions),
vulnerable financial status, voting status, membership in a trade union, criminal
record, or name. Ads also must not share or ask for private information about users.

Meta's general guidance: describing or showing the promoted product or service is
allowed; using "you" or "other" without referencing a personal attribute is allowed;
text referencing or alluding to attributes of the targeted group, or using "you", "your"
or "other" to reference an attribute, is not.

Examples from the page, allowed and not:

| Attribute | Allowed | Not allowed |
| --- | --- | --- |
| Age | "Meet seniors"; "A service for teens"; "Our new lotion and creams fight wrinkles like never before!" | "Meet other seniors"; "Are you 18 years old?"; "Ready to upgrade your skin to look younger?" |
| Health | "Depression counseling"; "New diabetes treatment available" | "Do you have diabetes?"; "Depression getting you down? Get help now." |
| Financial status | (none given) | "Are you bankrupt? Check out our services." |
| Religion | "Date Christian singles!" | "Are you Christian?"; "Meet other Buddhists" |
| Race or ethnicity | "Find black singles today." | "Meet other black singles near you!" |
| Name | "We print customizable t-shirts and stickers with your name." | "Billy Taylor, get this t-shirt with your name in print!" |

The pattern: name the service or the group it serves; never tell the viewer what they
are. The course review adds, as the creator's observation, that borderline wording in
health and money categories can be penalised silently through rising costs (23.4).

## Special ad categories

The command-line tool accepts, as of 2026-10-03: credit, employment, financial products
and services, housing, issues and politics, online gambling, or none. The offer file
names the category in plain words; this is the mapping. Declaring one restricts
targeting options on the account; the business's own compliance file adds the strings
and the promises it forbids.

## Not yet verified

- Meta's current standard on personal health, including before-and-after imagery.
- Meta's current standard on financial products and services wording.
- Whether family status, which Meta's page does not list, is treated under housing rules
  separately. A business in housing should follow its own compliance file, which usually
  bans it outright.
