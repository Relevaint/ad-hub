#!/usr/bin/env node
// Work orders: the output map behind staged work (core/_system/staged-work.md).
//
//   node <hub>/core/_system/scripts/workorder.mjs --for "<what was asked for>"
//   node <hub>/core/_system/scripts/workorder.mjs --id <work order>
//   node <hub>/core/_system/scripts/workorder.mjs --id <work order> --layer <layer id | whole> --notes <file>
//   node <hub>/core/_system/scripts/workorder.mjs --id <work order> --all
//   node <hub>/core/_system/scripts/workorder.mjs --list
//   node <hub>/core/_system/scripts/workorder.mjs --record <file | -> [--id <work order>]
//   node <hub>/core/_system/scripts/workorder.mjs --check
//   node <hub>/core/_system/scripts/workorder.mjs --write
//   node <hub>/core/_system/scripts/workorder.mjs --headings <hub file>
//   (all take --hub <dir>; default: this hub)
//
// The source is core/_system/work-orders.json: one entry per output the hub makes, with
// its layers in order. Each layer names what is built, where the method lives (a file and
// heading in the owner skill, never a copy of it), the one check, the evidence that
// answers it and where a failure goes back to.
//
// --for matches a request against each entry's phrases and prints the work order. It is a
//   word match, a convenience for finding the page, not a substitute for reading the
//   request: no clear winner prints the candidates and points at start-here.
// --for and --id print the summary: each layer's number, id, name and what is built, and the
//   command that opens the first layer. Method, check and evidence are not in it.
// --layer opens one layer (with --id, or after --for) and needs --notes. It opens only when
//   every layer before it has its section in the notes file (a heading with its id and 15
//   words, or a section beginning n/a, not checked or partial with the reason); the first
//   time, it appends "<!-- opened: <work order>/<layer> <UTC time> -->" to the notes file.
//   --layer whole opens the whole-output check.
// --all prints the full page, every layer at once: for a person reading, and for a session
//   that cannot write a notes file at all.
// --record checks a "## Layer record" table (or the one-line form used in a reply) in a
//   file, or on standard input with "-": every layer present, one verdict per row, every
//   pass with evidence that the check was made, the state supported by the rows, every
//   failed or unchecked layer named beside the state, the evidence items a layer asks for,
//   and, when the record names a notes file, a heading per passed layer in it with the
//   loading layer naming every file under "Load first", and an "opened:" line per passed
//   layer, in the work order's order.
// --check validates the map against the hub (the build gate runs it). Exit 1 on failure.
// --write regenerates work-orders/README.md and work-orders/<id>.md from the map. The
//   gate fails when they are out of date, so edit the JSON, never the generated files.
// --headings prints the anchors a layer's "method" may point at in one hub file.

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { DEFAULT_HUB, parseArgs, UsageError, loadSkills, run, isMain } from "./lib.mjs";
import { words } from "./route.mjs";

export const MAP = "core/_system/work-orders.json";
export const OUT = "work-orders";
const VERDICTS = ["pass", "fail", "n/a", "not checked", "carried", "partial"];
// Evidence that says the check was not made cannot sit behind a pass.
const NOT_DONE = /\b(?:not (?:read|opened|open|viewed|watched|played|inspected|checked|checkable|seen|verified|rendered|produced)|(?:could not|couldn't|cannot|can't|unable to)(?: be)? (?:open|opened|read|view|viewed|watch|watched|play|played|inspect|inspected|check|checked|reach|reached|see|seen|verify|verified))\b/i;
const UNIVERSAL_STATE = "not ready";
const WEAK = /^(ok(ay)?|done|yes|y|good|great|fine|looks (good|fine|ok(ay)?|great)|all good|checked|verified|reviewed|passe?d?|n\/?a|none|tbd|-+|—|✓|✔)[.!]?$/i;
// A reason that says nothing: an n/a or a not checked needs the why.
const THIN = /^(skipped|skip|not needed|not applicable|does not apply|doesn't apply|not relevant|no need)[.!]?$/i;
// A not checked whose reason is in the writer's own hands: the check can be made, so it is made.
// A source read in part: a search, a head, a range that stops before the end, a skim.
const PART_READ = /\b(?:read in part|in part|partly read|partially read|partial read|only partly|skimmed|skim(?:med)? only|first \d+ lines|grep(?:ped)? only|by grep|head only|not (?:opened|read) in full)\b/i;
const NOT_DONE_MORE = " Do not delete a true limit to make the row pass: change the verdict, or say what was looked at in its place (a named substitute, such as the repository copy of a live page, is evidence when the row says it is a substitute).";
const IN_HAND = /\b(?:partly read|partial read|read only in part|only partly|skimmed|not (?:opened|read) in full|did(?: not|n't) (?:read|open|finish|get to)|ran out of (?:time|room|context)|no time|self-review only|only a self-review|no (?:fresh|second) reviewer)\b/i;

// The map as stored, with each {"use": "<layer set>"} replaced by that set's layers, so a
// run of layers shared by several outputs (the creative passes) is written once.
export function loadMap(hub) {
  const file = path.join(hub, MAP);
  if (!existsSync(file)) throw new UsageError(`no work order map at ${MAP}`);
  const map = JSON.parse(readFileSync(file, "utf8"));
  const sets = map.layer_sets || {};
  for (const o of Array.isArray(map.work_orders) ? map.work_orders : []) {
    o.layers = (Array.isArray(o.layers) ? o.layers : []).flatMap((l) => {
      if (!l || !l.use) return [l];
      if (!sets[l.use]) throw new UsageError(`work order ${o.id}: unknown layer set "${l.use}"`);
      return sets[l.use].map((x) => ({ ...x }));
    });
  }
  return map;
}

// GitHub-style heading anchor.
export function slug(heading) {
  return heading.trim().toLowerCase().replace(/[`*_]/g, "").replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-");
}

export function headings(file) {
  const out = [];
  let fence = false;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (/^\s*```/.test(line)) { fence = !fence; continue; }
    const m = !fence && line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (m) out.push(slug(m[1]));
  }
  return out;
}

const norm = (s) => String(s).toLowerCase().replace(/^[\s\d.)#-]+/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const list = (v) => (Array.isArray(v) ? v : v === undefined || v === null ? [] : [v]);

// ---------------------------------------------------------------- validation

function itemErrors(items, where) {
  if (items === undefined) return [];
  if (!Array.isArray(items) || !items.length || items.some((x) => typeof x !== "string" || !x.trim())) return [`${where}: "evidence_items" is a list of non-empty names`];
  const k = items.map((x) => x.trim().toLowerCase());
  return k.filter((x, i) => k.indexOf(x) !== i).map((x) => `${where}: evidence item "${x}" appears twice`);
}

export function validate(hub) {
  const errors = [];
  let map;
  try { map = loadMap(hub); } catch (e) { return { errors: [`${MAP}: ${e.message}`], count: 0 }; }
  const orders = list(map.work_orders);
  if (!orders.length) errors.push(`${MAP}: no work orders`);
  const ids = orders.map((o) => o.id);
  const skills = loadSkills(hub).map((s) => s.name).filter(Boolean);
  const seenPhrase = new Map();
  const anchorCache = new Map();
  const hasAnchor = (rel, anchor) => {
    const file = path.join(hub, rel);
    if (!existsSync(file)) return "missing file";
    if (!anchor) return null;
    if (!anchorCache.has(rel)) anchorCache.set(rel, headings(file));
    return anchorCache.get(rel).includes(anchor) ? null : `no heading "#${anchor}"`;
  };
  const text = (o, where, key) => {
    if (typeof o[key] !== "string" || !o[key].trim()) errors.push(`${where}: "${key}" is missing or empty`);
  };

  ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => errors.push(`${MAP}: work order "${id}" appears twice`));
  for (const o of orders) {
    const where = `work order ${o.id || "(no id)"}`;
    if (!/^[a-z][a-z0-9-]*$/.test(o.id || "")) errors.push(`${where}: id must be lowercase letters, digits and hyphens`);
    text(o, where, "name");
    text(o, where, "record");
    if (!skills.includes(o.owner)) errors.push(`${where}: owner "${o.owner}" is not a built skill`);
    if (!list(o.say).length) errors.push(`${where}: "say" needs at least one phrase a person would type`);
    for (const p of list(o.say)) {
      const k = norm(p);
      if (seenPhrase.has(k) && seenPhrase.get(k) !== o.id) errors.push(`${where}: phrase "${p}" is also on ${seenPhrase.get(k)}`);
      seenPhrase.set(k, o.id);
    }
    for (const rel of [...list(o.part_of), ...list(o.contains)]) {
      if (!ids.includes(rel)) errors.push(`${where}: names unknown work order "${rel}"`);
      if (rel === o.id) errors.push(`${where}: names itself`);
    }
    if (!list(o.load).length) errors.push(`${where}: "load" needs at least the owner skill`);
    for (const f of list(o.load)) if (hasAnchor(f)) errors.push(`${where}: load file not found: ${f}`);
    for (const w of list(o.load_when)) {
      text(w, `${where} load_when`, "when");
      if (hasAnchor(w.file || "")) errors.push(`${where}: load_when file not found: ${w.file}`);
    }

    const layers = list(o.layers);
    if (!layers.length) errors.push(`${where}: no layers`);
    const layerIds = layers.map((l) => l.id);
    layerIds.filter((id, i) => layerIds.indexOf(id) !== i).forEach((id) => errors.push(`${where}: layer "${id}" appears twice`));
    if (layerIds.includes("whole")) errors.push(`${where}: "whole" is reserved for the whole-output check`);
    for (const l of layers) {
      const lw = `${where}, layer ${l.id || "(no id)"}`;
      if (!/^[a-z][a-z0-9-]*$/.test(l.id || "")) errors.push(`${lw}: id must be lowercase letters, digits and hyphens`);
      for (const k of ["name", "build", "check", "evidence", "on_fail"]) text(l, lw, k);
      if (typeof l.check === "string" && !l.check.trim().endsWith("?")) errors.push(`${lw}: "check" is one question and ends with a question mark`);
      const children = list(l.work_orders);
      if (!l.method && !children.length) errors.push(`${lw}: needs "method" (file#heading) or "work_orders"`);
      for (const c of children) if (!ids.includes(c)) errors.push(`${lw}: names unknown work order "${c}"`);
      for (const m of list(l.method)) {
        const [file, anchor] = String(m).split("#");
        const problem = hasAnchor(file, anchor);
        if (problem) errors.push(`${lw}: method ${m}: ${problem}`);
      }
      for (const r of list(l.returns_to)) if (!layerIds.includes(r)) errors.push(`${lw}: returns_to names unknown layer "${r}"`);
      if (l.reads !== undefined && typeof l.reads !== "boolean") errors.push(`${lw}: "reads" is true or false`);
      itemErrors(l.evidence_items, lw).forEach((e) => errors.push(e));
    }
    if (layers.filter((l) => l.reads).length > 1) errors.push(`${where}: more than one layer is marked "reads"`);
    if (!o.whole) errors.push(`${where}: no whole-output check`);
    else {
      for (const k of ["check", "evidence", "on_fail"]) text(o.whole, `${where}, whole`, k);
      itemErrors(o.whole.evidence_items, `${where}, whole`).forEach((e) => errors.push(e));
      for (const m of list(o.whole.method)) {
        const [file, anchor] = String(m).split("#");
        const problem = hasAnchor(file, anchor);
        if (problem) errors.push(`${where}, whole: method ${m}: ${problem}`);
      }
    }
    const known = [...layerIds, "whole"];
    for (const r of list(o.recheck)) {
      text(r, `${where} recheck`, "when");
      if (!list(r.redo).length && !list(r.also).length) errors.push(`${where}: recheck "${r.when}" names nothing to check again`);
      for (const x of list(r.redo)) if (!known.includes(x)) errors.push(`${where}: recheck names unknown layer "${x}"`);
      for (const x of list(r.also)) if (!ids.includes(x)) errors.push(`${where}: recheck names unknown work order "${x}"`);
    }
    if (!list(o.states).length) errors.push(`${where}: no states`);
    for (const s of list(o.states)) {
      text(s, `${where} state`, "state");
      text(s, `${where} state ${s.state}`, "means");
      for (const x of list(s.needs)) if (!known.includes(x)) errors.push(`${where}: state "${s.state}" needs unknown layer "${x}"`);
      for (const x of list(s.must_pass)) if (!list(s.needs).includes(x)) errors.push(`${where}: state "${s.state}" must_pass names "${x}", which is not in its needs`);
    }
  }
  for (const s of skills) if (!orders.some((o) => o.owner === s)) errors.push(`skill ${s} owns no work order`);
  return { errors, count: orders.length };
}

// ---------------------------------------------------------------- rendering

const link = (prefix, target, label) => `[${label || target}](${prefix}${target})`;

function methodLinks(prefix, methods, hub = null) {
  return list(methods).map((m) => {
    const [file, anchor] = String(m).split("#");
    const base = file.replace(/^core\/skills\//, "").replace(/^core\/_system\//, "_system/");
    return link(prefix, m, anchor ? `${base}, "${anchor.replace(/-/g, " ")}"` : base) + fileLabel(hub, file);
  }).join("; ");
}

// Live output (--for, --id) shows each file's length; the generated pages do not, so they
// do not change when a file grows.
function fileLabel(hub, f) {
  if (!hub) return "";
  const file = path.join(hub, f);
  if (!existsSync(file)) return "";
  const t = readFileSync(file, "utf8");
  const n = t.split("\n").length - (t.endsWith("\n") ? 1 : 0);
  return n > 1500 ? ` (${n} lines, read it in several reads)` : ` (${n} lines)`;
}

const itemLine = (items) => `- The row's evidence gives each of these as \`name: what was found\`: ${list(items).map((x) => `\`${x}\``).join(", ")}`;

// The command that runs this tool: the hub's real path in live output, "<hub>/" on a generated page.
const tool = (hub) => (hub ? `node ${path.join(hub, "core/_system/scripts/workorder.mjs")}` : "node <hub>/core/_system/scripts/workorder.mjs");

// One layer's full block: what --layer prints and what --all shows for every layer.
export function layerBlock(o, l, i, map, prefix = "", hub = null) {
  const wo = (id) => (prefix ? `[\`${id}\`](${id}.md)` : `\`${id}\``);
  const L = [];
  L.push(`### ${i + 1}. ${l.name} (\`${l.id}\`)`, "");
  L.push(`- **Build:** ${l.build}`);
  if (list(l.work_orders).length) L.push(`- **Run:** ${list(l.work_orders).map(wo).join(", ")}${l.optional ? ` (${l.optional})` : ""}`);
  if (list(l.method).length) L.push(`- **Method:** ${methodLinks(prefix, l.method, hub)}`);
  L.push(`- **Check:** ${l.check}`);
  L.push(`- **Evidence:** ${l.evidence}`);
  if (list(l.evidence_items).length) L.push(itemLine(l.evidence_items));
  if (l.reads) L.push("- Under this layer's heading in the notes file, name every file under Load first and each of the business's files read, each read to its last line, and write an `Examples:` line naming every example the business's channel rules point at (or `none`, and why). The checker looks for each Load first file and the `Examples:` line there.");
  L.push(`- **If it fails:** ${l.on_fail}`, "");
  void map;
  return L.join("\n");
}

export function wholeBlock(o, prefix = "", hub = null) {
  const L = ["### Whole output (`whole`)", ""];
  if (list(o.whole.method).length) L.push(`- **Method:** ${methodLinks(prefix, o.whole.method, hub)}`);
  L.push(`- **Check:** ${o.whole.check}`);
  L.push(`- **Evidence:** ${o.whole.evidence}`);
  if (list(o.whole.evidence_items).length) L.push(itemLine(o.whole.evidence_items));
  L.push(`- **If it fails:** ${o.whole.on_fail}`, "");
  return L.join("\n");
}

// The page. Without `all` it is the summary: each layer's number, id, name and what is built,
// and the command that opens the first layer. Method, check and evidence come with --layer.
export function render(o, map, prefix = "", hub = null, all = false) {
  const wo = (id) => (prefix ? `[\`${id}\`](${id}.md)` : `\`${id}\``);
  const L = [];
  L.push(`# Work order: ${o.name} (\`${o.id}\`)`, "");
  L.push(`**When the ask is:** ${list(o.say).map((p) => `"${p}"`).join(", ")}`, "");
  if (o.not_for) L.push(`**Not this:** ${o.not_for}`, "");
  L.push(`**Owner:** \`${o.owner}\`${o.mode ? ` (${o.mode})` : ""}`);
  if (list(o.part_of).length) L.push(`**Part of:** ${list(o.part_of).map(wo).join(", ")}`);
  if (list(o.contains).length) L.push(`**Contains:** ${list(o.contains).map(wo).join(", ")}`);
  if (list(o.parts).length) L.push(`**Its parts:** ${list(o.parts).join("; ")}`);
  L.push(`**Live account:** ${o.live || "not reached"}`, "");
  L.push(`Build this one layer at a time, in order, under ${link(prefix, "core/_system/staged-work.md", "staged work")}. For each layer: open it with \`--layer\` when it is reached, build that layer only, answer its check from the evidence named, write its result under a heading with the layer's id in the notes file and its line in the layer record, then move on. Do not draft the finished output first and check it afterward. Every file this page lists, and every file of the business's that the request rests on (its brief, its rules for this channel, the examples those rules point at), is read to its last line. \`head\`, a line range, a search or a reader that stops at a line limit is a read in part, and a file read in part is not read.`, "");

  L.push("## Load first", "");
  list(o.load).forEach((f, i) => L.push(`${i + 1}. ${link(prefix, f)}${fileLabel(hub, f)}`));
  if (list(o.load_when).length) {
    L.push("", "Also, when it applies:", "");
    for (const w of list(o.load_when)) L.push(`- ${w.when}: ${link(prefix, w.file)}${fileLabel(hub, w.file)}`);
  }
  if (o.needs) {
    L.push("", "## Needs", "");
    if (list(o.needs.required).length) L.push(`- Required: ${list(o.needs.required).join("; ")}`);
    if (list(o.needs.helps).length) L.push(`- Helps, never blocks: ${list(o.needs.helps).join("; ")}`);
  }

  L.push("", "## Layers", "");
  if (all) {
    list(o.layers).forEach((l, i) => L.push(layerBlock(o, l, i, map, prefix, hub)));
    L.push(wholeBlock(o, prefix, hub));
  } else {
    list(o.layers).forEach((l, i) => {
      const run = list(l.work_orders).length ? ` Runs ${list(l.work_orders).map(wo).join(", ")}${l.optional ? ` (${l.optional})` : ""}.` : "";
      L.push(`${i + 1}. **${l.name}** (\`${l.id}\`): ${l.build}${run}`);
    });
    L.push(`${list(o.layers).length + 1}. **Whole output** (\`whole\`): the assembled output, checked last.`, "");
    L.push("Open the first layer:", "", "```", `${tool(hub)} --id ${o.id} --layer ${list(o.layers)[0].id} --notes <notes file>`, "```", "");
    L.push("A layer's method, check and evidence are printed when it is opened, and it opens once every layer before it has its section in the notes file. `--all` prints every layer at once: it is for a person reading, and for a session that cannot write a notes file at all.", "");
  }

  if (list(o.recheck).length) {
    L.push("## When something changes", "", "An old pass does not carry over. Check these again; leave unaffected work alone.", "");
    L.push("| If this changes | Check again | Note |", "| --- | --- | --- |");
    for (const r of list(o.recheck)) {
      const again = [...list(r.redo).map((x) => `\`${x}\``), ...list(r.also).map((x) => `work order ${wo(x)}`)].join(", ");
      L.push(`| ${r.when} | ${again} | ${r.note || ""} |`);
    }
    L.push("");
  }

  L.push("## What it can be called", "", "| State | Only when these passed | Means |", "| --- | --- | --- |");
  for (const s of list(o.states)) {
    const strict = list(s.must_pass);
    L.push(`| ${s.state} | ${list(s.needs).map((x) => (strict.includes(x) ? `**\`${x}\`**` : `\`${x}\``)).join(", ") || "nothing yet"} | ${s.means} |`);
  }
  L.push(`| ${UNIVERSAL_STATE} | nothing yet | A layer failed or could not be checked; say which and what it needs. |`, "");
  L.push("A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. Any layer that failed, was not checked or is partial, the whole row included, is named by its id after \`State:\`; the checker fails a record that leaves one out. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.", "");

  L.push("## Layer record", "", `Where it goes: ${o.record}`, "", "```markdown", "## Layer record", `Work order: ${o.id}`, "Notes: <path to the notes file>", "Date: <YYYY-MM-DD>");
  L.push("| Layer | Verdict | Evidence: what was looked at | Fix made or return |", "| --- | --- | --- | --- |");
  list(o.layers).forEach((l, i) => L.push(`| ${i + 1} ${l.id} |  |  |  |`));
  L.push("| whole |  |  |  |", "State:", "```", "");
  L.push("One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). `partial` (part of the check was made: say what was done and what remains; it counts as not checked for every state). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery. Before sending, run the record through `workorder.mjs --record <file>` (or `--record -` for a reply); a record that fails is fixed, not sent.", "");
  L.push("Notes: the file that holds each layer's result under a heading with the layer's id, written as the work proceeds (the job, the premises kept and rejected, the claims, the reviewer's findings and the repairs). It is this output's own file when it writes one; otherwise a scratch file outside the hub, and outside the business repo unless the business says outputs go there. Only a session that cannot write files writes `Notes: none (why)`. The checker opens the file: every passed layer needs its heading with at least 15 words under it and the `opened:` line `--layer` wrote when it was opened, in the work order's order, and the loading layer names every file under Load first.", "");
  L.push(`In a reply with no file, put the record on its own line, starting with \`Layers (${o.id}):\`, every layer in order with a few words of evidence in brackets:`, "");
  L.push("```", `Layers (${o.id}): ${list(o.layers)[0].id} pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>. Notes: <path>`, "```", "");
  L.push(`Check it before you send it: \`node ${prefix ? "<hub>/" : ""}core/_system/scripts/workorder.mjs --record <file>\`, or pipe the reply in with \`--record -\`.`, "");
  return L.join("\n");
}

export function renderIndex(map) {
  const L = [];
  L.push("# Work orders", "");
  L.push("One page per output this hub makes. Each page lists what to load and the layers to build and check, in order. The rules are in [staged work](../core/_system/staged-work.md). Find the row for what was asked, open its page, and work it one layer at a time. An unclear or multi-step request starts with `start-here`.", "");
  L.push("Each page is the summary: a layer's method, check and evidence are printed by `workorder.mjs --id <work order> --layer <layer id> --notes <file>` when that layer is reached, and `--all` prints the full page.", "");
  L.push("```", 'node <hub>/core/_system/scripts/workorder.mjs --for "<what was asked for>"', "```", "");
  L.push("| When the ask is | Work order | Owner | Layers |", "| --- | --- | --- | --- |");
  for (const o of list(map.work_orders)) {
    L.push(`| ${list(o.say).slice(0, 3).map((p) => `"${p}"`).join(", ")} | [${o.name}](${o.id}.md) | \`${o.owner}\` | ${list(o.layers).map((l) => l.name.toLowerCase()).join(" → ")} → whole |`);
  }
  L.push("", "Generated from `core/_system/work-orders.json` by `workorder.mjs --write`. Edit the JSON, not these files.", "");
  return L.join("\n");
}

const BANNER = "<!-- Generated from core/_system/work-orders.json by `workorder.mjs --write`. Edit the JSON, not this file. -->\n\n";

export function generated(hub) {
  const map = loadMap(hub);
  const files = { "README.md": BANNER + renderIndex(map) };
  for (const o of list(map.work_orders)) files[`${o.id}.md`] = BANNER + render(o, map, "../");
  return files;
}

export function stale(hub) {
  const dir = path.join(hub, OUT);
  const want = generated(hub);
  const problems = [];
  for (const [name, body] of Object.entries(want)) {
    const f = path.join(dir, name);
    if (!existsSync(f)) problems.push(`${OUT}/${name} is missing`);
    else if (readFileSync(f, "utf8") !== body) problems.push(`${OUT}/${name} is out of date`);
  }
  for (const name of existsSync(dir) ? readdirSync(dir) : []) {
    if (name.endsWith(".md") && !(name in want)) problems.push(`${OUT}/${name} has no entry in the map`);
  }
  return problems;
}

// ---------------------------------------------------------------- matching

// A word few work orders use says more about which one is meant than a word they all use,
// so each word counts by how rare it is across the map.
const MATCH_MIN = 1.6;
const MATCH_GAP = 0.4;

// "Use the Ad Hub for this." names the hub, not an output: its words never pick a work order.
const PREAMBLE = words("use hub");
const matchWords = (t) => { const w = words(t); for (const x of PREAMBLE) w.delete(x); return w; };

export function match(hub, request, min = MATCH_MIN, gap = MATCH_GAP, lead = false) {
  const map = loadMap(hub);
  const g = matchWords(request);
  const orders = list(map.work_orders);
  const vocab = orders.map((o) => matchWords([o.name, o.id.replace(/-/g, " "), ...list(o.say)].join(" ")));
  const df = new Map();
  for (const v of vocab) for (const x of v) df.set(x, (df.get(x) || 0) + 1);
  const weight = (x) => Math.log(1 + orders.length / (df.get(x) || orders.length));
  const sum = (xs) => xs.reduce((n, x) => n + weight(x), 0);
  const scored = orders.map((o, i) => {
    let best = 0;
    for (const p of list(o.say)) {
      const w = [...matchWords(p)];
      if (!w.length) continue;
      const hit = sum(w.filter((x) => g.has(x)));
      best = Math.max(best, (hit / sum(w)) * hit);
    }
    const spread = sum([...g].filter((x) => vocab[i].has(x)));
    return { o, score: best + spread * 0.25 };
  }).sort((a, b) => b.score - a.score);
  const [top, second] = scored;
  const clear = top && top.score >= min && (!second || top.score - second.score >= gap);
  const whole = { map, top: clear ? top.o : null, candidates: scored.filter((x) => x.score > 0).slice(0, 5).map((x) => x.o), scored };
  // A long request usually carries pasted material after the ask, and that material can outweigh it: read the ask first.
  const raw = String(request).trim();
  if (!lead && raw.split(/\s+/).length > 30) {
    const sentences = raw.split(/(?<=[.!?:])\s+/);
    for (const n of [1, 2]) {
      const first = match(hub, sentences.slice(0, n).join(" "), min, gap, true);
      if (first.top) return first;
    }
  }
  return whole;
}

// ---------------------------------------------------------------- records

// One verdict per row. "fail, then pass" is the one allowed pair: a repair that worked.
function readVerdict(cell) {
  const text = String(cell).toLowerCase().replace(/\b(?:partially|partly|part) (?:done|checked|rechecked|complete|completed)\b/g, "partial");
  const found = [...text.matchAll(/not checked|carried|partial|n\/a|pass|fail/g)].map((m) => m[0]);
  if (!found.length) return { verdict: null, mixed: false };
  const last = found[found.length - 1];
  const mixed = found.slice(0, -1).some((v) => v !== last && !(v === "fail" && (last === "pass" || last === "carried")));
  // One verdict exactly: "pass after a fix" hides a repair that belongs in the record as "fail, then pass".
  const plain = text.replace(/[`*_]/g, "").replace(/\s+,/g, ",").replace(/\s+/g, " ").replace(/[.;:,\s]+$/, "").trim();
  const extra = !mixed && !/^(?:pass|fail|n\/a|not checked|carried|partial|fail, then (?:pass|carried))$/.test(plain);
  return { verdict: last, mixed, extra, said: plain };
}

const cleanNotes = (s) => String(s).trim().replace(/^[`*]+|[`*]+$/g, "").replace(/[.,;]+$/, "").replace(/^[`*]+|[`*]+$/g, "").trim();

// "... State: copy-ready. Notes: /tmp/x/notes.md": the notes path comes off the end, outside brackets.
function takeNotes(str) {
  const s = String(str);
  const re = /(?:^|[\s.;·*])Notes:\s*/gi;
  let m, at = -1, len = 0;
  while ((m = re.exec(s))) {
    let depth = 0;
    for (const ch of s.slice(0, m.index)) { if (ch === "(") depth++; if (ch === ")") depth = Math.max(0, depth - 1); }
    if (depth === 0) { at = m.index; len = m[0].length; }
  }
  if (at < 0) return { rest: s, notes: null };
  return { rest: s.slice(0, at).replace(/[\s.;·*]+$/, ""), notes: cleanNotes(s.slice(at + len)) };
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordCount = (s) => (String(s).match(/[A-Za-z0-9][\w'’-]*/g) || []).length;
const namesWord = (text, id) => new RegExp(`(?<![a-z0-9-])${esc(id)}(?![a-z0-9-])`, "i").test(text);

// Evidence items: each "name: <at least three words>", in any order. A few items are short by nature
// ("reviewer: fresh agent", "reviewed: draft-01.md", "after review: nothing changed", "audience: any").
const ITEM_MIN = { reviewer: 2, reviewed: 1, "after review": 2, audience: 1 };
export function itemValues(items, evidence) {
  const ev = String(evidence);
  const found = [];
  for (const name of list(items)) {
    const re = new RegExp(`(?<![a-z0-9-])${esc(name.trim())}\\s*:`, "gi");
    let m;
    while ((m = re.exec(ev))) found.push({ name, start: m.index, after: m.index + m[0].length });
  }
  found.sort((a, b) => a.start - b.start);
  const values = {};
  found.forEach((f, i) => {
    const v = ev.slice(f.after, i + 1 < found.length ? found[i + 1].start : undefined).trim().replace(/[;,.\s]+$/, "");
    if (wordCount(v) >= (ITEM_MIN[f.name.trim().toLowerCase()] || 3) && !(f.name in values)) values[f.name] = v;
  });
  return values;
}
export function missingItems(items, evidence) {
  const values = itemValues(items, evidence);
  return list(items).filter((name) => !(name in values));
}

// "13, 5 blocking" or "a blocking gap" reports a blocking finding; "none blocking", "0 blocking" and "non-blocking" do not.
const NUMBER_WORDS = /^(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|several|many|some|a|an)$/;
export function reportsBlocking(findings) {
  for (const m of String(findings).toLowerCase().matchAll(/\bblocking\b/g)) {
    const before = (String(findings).toLowerCase().slice(0, m.index).match(/([a-z0-9]+)[\s-]*$/) || [])[1] || "";
    if (/^(?:0|zero|no|none|nothing|non|not)$/.test(before)) continue;
    if (/^\d+$/.test(before) ? Number(before) > 0 : true) return true;
  }
  return false;
}
// Review rows: what was reviewed, what changed after, and whether a blocking finding is recorded as a repair.
function reviewErrors(at, lid, r, values, verdictOf = () => null) {
  const errors = [];
  // "findings: 4 blocking [premises, copy], all repaired": the layers the blocking findings sent work back to.
  if (values.findings && reportsBlocking(values.findings)) {
    const named = [...values.findings.matchAll(/\[([^\]]+)\]/g)].flatMap((m) => m[1].split(/\s*(?:,|\band\b)\s*/)).map((x) => x.trim().replace(/[`*]/g, "")).filter(Boolean);
    if (!named.length) errors.push(`${at}: layer "${lid}" reports blocking findings with no layer named; write the layers they sent work back to in square brackets, for example "findings: 3 blocking [premises, copy], all repaired"`);
    for (const x of named) {
      const said = verdictOf(x);
      if (said === null) errors.push(`${at}: layer "${lid}" findings name "${x}", which is not a layer of this work order`);
      else if (/^(?:pass|carried)$/.test(said)) errors.push(`${at}: layer "${lid}" findings sent work back to "${x}", but "${x}" is a plain ${said}; a layer a blocking finding sent back is "fail, then pass" (or fail, or not checked)`);
    }
  }
  const reviewer = values.reviewer, after = values["after review"];
  if (reviewer && after && !/\bself\b/i.test(reviewer) && !/^[`"*]*(?:nothing|none|no change)/i.test(after)) errors.push(`${at}: layer "${lid}" passes on a fresh review, but text changed after it ("after review: ${after.slice(0, 60)}"); run the review again on what changed, or record the row as partial and name the changed lines`);
  if (values.findings && reportsBlocking(values.findings) && !/^fail\b/.test(r.said || "")) errors.push(`${at}: layer "${lid}" records blocking findings ("${values.findings.slice(0, 60)}") under a plain pass; a review that found blocking problems and was repaired is "fail, then pass"`);
  return errors;
}
// A repair named in a pass row: the check failed first, so the row is "fail, then pass".
const REPAIRED = /\b(?:returned (?:from|to) [a-z-]+|sent back to [a-z-]+|failed (?:first|at first|the check|its check|initially)|repaired after|fixed after (?:the |a )?(?:review|check|fail))/i;
// Own words: a line the maker marked "reworded" is rewritten before the row can pass.
const REWORDED = /(?<!\b(?:not|no|none)\s+)\breworded\b/i;

// A line saying a source was read only in part: the patterns above, or a range that stops before the file's end.
function partRead(line) {
  if (PART_READ.test(line)) return true;
  return [...line.matchAll(/\blines?\s+(\d+)\s*(?:-|–|to)\s*(\d+)\s+of\s+(\d+)/gi)].some((m) => Number(m[1]) > 1 || Number(m[2]) < Number(m[3]));
}

function sections(text) {
  const out = [];
  let cur = null, fence = false;
  for (const line of text.split("\n")) {
    if (/^\s*```/.test(line)) fence = !fence;
    const h = !fence && line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (h) { cur = { heading: h[1], body: [] }; out.push(cur); } else if (cur && !/^\s*<!--.*-->\s*$/.test(line)) cur.body.push(line);
  }
  return out;
}

// ---------------------------------------------------------------- gated layers

// "<!-- opened: <work order>/<layer> <UTC time> -->", written by --layer the first time a layer is opened.
const STAMP = /<!--\s*opened:\s*([a-z0-9-]+)\/([a-z0-9-]+)\s+(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s*-->/g;
// The earliest time for a layer is the one that counts.
export function stamps(text, id) {
  const out = {};
  for (const m of String(text).matchAll(STAMP)) if (m[1] === id && (!(m[2] in out) || m[3] < out[m[2]])) out[m[2]] = m[3];
  return out;
}

// The tool's own copy of the stamps, beside the notes file. A notes file rewritten whole
// loses the stamps written into it; the ledger keeps them.
export const ledgerOf = (file) => `${file}.opened`;
export const ledgerText = (file) => (existsSync(ledgerOf(file)) ? readFileSync(ledgerOf(file), "utf8") : "");

// A layer is written down when the notes file has a heading naming it with 15 words under it,
// or a section that begins n/a, not checked or partial with a reason of three words or more.
export function written(secs, lid) {
  return secs.filter((s) => namesWord(s.heading, lid)).some((s) => {
    const body = s.body.join("\n");
    if (wordCount(body) >= 15) return true;
    const m = body.match(/^[\s>*_`-]*(n\/a|not checked|partial)\b[`*_]*[\s:,.;()-]*([\s\S]*)$/i);
    return Boolean(m && wordCount(m[2]) >= 3);
  });
}

// Open one layer: the gate, the stamp, then the block.
export function openLayer(hub, o, map, lid, notes, cwd = process.cwd(), now = new Date()) {
  const layers = list(o.layers);
  const at = lid === "whole" ? layers.length : layers.findIndex((l) => l.id === lid);
  if (at < 0) throw new UsageError(`work order ${o.id} has no layer "${lid}"; its layers: ${layers.map((l) => l.id).join(", ")}, whole`);
  const file = path.resolve(cwd, notes);
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  const secs = sections(text);
  const missing = layers.slice(0, at).filter((l) => !written(secs, l.id));
  if (missing.length) {
    return { code: 1, out: `Layer "${lid}" is not open yet: layer "${missing[0].id}" has no section in ${notes}. Write its result under a heading with "${missing[0].id}" (15 words or more), or a section that begins "n/a", "not checked" or "partial" with the reason, then open "${lid}" again.` };
  }
  if (!(lid in stamps(`${text}\n${ledgerText(file)}`, o.id))) {
    mkdirSync(path.dirname(file), { recursive: true });
    const line = `<!-- opened: ${o.id}/${lid} ${now.toISOString().replace(/\.\d{3}Z$/, "Z")} -->\n`;
    writeFileSync(file, text && !text.endsWith("\n") ? `${text}\n${line}` : text + line);
    appendFileSync(ledgerOf(file), line);
  }
  const block = lid === "whole" ? wholeBlock(o, "", hub) : layerBlock(o, layers[at], at, map, "", hub);
  const next = at < layers.length - 1 ? layers[at + 1].id : at === layers.length - 1 ? "whole" : null;
  const L = [`Work order ${o.id}, layer ${at + 1} of ${layers.length + 1}. Paths are relative to the hub: ${hub}`, "", block];
  L.push(`Write this layer's result in ${notes} under a heading with \`${lid}\` before opening the next.`);
  L.push(next ? `Next: ${tool(hub)} --id ${o.id} --layer ${next} --notes ${notes}` : `Then check the record: ${tool(hub)} --record <file> (or --record - for a reply).`);
  return { code: 0, out: L.join("\n") };
}

// The notes file behind a record: a heading per passed layer with real sentences under it,
// and the loading layer naming every file under Load first, none of them read in part.
function checkNotes(o, rec, final, at, cwd) {
  const errors = [];
  const given = rec.notes;
  if (/^none\b/i.test(given)) {
    if (!/^none\s*\(\s*\S.{2,}\)/i.test(given)) errors.push(`${at}: "Notes: none" needs the reason in brackets, for example "Notes: none (cannot write files here)"`);
    return errors;
  }
  const file = path.resolve(cwd, given);
  if (!given || !existsSync(file)) return [`${at}: the notes file "${given}" was not found (paths are relative to the current directory, or absolute)`];
  const raw = readFileSync(file, "utf8");
  const secs = sections(raw);
  // Each passed layer was opened with --layer, and the opens run in the work order's order.
  const opened = stamps(`${raw}\n${ledgerText(file)}`, o.id);
  let prev = null;
  for (const l of [...list(o.layers), { id: "whole" }]) {
    if (final[l.id] === "pass" && !opened[l.id]) errors.push(`${at}: layer "${l.id}" passes, but the notes file has no "opened: ${o.id}/${l.id}" line; open each layer with --layer as it is reached, so its method and check come after the layers before it`);
    if (!opened[l.id]) continue;
    if (prev && opened[l.id] < prev.time) errors.push(`${at}: layer "${l.id}" was opened at ${opened[l.id]}, before layer "${prev.id}" (${prev.time}), which comes earlier in the work order; open each layer with --layer as it is reached`);
    prev = { id: l.id, time: opened[l.id] };
  }
  for (const l of list(o.layers)) {
    if (final[l.id] !== "pass") continue;
    const mine = secs.filter((s) => namesWord(s.heading, l.id));
    if (!mine.length) { errors.push(`${at}: the notes file has no heading naming layer "${l.id}"; write each layer's result under a heading with its id as the work proceeds`); continue; }
    if (!mine.some((s) => wordCount(s.body.join("\n")) >= 15)) errors.push(`${at}: the notes file's heading for layer "${l.id}" has fewer than 15 words under it; the layer's result goes there, not a label`);
    if (!l.reads) continue;
    const body = mine.map((s) => s.body.join("\n")).join("\n");
    const bases = list(o.load).map((f) => path.basename(f));
    for (const f of list(o.load)) {
      const base = path.basename(f);
      const forms = [f, `${path.basename(path.dirname(f))}/${base}`];
      if (bases.filter((b) => b === base).length === 1) forms.push(base);
      if (!forms.some((x) => new RegExp(`(?<![A-Za-z0-9_-])${esc(x)}`).test(body))) errors.push(`${at}: the notes under layer "${l.id}" do not name ${f}; name every file under Load first, each read to its last line`);
    }
    if (!/^[\s>*-]*`?Examples:`?\s*\S/im.test(body)) errors.push(`${at}: the notes under layer "${l.id}" have no "Examples:" line; name every example the business's channel rules point at, each read to its end, or write "Examples: none" with why`);
    for (const line of body.split("\n")) if (partRead(line)) errors.push(`${at}: the notes under layer "${l.id}" say a file was read in part ("${line.trim().slice(0, 80)}"); read it to its last line, then record it`);
  }
  return errors;
}

export function parseRecords(text) {
  const records = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^#{2,6}\s+Layer record\b/i.test(lines[i])) {
      const rec = { line: i + 1, id: null, rows: [], state: null };
      for (let j = i + 1; j < lines.length; j++) {
        const t = lines[j].trim();
        if (/^#{1,6}\s/.test(t) || /^```/.test(t)) break;
        const wo = t.match(/^Work order:\s*`?([a-z0-9-]+)`?/i);
        if (wo) { rec.id = wo[1]; continue; }
        const nt = t.match(/^Notes:\s*(.*)$/i);
        if (nt) { rec.notes = cleanNotes(nt[1]); continue; }
        const st = t.match(/^State:\s*(.*)$/i);
        if (st) { const x = takeNotes(st[1]); rec.state = x.rest.trim(); if (x.notes) rec.notes = x.notes; continue; }
        if (t.startsWith("|")) {
          const cells = t.split("|").slice(1, -1).map((c) => c.trim());
          if (cells.length < 2 || /^-+$/.test(cells[0].replace(/[: ]/g, "")) || /^layer$/i.test(cells[0])) continue;
          rec.rows.push({ layer: norm(cells[0]), ...readVerdict(cells[1]), given: cells[1], evidence: cells[2] || "", fix: cells[3] || "" });
        }
      }
      records.push(rec);
    }
    // The one-line form used in a reply. It may sit anywhere on its line.
    const one = lines[i].match(/Layers\s*\(`?([a-z0-9-]+)`?\)\s*:\s*(.+)$/i);
    if (one) {
      const rec = { line: i + 1, id: one[1], rows: [], state: null, compact: true };
      const taken = takeNotes(one[2]);
      let body = taken.rest;
      if (taken.notes) rec.notes = taken.notes;
      const st = body.match(/\bState:\s*(.*)$/i);
      if (st) { rec.state = st[1].trim(); body = body.slice(0, st.index); }
      else {
        const before = lines[i].slice(0, one.index).match(/State:\s*([^.]*)/i);
        const after = [lines[i + 1], lines[i + 2]].map((l) => String(l || "").match(/^\s*State:\s*(.*)$/i)).find(Boolean);
        if (before) rec.state = before[1].trim();
        else if (after) rec.state = takeNotes(after[1]).rest.trim();
      }
      if (!rec.notes) {
        const near = [lines[i + 1], lines[i + 2]].map((l) => String(l || "").match(/^\s*(?:State:.*?)?\bNotes:\s*(.*)$/i)).find(Boolean);
        if (near) rec.notes = cleanNotes(near[1]);
      }
      // Split on the separator only outside brackets, so "·" or ";" inside evidence stays evidence.
      const sep = body.includes("·") ? "·" : ";";
      const items = [];
      let depth = 0, cur = "";
      for (const ch of body) {
        if (ch === "(") depth++;
        if (ch === ")") depth = Math.max(0, depth - 1);
        if (ch === sep && depth === 0) { items.push(cur); cur = ""; } else cur += ch;
      }
      items.push(cur);
      for (const raw of items) {
        const item = raw.trim().replace(/\.$/, "");
        const open = item.indexOf("(");
        const close = item.lastIndexOf(")");
        const head = open < 0 ? item : item.slice(0, open);
        const evidence = open < 0 ? "" : item.slice(open + 1, close > open ? close : undefined);
        const tail = close > open ? item.slice(close + 1) : "";
        const m = head.trim().match(/^[`*_\s]*([a-z0-9][a-z0-9-]*)[`*_]*[\s:]+(.*)$/i);
        if (!m) continue;
        const given = `${m[2]} ${tail}`.trim();
        rec.rows.push({ layer: norm(m[1]), ...readVerdict(given), given, evidence: evidence.trim(), fix: "" });
      }
      records.push(rec);
    }
  }
  return records;
}

export function checkRecord(hub, text, forcedId, opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const map = loadMap(hub);
  const by = Object.fromEntries(list(map.work_orders).map((o) => [o.id, o]));
  const records = parseRecords(text);
  const errors = [];
  if (!records.length) errors.push('no "## Layer record" section and no "Layers (<work order>): ..." line found');
  for (const rec of records) {
    const id = forcedId || rec.id;
    const at = `layer record at line ${rec.line}`;
    if (!id) { errors.push(`${at}: no "Work order: <id>" line; pass --id`); continue; }
    const o = by[id];
    if (!o) { errors.push(`${at}: unknown work order "${id}"`); continue; }
    const rows = {};
    for (const r of rec.rows) rows[r.layer] = r;
    const find = (l) => rows[norm(l.id)] || rows[norm(l.name)];
    const final = {};
    const audiences = [];
    for (const l of [...list(o.layers), { id: "whole", name: "whole output" }]) {
      const r = find(l) || (l.id === "whole" ? rows["whole-output"] : null);
      if (!r) { errors.push(`${at}: layer "${l.id}" has no row; a layer that does not apply is n/a with the reason, never left out`); continue; }
      if (!VERDICTS.includes(r.verdict)) { errors.push(String(r.given || "").trim() ? `${at}: layer "${l.id}" has the verdict "${String(r.given).trim().slice(0, 60)}", which is not one of ${VERDICTS.join(", ")}; a layer checked only in part is partial, with what was done and what remains` : `${at}: layer "${l.id}" has no verdict (${VERDICTS.join(", ")})`); continue; }
      final[l.id] = r.verdict;
      if (r.mixed) errors.push(`${at}: layer "${l.id}" carries two verdicts; one verdict per row (a layer checked only in part is partial, with what was done and what remains)`);
      if (r.extra) errors.push(`${at}: layer "${l.id}" has the verdict "${r.said}"; write one verdict only (a repair that worked is "fail, then pass") and put everything else in the evidence${rec.compact ? ", in brackets" : " or fix column"}`);
      const plainPass = r.verdict === "pass" && !r.extra && !r.mixed && !/^fail\b/.test(r.said || "");
      if (plainPass && (/^fail(?:ed|s)?\b/i.test(r.fix.trim()) || REPAIRED.test(r.fix))) errors.push(`${at}: layer "${l.id}" is marked pass but its fix column records a failure or a repair; a repair made after a failed check is "fail, then pass"`);
      else if (plainPass && REPAIRED.test(r.evidence)) errors.push(`${at}: layer "${l.id}" is marked pass but its evidence names a repair after a failed check ("${r.evidence.match(REPAIRED)[0]}"); that is "fail, then pass"`);
      const ev = r.evidence.trim();
      if (r.verdict === "carried" && !/\b\d{4}-\d{2}-\d{2}\b/.test(ev)) errors.push(`${at}: layer "${l.id}" is carried without the date of the record it passed in (YYYY-MM-DD)`);
      if (r.verdict === "pass" || r.verdict === "carried") {
        if (ev.length < 6 || WEAK.test(ev)) errors.push(`${at}: layer "${l.id}" passes with no evidence ("${ev}"); name what was looked at`);
        else if (r.verdict === "pass" && NOT_DONE.test(ev)) errors.push(`${at}: layer "${l.id}" is marked pass but its evidence says the check was not made ("${ev.slice(0, 80)}"); that is not checked.${NOT_DONE_MORE}`);
      }
      const items = l.id === "whole" ? list(o.whole && o.whole.evidence_items) : list(l.evidence_items);
      if (r.verdict === "pass" && items.length) {
        const miss = missingItems(items, ev);
        if (miss.length) errors.push(`${at}: layer "${l.id}" passes without these evidence items: ${miss.map((x) => `"${x}:"`).join(", ")}; give each as "name: what was found", at least three words`);
        const values = itemValues(items, ev);
        if (items.includes("reviewer")) errors.push(...reviewErrors(at, l.id, r, values, (x) => { const row = list(o.layers).some((y) => y.id === norm(x)) || norm(x) === "whole" ? find({ id: x, name: x }) : null; return row ? row.said || "" : null; }));
        if (values.audience && !/^[`"*]*any\b/i.test(values.audience)) audiences.push(values.audience);
        if (values["own words"] && REWORDED.test(values["own words"])) errors.push(`${at}: layer "${l.id}" passes with a line its own words item marks reworded; rewrite the line, or record the row as failed`);
      }
      if ((r.verdict === "n/a" || r.verdict === "not checked" || r.verdict === "partial") && (ev.length < 6 || WEAK.test(ev) || THIN.test(ev))) errors.push(`${at}: layer "${l.id}" is ${r.verdict} with no reason; say why it does not apply, or what could not be done and who can`);
      if (r.verdict === "not checked" && /\b(?:no earlier (?:layer )?record|predates? layer records|no record of this layer|no layer record)\b/i.test(ev)) errors.push(`${at}: layer "${l.id}" is not checked for want of an earlier record; a layer the change did not touch is carried from the ad's dated status on file (its ledger status, checks section or approval), and a layer the change touched is run again`);
      if (r.verdict === "not checked" && IN_HAND.test(ev)) errors.push(`${at}: layer "${l.id}" is not checked for a reason that is in your hands ("${ev.match(IN_HAND)[0]}"); not checked is for a check that cannot be made in this session: make the check, then record the verdict (a self-review in a separate pass is a pass, labelled self-review)`);
      if (l.id === "whole" && r.verdict === "n/a") errors.push(`${at}: the whole-output row is never n/a; check the assembled output, or mark it not checked with the reason`);
      if (r.verdict === "fail" && !ev && !r.fix.trim()) errors.push(`${at}: layer "${l.id}" fails with nothing said about what failed`);
    }
    if (rec.notes === undefined || rec.notes === null) {
      if (rec.compact || opts.stdin) errors.push(`${at}: no "Notes:" line; name the notes file that holds each layer's result, or "Notes: none (why)"`);
    } else errors.push(...checkNotes(o, rec, final, at, cwd));
    if (!rec.state) { errors.push(`${at}: no "State:" line`); continue; }
    // Every layer that failed, was not checked or is partial is named beside the state.
    const unnamed = Object.entries(final).filter(([lid, v]) => ["fail", "not checked", "partial"].includes(v) && !namesWord(rec.state, lid)).map(([lid, v]) => `"${lid}" (${v})`);
    if (unnamed.length) errors.push(`${at}: the state does not name ${unnamed.join(", ")}; name each failed, unchecked or partial layer by its id after "State:"`);
    const st = rec.state.toLowerCase().replace(/[`*]/g, "");
    const states = [...list(o.states)].sort((a, b) => b.state.length - a.state.length);
    const claimed = states.find((s) => st.startsWith(s.state.toLowerCase()));
    if (!claimed) {
      if (!st.startsWith(UNIVERSAL_STATE)) errors.push(`${at}: state "${rec.state}" is not one of: ${list(o.states).map((s) => s.state).concat(UNIVERSAL_STATE).join(", ")}`);
      continue;
    }
    // A state takes no exceptions: "rechecked, except the live ads" is the weaker state, not this one.
    const tail = st.slice(claimed.state.length).split(/[.!?](?:\s|$)/)[0];
    const ex = tail.match(/\b(?:except|excluding|apart from|other than|but|however|although|only)\b/);
    if (ex) errors.push(`${at}: state "${claimed.state}" is claimed with an exception ("${ex[0]}"); a state takes no exceptions: claim the weaker state and name what remains`);
    for (const need of list(claimed.needs)) {
      const v = final[need];
      const strict = list(claimed.must_pass).includes(need);
      if (v && v !== "pass" && v !== "carried" && (strict || v !== "n/a")) {
        errors.push(`${at}: state "${claimed.state}" needs layer "${need}" to pass; it is ${v}`);
      }
    }
    // A review whose scores hold for one audience: a state resting on it names that audience.
    if (list(claimed.needs).includes("review")) {
      for (const a of audiences) {
        const keys = (a.toLowerCase().match(/[a-z]{4,}/g) || []).filter((w) => !["only", "audience", "audiences", "served", "when", "with", "that", "this", "scores", "hold"].includes(w));
        if (keys.length && !keys.some((k) => st.includes(k))) errors.push(`${at}: the review's scores hold for one audience ("audience: ${a.slice(0, 60)}"); name it after the state, for example "State: ${claimed.state} for ${a.slice(0, 40)}"`);
      }
    }
    const needed = list(claimed.needs);
    if (needed.length && needed.every((n) => final[n] === "n/a")) errors.push(`${at}: state "${claimed.state}" rests only on n/a rows; n/a alone cannot support a state`);
  }
  return { errors, records };
}

// ---------------------------------------------------------------- CLI

export function main(argv) {
  const args = parseArgs(argv, ["list", "check", "write", "all"]);
  const hub = path.resolve(args.hub || DEFAULT_HUB);
  if (args.check) {
    const { errors, count } = validate(hub);
    const drift = errors.length ? [] : stale(hub);
    for (const e of [...errors, ...drift]) console.log(`FAIL  ${e}`);
    if (drift.length) console.log("Run: node core/_system/scripts/workorder.mjs --write");
    const n = errors.length + drift.length;
    console.log(`${n ? "Check failed" : "Check passed"}: ${count} work order(s), ${n} problem(s).`);
    return n ? 1 : 0;
  }
  if (args.write) {
    const { errors } = validate(hub);
    if (errors.length) { for (const e of errors) console.log(`FAIL  ${e}`); return 1; }
    const dir = path.join(hub, OUT);
    mkdirSync(dir, { recursive: true });
    const files = generated(hub);
    for (const name of readdirSync(dir)) if (name.endsWith(".md") && !(name in files)) rmSync(path.join(dir, name));
    for (const [name, body] of Object.entries(files)) writeFileSync(path.join(dir, name), body);
    console.log(`wrote ${Object.keys(files).length} file(s) to ${OUT}/`);
    return 0;
  }
  if (args.headings) {
    for (const h of headings(path.resolve(hub, args.headings))) console.log(`${args.headings}#${h}`);
    return 0;
  }
  if (args.list) {
    for (const o of list(loadMap(hub).work_orders)) console.log(`${o.id.padEnd(24)} ${o.owner.padEnd(18)} ${o.name}`);
    return 0;
  }
  if (args.record) {
    const file = args.record === "-" ? 0 : path.resolve(args.record);
    if (file !== 0 && !existsSync(file)) throw new UsageError(`file not found: ${args.record}`);
    const { errors, records } = checkRecord(hub, readFileSync(file, "utf8"), args.id, { stdin: file === 0 });
    for (const e of errors) console.log(`FAIL  ${e}`);
    console.log(`${errors.length ? "Record failed" : "Record passed"}: ${records.length} layer record(s), ${errors.length} problem(s).`);
    return errors.length ? 1 : 0;
  }
  // --layer opens one layer of the work order named by --id (or matched by --for).
  const openOne = (o, map) => {
    if (!args.notes) throw new UsageError("--layer needs --notes <path to the notes file>; a session that cannot write a notes file at all reads the page with --all");
    const r = openLayer(hub, o, map, String(args.layer), args.notes);
    console.log(r.out);
    return r.code;
  };
  if (args.id) {
    const map = loadMap(hub);
    const o = list(map.work_orders).find((x) => x.id === args.id);
    if (!o) throw new UsageError(`no work order "${args.id}"; --list shows them`);
    if (args.layer) return openOne(o, map);
    console.log(`Paths are relative to the hub: ${hub}\n`);
    console.log(render(o, map, "", hub, Boolean(args.all)));
    return 0;
  }
  if (args.for) {
    const { map, top, candidates } = match(hub, args.for);
    if (top && args.layer) return openOne(top, map);
    if (!top) {
      console.log("No single work order matches clearly.");
      if (candidates.length) {
        console.log("Closest:");
        for (const o of candidates) console.log(`  ${o.id.padEnd(22)} ${o.name}  (owner: ${o.owner})`);
        console.log("Pick by reading the request, then: workorder.mjs --id <work order>");
      }
      console.log("A request that names an ad ID: the ledger row's format says which work order makes it (static-ad, video-ad, ad-copy).");
      console.log("Unclear or spanning several outputs: start with start-here (core/skills/start-here/SKILL.md).");
      return 0;
    }
    const others = candidates.filter((o) => o.id !== top.id).slice(0, 3);
    console.log(`Matched: ${top.id}${others.length ? `. Also close: ${others.map((o) => o.id).join(", ")}` : ""}.`);
    console.log(`A word match, not a reading of the request: if this is the wrong output, use --list. Paths are relative to the hub: ${hub}\n`);
    console.log(render(top, map, "", hub, Boolean(args.all)));
    return 0;
  }
  throw new UsageError('usage: workorder.mjs (--for "<request>" | --id <work order>) [--layer <layer id> --notes <file> | --all] | --list | --record <file> | --check | --write | --headings <file>');
}

if (isMain(import.meta.url)) run(main);
