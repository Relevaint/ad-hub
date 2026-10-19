# Schema: workspace manifest

File in the business repo: `ads/ads.yaml`, one per business. Shared bookkeeping, not a
record: it says which offers exist, which platforms are in use, and when each `ads/` file
was last written and by which skill. Rules behind it: [memory-contract.md](../memory-contract.md),
"The ad workspace" and "Who writes what".

**Who writes it.** Whichever skill last wrote a file updates that file's entry.
`start-here` creates the manifest with the first offer. Like the approvals log in
`ads/authority.md`, it is outside the one-writer rule and is not declared in any skill's
`writes`.

**What it is not.** Not the source of truth for dates. Each file's own header
(`updated:`) and the repo's history are. The context loader reads those, not this file.
When the two disagree, fix the manifest.

## Template

```yaml
business: <name as the business writes it>
updated: YYYY-MM-DD
offers:
  - <slug>
platforms: []            # a platform is added when ad-setup writes platform/<platform>.md
files:
  offers/<slug>.md: { updated: YYYY-MM-DD, by: start-here }
  calendar.md: { updated: YYYY-MM-DD, by: start-here }
```

## Notes

- Keep it short. A file that is not in `ads/` is never listed here.
- Secrets and account identifiers do not belong here. Account identifiers live in
  `ads/platform/<platform>.md`; credentials live nowhere in the repo.
