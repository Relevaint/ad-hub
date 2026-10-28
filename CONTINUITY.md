# Session continuity

This is a routing guide, not another rulebook. [AGENTS.md](AGENTS.md) is the working
authority, [HANDOFF.md](HANDOFF.md) is current state, and [README.md](README.md) maps
Ad-Hub's skills and their decision owners. Follow their existing safety and approval
rules. A file path, profile or repository link grants no permission.

## Pick the correct hub

| Job | Canonical repository | Usual sibling checkout |
| --- | --- | --- |
| Studio production capabilities | `Relevaint/rtvaistudios` | `../rtvaistudios` |
| Marketing capabilities | `Relevaint/Marketing-Hub` | `../Marketing-Hub` |
| Paid-ads capabilities | `Relevaint/ad-hub` | `../ad-hub` |

Ad-Hub remains self-contained. These are routes, not new dependencies. For overlapping
paid-ads work, follow [AGENTS.md section 2.15](AGENTS.md#215-marketing-work-and-marketing-hub):
say which hub you used and why. `lowkeycm/clay-config` remains the cross-project config
repo. `lowkeycm/RTVAIStudios-Web` is the website/CRM, not the Studio Hub.

New Ad-Hub checkouts use `https://github.com/Relevaint/ad-hub.git`. Existing local
folder names and explicit `AD_HUB` locations remain valid. Do not rename a working
checkout, regenerate pointers, alter credentials or change permissions merely to
update the owner in a document. Inspect the current remote before proposing a change.

## Claude Code and filesystem-backed sessions

For hub maintenance, open this checkout. `CLAUDE.md` forwards to `AGENTS.md`; read the
handoff and resolve the operator under section 2.3. For business work, open the
authorized business repo and read its own instructions first. Its `adhub-` pointers
route to the selected `core/skills/<name>/SKILL.md` here. Read that actual skill and
the references it calls for; a listed pointer is not proof the target was loaded.

Keep the working installer and hook. [install/README.md](install/README.md) explains
the sibling path and explicit-location options. If the checkout or a referenced file
is unavailable, name the missing path instead of silently replacing it with remembered
instructions. Nothing about a business belongs in this public hub.

## Claude chat and Projects

A chat or Project cannot use local pointer files as if they were a checkout. Supply or
sync the actual files the session can access: this hub's `AGENTS.md`, `README.md`, the
selected skill and required references; for maintenance, also the current handoff.
Keep their source repository, path and revision/date identifiable, and refresh stale
copies before continuing. The `CLAUDE.md` line or an `adhub-` wrapper alone is not the
skill. Do not assume a hook ran, a file was synced or a relative link was followed.

Only bring authorized business instructions/context into that business's private
workspace, with its own output destination. Never upload private hub material,
customer records or credentials into public Ad-Hub or a shared generic hub Project.
If a selected skill's files cannot be read or a required tool cannot run, say exactly
what is missing and request it; do not claim the workflow was executed.

## Fresh-session read-only acceptance check

In each actual teammate environment, start a fresh session and ask for a short report,
without writing files, running installers, probing write access or touching ad accounts:

1. Name the selected hub, canonical repository, checkout or supplied-file source and
   revision/date. Identify the business workspace separately, if there is one.
2. Identify the actual operator from the current conversation or an unambiguous account
   match. Do not infer identity from the lone `people/clay.md` profile, commit identity
   or a shared name. Identify the client/offer separately; ask if either is unclear.
3. Name the instruction and handoff files actually read. Select the relevant skill via
   the README task table and read its body and required references, not just its wrapper.
4. Report the effective boundary from the task authorization, runtime sandbox/tool
   permissions and repo/client rules: what is readable, where any later output may be
   written, and which approvals are still needed. If any part cannot be inspected,
   label it unknown. Do not use a write probe to find out. Hub content availability
   does not confer business-repo write access or live-ad authority.
5. Name missing/stale files or unavailable capabilities. Pass only if the required
   sources were actually read and the routing, operator, client and permitted scope
   are clear; otherwise identify the specific gap. This check grants no new authority.

Repository checks (from this checkout; they do not validate teammate sessions):

```sh
python3 scripts/check-continuity.py
python3 scripts/check-continuity.py --self-test
npm test
```

The continuity check is scoped to active routing documents/templates. Historical
handoffs, source provenance and old PR links remain history, not stale-route errors.
