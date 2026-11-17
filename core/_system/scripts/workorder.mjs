#!/usr/bin/env node
// Work orders: the output map behind staged work (core/_system/staged-work.md).
//
//   node <hub>/core/_system/scripts/workorder.mjs --for "<what was asked for>" [--all]
//   node <hub>/core/_system/scripts/workorder.mjs --id <work order> [--all]
//   node <hub>/core/_system/scripts/workorder.mjs --id <work order> --layer <layer id>
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
// --for matches a request against each entry's phrases and prints the work order's summary
//   (--id prints it by id). It is a word match, a convenience for finding the page, not a
//   substitute for reading the request: no clear winner prints the candidates and points at
//   start-here. The summary lists the layers by number, name and id; --all prints the whole
//   page, as work-orders/<id>.md shows it.
// --layer prints one layer of a work order: what to build, the method, the check, the
//   evidence, where a failure goes back to, its place and the next layer. It reads and
//   writes nothing.
// --record checks a "## Layer record" table (or the one-line form used in a reply) in a
//   file, or on standard input with "-": every layer present, one verdict per row, every
//   pass with evidence that the check was made, the state supported by the rows.
// --check validates the map against the hub (the build gate runs it). Exit 1 on failure.
// --write regenerates work-orders/README.md and work-orders/<id>.md from the map. The
//   gate fails when they are out of date, so edit the JSON, never the generated files.
// --headings prints the anchors a layer's "method" may point at in one hub file.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { DEFAULT_HUB, parseArgs, UsageError, loadSkills, run, isMain } from "./lib.mjs";
import { words } from "./route.mjs";

export const MAP = "core/_system/work-orders.json";
export const OUT = "work-orders";
const VERDICTS = ["pass", "fail", "n/a", "not checked", "carried"];
// Evidence that says the check was not made cannot sit behind a pass.
const NOT_DONE = /\b(?:not (?:read|opened|open|viewed|watched|played|inspected|checked|checkable|seen|verified|rendered|produced)|(?:could not|couldn't|cannot|can't|unable to)(?: be)? (?:open|opened|read|view|viewed|watch|watched|play|played|inspect|inspected|check|checked|reach|reached|see|seen|verify|verified))\b/i;
const UNIVERSAL_STATE = "not ready";
const WEAK = /^(ok(ay)?|done|yes|y|good|great|fine|looks (good|fine|ok(ay)?|great)|all good|checked|verified|reviewed|passe?d?|n\/?a|none|tbd|-+|—|✓|✔)[.!]?$/i;
// A reason that says nothing: an n/a or a not checked needs the why.
const THIN = /^(skipped|skip|not needed|not applicable|does not apply|doesn't apply|not relevant|no need)[.!]?$/i;
// A not checked whose reason is in the writer's own hands: the check can be made, so it is made.
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
    }
    if (!o.whole) errors.push(`${where}: no whole-output check`);
    else {
      for (const k of ["check", "evidence", "on_fail"]) text(o.whole, `${where}, whole`, k);
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

function methodLinks(prefix, methods) {
  return list(methods).map((m) => {
    const [file, anchor] = String(m).split("#");
    const base = file.replace(/^core\/skills\//, "").replace(/^core\/_system\//, "_system/");
    return link(prefix, m, anchor ? `${base}, "${anchor.replace(/-/g, " ")}"` : base);
  }).join("; ");
}

const woLink = (prefix) => (id) => (prefix ? `[\`${id}\`](${id}.md)` : `\`${id}\``);

// The layers of a work order with the whole-output check last, as "--layer" numbers them.
export function layersOf(o) {
  return [...list(o.layers), { ...o.whole, id: "whole", name: "Whole output" }];
}

function layerLines(l, prefix) {
  const wo = woLink(prefix);
  const L = [];
  if (l.build) L.push(`- **Build:** ${l.build}`);
  if (list(l.work_orders).length) L.push(`- **Run:** ${list(l.work_orders).map(wo).join(", ")}${l.optional ? ` (${l.optional})` : ""}`);
  if (list(l.method).length) L.push(`- **Method:** ${methodLinks(prefix, l.method)}`);
  L.push(`- **Check:** ${l.check}`);
  L.push(`- **Evidence:** ${l.evidence}`);
  L.push(`- **If it fails:** ${l.on_fail}`);
  return L;
}

// One layer, as "--layer" prints it.
export function renderLayer(o, layerId, prefix = "") {
  const all = layersOf(o);
  const i = all.findIndex((l) => l.id === layerId);
  if (i < 0) throw new UsageError(`work order ${o.id} has no layer "${layerId}"; its layers: ${all.map((l) => l.id).join(", ")}`);
  const l = all[i];
  const L = [];
  L.push(`# ${o.name} (\`${o.id}\`), layer ${i + 1} of ${all.length}: ${l.name} (\`${l.id}\`)`, "");
  L.push(...layerLines(l, prefix), "");
  L.push(i + 1 < all.length ? `Next: \`${all[i + 1].id}\`. Build and check this layer first.` : "This is the last layer. Then write the layer record and report only the state it supports.");
  return L.join("\n");
}

export function render(o, map, prefix = "", summary = false) {
  const by = Object.fromEntries(list(map.work_orders).map((x) => [x.id, x]));
  const wo = woLink(prefix);
  const L = [];
  L.push(`# Work order: ${o.name} (\`${o.id}\`)`, "");
  L.push(`**When the ask is:** ${list(o.say).map((p) => `"${p}"`).join(", ")}`, "");
  if (o.not_for) L.push(`**Not this:** ${o.not_for}`, "");
  L.push(`**Owner:** \`${o.owner}\`${o.mode ? ` (${o.mode})` : ""}`);
  if (list(o.part_of).length) L.push(`**Part of:** ${list(o.part_of).map(wo).join(", ")}`);
  if (list(o.contains).length) L.push(`**Contains:** ${list(o.contains).map(wo).join(", ")}`);
  if (list(o.parts).length) L.push(`**Its parts:** ${list(o.parts).join("; ")}`);
  L.push(`**Live account:** ${o.live || "not reached"}`, "");
  L.push(`Build this one layer at a time, in order, under ${link(prefix, "core/_system/staged-work.md", "staged work")}. For each layer: build that layer only, answer its check from the evidence named, write its line in the layer record, then move on. Do not draft the finished output first and check it afterward.`, "");

  L.push("## Load first", "");
  list(o.load).forEach((f, i) => L.push(`${i + 1}. ${link(prefix, f)}`));
  if (list(o.load_when).length) {
    L.push("", "Also, when it applies:", "");
    for (const w of list(o.load_when)) L.push(`- ${w.when}: ${link(prefix, w.file)}`);
  }
  if (o.needs) {
    L.push("", "## Needs", "");
    if (list(o.needs.required).length) L.push(`- Required: ${list(o.needs.required).join("; ")}`);
    if (list(o.needs.helps).length) L.push(`- Helps, never blocks: ${list(o.needs.helps).join("; ")}`);
  }

  L.push("", "## Layers", "");
  if (summary) {
    layersOf(o).forEach((l, i) => L.push(`${i + 1}. ${l.name} (\`${l.id}\`)`));
    L.push("", `Open each layer when you reach it: \`workorder.mjs --id ${o.id} --layer <layer id>\`. \`--all\` prints every layer at once.`, "");
  } else {
    list(o.layers).forEach((l, i) => {
      L.push(`### ${i + 1}. ${l.name} (\`${l.id}\`)`, "");
      L.push(...layerLines(l, prefix), "");
    });
    L.push("### Whole output (`whole`)", "");
    L.push(...layerLines({ ...o.whole, build: undefined }, prefix), "");
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
  L.push("A layer in bold must be `pass`, or `carried` from an earlier record; `n/a` is not accepted there. The others may also be `n/a` with the reason. The whole-output row is never `n/a`, and no state stands on `n/a` rows alone. A layer outside the list that failed or was not checked is named beside the state. A state takes no exceptions (`rechecked, except the live ads`): claim the weaker state and name what remains.", "");

  L.push("## Layer record", "", `Where it goes: ${o.record}`, "", "```markdown", "## Layer record", `Work order: ${o.id}`, "Date: <YYYY-MM-DD>");
  L.push("| Layer | Verdict | Evidence: what was looked at | Fix made or return |", "| --- | --- | --- | --- |");
  list(o.layers).forEach((l, i) => L.push(`| ${i + 1} ${l.id} |  |  |  |`));
  L.push("| whole |  |  |  |", "State:", "```", "");
  L.push("One verdict per row: `pass` (name what was looked at), `fail` (name the fix or where it went back), `n/a` (say why it does not apply), `not checked` (say why and who can check it), `carried` (it passed in an earlier record and nothing it rests on changed: name that record's date). A pass whose evidence says the check was not made is a `not checked`. `not checked` is only for a check that cannot be made in this session (no tool, no access, a person's approval): a check that is in your hands is made before delivery.", "");
  L.push(`In a reply with no file, put the record on its own line, starting with \`Layers (${o.id}):\`, every layer in order with a few words of evidence in brackets:`, "");
  L.push("```", `Layers (${o.id}): ${list(o.layers)[0].id} pass (what was looked at) · <next layer> not checked (why, and who can) · ... · whole pass (what was looked at). State: <state>`, "```", "");
  L.push(`Check it before you send it: \`node ${prefix ? "<hub>/" : ""}core/_system/scripts/workorder.mjs --record <file>\`, or pipe the reply in with \`--record -\`.`, "");
  void by;
  return L.join("\n");
}

export function renderIndex(map) {
  const L = [];
  L.push("# Work orders", "");
  L.push("One page per output this hub makes. Each page lists what to load and the layers to build and check, in order. The rules are in [staged work](../core/_system/staged-work.md). Find the row for what was asked, open its page, and work it one layer at a time. An unclear or multi-step request starts with `start-here`.", "");
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

export function match(hub, request, min = MATCH_MIN, gap = MATCH_GAP) {
  const map = loadMap(hub);
  const g = words(request);
  const orders = list(map.work_orders);
  const vocab = orders.map((o) => words([o.name, o.id.replace(/-/g, " "), ...list(o.say)].join(" ")));
  const df = new Map();
  for (const v of vocab) for (const x of v) df.set(x, (df.get(x) || 0) + 1);
  const weight = (x) => Math.log(1 + orders.length / (df.get(x) || orders.length));
  const sum = (xs) => xs.reduce((n, x) => n + weight(x), 0);
  const scored = orders.map((o, i) => {
    let best = 0;
    for (const p of list(o.say)) {
      const w = [...words(p)];
      if (!w.length) continue;
      const hit = sum(w.filter((x) => g.has(x)));
      best = Math.max(best, (hit / sum(w)) * hit);
    }
    const spread = sum([...g].filter((x) => vocab[i].has(x)));
    return { o, score: best + spread * 0.25 };
  }).sort((a, b) => b.score - a.score);
  const [top, second] = scored;
  const clear = top && top.score >= min && (!second || top.score - second.score >= gap);
  return { map, top: clear ? top.o : null, candidates: scored.filter((x) => x.score > 0).slice(0, 5).map((x) => x.o), scored };
}

// ---------------------------------------------------------------- records

// One verdict per row. "fail, then pass" is the one allowed pair: a repair that worked.
function readVerdict(cell) {
  const found = [...String(cell).toLowerCase().matchAll(/not checked|carried|n\/a|pass|fail/g)].map((m) => m[0]);
  if (!found.length) return { verdict: null, mixed: false };
  const last = found[found.length - 1];
  const mixed = found.slice(0, -1).some((v) => v !== last && !(v === "fail" && (last === "pass" || last === "carried")));
  // One verdict exactly: "pass after a fix" hides a repair that belongs in the record as "fail, then pass".
  const plain = String(cell).toLowerCase().replace(/[`*_]/g, "").replace(/\s+,/g, ",").replace(/\s+/g, " ").replace(/[.;:,\s]+$/, "").trim();
  const extra = !mixed && !/^(?:pass|fail|n\/a|not checked|carried|fail, then (?:pass|carried))$/.test(plain);
  return { verdict: last, mixed, extra, said: plain };
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
        const st = t.match(/^State:\s*(.*)$/i);
        if (st) { rec.state = st[1].trim(); continue; }
        if (t.startsWith("|")) {
          const cells = t.split("|").slice(1, -1).map((c) => c.trim());
          if (cells.length < 2 || /^-+$/.test(cells[0].replace(/[: ]/g, "")) || /^layer$/i.test(cells[0])) continue;
          rec.rows.push({ layer: norm(cells[0]), ...readVerdict(cells[1]), evidence: cells[2] || "", fix: cells[3] || "" });
        }
      }
      records.push(rec);
    }
    // The one-line form used in a reply. It may sit anywhere on its line.
    const one = lines[i].match(/Layers\s*\(`?([a-z0-9-]+)`?\)\s*:\s*(.+)$/i);
    if (one) {
      const rec = { line: i + 1, id: one[1], rows: [], state: null, compact: true };
      let body = one[2];
      const st = body.match(/\bState:\s*(.*)$/i);
      if (st) { rec.state = st[1].trim(); body = body.slice(0, st.index); }
      else {
        const before = lines[i].slice(0, one.index).match(/State:\s*([^.]*)/i);
        const after = [lines[i + 1], lines[i + 2]].map((l) => String(l || "").match(/^\s*State:\s*(.*)$/i)).find(Boolean);
        if (before) rec.state = before[1].trim();
        else if (after) rec.state = after[1].trim();
      }
      for (const item of body.split(body.includes("·") ? /\s*·\s*/ : /\s*;\s*/)) {
        const m = item.trim().replace(/\.$/, "").match(/^(.*?)[\s:]+(not checked|carried|n\/a|pass|fail)\b(.*)$/i);
        if (!m) continue;
        const outside = m[3].replace(/\([^)]*\)/g, " ");
        const inside = (m[3].match(/\(([^)]*)\)/) || [])[1];
        rec.rows.push({ layer: norm(m[1]), ...readVerdict(`${m[2]} ${outside}`), evidence: (inside ?? m[3].replace(/^[\s,:-]+/, "")).trim(), fix: "" });
      }
      records.push(rec);
    }
  }
  return records;
}

export function checkRecord(hub, text, forcedId) {
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
    for (const l of [...list(o.layers), { id: "whole", name: "whole output" }]) {
      const r = find(l) || (l.id === "whole" ? rows["whole-output"] : null);
      if (!r) { errors.push(`${at}: layer "${l.id}" has no row; a layer that does not apply is n/a with the reason, never left out`); continue; }
      if (!VERDICTS.includes(r.verdict)) { errors.push(`${at}: layer "${l.id}" has no verdict (${VERDICTS.join(", ")})`); continue; }
      final[l.id] = r.verdict;
      if (r.mixed) errors.push(`${at}: layer "${l.id}" carries two verdicts; one verdict per row (a result that is part passed and part unchecked is not checked, with what remains)`);
      if (r.extra) errors.push(`${at}: layer "${l.id}" has the verdict "${r.said}"; write one verdict only (a repair that worked is "fail, then pass") and put everything else in the evidence${rec.compact ? ", in brackets" : " or fix column"}`);
      if (r.verdict === "pass" && !r.extra && !r.mixed && /^fail(?:ed|s)?\b/i.test(r.fix.trim())) errors.push(`${at}: layer "${l.id}" is marked pass but its fix column records a failure; a repair that worked is "fail, then pass"`);
      const ev = r.evidence.trim();
      if (r.verdict === "carried" && !/\b\d{4}-\d{2}-\d{2}\b/.test(ev)) errors.push(`${at}: layer "${l.id}" is carried without the date of the record it passed in (YYYY-MM-DD)`);
      if (r.verdict === "pass" || r.verdict === "carried") {
        if (ev.length < 6 || WEAK.test(ev)) errors.push(`${at}: layer "${l.id}" passes with no evidence ("${ev}"); name what was looked at`);
        else if (r.verdict === "pass" && NOT_DONE.test(ev)) errors.push(`${at}: layer "${l.id}" is marked pass but its evidence says the check was not made ("${ev.slice(0, 80)}"); that is not checked`);
      }
      if ((r.verdict === "n/a" || r.verdict === "not checked") && (ev.length < 6 || WEAK.test(ev) || THIN.test(ev))) errors.push(`${at}: layer "${l.id}" is ${r.verdict} with no reason; say why it does not apply, or what could not be done and who can`);
      if (r.verdict === "not checked" && IN_HAND.test(ev)) errors.push(`${at}: layer "${l.id}" is not checked for a reason that is in your hands ("${ev.match(IN_HAND)[0]}"); not checked is for a check that cannot be made in this session: make the check, then record the verdict (a self-review in a separate pass is a pass, labelled self-review)`);
      if (l.id === "whole" && r.verdict === "n/a") errors.push(`${at}: the whole-output row is never n/a; check the assembled output, or mark it not checked with the reason`);
      if (r.verdict === "fail" && !ev && !r.fix.trim()) errors.push(`${at}: layer "${l.id}" fails with nothing said about what failed`);
    }
    if (!rec.state) { errors.push(`${at}: no "State:" line`); continue; }
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
    const { errors, records } = checkRecord(hub, readFileSync(file, "utf8"), args.id);
    for (const e of errors) console.log(`FAIL  ${e}`);
    console.log(`${errors.length ? "Record failed" : "Record passed"}: ${records.length} layer record(s), ${errors.length} problem(s).`);
    return errors.length ? 1 : 0;
  }
  if (args.id) {
    const map = loadMap(hub);
    const o = list(map.work_orders).find((x) => x.id === args.id);
    if (!o) throw new UsageError(`no work order "${args.id}"; --list shows them`);
    if (args.layer) {
      console.log(renderLayer(o, args.layer));
      return 0;
    }
    console.log(`Paths are relative to the hub: ${hub}\n`);
    console.log(render(o, map, "", !args.all));
    return 0;
  }
  if (args.for) {
    const { map, top, candidates } = match(hub, args.for);
    if (!top) {
      console.log("No single work order matches clearly.");
      if (candidates.length) {
        console.log("Closest:");
        for (const o of candidates) console.log(`  ${o.id.padEnd(22)} ${o.name}  (owner: ${o.owner})`);
        console.log("Pick by reading the request, then: workorder.mjs --id <work order>");
      }
      console.log("Unclear or spanning several outputs: start with start-here (core/skills/start-here/SKILL.md).");
      return 0;
    }
    const others = candidates.filter((o) => o.id !== top.id).slice(0, 3);
    console.log(`Matched: ${top.id}${others.length ? `. Also close: ${others.map((o) => o.id).join(", ")}` : ""}.`);
    console.log(`A word match, not a reading of the request: if this is the wrong output, use --list. Paths are relative to the hub: ${hub}\n`);
    console.log(render(top, map, "", !args.all));
    return 0;
  }
  if (args.layer) throw new UsageError("--layer needs --id <work order>");
  throw new UsageError('usage: workorder.mjs (--for "<request>" [--all] | --id <work order> [--all | --layer <layer id>] | --list | --record <file> | --check | --write | --headings <file>)');
}

if (isMain(import.meta.url)) {
  // Output cut short by the reader (`| head`) is not an error.
  process.stdout.on("error", (e) => { if (e.code === "EPIPE") process.exit(0); throw e; });
  run(main);
}
