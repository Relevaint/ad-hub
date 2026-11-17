# Helper scripts

Node standard library only, no packages to install. Node 20 or later. Each script's
header comment is its full usage. Run from anywhere; `--hub` defaults to this hub.

| Script | What it does | Used by |
| --- | --- | --- |
| `context.mjs --for <skill> --root <business repo> [--offer <slug>]` | Loads exactly the files a skill declares in its `reads`, from the business repo's `ads/` folder, with dates and age. Absent files are named with the skill that writes them and never block. Lists the business repo's other Markdown files by title so existing context can be found by meaning. Files older than 90 days (change with `--stale-days`) are flagged. | Every skill, at the start of a run |
| `freshness.mjs [files...] [--strict]` | Checks the `last-verified · ttl-days · refresh` header on dated reference files. Reports fresh, due soon, expired (with its refresh instruction) or broken. | The monthly refresh; the build gate (broken headers fail) |
| `route.mjs --goal "<request>"` / `--task <skill>` / `--list` | Points a request at a skill from the README task lookup and shows what that skill reads, writes and whether it can touch a live account. A plain word match: a fallback for platforms that do not list skills, not a replacement for reading the request. | Agents on Codex, Perplexity and the like |
| `workorder.mjs --for "<request>"` / `--id <work order>` / `--list` | Prints the summary of the work order for an output, from `../work-orders.json` ([staged work](../staged-work.md)): the owner, what to load, and the layers by number, name and id. `--for` is a word match; with no clear winner it lists the closest and points at `start-here`. `--all` prints the whole page, as `work-orders/<id>.md` shows it. | Every skill, before producing anything |
| `workorder.mjs --id <work order> --layer <layer id>` | Prints one layer (or `whole`): what to build, the method, the check, the evidence, where a failure goes back to, its place ("layer 3 of 8") and the next layer. Reads and writes nothing. | Every layer, as it is reached |
| `workorder.mjs --record <file>` | Checks a `## Layer record` table (or the one-line form in a reply, with `--record -`) against its work order: every layer present, one verdict per row, every pass with evidence that the check was made, the state supported by the rows. | The agent at the end of a run; regression runs |
| `workorder.mjs --check` / `--write` / `--headings <file>` | Validates the map against the hub (owners are built skills, every file and heading a layer points at exists, every skill owns a work order, the generated pages are current); regenerates `work-orders/`; lists the anchors a layer may point at. | The build gate; anyone editing the map |
| `route.mjs --check` | Enforces the frontmatter rules every skill must meet (CONVENTIONS sections 2 and 3, README hard rules 5 and 6). The ledger is owned by transition: a write to it is declared as `ledger.md#<transition>`; the append-only `changes/` folder is declared `changes/#<label>` by each skill that writes entries. | The build gate |

Build gate, from the repo root: `npm test`. It runs the script tests against synthetic
fixtures in `test/fixtures/`, then runs the freshness and skill checks on the real hub and
checks that every regression case in `../regression/` is well formed, that the installer
(`install/adhub-skills.mjs`) and its hook work on a scratch copy of a business folder, and
that the work-order map is valid with its generated pages up to date.
