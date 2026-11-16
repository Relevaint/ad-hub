// Tests for the Ad-Hub helper scripts. Run from the repo root: npm test
// Fixtures are synthetic (test/fixtures/README.md). The last tests run the checks
// against the real hub, so a broken freshness header or a skill that breaks the
// frontmatter rules fails the build gate.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync, appendFileSync } from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = path.resolve(here, "..");
const fx = (p) => path.join(here, "fixtures", p);
const run = (script, ...args) => {
  const r = spawnSync(process.execPath, [path.join(scripts, script), ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout, err: r.stderr };
};
const ctx = (...a) => run("context.mjs", "--hub", fx("hub"), "--today", "2026-10-10", ...a);

test("context: loads the offer, the named section and filtered learnings", () => {
  const r = ctx("--for", "ad-strategy", "--root", fx("business"), "--offer", "loaf");
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /## ads\/offers\/loaf\.md\n\nUpdated 2026-09-01 \(file header\), 39 days old\./);
  assert.match(r.out, /## Customer types\n\n- Busy parents/);
  assert.doesNotMatch(r.out, /## Awareness/);
  assert.match(r.out, /\[loaf\] Founder-led video/);
  assert.doesNotMatch(r.out, /\[cake\] Testimonial/);
});

test("context: flags stale files and names the skill that refreshes them", () => {
  const r = ctx("--for", "ad-strategy", "--root", fx("business"), "--offer", "loaf");
  assert.match(r.out, /audience\.md#customer-types\n\nUpdated 2026-01-02 \(file header\), 281 days old\. STALE: older than 90 days; refresh with audience-research/);
});

test("context: absent files are reported with their writer and never block", () => {
  const r = ctx("--for", "ad-strategy", "--root", fx("business"), "--offer", "loaf");
  assert.equal(r.code, 0);
  assert.match(r.out, /## ads\/research\/voc\.md\n\nAbsent\. Written by audience-research\./);
  assert.match(r.out, /Summary: 4 present, 1 absent, 1 stale\./);
});

test("context: folders are listed, not loaded", () => {
  const r = ctx("--for", "ad-strategy", "--root", fx("business"), "--offer", "loaf");
  assert.match(r.out, /Folder, 1 file\(s\)\. Open only what the task needs:\n- ads\/creative\/2610-a\/loaf-2610-001\.md/);
  assert.doesNotMatch(r.out, /loaf-2610-001 brief/);
});

test("context: other business files are listed by title, outside ads/ only", () => {
  const r = ctx("--for", "ad-strategy", "--root", fx("business"), "--offer", "loaf");
  assert.match(r.out, /- README\.md: Example Bakery/);
  assert.match(r.out, /- notes\/brand-notes\.md: How we sound/);
  assert.doesNotMatch(r.out, /- ads\/offers\/cake\.md:/);
  assert.doesNotMatch(r.out, /Warm and plain/);
});

test("context: with two offers and none chosen, asks for one", () => {
  const r = ctx("--for", "ad-strategy", "--root", fx("business"));
  assert.equal(r.code, 0);
  assert.match(r.out, /Offer: not chosen \(offers: cake, loaf\)/);
  assert.match(r.out, /Needs an offer\. Pass --offer <slug> \(offers: cake, loaf\)/);
});

test("context: a business with no ads/ folder still gets a usable answer", () => {
  const r = ctx("--for", "ad-strategy", "--root", fx("business-empty"));
  assert.equal(r.code, 0);
  assert.match(r.out, /No ads\/ folder yet\. Drafting can start from the request/);
  assert.match(r.out, /- README\.md: Brand-new business/);
});

test("context: unknown skill is a usage error", () => {
  const r = ctx("--for", "no-such-skill", "--root", fx("business"));
  assert.equal(r.code, 2);
  assert.match(r.err, /no built skill named "no-such-skill".*built: ad-review, ad-strategy, audience-research/);
});

test("freshness: fresh, expired and broken headers", () => {
  const files = ["fresh.md", "expired.md", "broken.md"].map((f) => fx(`dated/${f}`));
  const r = run("freshness.mjs", "--today", "2026-10-10", ...files);
  assert.equal(r.code, 2);
  assert.match(r.out, /fresh +.*fresh\.md: expires in 21 days/);
  assert.match(r.out, /expired +.*expired\.md: verified 2026-08-01, 40 days past its 30-day life\. Refresh: re-read/);
  assert.match(r.out, /broken +.*broken\.md: last-verified is not a YYYY-MM-DD date; ttl-days is missing or not a whole number; refresh instruction is missing/);
});

test("freshness: expiry fails only with --strict", () => {
  const f = fx("dated/expired.md");
  assert.equal(run("freshness.mjs", "--today", "2026-10-10", f).code, 0);
  assert.equal(run("freshness.mjs", "--today", "2026-10-10", "--strict", f).code, 1);
  assert.match(run("freshness.mjs", "--today", "2026-08-27", fx("dated/expired.md")).out, /due soon/);
});

test("route: picks the matching skill and falls back to start-here", () => {
  const go = (g) => run("route.mjs", "--hub", fx("hub"), "--goal", g).out;
  assert.match(go("who are our customers and what do they say"), /^Start with: audience-research\n/);
  assert.match(go("what should we test in the next batch"), /^Start with: ad-strategy\n/);
  assert.match(go("help me with ads"), /^Start with: start-here \(not built yet/);
  assert.match(go("what should we test"), /Reads: offers\/<offer>\.md, research\/audience\.md#customer-types/);
});

test("route --check: passes a well-formed hub", () => {
  const r = run("route.mjs", "--hub", fx("hub"), "--check");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /Check passed: 3 built skill\(s\), 4 in the README task table/);
});

test("route --check: catches every rule the rogue skill breaks", () => {
  const r = run("route.mjs", "--hub", fx("bad-hub"), "--check");
  assert.equal(r.code, 1);
  for (const want of [
    /name "rogue-skill" does not match folder/,
    /layer must be one of/,
    /live: act is allowed only for ad-launch and ad-manage/,
    /not listed in the README task table/,
    /"ads\/offers\/x\.md" must be a path inside the business ads\/ folder/,
    /only ad-review writes learnings\.md/,
    /strategy\/diagnosis\.md and strategy\/diagnosis\.md: two writers/,
    /ledger\.md is owned by transition/,
  ]) assert.match(r.out, want);
});

test("real hub: freshness headers are valid", () => {
  const r = run("freshness.mjs");
  assert.equal(r.code, 0, r.out);
});

test("real hub: skills pass the structural check", () => {
  const r = run("route.mjs", "--check");
  assert.equal(r.code, 0, r.out);
});

test("real hub: the Meta platform skill and its action map are well formed", async () => {
  const { readFileSync, existsSync } = await import("node:fs");
  const { frontmatter, taskTable } = await import("../lib.mjs");
  const hub = path.resolve(here, "../../../..");
  const dir = path.join(hub, "meta-system");
  const text = readFileSync(path.join(dir, "SKILL.md"), "utf8");
  const fm = frontmatter(text);
  assert.equal(fm.name, "meta");
  assert.equal(fm.metadata.adhub.layer, "platform");
  assert.equal(fm.metadata.adhub.platform, "meta");
  assert.deepEqual(fm.metadata.adhub.writes, [], "the platform skill writes nothing in the business repo");
  assert.ok(text.split("\n").length <= 500, "meta-system/SKILL.md is over 500 lines");
  for (const ref of new Set([...text.matchAll(/`references\/([a-z-]+\.md)`/g)].map((m) => m[1]))) {
    assert.ok(existsSync(path.join(dir, "references", ref)), `meta-system/SKILL.md names a missing reference: ${ref}`);
  }
  const skills = taskTable(hub).map((r) => r.skill);
  const map = readFileSync(path.join(dir, "references/action-map.md"), "utf8");
  const rows = map.split("\n").filter((l) => /^\| [^|-]/.test(l) && !/^\| Action \|/.test(l));
  assert.ok(rows.length >= 20, `action map has only ${rows.length} rows`);
  for (const r of rows) {
    const cells = r.split("|").slice(1, -1).map((c) => c.trim());
    const [action, needed, , , status] = cells;
    assert.equal(cells.length, 6, `action map row "${action}" has ${cells.length} cells; a pipe inside a cell breaks the table`);
    assert.match(status, /^(docs|run|person) \d{4}-\d{2}-\d{2}$|^unknown$/, `action map row "${action}": status "${status}" is not docs, run or person with a date, or unknown`);
    for (const s of needed.split(",").map((x) => x.trim()).filter((x) => x && x !== "none")) {
      assert.ok(skills.includes(s), `action map row "${action}": needed by unknown skill ${s}`);
    }
  }
});

test("regression cases: complete, named after real skills, and consistent with the schemas", async () => {
  const { readdirSync, readFileSync, existsSync } = await import("node:fs");
  const { taskTable } = await import("../lib.mjs");
  const hub = path.resolve(here, "../../../..");
  const dir = path.join(hub, "core/_system/regression");
  const skills = taskTable(hub).map((r) => r.skill);
  const index = readFileSync(path.join(dir, "README.md"), "utf8");
  const cases = readdirSync(dir).filter((d) => /^\d\d-/.test(d));
  assert.equal(cases.length, 5);
  for (const c of cases) {
    const at = (p) => path.join(dir, c, p);
    assert.ok(index.includes(`(${c}/evaluate.md)`), `${c} missing from the regression README`);
    assert.ok(existsSync(at("business/README.md")), `${c}: business/README.md missing`);
    assert.ok(!existsSync(at("business/evaluate.md")), `${c}: evaluate.md must stay outside business/`);
    const ev = readFileSync(at("evaluate.md"), "utf8");
    const requests = ev.split(/^## Requests\s*$/m)[1];
    assert.ok(requests, `${c}: no Requests section`);
    const named = [...requests.matchAll(/^### ([a-z-]+)/gm)].map((m) => m[1]);
    assert.ok(named.length >= 3, `${c}: fewer than three requests`);
    for (const s of named) assert.ok(skills.includes(s), `${c}: request for unknown skill ${s}`);
    const offersDir = at("business/ads/offers");
    const offers = existsSync(offersDir) ? readdirSync(offersDir).map((f) => f.replace(/\.md$/, "")) : [];
    for (const o of offers) {
      assert.match(readFileSync(path.join(offersDir, `${o}.md`), "utf8"), new RegExp(`^offer: ${o}$`, "m"), `${c}: offer slug does not match file name`);
    }
    if (existsSync(at("business/ads/ledger.md"))) {
      const rows = readFileSync(at("business/ads/ledger.md"), "utf8").split("\n").filter((l) => /^\| [a-z0-9-]+-\d{4}-\d{3}/.test(l));
      assert.ok(rows.length, `${c}: ledger has no rows`);
      for (const r of rows) {
        const [id, offer] = r.split("|").slice(1, 3).map((s) => s.trim());
        assert.ok(offers.includes(offer), `${c}: ledger offer ${offer} has no offer file`);
        assert.match(id, new RegExp(`^${offer}-\\d{4}-\\d{3}(-v\\d+)?$`), `${c}: ad ID ${id} does not follow the format`);
      }
    }
    const r = run("context.mjs", "--hub", fx("hub"), "--for", "ad-strategy", "--root", at("business"), "--today", "2026-10-08");
    assert.equal(r.code, 0, `${c}: context loader failed: ${r.err}`);
  }
});

test("installer: writes one pointer per built skill, keeps other hubs' pointers, clears stale ones", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const { frontmatter } = await import("../lib.mjs");
  const hub = path.resolve(here, "../../../..");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-install-"));
  const biz = path.join(tmp, "biz");
  fs.cpSync(path.join(hub, "core/_system/regression/02-local-service/business"), biz, { recursive: true });
  const skills = path.join(biz, ".claude/skills");
  fs.mkdirSync(path.join(skills, "hub-paid-ads"), { recursive: true });
  fs.writeFileSync(path.join(skills, "hub-paid-ads/SKILL.md"), "keep");
  fs.mkdirSync(path.join(skills, "adhub-retired-skill"), { recursive: true });
  const install = (...a) => {
    const r = spawnSync(process.execPath, [path.join(hub, "install/adhub-skills.mjs"), ...a], { encoding: "utf8" });
    return { code: r.status, out: r.stdout, err: r.stderr };
  };
  try {
    const r = install("--root", biz, "--hub", fx("hub"));
    assert.equal(r.code, 0, r.err);
    assert.match(r.out, /wrote 3 Ad-Hub skill pointer\(s\)/);
    assert.deepEqual(fs.readdirSync(skills).sort(), ["adhub-ad-review", "adhub-ad-strategy", "adhub-audience-research", "hub-paid-ads"]);
    assert.equal(fs.readFileSync(path.join(skills, "hub-paid-ads/SKILL.md"), "utf8"), "keep");
    const text = fs.readFileSync(path.join(skills, "adhub-ad-strategy/SKILL.md"), "utf8");
    assert.equal(frontmatter(text).name, "adhub-ad-strategy");
    assert.match(frontmatter(text).description, /^Decide what to make and test next for one offer\. Use when: /);
    const target = text.match(/Read `([^`]+)`/)[1];
    assert.ok(fs.existsSync(path.isAbsolute(target) ? target : path.resolve(biz, target)), `pointer target missing: ${target}`);
    assert.match(text, /context\.mjs --for ad-strategy --root \./);

    const removed = install("--root", biz, "--remove");
    assert.match(removed.out, /removed 3 Ad-Hub skill pointer\(s\)/);
    assert.deepEqual(fs.readdirSync(skills), ["hub-paid-ads"]);

    assert.equal(install("--root", hub).code, 2, "must refuse to install into the hub itself");
    assert.match(install("--root", biz).out, /wrote \d+ Ad-Hub skill pointer\(s\)/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("installer hook: runs the generator when the hub is present, stays quiet when it is not", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const hub = path.resolve(here, "../../../..");
  const hook = path.join(hub, "install/session-start.sh");
  assert.equal(spawnSync("bash", ["-n", hook]).status, 0, "hook syntax");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-hook-"));
  const env = (extra) => ({ ...process.env, CLAUDE_CODE_REMOTE: "true", CLAUDE_PROJECT_DIR: tmp, ...extra });
  try {
    const found = spawnSync("bash", [hook], { encoding: "utf8", env: env({ AD_HUB: hub }) });
    assert.equal(found.status, 0, found.stderr);
    assert.match(found.stdout, /Ad-Hub skill pointer\(s\)/);
    const missing = spawnSync("bash", [hook], { encoding: "utf8", env: env({ AD_HUB: path.join(tmp, "nowhere") }) });
    assert.equal(missing.status, 0, missing.stderr);
    assert.match(missing.stdout, /Ad-Hub not found at .*; adhub- skill pointers left as committed\./);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("creative: concept requests route to ad-creative and required pass reference exists", async () => {
  const { readFileSync, existsSync } = await import("node:fs");
  const hub = path.resolve(here, "../../../..");
  for (const request of ["give me video and image ad concepts only", "brainstorm ad ideas without generating assets"]) {
    assert.match(run("route.mjs", "--goal", request).out, /^Start with: ad-creative\n/);
  }
  const at = (p) => readFileSync(path.join(hub, p), "utf8");
  const skill = at("core/skills/ad-creative/SKILL.md");
  assert.match(skill, /\*\*Concepts\.\*\*/);
  assert.match(skill, /references\/creative-passes\.md/);
  assert.match(at("AGENTS.md"), /references\/creative-passes\.md/);
  for (const ref of new Set([...skill.matchAll(/(?<![a-z/-])references\/([a-z-]+\.md)/g)].map((m) => m[1]))) {
    assert.ok(existsSync(path.join(hub, "core/skills/ad-creative/references", ref)), `missing reference ${ref}`);
  }
});

test("creative: separate passes, scope and hard rejection remain explicit", async () => {
  const { readFileSync } = await import("node:fs");
  const hub = path.resolve(here, "../../../..");
  const at = (p) => readFileSync(path.join(hub, p), "utf8");
  const passes = at("core/skills/ad-creative/references/creative-passes.md");
  assert.deepEqual([...passes.matchAll(/^## Pass (\d)\./gm)].map((m) => Number(m[1])), [1, 2, 3, 4, 5, 6, 7]);
  for (const needed of [/no image, audio or video generation/, /Cast and treatment are independent/, /Nonhuman does not mean/, /visual-alone stop test/, /do not average away a failed/, /withhold/, /fresh reviewer/, /not a finished asset or proven winner/]) {
    assert.match(passes, needed);
  }
  const rubric = at("core/skills/ad-creative/references/copy-and-hooks.md");
  assert.match(rubric, /Hook and Glance each need at least\n4/);
  assert.match(rubric, /Finish is \*\*not applicable\*\*/);
  assert.doesNotMatch(rubric, /Says what and for whom in one second/);
  assert.match(at("core/_system/schemas/creative.md"), /not a new ledger status/);
  assert.match(at("core/skills/ad-creative/references/claims-and-policy.md"), /Do not create a file just/);
});

test("creative: composition review preserves hierarchy without prescribing minimalism", async () => {
  const { readFileSync } = await import("node:fs");
  const hub = path.resolve(here, "../../../..");
  const read = (p) => readFileSync(path.join(hub, p), "utf8");
  const prefix = "core/skills/ad-creative/references/";
  const review = read(prefix + "composition-review.md");
  for (const rule of [/hierarchy, not mandatory minimalism/, /Richness|rich environment/, /Reject \/ rework/, /distinctive/, /concepts-only/, /not controlled single-variable tests/, /actual render/, /not conversion evidence/]) assert.match(review, rule);
  assert.match(read("core/skills/ad-creative/SKILL.md"), /references\/composition-review\.md/);
  const passes = read(prefix + "creative-passes.md");
  for (const n of [4, 6, 7]) {
    const section = passes.split(`## Pass ${n}.`)[1].split("## Pass ")[0];
    assert.match(section, /[Cc]omposition \/\s+hierarchy/);
  }
  assert.match(read("core/_system/schemas/creative.md"), /Composition \/ hierarchy/);
});

test("creative: paired teaching assets are local, intact and bounded", async () => {
  const { readFileSync, existsSync } = await import("node:fs");
  const { createHash } = await import("node:crypto");
  const dir = path.resolve(here, "../../../skills/ad-creative/references/composition-examples");
  const manifest = JSON.parse(readFileSync(path.join(dir, "manifest.json"), "utf8"));
  assert.equal(manifest.schema_version, 1);
  const variants = new Map();
  let bytes = 0;
  const gallery = readFileSync(path.join(dir, "README.md"), "utf8");
  for (const a of manifest.assets) {
    const f = a.derivative;
    assert.equal(path.basename(f.file), f.file, "asset must be a local filename");
    assert.match(f.file, /\.jpg$/);
    const data = readFileSync(path.join(dir, f.file));
    assert.equal(createHash("sha256").update(data).digest("hex"), f.sha256);
    assert.equal(data.length, f.bytes);
    assert.equal(data.readUInt16BE(0), 0xffd8, "JPEG signature");
    assert.match(a.source.sha256, /^[0-9a-f]{64}$/);
    assert.ok(Math.abs(f.width / f.height - a.source.width / a.source.height) < 0.001, "preserve full-frame ratio");
    assert.ok(gallery.includes(`](${f.file})`), "each asset embedded");
    const pair = a.id.replace(/-simplified$/, "");
    if (a.variant !== "standalone") variants.set(pair, [...(variants.get(pair) || []), a.variant]);
    else assert.equal(a.id, "enough-mugs", "standalone benchmark must be explicit");
    bytes += data.length;
  }
  assert.ok(variants.size >= 2);
  for (const v of variants.values()) assert.deepEqual(v.sort(), ["original", "simplified"]);
  assert.ok(bytes < 2_000_000, "keep teaching gallery lightweight");
  for (const m of gallery.matchAll(/\]\(([^)]+)\)/g)) assert.ok(existsSync(path.resolve(dir, m[1])), `missing gallery target ${m[1]}`);
  assert.doesNotMatch(JSON.stringify(manifest), /\/workspace\/|\/tmp\/|library_file_id|Sentinel_/);
});

test("creative: brand continuity comes from reviewed sources, not demographic defaults", async () => {
  const { readFileSync } = await import("node:fs");
  const hub = path.resolve(here, "../../../..");
  const read = (p) => readFileSync(path.join(hub, p), "utf8");
  const passes = read("core/skills/ad-creative/references/creative-passes.md");
  const first = passes.split("## Pass 1.")[1].split("## Pass 2.")[0];
  for (const rule of [/actual destination landing page/, /source note/, /page is unavailable/, /supplied brand direction/, /guessed race or/, /demographic quotas/, /alter ad targeting/]) assert.match(first, rule);
  const third = passes.split("## Pass 3.")[1].split("## Pass 4.")[0];
  assert.match(third, /nonhuman, fantasy, abstract and character-free/);
  const sixth = passes.split("## Pass 6.")[1].split("## Pass 7.")[0];
  for (const rule of [/Brand \/ cultural continuity/, /unintentional sameness/, /variety is not a quota/, /return to Pass 1/, /not a compliance essay/]) assert.match(sixth, rule);
  assert.match(read("core/_system/schemas/creative.md"), /Brand\/cultural continuity/);
});

// ---- staged work: the output map, its pages and the layer record ----

const woRaw = (...a) => run("workorder.mjs", ...a);
// Most tests are about other rules, so this runner answers each printout's mark the way an agent does: the mark line
// is copied under the layer's heading once that heading is the last one in the notes (the whole output gets its own).
const pendingMarks = new Map();
// The words a printout asks for, as an agent reads them off the lines its question names, in a mark line.
const answerOf = (out) => {
  const lines = String(out).split("\n");
  const q = lines.find((l) => l.startsWith("Mark for this printout:"));
  if (!q) return null;
  const labels = [...q.matchAll(/the last word of the \*\*([^*]+)\*\* line/g)].map((m) => m[1]);
  const lw = (l) => String(l).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).pop() || "";
  const words = labels.length ? labels.map((lab) => lw(lines.find((l) => l.replace(/^\s*(?:[-*]\s+)?/, "").startsWith(`**${lab}:**`)))) : [lw(lines.filter((l) => l !== q).reverse().find((l) => l.trim()))];
  return `<!-- mark: ${words.join(" ")} -->`;
};
const flushMarks = (only) => {
  for (const [f, list] of pendingMarks) {
    if (only && f !== only) continue;
    if (!existsSync(f)) { pendingMarks.delete(f); continue; }
    const keep = [];
    for (const p of list) {
      const t = readFileSync(f, "utf8");
      const last = [...t.matchAll(/^#{1,6}\s+(.+)$/gm)].pop();
      const names = last && new RegExp(`(?<![a-z0-9-])${p.lid}(?![a-z0-9-])`, "i").test(last[1]);
      if (!names && p.lid !== "whole") { keep.push(p); continue; }
      appendFileSync(f, `${t && !t.endsWith("\n") ? "\n" : ""}${names ? "" : "\n## whole\n"}${p.mark}\n`);
    }
    if (keep.length) pendingMarks.set(f, keep); else pendingMarks.delete(f);
  }
};
const wo = (...a) => {
  const ni = a.indexOf("--notes"), li = a.indexOf("--layer");
  if (a.includes("--record")) flushMarks();
  if (ni >= 0 && li >= 0) flushMarks(path.resolve(a[ni + 1]));
  const r = woRaw(...a);
  const m = r.out && answerOf(r.out);
  if (ni >= 0 && li >= 0 && r.code === 0 && m) { const f = path.resolve(a[ni + 1]); pendingMarks.set(f, [...(pendingMarks.get(f) || []).filter((p) => p.lid !== a[li + 1]), { lid: a[li + 1], mark: m }]); }
  return r;
};
// An Examples: line naming real files by path, as the loading layer's notes must.
const EXAMPLES = `Examples: ${fx("business/notes/brand-notes.md")}, ${fx("business/ads/offers/cake.md")}, each read to its end.`;
// A notes file written by a test, with the ledger the tool would have kept beside it.
const writeNotes = (fs, f, text) => { fs.writeFileSync(f, text); fs.writeFileSync(`${f}.opened`, (text.match(/<!--\s*(?:re)?opened:[^>]*-->/g) || []).join("\n") + "\n"); };
const hubRoot = path.resolve(here, "../../../..");

test("work orders: the real map is valid and its generated pages are current", () => {
  const r = wo("--check");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /Check passed: \d+ work order\(s\), 0 problem\(s\)/);
});

test("work orders: every built skill owns one, and every skill body points at staged work", async () => {
  const { readFileSync } = await import("node:fs");
  const { loadSkills } = await import("../lib.mjs");
  const { loadMap } = await import("../workorder.mjs");
  const owners = new Set(loadMap(hubRoot).work_orders.map((o) => o.owner));
  for (const s of loadSkills(hubRoot)) {
    assert.ok(owners.has(s.name), `${s.name} owns no work order`);
    assert.match(s.text, /^## Work order$/m, `${s.name}: no Work order section`);
    assert.match(s.text, /_system\/staged-work\.md/, `${s.name}: does not point at staged work`);
    assert.match(s.text, /workorder\.mjs --for/, `${s.name}: does not say how to get the work order`);
  }
  const at = (p) => readFileSync(path.join(hubRoot, p), "utf8");
  for (const p of ["AGENTS.md", "README.md", "install/README.md", "core/_system/CONVENTIONS.md"]) {
    assert.match(at(p), /workorder\.mjs/, `${p} does not mention the work-order tool`);
    assert.match(at(p), /staged-work\.md/, `${p} does not point at staged work`);
  }
});

test("work orders: requests reach the right output", () => {
  const cases = {
    "What do you still need before we can run ads for the garden kit?": "readiness",
    "Add a second offer: a buyer consultation for people moving into the county.": "readiness",
    "Help me get bookings with ads.": "ad-program",
    "Who should we target?": "audience-report",
    "What are other garden planner sellers running?": "competitor-report",
    "Plan the first test batch for the garden kit.": "test-plan",
    "Plan our ads for the next month.": "test-plan",
    "Write copy for three of the planned ads.": "ad-copy",
    "Write three ads.": "ad-copy",
    "give me video and image ad concepts only": "ad-concepts",
    "brainstorm ad ideas without generating assets": "ad-concepts",
    "make a static ad for the spring sale": "static-ad",
    "make me a video ad for the garden kit": "video-ad",
    "new hooks on our winning ad": "ad-remix",
    "check this copy for claims and policy": "claims-check",
    "write the ads for this batch": "ad-batch",
    "Make sure we can tell which ads make sales.": "tracking-setup",
    "Which result should we send back to the ad platform?": "tracking-setup",
    "Launch the batch.": "launch",
    "Put them live tomorrow with $20 a day.": "launch",
    "Run today's check on the gutter ads.": "daily-watch",
    "We just filled every crew slot through November 20. Do what you need to.": "daily-watch",
    "Kill the ads that haven't booked anything.": "management-session",
    "How are the ads doing? Which ones should go?": "results-review",
    "Which ad is winning?": "results-review",
    "the price changed to $29, update the ads": "change-recheck",
    // A long request: the ask comes first and pasted material must not outweigh it.
    "Write copy for three of the planned ads. Here is everything about the business so you have it: we sell a printable garden planner with a spreadsheet that works out planting dates, customers email us about frost, we posted a video tutorial last week, the launch was in March, our tracking was set up by a freelancer, a competitor runs carousel ads, and the weekly report says results dropped.": "ad-copy",
    // Plain requests, as an operator would say them with no knowledge of the map.
    "make me three ads for the spring sale": "ad-batch",
    "make me an ad": "static-ad",
    "I need ads for my new offer": "ad-program",
    "create a facebook ad for the garden kit": "static-ad",
    "make a video ad for the planner": "video-ad",
    "write ad copy for the home valuation offer": "ad-copy",
    "give me ad concepts, no production": "ad-concepts",
    "give me some ad ideas": "ad-concepts",
    "why did my cost per lead go up this week": "troubleshooting",
    "results dropped yesterday, what happened": "troubleshooting",
    "my ads stopped getting leads": "troubleshooting",
    "check on the ads today": "daily-watch",
    "how are the ads doing": "results-review",
    "how did last week's ads do": "results-review",
    "how did the ads do last week": "results-review",
    "how did the campaign perform": "results-review",
    "what is working in our ads right now": "results-review",
    "which ads are winning": "results-review",
    "what's working": "results-review",
    "what should we change in the account this week": "management-session",
    "scale the winning ad": "management-session",
    "undo the change we made yesterday": "rollback",
    "launch the new ads": "launch",
    "is the business ready to run ads": "readiness",
    "who is our customer": "audience-report",
    "what are competitors running": "competitor-report",
    "plan the next test": "test-plan",
    "audit my ad account": "ad-audit",
    "is this claim ok to use in an ad": "claims-check",
    "the price changed, update the ads": "change-recheck",
    "remix our best ad": "ad-remix",
    "set up the pixel and conversions": "tracking-setup",
    "which creative won this week": "weekly-creative-report",
    "I want to start running ads for my business": "ad-program",
    "turn off the ads that are wasting money": "management-session",
    "refresh the plays library from this new source": "plays-refresh",
    // Concepts and copy together is the copy work order, which contains the concept layers.
    "Use the Ad Hub for this. I need ad concepts and copy for the spring offer, for Facebook and Instagram.": "ad-copy",
    "I need ad concepts and copy for the spring offer, for Facebook and Instagram": "ad-copy",
    "concepts and copy for the garden kit ads": "ad-copy",
    // Plural and finished static ads; naming the hub or an approved generation does not pull the request elsewhere.
    "Use the Ad Hub for this. Make me two finished static ads for the spring garden kit offer, for the Facebook and Instagram feed: one built right here with no generated image, and one built around a single generated photo. One paid image generation is approved for the second.": "static-ad",
    "make two static ads for the spring sale": "static-ad",
    "two finished ads for the garden kit": "static-ad",
    "an ad for the feed built around a generated photo of the planner": "static-ad",
    "Make one finished ad for the garden kit. One paid image generation is approved.": "static-ad",
  };
  for (const [request, id] of Object.entries(cases)) {
    assert.match(wo("--for", request).out, new RegExp(`^Matched: ${id}[.\\s]`), `"${request}" should reach ${id}`);
  }
  const vague = wo("--for", "can you help");
  assert.equal(vague.code, 0);
  assert.match(vague.out, /No single work order matches clearly/);
  assert.match(vague.out, /start-here/);
});

test("work orders: the direct route and the start-here route reach the same creative gates", async () => {
  const { loadMap } = await import("../workorder.mjs");
  const map = loadMap(hubRoot);
  const by = Object.fromEntries(map.work_orders.map((o) => [o.id, o]));
  const passes = (o) => o.layers.flatMap((l) => l.method || []).map((m) => (m.match(/creative-passes\.md#pass-(\d)/) || [])[1]).filter(Boolean).map(Number);
  // Direct: each creative output carries passes 1 to 6; finished media carries pass 7 or the video build.
  for (const id of ["ad-concepts", "ad-copy", "static-ad", "video-ad"]) {
    const got = new Set(passes(by[id]));
    for (const n of [1, 2, 3, 4, 5, 6]) assert.ok(got.has(n), `${id} is missing creative pass ${n}`);
  }
  assert.ok(new Set(passes(by["static-ad"])).has(7), "static-ad is missing pass 7");
  assert.ok(by["video-ad"].layers.some((l) => (l.method || []).some((m) => /video-build\.md#part-7/.test(m))), "video-ad never watches the export");
  assert.ok(!by["ad-concepts"].layers.some((l) => /production|render/.test(l.id)), "concepts must stop before production");
  // Truth is its own layer in every creative output, and a video's beats come before its placement copy.
  for (const id of ["ad-concepts", "ad-copy", "static-ad", "video-ad"]) {
    const ids = by[id].layers.map((l) => l.id);
    assert.ok(ids.indexOf("claims") > ids.indexOf("connection") && ids.indexOf("claims") < ids.indexOf("review"), `${id}: the claims layer sits between connection and review`);
    for (const st of by[id].states) assert.ok(st.must_pass.includes("claims"), `${id} ${st.state}: claims must pass`);
  }
  const video = by["video-ad"].layers.map((l) => l.id);
  assert.ok(video.indexOf("sequence") < video.indexOf("copy"), "video-ad: timed beats come before the per-placement copy");
  // Every word an audience reads or hears is written before the review that covers it; concepts keep review last.
  for (const o of Object.values(by)) {
    const ids = o.layers.map((l) => l.id);
    if (!ids.includes("review")) continue;
    for (const w of ["sequence", "copy"]) if (ids.includes(w)) assert.ok(ids.indexOf(w) < ids.indexOf("review"), `${o.id}: ${w} comes before review`);
    for (const st of o.states) if (st.needs.includes("copy")) assert.ok(st.needs.includes("review"), `${o.id} ${st.state}: copy-ready rests on the review`);
  }
  assert.equal(by["ad-concepts"].layers.at(-1).id, "review");
  assert.match(by["ad-copy"].layers.find((l) => l.id === "review").build, /primary text, headlines, description/);
  assert.ok(by["ad-copy"].layers.find((l) => l.id === "review").returns_to.includes("copy"));
  assert.ok(!by["ad-concepts"].layers.find((l) => l.id === "review").returns_to.includes("copy"));
  for (const id of ["ad-copy", "static-ad", "video-ad"]) assert.ok(by[id].recheck.find((r) => r.when.startsWith("A claim")).redo.includes("review"), `${id}: a changed claim is re-checked by the review`);
  assert.ok(by["static-ad"].states.find((s) => s.state === "creative-ready").must_pass.includes("render-review"));
  assert.ok(!by["static-ad"].states.find((s) => s.state === "copy-ready").needs.includes("destination"), "an unseen page does not force a false pass");
  // Wrapper: start-here's end-to-end route runs the batch, and the batch runs those same work orders.
  const creative = by["ad-program"].layers.find((l) => l.id === "creative");
  assert.deepEqual(creative.work_orders, ["ad-batch"]);
  const made = by["ad-batch"].layers.find((l) => l.id === "ads").work_orders;
  for (const id of ["ad-concepts", "ad-copy", "static-ad", "video-ad"]) assert.ok(made.includes(id), `ad-batch does not run ${id}`);
  // Nothing goes live through any route without the gates and a recorded approval.
  const launch = by["launch"];
  assert.equal(launch.layers[0].id, "gates");
  assert.ok(launch.states.find((s) => s.state === "live").needs.includes("approval"));
  // Live rests on the gates read again and all clear; a dry run does not need that row.
  assert.ok(launch.states.find((s) => s.state === "live").must_pass.includes("all-clear"));
  assert.ok(launch.layers.findIndex((l) => l.id === "all-clear") < launch.layers.findIndex((l) => l.id === "activate"));
  assert.ok(!launch.states.find((s) => s.state === "dry run only").needs.includes("all-clear"));
  // Every state names the layers it cannot stand without.
  for (const o of Object.values(by)) for (const s of o.states) if ((s.needs || []).length) assert.ok((s.must_pass || []).length, `${o.id} "${s.state}" has no must_pass`);
  assert.ok(by["tracking-setup"].states.find((s) => s.state === "test seen").needs.includes("result-test"));
  assert.ok(!by["tracking-setup"].states.find((s) => s.state === "checklist prepared").needs.includes("result-test"));
});

test("work orders: a layer record with a skipped layer, an empty pass or an overclaimed state fails", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-record-"));
  const row = (l, v, e, f = "") => `| ${l} | ${v} | ${e} | ${f} |`;
  const REVIEW = "reviewer: self-review in a separate pass, no fresh agent here; findings: two, one blocking (glance) [visual-stop], both repaired; reviewed: the draft in this file; after review: nothing changed; audience: any; register: at register beside the owner's frost caption example; hook: 4, the frost image stops the scroll; glance: 4, the offer reads in a second; one job: 4, one promise only; proof: 3, proof row 2 stated plainly";
  const COPY = "each field read against the claims map; own words: closest passages are the offer page intro and the spring email, neither reused; corrections: none on file for this channel";
  const GOOD = "copy-ready; destination, production, render-review and whole not checked";
  const NONE = " Notes: none (cannot write files here)";
  const rows = [
    row("1 fundamentals", "pass", "offer file proof rows 1 to 3; landing page copy on file read"),
    row("2 premises", "pass", "closest earlier: the spring ad for the same kit leads on price, this idea on frost; four premises compared; two rejected as category slogans"),
    row("3 cast-treatment", "pass", "hands-only against illustrated planner; hands chosen for recognition"),
    row("4 visual-stop", "fail, then pass", "frost-bitten seedlings frame read with copy hidden", "returned to premises; replaced the generic garden shot"),
    row("5 connection", "pass", "sequence read start to end: the planner answers the frost loss"),
    row("6 claims", "pass", "condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against proof rows 1 and 3; the review withheld, no permission on record"),
    row("7 review", "fail, then pass", REVIEW, "returned to visual-stop; the glance finding repaired"),
    row("8 copy", "pass", COPY),
    row("9 destination", "not checked", "the page is not reachable from here; the operator can open it"),
    row("10 production", "not checked", "no image tool connected here; production brief written"),
    row("11 render-review", "not checked", "nothing rendered"),
    row("whole", "not checked", "no finished ad to view"),
  ];
  const swap = (label, r) => rows.map((x) => (x.startsWith(`| ${label} `) ? r : x));
  const doc = (r, state) => ["# ad", "", "## Layer record", "Work order: static-ad", "| Layer | Verdict | Evidence: what was looked at | Fix made or return |", "| --- | --- | --- | --- |", ...r, `State: ${state}`, ""].join("\n");
  const check = (name, text) => {
    const f = path.join(tmp, name);
    fs.writeFileSync(f, text);
    return wo("--record", f);
  };
  try {
    const good = check("good.md", doc(rows, GOOD));
    assert.equal(good.code, 0, good.out);
    const over = check("over.md", doc(rows, "creative-ready"));
    assert.equal(over.code, 1);
    assert.match(over.out, /state "creative-ready" needs layer "render-review" to pass; it is not checked/);
    const skipped = check("skipped.md", doc(rows.filter((r) => !r.includes("cast-treatment")), "copy-ready"));
    assert.equal(skipped.code, 1);
    assert.match(skipped.out, /layer "cast-treatment" has no row/);
    const empty = check("empty.md", doc(rows.map((r) => (r.includes("2 premises") ? row("2 premises", "pass", "looks good") : r)), "copy-ready"));
    assert.equal(empty.code, 1);
    assert.match(empty.out, /layer "premises" passes with no evidence/);
    const unknown = check("unknown.md", doc(rows, "ready to ship"));
    assert.equal(unknown.code, 1);
    assert.match(unknown.out, /is not one of: copy-ready, creative-ready, not ready/);
    // A pass whose evidence says the check was not made, two verdicts in one row, and n/a on a layer the state depends on.
    const notDone = check("notdone.md", doc(swap("whole", row("whole", "pass", "Not read beside the destination page because it could not be opened")), "copy-ready"));
    assert.equal(notDone.code, 1);
    assert.match(notDone.out, /layer "whole" is marked pass but its evidence says the check was not made/);
    const mixed = check("mixed.md", doc(swap("8 copy", row("8 copy", "pass for the feed fields, not checked for stories", "fields read against the claims map")), "copy-ready"));
    assert.equal(mixed.code, 1);
    assert.match(mixed.out, /layer "copy" carries two verdicts/);
    const dodged = check("dodged.md", doc(swap("6 claims", row("6 claims", "n/a", "no claims in this ad at all")), "copy-ready"));
    assert.equal(dodged.code, 1);
    assert.match(dodged.out, /state "copy-ready" needs layer "claims" to pass; it is n\/a/);
    const carried = check("carried.md", doc(swap("5 connection", row("5 connection", "carried", "passed in the record of 2026-10-07; the payoff did not change")), GOOD));
    assert.equal(carried.code, 0, carried.out);
    // One verdict exactly, a repair written as a repair, and a carried row that names its date.
    const wordy = check("wordy.md", doc(swap("2 premises", row("2 premises", "pass after a fix", "four premises compared; two rejected as category slogans")), "copy-ready"));
    assert.equal(wordy.code, 1);
    assert.match(wordy.out, /layer "premises" has the verdict "pass after a fix"/);
    const hidden = check("hidden.md", doc(swap("2 premises", row("2 premises", "pass", "four premises compared; two rejected as category slogans", "failed first: all four were category slogans; rewrote two")), "copy-ready"));
    assert.equal(hidden.code, 1);
    assert.match(hidden.out, /layer "premises" is marked pass but its fix column records a failure/);
    const undated = check("undated.md", doc(swap("5 connection", row("5 connection", "carried", "passed in the earlier record; the payoff did not change")), "copy-ready"));
    assert.equal(undated.code, 1);
    assert.match(undated.out, /layer "connection" is carried without the date/);
    const lineWordy = check("linewordy.md", "Layers (ad-concepts): fundamentals pass (offer file and proof table read) · premises pass after a fix (closest earlier: the spring ad for the same kit leads on price, this idea on frost; five compared, three rejected) · cast-treatment pass (hands only; illustrated rejected) · visual-stop pass (frame read with copy hidden) · connection pass (read start to end) · claims pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against proof rows; review withheld) · review pass (self-review, Hook 4 Glance 4) · whole pass (set read as the operator sees it). State: concept-ready\n");
    assert.equal(lineWordy.code, 1);
    assert.match(lineWordy.out, /layer "premises" has the verdict "pass after a fix"/);
    // A layer checked in part is partial; a verdict the contract does not have is named; a separator inside evidence stays evidence.
    const partly = check("partly.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck partly done (two October ads corrected, claims and copy pass; page not checked) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: partly rechecked; recheck partial. Notes: none (cannot write files here)\n");
    assert.equal(partly.code, 0, partly.out);
    const bold = check("bold.md", "**Layers (change-recheck):** record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck partial (two October ads corrected; page and renders not checked) · states pass (ledger beside the updated records) · whole not checked (page and live ad text not seen). State: **partly rechecked**; recheck partial, whole not checked. Notes: none (cannot write files here)\n");
    assert.equal(bold.code, 0, bold.out);
    const partialNeeded = check("partialneeded.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck partial (two October ads corrected; page and renders not checked) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: rechecked\n");
    assert.equal(partialNeeded.code, 1);
    assert.match(partialNeeded.out, /state "rechecked" needs layer "recheck" to pass; it is partial/);
    const odd = check("odd.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck mostly fine (two October ads corrected) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: partly rechecked\n");
    assert.equal(odd.code, 1);
    assert.match(odd.out, /layer "recheck" has the verdict "mostly fine", which is not one of/);
    const dotted = check("dotted.md", `Layers (ad-concepts): fundamentals pass (offer file and proof table read) · premises pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; five compared, three rejected) · cast-treatment pass (hands only; illustrated rejected) · visual-stop fail, then pass (frame read with copy hidden after the glance repair) · connection pass (read start to end) · claims pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; footer strings checked: Instant download · 30-day refund; review withheld) · review fail, then pass (${REVIEW}) · whole pass (set read as the operator sees it). State: concept-ready.${NONE}\n`);
    assert.equal(dotted.code, 0, dotted.out);
    // Older work with no layer record carries from its dated status; it is not left unchecked for want of a record.
    const noRecord = check("norecord.md", doc(swap("2 premises", row("2 premises", "not checked", "earlier work predates layer records; the change does not touch the premise")), "not ready"));
    assert.equal(noRecord.code, 1);
    assert.match(noRecord.out, /layer "premises" is not checked for want of an earlier record/);
    // Not checked is for what cannot be done here, not for work the writer left undone.
    const lazy = check("lazy.md", doc(swap("7 review", row("7 review", "not checked", "self-review only, no fresh reviewer")), "not ready"));
    assert.equal(lazy.code, 1);
    assert.match(lazy.out, /layer "review" is not checked for a reason that is in your hands/);
    const partRead = check("partread.md", doc(swap("1 fundamentals", row("1 fundamentals", "not checked", "the offer file was only partly read")), "not ready"));
    assert.equal(partRead.code, 1);
    assert.match(partRead.out, /layer "fundamentals" is not checked for a reason that is in your hands/);
    // An n/a needs a real reason, and the whole-output row is never n/a.
    const thin = check("thin.md", doc(swap("9 destination", row("9 destination", "n/a", "skipped")), "copy-ready"));
    assert.equal(thin.code, 1);
    assert.match(thin.out, /layer "destination" is n\/a with no reason/);
    const wholeNa = check("wholena.md", doc(swap("whole", row("whole", "n/a", "nothing was assembled in this session")), "copy-ready"));
    assert.equal(wholeNa.code, 1);
    assert.match(wholeNa.out, /whole-output row is never n\/a/);
    // The one-line form used in a reply: evidence in brackets, anywhere on its line.
    const items = "fundamentals pass (offer file and proof table read) · premises pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; five compared, three rejected) · cast-treatment pass (hands only; illustrated rejected) · visual-stop fail, then pass (frame read with copy hidden after the glance repair) · connection pass (read start to end) · claims pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against proof rows; review withheld) · review fail, then pass (" + REVIEW + ") · whole pass (set read as the operator sees it)";
    const line = check("line.md", `Three concepts below.\n\nLayers (ad-concepts): ${items}. State: concept-ready, untested.${NONE}\n`);
    assert.equal(line.code, 0, line.out);
    const stateFirst = check("statefirst.md", `State: concept-ready. Layers (ad-concepts): ${items}.${NONE}\n`);
    assert.equal(stateFirst.code, 0, stateFirst.out);
    const bare = check("bare.md", "Layers (ad-concepts): fundamentals pass · premises pass · cast-treatment pass · visual-stop pass · connection pass · claims pass · review pass · whole pass. State: concept-ready\n");
    assert.equal(bare.code, 1);
    assert.match(bare.out, /layer "fundamentals" passes with no evidence/);
    const shortLine = check("short.md", "Layers (ad-concepts): fundamentals pass (offer file read) · premises pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; five compared) · review pass (self-review, scores 4) · whole pass (set read whole). State: concept-ready\n");
    assert.equal(shortLine.code, 1);
    assert.match(shortLine.out, /layer "visual-stop" has no row/);
    // A state claimed with an exception is not that state.
    const excepted = check("excepted.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck pass (both October ads corrected and their records updated) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: rechecked, except the four live ads\n");
    assert.equal(excepted.code, 1);
    assert.match(excepted.out, /state "rechecked" is claimed with an exception/);
    const qualified = check("qualified.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck pass (both October ads corrected and their records updated) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: rechecked. The only thing left is your review." + NONE + "\n");
    assert.equal(qualified.code, 0, qualified.out);
    const lineMixed = check("linemixed.md", "Layers (change-recheck): record pass (offer file read back) · dependents pass (ads searched for the old wording) · recheck pass for the two October ads, not checked for the four live ads (no creative files) · states pass (ledger beside the records) · whole not checked (page unseen). State: partly rechecked\n");
    assert.equal(lineMixed.code, 1);
    assert.match(lineMixed.out, /layer "recheck" carries two verdicts/);
    const piped = spawnSync(process.execPath, [path.join(scripts, "workorder.mjs"), "--record", "-"], { encoding: "utf8", input: `Layers (ad-concepts): ${items}. State: concept-ready.${NONE}\n` });
    assert.equal(piped.status, 0, piped.stdout);
    assert.equal(check("none.md", "# nothing here\n").code, 1);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: a record names its notes, its evidence items and every failed layer", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const { missingItems } = await import("../workorder.mjs");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-notes-"));
  const check = (name, text) => { const f = path.join(tmp, name); fs.writeFileSync(f, text); return wo("--record", f); };
  // The shape of a real failed run's record, retold for a synthetic business: drafted whole, labelled afterward.
  const failed = "Layers (ad-copy): fundamentals pass (brief offer block and the owner's correction, channel note, preferences, voice profile, audience and creative kit read; offer page read from its repo source, earlier ad images viewed; the missing offer file named as a gap) · premises pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; eight premises side by side, four kept, four rejected with reasons) · cast-treatment pass (cast and rendering chosen separately for four concepts, each with a rejected alternative) · visual-stop pass (each first frame described and read with copy hidden) · connection pass (each concept read start to end; two glance failures found and fixed) · claims pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map read row by row against the brief and the email drafts; no testimonials, no people) · review pass (separate self-review pass, no fresh reviewer available; Hook and Glance 4 or more, One job and Proof 3 or more, two revisions made) · copy pass (every field read against the claims map; character counts run; no em dashes) · destination fail (offer page source has no offer mention; reported as a page gap, offer not changed) · whole pass (four concepts read as a set; distinct mechanisms; nothing generated). State: copy-ready\n";
  const LOAD = ["core/skills/ad-creative/SKILL.md", "references/creative-passes.md", "opening-dynamics.md", "copy-and-hooks.md", "composition-review.md", "claims-and-policy.md", "core/_system/schemas/creative.md"];
  const para = (id) => `Result of the ${id} layer, written when it was reached: what was built, what was compared and rejected, and what the check found from the evidence opened.`;
  // Each section follows the opened line --layer wrote when the layer was reached.
  const opened = (id, n) => `<!-- opened: ad-copy/${id} 2026-11-15T10:${String(10 + n).padStart(2, "0")}:00Z -->`;
  // The review's blocking findings sent work back to claims and copy: each was reopened with --repair and its repair written below.
  const repaired = (id) => (["claims", "copy"].includes(id) ? [`<!-- reopened: ad-copy/${id} review 1 2026-11-15T10:3${id === "claims" ? 0 : 1}:00Z -->`, `Repair (review 1): the ${id} finding was fixed here, and the changed lines were read again against the proof table afterwards.`] : []);
  const notes = (over = {}) => ["# Notes, spring offer ads", ...["fundamentals", "premises", "cast-treatment", "visual-stop", "connection", "claims", "copy", "review"].flatMap((id, n) => [opened(id, n), `## ${id}`, over[id] !== undefined ? over[id] : para(id), ...repaired(id), ""]), opened("destination", 8), opened("whole", 9), "", "## whole", "Re-checked (review 1): the repaired claim and copy were read again here against what this layer had passed."].join("\n");
  const readAll = (files) => `Read to the last line: ${files.join(", ")}; the business's channel note, each to its end.\n${EXAMPLES} The offer is the spring kit, sold until May 1.`;
  const REVIEW = "reviewer: fresh agent given the review brief word for word; findings: five, two blocking (a repeated opening, an unsupported speed claim) [copy, claims], both repaired; reviewed: concepts-draft-v2.md; after review: nothing changed; audience: any; register: at register beside the owner's frost caption example; hook: 4, the frozen seedling stops the scroll; glance: 4, offer reads in one second; one job: 4, one promise per ad; proof: 3, proof row 2 quoted with its condition";
  const fixed = (notesLine) => `Layers (ad-copy): fundamentals pass (every Load first file and the business's channel note read to the last line, named in the notes) · premises pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; eight premises in the notes, four rejected with reasons) · cast-treatment pass (cast and rendering chosen per concept, alternatives in the notes) · visual-stop pass (first frames read with copy hidden) · connection pass (each concept read start to end) · claims fail, then pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against the proof table; the speed claim cut after review) · review fail, then pass (${REVIEW}) · copy fail, then pass (fields against the claims map; own words: closest are the spring email opening and the offer page intro, both rewritten; corrections: the owner's two channel corrections quoted, both followed) · destination fail (the live page does not show the offer; reported as a page gap) · whole pass (set: no primary text or headline repeats across the four ads, only the offer dates). State: copy-ready; destination fail, page gap reported to the business. ${notesLine}\n`;
  try {
    // 1. The failed record now fails, for the reasons the grade found.
    const old = check("failed.md", failed);
    assert.equal(old.code, 1);
    assert.match(old.out, /no "Notes:" line; name the notes file/);
    assert.match(old.out, /layer "review" passes without these evidence items: "reviewer:", "findings:", "reviewed:", "after review:", "audience:", "hook:", "glance:", "one job:", "proof:"/);
    assert.match(old.out, /layer "copy" passes without these evidence items: "own words:", "corrections:"/);
    assert.match(old.out, /layer "whole" passes without these evidence items: "set:"/);
    assert.match(old.out, /the state does not name "destination" \(fail\)/);
    // 2. The corrected record, with a notes file written as the work went, passes.
    const good = path.join(tmp, "notes.md");
    writeNotes(fs, good, notes({ fundamentals: readAll(LOAD) }));
    const ok = check("fixed.md", fixed(`Notes: ${good}`));
    assert.equal(ok.code, 0, ok.out);
    // 3. A Load first file missing under the loading layer, a thin heading, a part read and a missing path all fail.
    writeNotes(fs, path.join(tmp, "missing.md"), notes({ fundamentals: readAll(LOAD.slice(0, -1)) }));
    const missing = check("m.md", fixed(`Notes: ${path.join(tmp, "missing.md")}`));
    assert.equal(missing.code, 1);
    assert.match(missing.out, /notes under layer "fundamentals" do not name core\/_system\/schemas\/creative\.md/);
    writeNotes(fs, path.join(tmp, "thin.md"), notes({ fundamentals: readAll(LOAD), premises: "Eight premises, four kept." }));
    const thin = check("t.md", fixed(`Notes: ${path.join(tmp, "thin.md")}`));
    assert.equal(thin.code, 1);
    assert.match(thin.out, /heading for layer "premises" has fewer than 15 words/);
    writeNotes(fs, path.join(tmp, "part.md"), notes({ fundamentals: `${readAll(LOAD)}\nopening-dynamics.md: lines 1-200 of 225.` }));
    const part = check("p.md", fixed(`Notes: ${path.join(tmp, "part.md")}`));
    assert.equal(part.code, 1);
    assert.match(part.out, /say a file was read in part/);
    writeNotes(fs, path.join(tmp, "noex.md"), notes({ fundamentals: readAll(LOAD).replace("\nExamples:", "\nAlso:") }));
    const noEx = check("x.md", fixed(`Notes: ${path.join(tmp, "noex.md")}`));
    assert.equal(noEx.code, 1);
    assert.match(noEx.out, /notes under layer "fundamentals" have no "Examples:" line/);
    // Under the loading layer, only a part read fails; something left undone is a disclosure, unless it names a Load first file.
    const loadLine = (line, n) => { const f = path.join(tmp, `ld-${n}.md`); writeNotes(fs, f, notes({ fundamentals: `${readAll(LOAD)}\n${line}` })); return check(`rld-${n}.md`, fixed(`Notes: ${f}`)); };
    ["The offer rests in part on the owner's note of 2026-11-11.", "Did not open the SEO files: not needed for this request.", "Not opened, not required: ads/research/competitors.md (no competitor claim in this ad).", "The live page cannot be reached from this session.", "Did not get to the playbook for another service: not this request."].forEach((line, n) => {
      const r = loadLine(line, n);
      assert.equal(r.code, 0, `${line}\n${r.out}`);
    });
    const loadFirst = loadLine("Did not open copy-and-hooks.md: not needed for this request.", 9);
    assert.equal(loadFirst.code, 1);
    assert.match(loadFirst.out, /leave core\/skills\/ad-creative\/references\/copy-and-hooks\.md undone .* it is a Load first file and is read to its last line/);
    // A Load first file is named by a path as the line writes it, never by a piece of one: another skill's SKILL.md is not this one.
    const otherSkill = loadLine("Not opened, not required: core/skills/ad-launch/SKILL.md (no launch in this request).", 50);
    assert.equal(otherSkill.code, 0, otherSkill.out);
    assert.match(loadLine("Did not open SKILL.md.", 51).out, /leave core\/skills\/ad-creative\/SKILL\.md undone/);
    assert.equal(loadLine("Not opened: old-copy-and-hooks.md (an earlier copy).", 52).code, 0);
    // A disclosure is read with its own sentence: a fresh agent wrote its Load first list and a disclosure about other files on one line.
    const onOneLine = path.join(tmp, "ld-para.md");
    writeNotes(fs, onOneLine, notes({ fundamentals: `Load first, each read to its last line this session: ${LOAD.join("; ")}. Also the business's channel note, read whole. Not opened, not required: the gallery images (concepts only, no render).\n${EXAMPLES} The offer is the spring kit, sold until May 1.` }));
    const para = check("rld-para.md", fixed(`Notes: ${onOneLine}`));
    assert.equal(para.code, 0, para.out);
    assert.match(loadLine("Read whole: the brief. Not opened: copy-and-hooks.md, ran long.", 53).out, /leave core\/skills\/ad-creative\/references\/copy-and-hooks\.md undone/);
    ["brief.md, first 200 lines", "brief.md, lines 1 to 80", "skimmed brief.md", "brief.md was not read in full", "brief.md: not read to its last line", "read brief.md in part", "did not finish brief.md", "searched brief.md only"].forEach((line, n) => {
      assert.match(loadLine(line, 20 + n).out, /say a file was read in part/, line);
    });
    assert.doesNotMatch(loadLine("brief.md, first 200 lines\nRead later, while premises was open: brief.md (240 lines), to its last line.", 40).out, /say a file was read in part/);
    // The loading layer says so where the section is written.
    assert.match(wo("--id", "ad-copy", "--layer", "fundamentals", "--notes", path.join(tmp, "open-load.md")).out, /that is a disclosure, not a part read, unless the line names a Load first file/);
    // The Examples: line names each example by a path that exists; a missing path or a pattern fails, naming it.
    const exLine = (line) => { const f = path.join(tmp, `ex-${Math.abs(line.length)}.md`); writeNotes(fs, f, notes({ fundamentals: readAll(LOAD).replace(EXAMPLES, line) })); return check(`rx-${line.length}.md`, fixed(`Notes: ${f}`)); };
    const missingEx = exLine(`Examples: ${fx("business/ads/rejected-sept")}, ${fx("business/notes/brand-notes.md")}, each read to its end.`);
    assert.equal(missingEx.code, 1);
    assert.match(missingEx.out, /the "Examples:" line under layer "fundamentals" names ".*business\/ads\/rejected-sept", which does not exist/);
    const globEx = exLine("Examples: campaigns/ads-*, all opened.");
    assert.equal(globEx.code, 1);
    assert.match(globEx.out, /uses a pattern \("campaigns\/ads-\*"\)/);
    assert.match(exLine("Examples: the rejected September ads, all opened.").out, /names no path/);
    assert.equal(exLine("Examples: none, the channel rules point at no examples.").code, 0);
    // Words in brackets on the Examples line are the writer's notes about a path, not paths.
    const bracketed = exLine(`Examples: ${fx("business/notes/brand-notes.md")} (pointed at by social.md, which ads.md says to start from); ${fx("business/ads/offers/cake.md")} (ads.md: check hooks against it).`);
    assert.equal(bracketed.code, 0, bracketed.out);
    const gone = check("g.md", fixed(`Notes: ${path.join(tmp, "no-such-notes.md")}`));
    assert.equal(gone.code, 1);
    assert.match(gone.out, /the notes file ".*no-such-notes\.md" was not found/);
    const none = check("n.md", fixed("Notes: none (cannot write files here)"));
    assert.equal(none.code, 0, none.out);
    // A piped record needs a Notes line; a file record without one is checked as before.
    const piped = spawnSync(process.execPath, [path.join(scripts, "workorder.mjs"), "--record", "-"], { encoding: "utf8", input: ["## Layer record", "Work order: claims-check", "| Layer | Verdict | Evidence | Fix |", "| --- | --- | --- | --- |", "| claims-list | pass | every line of the copy listed with its claim |  |", "| proof-map | pass | each claim beside its proof row |  |", "| policy | pass | personal attributes read line by line |  |", "| report | pass | the verdict table written for the operator |  |", "| whole | pass | the report read top to bottom |  |", "State: checked", ""].join("\n") });
    assert.match(piped.stdout, /no "Notes:" line/);
    // 4. An evidence item needs words after its name.
    assert.deepEqual(missingItems(["voice"], "voice:"), ["voice"]);
    assert.deepEqual(missingItems(["voice"], "Voice: reads like the owner's own captions E5 and E8"), []);
    // A true limit is not deleted to pass: the message says so.
    const limit = check("limit.md", fixed("Notes: none (cannot write files here)").replace("first frames read with copy hidden", "first frames not rendered"));
    assert.match(limit.out, /Do not delete a true limit to make the row pass/);
    // The live page shows file lengths; the generated page does not.
    assert.match(wo("--id", "ad-copy").out, /core\/_system\/schemas\/creative\.md\]\([^)]*\) \(\d+ lines\)/);
    assert.doesNotMatch(fs.readFileSync(path.join(hubRoot, "work-orders/ad-copy.md"), "utf8"), /\(\d+ lines\)/);
    assert.match(fs.readFileSync(path.join(hubRoot, "work-orders/ad-copy.md"), "utf8"), /a file read in part is not read/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: a review covers the delivered words, and a reworded line does not pass", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-review-"));
  const check = (name, text) => { const f = path.join(tmp, name); fs.writeFileSync(f, text); return wo("--record", f); };
  const SCORES = "hook: 4, the frozen seedling stops the scroll; glance: 4, offer reads in one second; one job: 4, one promise per ad; proof: 3, proof row 2 quoted with its condition";
  const review = ({ verdict = "fail, then pass", reviewer = "fresh agent", findings = "13, 5 blocking [premises], all repaired", after = "nothing changed", audience = "any" } = {}) => `review ${verdict} (reviewer: ${reviewer}; findings: ${findings}; reviewed: draft v1; after review: ${after}; audience: ${audience}; register: at register beside the owner's frost caption example; ${SCORES})`;
  const OWN = 'own words: "Frost comes early this year" beside "Beat the early frost" from the spring email: new; "Order by May 1" beside the offer file: offer term';
  const record = ({ rev = review(), own = OWN, state = "copy-ready; destination fail, page gap reported" } = {}) => `Layers (ad-copy): fundamentals pass (every Load first file and the channel note read to the last line) · premises fail, then pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; eight premises, four rejected with reasons) · cast-treatment pass (cast and rendering chosen per concept) · visual-stop pass (first frames read with copy hidden) · connection pass (each concept read start to end) · claims pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against the proof table) · ${rev} · copy pass (fields against the claims map; ${own}; corrections: the owner's two channel corrections quoted, both followed) · destination fail (the live page does not show the offer; reported as a page gap) · whole pass (set: no primary text or headline repeats across the ads, only the offer dates). State: ${state}. Notes: none (cannot write files here)\n`;
  try {
    // 1. A review that found blocking problems is a repair, not a plain pass.
    const plain = check("plain.md", record({ rev: review({ verdict: "pass" }) }));
    assert.equal(plain.code, 1);
    assert.match(plain.out, /layer "review" records blocking findings .* "fail, then pass"/);
    assert.equal(check("repair.md", record()).code, 0);
    assert.equal(check("nonblocking.md", record({ rev: review({ verdict: "pass", findings: "four, none blocking, two taken up" }) })).code, 0);
    // 2. Words changed after a fresh review are not reviewed words; a session with no fresh agent may self re-check.
    const changed = "headline and primary text rewritten, re-checked by the maker";
    const after = check("after.md", record({ rev: review({ after: changed }) }));
    assert.equal(after.code, 1);
    assert.match(after.out, /layer "review" passes on a fresh review, but text changed after it .* run the review again on what changed, or record the row as partial/);
    const self = check("self.md", record({ rev: review({ reviewer: "self, no fresh agent can be started here", after: changed }) }));
    assert.equal(self.code, 0, self.out);
    const noAfter = check("noafter.md", record({ rev: review().replace("after review: nothing changed; ", "") }));
    assert.equal(noAfter.code, 1);
    assert.match(noAfter.out, /without these evidence items: "after review:"/);
    // Register is a verdict: below register is not a pass; at register beside the example, or n/a with no examples, is.
    const REG = "register: at register beside the owner's frost caption example";
    const below = check("below.md", record().replace(REG, 'register: below register beside "Frost does not wait, and neither should you"'));
    assert.equal(below.code, 1);
    assert.match(below.out, /passes with "register: below register/);
    assert.equal(check("at.md", record().replace(REG, 'register: at register (beside "Frost does not wait, and neither should you")')).code, 0);
    assert.equal(check("noex.md", record().replace(REG, "register: n/a: no owner examples for this channel")).code, 0);
    // The idea is set beside what the business already ran: premises without closest earlier fails, naming the item.
    const noEarlier = check("noearlier.md", record().replace("closest earlier: the spring ad for the same kit leads on price, this idea on frost; ", ""));
    assert.equal(noEarlier.code, 1);
    assert.match(noEarlier.out, /layer "premises" passes without these evidence items: "closest earlier:"/);
    assert.equal(check("noneonfile.md", record().replace("closest earlier: the spring ad for the same kit leads on price, this idea on frost; ", "closest earlier: none on file (searched ads/creative and the emails folder); ")).code, 0);
    // A condition is shown wherever the offer is: the claims row names each condition's surfaces, or says none.
    const SHOWN = "; shown in: the image, the headline and both primary texts";
    const noShown = check("noshown.md", record().replace(SHOWN, ""));
    assert.equal(noShown.code, 1);
    assert.match(noShown.out, /layer "claims" passes with condition "Order by May 1" but no "shown in:" after it/);
    assert.equal(check("nocond.md", record().replace(`condition: “Order by May 1”${SHOWN}; `, "condition: none; ")).code, 0);
    assert.match(check("nocondition.md", record().replace(`condition: “Order by May 1”${SHOWN}; `, "")).out, /layer "claims" passes without these evidence items: "condition:"/);
    // A cut never removes a condition or a scope limit the claims row lists; a cut that only shares words passes.
    const scoped = (after) => record({ rev: review({ after }) }).replace(SHOWN, `${SHOWN}; scope limit: “not the raised beds”; shown in: both long texts`);
    const cutLimit = check("cutlimit.md", scoped('cut: "Covers every row, not the raised beds." (finding 2)'));
    assert.equal(cutLimit.code, 1);
    assert.match(cutLimit.out, /the cut "Covers every row, not the raised beds\." removes the scope limit "not the raised beds"; a cut never removes a condition or a scope limit: restore the line, or change it and have that one line re-checked/);
    assert.equal(check("cutother.md", scoped('cut: "Frost comes early this year." (finding 2)')).code, 0);
    assert.equal(check("cutshared.md", scoped('cut: "Order by Friday for the beds." (finding 2)')).code, 0);
    // 3. Own words: a line marked reworded fails the copy row; new, offer term and "not reworded" do not.
    const reworded = check("reworded.md", record({ own: 'own words: "Kit free with every planner" beside "Free kit with your planner" from the spring email: reworded' }));
    assert.equal(reworded.code, 1);
    assert.match(reworded.out, /layer "copy" passes with a line its own words item marks reworded/);
    // client claim: the owner's product claim as a fact with its conditions, in a new sentence, passes; reworded still fails.
    const claim = check("claim.md", record({ own: 'own words: "Roots stay warm down to minus five" beside "the kit keeps roots warm to -5C" from the offer page: client claim (offer/garden-kit.md, line 12)' }));
    assert.equal(claim.code, 0, claim.out);
    assert.equal(check("notreworded.md", record({ own: 'own words: "Frost comes early this year" beside "Beat the early frost": new, not reworded' })).code, 0);
    // 4. Scores that hold for one audience: the state names it.
    const warm = review({ audience: "warm visitors only, hook 3 if served cold" });
    const unnamed = check("unnamed.md", record({ rev: warm }));
    assert.equal(unnamed.code, 1);
    assert.match(unnamed.out, /the review's scores hold for one audience/);
    assert.match(unnamed.out, /copy that audience after the state unchanged/);
    assert.equal(check("named.md", record({ rev: warm, state: "copy-ready for warm visitors; destination fail, page gap reported" })).code, 0);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: the tool hands out one layer at a time", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const { loadMap } = await import("../workorder.mjs");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-gate-"));
  const by = Object.fromEntries(loadMap(hubRoot).work_orders.map((o) => [o.id, o]));
  const check = (name, text) => { const f = path.join(tmp, name); fs.writeFileSync(f, text); return wo("--record", f); };
  const stampsIn = (f) => (fs.readFileSync(f, "utf8").match(/<!-- opened: /g) || []).length;
  try {
    // 1. The summary names every layer and holds none of their checks or evidence; --all and the page agree.
    const o = by["ad-copy"];
    const summary = wo("--id", "ad-copy").out;
    const page = fs.readFileSync(path.join(hubRoot, "work-orders/ad-copy.md"), "utf8");
    const full = wo("--id", "ad-copy", "--all").out;
    for (const l of o.layers) {
      for (const text of [summary, page]) {
        assert.ok(text.includes(`\`${l.id}\``) && text.includes(l.name), `summary lacks layer ${l.id}`);
        assert.ok(!text.includes(l.check), `summary carries the check of ${l.id}`);
        assert.ok(!text.includes(l.evidence), `summary carries the evidence of ${l.id}`);
      }
      assert.ok(full.includes(l.check) && full.includes(l.evidence), `--all lacks layer ${l.id}`);
    }
    assert.ok(!summary.includes(o.whole.check) && full.includes(o.whole.check));
    assert.match(summary, /--id ad-copy --layer fundamentals --notes <notes file>/);
    assert.match(summary, /`--all` prints every layer at once/);
    assert.match(wo("--for", "write ad copy for the home valuation offer").out, /--id ad-copy --layer fundamentals --notes/);
    // 2. The first layer opens with no notes file and stamps it; the second waits for the first's section.
    const notes = path.join(tmp, "notes.md");
    const first = wo("--id", "ad-copy", "--layer", "fundamentals", "--notes", notes);
    assert.equal(first.code, 0, first.out);
    assert.ok(first.out.includes(o.layers[0].check));
    assert.match(first.out, /Next: .* --id ad-copy --layer premises --notes /);
    assert.equal(stampsIn(notes), 1);
    assert.match(fs.readFileSync(notes, "utf8"), /^<!-- opened: ad-copy\/fundamentals \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z -->$/m);
    const early = wo("--id", "ad-copy", "--layer", "premises", "--notes", notes);
    assert.equal(early.code, 1);
    assert.match(early.out, /layer "fundamentals" has no section/);
    assert.ok(!early.out.includes(o.layers[1].check), "a closed layer prints no check");
    fs.appendFileSync(notes, "\n## fundamentals\nRead every file under Load first to its last line, and the business's brief and channel rules, before any premise.\n");
    const second = wo("--id", "ad-copy", "--layer", "premises", "--notes", notes);
    assert.equal(second.code, 0, second.out);
    assert.ok(second.out.includes(o.layers[1].check));
    assert.equal(stampsIn(notes), 2);
    assert.equal(wo("--id", "ad-copy", "--layer", "fundamentals", "--notes", notes).code, 0);
    assert.equal(stampsIn(notes), 2, "opening a layer again adds no line");
    // The tool keeps its own ledger of the stamps beside the notes: a notes file rewritten
    // whole loses its stamps, the ledger keeps them, and reopening adds nothing.
    const ledger = `${notes}.opened`;
    const kept = fs.readFileSync(ledger, "utf8");
    assert.equal((kept.match(/opened: ad-copy\//g) || []).length, 2);
    const rewritten = path.join(tmp, "rewritten.md");
    assert.equal(wo("--id", "ad-copy", "--layer", "fundamentals", "--notes", rewritten).code, 0);
    const first1 = fs.readFileSync(`${rewritten}.opened`, "utf8");
    fs.writeFileSync(rewritten, "## fundamentals\nRead every file under Load first to its last line, and the business's brief and channel rules, before any premise.\n");
    assert.equal(stampsIn(rewritten), 0);
    assert.equal(wo("--id", "ad-copy", "--layer", "fundamentals", "--notes", rewritten).code, 0);
    assert.equal(stampsIn(rewritten), 0, "a layer whose stamp is in the ledger is not stamped again");
    const stampsOnly = (x) => x.split("\n").filter((l) => !l.includes("<!-- mark:")).join("\n");
    assert.equal(stampsOnly(fs.readFileSync(`${rewritten}.opened`, "utf8")), stampsOnly(first1));
    // The stamp lines do not count toward a section's words.
    fs.appendFileSync(notes, "\n## premises\nFour kept.\n");
    assert.equal(wo("--id", "ad-copy", "--layer", "cast-treatment", "--notes", notes).code, 1);
    // 3. A section that begins n/a with a reason lets the next layer open; a bare n/a does not.
    const na = path.join(tmp, "na.md");
    fs.writeFileSync(na, "## claims-list\nn/a\n");
    assert.equal(wo("--id", "claims-check", "--layer", "proof-map", "--notes", na).code, 1);
    fs.writeFileSync(na, "## claims-list\nn/a: the copy makes no claims at all\n");
    assert.equal(wo("--id", "claims-check", "--layer", "proof-map", "--notes", na).code, 0);
    assert.equal(wo("--id", "ad-copy", "--layer", "fundamentals").code, 2, "--layer needs --notes");
    // 4. The record checker reads the opened lines: missing, in order, swapped.
    const c = by["ad-concepts"];
    const ids = c.layers.map((l) => l.id);
    const body = (id) => (id === "fundamentals" ? `Read to the last line: ${c.load.join(", ")}; the channel note, each to its end.\n${EXAMPLES}` : `Result of the ${id} layer, written when it was reached: what was built, compared and rejected, and what the check found.`);
    const stamp = (id, n) => `<!-- opened: ad-concepts/${id} 2026-11-15T09:${String(10 + n).padStart(2, "0")}:00Z -->`;
    const write = (name, withStamps, swap = false) => {
      // Swapped: premises and cast-treatment trade times, so the later layer was opened first.
      const order = [...ids, "whole"].map((id, n) => stamp(id, swap && n === 1 ? 2 : swap && n === 2 ? 1 : n));
      const fix = (id) => (withStamps && id === "visual-stop" ? ["<!-- reopened: ad-concepts/visual-stop review 1 2026-11-15T09:30:00Z -->", "Repair (review 1): the frame's competing caption was removed, and the frame was read again at feed size with copy hidden."] : []);
      // Layers after the repaired one, already open, say they were re-checked for review 1.
      const rc = (id) => (withStamps && ["connection", "claims"].includes(id) ? ["Re-checked (review 1): the repaired frame was read again against this layer's result."] : []);
      const lines = ["# Notes", ...ids.flatMap((id, n) => [withStamps ? order[n] : "", `## ${id}`, body(id), ...fix(id), ...rc(id), ""]), withStamps ? order[ids.length] : "", ...(withStamps ? ["", "## whole", "Re-checked (review 1): the set was read again after the frame repair."] : [])];
      writeNotes(fs, path.join(tmp, name), lines.join("\n"));
      return path.join(tmp, name);
    };
    const REV = "reviewer: fresh agent given the review brief word for word; findings: four, one blocking [visual-stop], repaired; reviewed: concepts-v1.md; after review: nothing changed; audience: any; register: at register beside the owner's frost caption example; hook: 4, the frost image stops the scroll; glance: 4, offer reads in a second; one job: 4, one promise only; proof: 3, proof row 2 stated plainly";
    const line = (notesFile) => `Layers (ad-concepts): fundamentals pass (every Load first file read to its end) · premises pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; five compared, three rejected) · cast-treatment pass (hands only; illustrated rejected) · visual-stop fail, then pass (frame read with copy hidden after the glance repair) · connection pass (read start to end) · claims pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against proof rows) · review fail, then pass (${REV}) · whole pass (set read as the operator sees it). State: concept-ready. Notes: ${notesFile}\n`;
    const bare = check("bare.md", line(write("n-bare.md", false)));
    assert.equal(bare.code, 1);
    assert.match(bare.out, /layer "fundamentals" passes, but the notes file has no "opened: ad-concepts\/fundamentals" line; open each layer with --layer/);
    const inOrder = check("order.md", line(write("n-order.md", true)));
    assert.equal(inOrder.code, 0, inOrder.out);
    const swapped = check("swap.md", line(write("n-swap.md", true, true)));
    assert.equal(swapped.code, 1);
    assert.match(swapped.out, /layer "cast-treatment" was opened at .*, before layer "premises"/);
    // 5. Blocking findings name the layers they sent work back to, and those layers record the repair.
    const copyLine = (findings, copyVerdict) => `Layers (ad-copy): fundamentals pass (every Load first file and the channel note read to the last line) · premises pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; eight premises, four rejected with reasons) · cast-treatment pass (cast and rendering chosen per concept) · visual-stop pass (first frames read with copy hidden) · connection pass (each concept read start to end) · claims pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against the proof table) · review fail, then pass (reviewer: fresh agent; findings: ${findings}; reviewed: draft v1; after review: nothing changed; audience: any; register: at register beside the owner's frost caption example; hook: 4, the frozen seedling stops the scroll; glance: 4, offer reads in one second; one job: 4, one promise per ad; proof: 3, proof row 2 quoted with its condition) · copy ${copyVerdict} (fields against the claims map; own words: "Frost comes early this year" beside "Beat the early frost": new; corrections: the owner's two channel corrections quoted, both followed) · destination fail (the live page does not show the offer; reported as a page gap) · whole pass (set: no primary text or headline repeats across the ads, only the offer dates). State: copy-ready; destination fail, page gap reported. Notes: none (cannot write files here)\n`;
    const unnamed = check("f1.md", copyLine("3 blocking, all repaired", "pass"));
    assert.equal(unnamed.code, 1);
    assert.match(unnamed.out, /reports blocking findings with no layer named/);
    const plainCopy = check("f2.md", copyLine("3 blocking [copy], all repaired", "pass"));
    assert.equal(plainCopy.code, 1);
    assert.match(plainCopy.out, /findings sent work back to "copy", but "copy" is a plain pass/);
    const repaired = check("f3.md", copyLine("3 blocking [copy], all repaired", "fail, then pass"));
    assert.equal(repaired.code, 0, repaired.out);
    assert.match(check("f4.md", copyLine("3 blocking [nowhere], all repaired", "fail, then pass")).out, /findings name "nowhere", which is not a layer/);
    // 6. A pass that names a repair after a failed check is "fail, then pass".
    const fixCell = ["## Layer record", "Work order: claims-check", "| Layer | Verdict | Evidence | Fix |", "| --- | --- | --- | --- |", "| claims-list | pass | every line of the copy listed with its claim | returned from review: the speed line added |", "| proof-map | pass | each claim beside its proof row |  |", "| policy | pass | personal attributes read line by line |  |", "| report | pass | the verdict table written for the operator |  |", "| whole | pass | the report read top to bottom |  |", "State: checked, clean", ""].join("\n");
    const viaFix = check("g1.md", fixCell);
    assert.equal(viaFix.code, 1);
    assert.match(viaFix.out, /layer "claims-list" is marked pass but its fix column records a failure or a repair/);
    const viaEvidence = check("g2.md", fixCell.replace("| returned from review: the speed line added |", "|  |").replace("each claim beside its proof row", "each claim beside its proof row, returned to claims-list for the missed speed line"));
    assert.equal(viaEvidence.code, 1);
    assert.match(viaEvidence.out, /layer "proof-map" is marked pass but its evidence names a repair after a failed check/);
    assert.equal(check("g3.md", fixCell.replace("| returned from review: the speed line added |", "|  |")).code, 0);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: a repair is reopened at the layer a finding names, and the review loop can end clean", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const { loadMap } = await import("../workorder.mjs");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-repair-"));
  const c = loadMap(hubRoot).work_orders.find((o) => o.id === "ad-concepts");
  const ids = c.layers.map((l) => l.id);
  const check = (name, text) => { const f = path.join(tmp, name); fs.writeFileSync(f, text); return wo("--record", f); };
  const pipe = (input) => { const r = spawnSync(process.execPath, [path.join(scripts, "workorder.mjs"), "--record", "-"], { encoding: "utf8", input, cwd: tmp }); return { code: r.status, out: r.stdout + r.stderr }; };
  const reopened = (f) => (fs.readFileSync(f, "utf8").match(/<!-- reopened: /g) || []).length;
  try {
    // 2. --repair: refused on a layer never opened; on an opened layer it prints the block and stamps notes and ledger every call.
    const notes = path.join(tmp, "notes.md");
    assert.equal(wo("--id", "ad-concepts", "--layer", "fundamentals", "--notes", notes).code, 0);
    const never = wo("--id", "ad-concepts", "--layer", "premises", "--repair", "1", "--notes", notes);
    assert.equal(never.code, 1);
    assert.match(never.out, /was never opened.*open it first with .*--layer premises --notes/);
    fs.appendFileSync(notes, "\n## fundamentals\nRead every file under Load first to its last line, and the business's brief and channel rules, before any premise.\n");
    assert.equal(wo("--id", "ad-concepts", "--layer", "premises", "--notes", notes).code, 0);
    fs.appendFileSync(notes, "\n## premises\nFive premises compared side by side, three rejected with a reason each, two kept for the frost offer.\n");
    const one = wo("--id", "ad-concepts", "--layer", "fundamentals", "--repair", "1", "--notes", notes);
    assert.equal(one.code, 0, one.out);
    assert.ok(one.out.includes(c.layers[0].check), "the repair prints the layer's block");
    assert.match(one.out, /begins "Repair \(review 1\):"/);
    // The check comes first, so a reader that keeps only the first line still sees it; the order comes before the block.
    assert.equal(one.out.split("\n")[0], `Check (ad-concepts/fundamentals, reopened for review 1): ${c.layers[0].check}`);
    assert.match(one.out.split("\n")[1], /^Write the new lines after this reopen, not before it\./);
    assert.match(one.out, /Every later layer already open, apart from the one that carries the fresh review, is then reopened the same way if it changes, or re-checked with --layer <id> --recheck 1\./);
    assert.match(fs.readFileSync(notes, "utf8"), /^<!-- reopened: ad-concepts\/fundamentals review 1 \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z -->$/m);
    assert.equal(wo("--id", "ad-concepts", "--layer", "fundamentals", "--repair", "1", "--notes", notes).code, 0);
    assert.equal(reopened(notes), 2);
    assert.equal(reopened(`${notes}.opened`), 2);
    // An upstream repair is written down before a downstream layer is reopened for the same review.
    const blocked = wo("--id", "ad-concepts", "--layer", "premises", "--repair", "1", "--notes", notes);
    assert.equal(blocked.code, 1);
    assert.match(blocked.out, /layer "fundamentals", earlier in the work order, was reopened for review 1 and has no "Repair \(review 1\):"/);
    fs.appendFileSync(notes, "\n## fundamentals, after review 1\nRepair (review 1): the offer end date was added from the brief, and the brief was read again to its last line.\n");
    assert.equal(wo("--id", "ad-concepts", "--layer", "premises", "--repair", "1", "--notes", notes).code, 0);
    assert.match(fs.readFileSync(notes, "utf8"), /\n## premises: repair 1\n<!-- reopened: ad-concepts\/premises review 1 [^>]*-->\n$/, "--repair adds the layer's repair heading with the stamp under it");
    assert.equal(wo("--id", "ad-concepts", "--layer", "premises", "--repair", "0", "--notes", notes).code, 2);
    // A repair written before its reopen is refused by the tool and failed by the checker.
    fs.appendFileSync(notes, "\n## premises, more\nRepair (review 2): the kept premise now names the frost date, and the set was read again side by side.\n");
    const early = wo("--id", "ad-concepts", "--layer", "premises", "--repair", "2", "--notes", notes);
    assert.equal(early.code, 1);
    assert.match(early.out, /already has a "Repair \(review 2\):" paragraph .* written before the layer was reopened/);
    // 3. The record: a layer the findings name is reopened after the review opened and has its repair paragraph.
    const stamp = (id, n) => `<!-- opened: ad-concepts/${id} 2026-11-15T09:${String(10 + n).padStart(2, "0")}:00Z -->`;
    const body = (id) => (id === "fundamentals" ? `Read to the last line: ${c.load.join(", ")}; the channel note, each to its end.\n${EXAMPLES}` : `Result of the ${id} layer, written when it was reached: what was built, compared and rejected, and what the check found.`);
    const write = (name, { restamp = [], repairs = [], tail = [], recheck = 1, skipRc = [], wholeLate = false } = {}) => {
      // Layers after premises, already open, say they were re-checked for review 1 (the review layer carries the fresh review).
      const rc = (id) => (ids.indexOf(id) > ids.indexOf("premises") && id !== "review" && !restamp.includes(id) && !skipRc.includes(id) && recheck ? [`Re-checked (review ${recheck}): the repaired premise was read again against this layer's result.`] : []);
      const wholeStamp = wholeLate ? "<!-- opened: ad-concepts/whole 2026-11-15T09:50:00Z -->" : stamp("whole", ids.length);
      const wholeRc = skipRc.includes("whole") || !recheck ? [] : ["", "## whole", `Re-checked (review ${recheck}): the set was read again after the premise repair.`];
      const lines = ["# Notes", ...ids.flatMap((id, n) => [stamp(id, n), `## ${id}`, body(id), ...(restamp.includes(id) ? [`<!-- reopened: ad-concepts/${id} review 1 2026-11-15T09:40:00Z -->`] : []), ...(repairs.includes(id) ? ["Repair (review 1): the second premise now carries the offer's end date, and the set was read again side by side."] : []), ...rc(id), ""]), wholeStamp, ...wholeRc, ...tail];
      writeNotes(fs, path.join(tmp, name), lines.join("\n"));
      return path.join(tmp, name);
    };
    const SCORES = "audience: any; register: at register beside the owner's frost caption example; hook: 4, the frost image stops the scroll; glance: 4, offer reads in a second; one job: 4, one promise only; proof: 3, proof row 2 stated plainly";
    const rec = (notesFile, { premises = "fail, then pass", cast = "pass", claimsV = "pass", rev } = {}) => `Layers (ad-concepts): fundamentals pass (every Load first file read to its end) · premises ${premises} (closest earlier: the spring ad for the same kit leads on price, this idea on frost; five compared, three rejected; the end date added after review) · cast-treatment ${cast} (hands only; illustrated rejected) · visual-stop pass (frame read with copy hidden) · connection pass (read start to end) · claims ${claimsV} (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against proof rows) · ${rev || `review fail, then pass (reviewer: fresh agent given the brief word for word; findings: 2 blocking [premises], all repaired; reviewed: concepts-v1.md; after review: nothing changed; ${SCORES})`} · whole pass (set read as the operator sees it). State: concept-ready. Notes: ${notesFile}\n`;
    const noStamp = check("r1.md", rec(write("n1.md", { repairs: ["premises"] })));
    assert.equal(noStamp.code, 1);
    assert.match(noStamp.out, /findings send work back to "premises", but the notes have no "reopened: ad-concepts\/premises review <N>" line .* --layer premises --repair <review number>/);
    const noRepair = check("r2.md", rec(write("n2.md", { restamp: ["premises"] })));
    assert.equal(noRepair.code, 1);
    assert.match(noRepair.out, /"premises", but its notes section has no repair paragraph; .*"Repair \(review <N>\):/);
    // After a repair, each later layer already open is reopened for that review or says "Re-checked (review N):".
    const noRc = check("rc1.md", rec(write("rc1n.md", { restamp: ["premises"], repairs: ["premises"], skipRc: ["claims"] })));
    assert.equal(noRc.code, 1);
    assert.match(noRc.out, /layer "premises" was reopened for review 1 while layer "claims", later in the work order, was already open; reopen "claims" too \(.*--layer claims --repair 1 .*\), or write under a heading with "claims" a line "Re-checked \(review 1\):/);
    assert.equal((noRc.out.match(/while layer "claims", later in the work order/g) || []).length, 1, "one finding per later layer and review");
    assert.match(check("rc2.md", rec(write("rc2n.md", { restamp: ["premises"], repairs: ["premises"], recheck: 2 }))).out, /reopen "cast-treatment" too/, "another review's number does not count");
    const reopenedInstead = check("rc3.md", rec(write("rc3n.md", { restamp: ["premises", "claims"], repairs: ["premises", "claims"] }), { claimsV: "fail, then pass" }));
    assert.equal(reopenedInstead.code, 0, reopenedInstead.out);
    // A layer opened after the repair needs no line; the review layer, which carries the fresh review, never does.
    const late = check("rc4.md", rec(write("rc4n.md", { restamp: ["premises"], repairs: ["premises"], skipRc: ["whole"], wholeLate: true })));
    assert.equal(late.code, 0, late.out);
    const both = check("r3.md", rec(write("n3.md", { restamp: ["premises"], repairs: ["premises"] })));
    assert.equal(both.code, 0, both.out);
    // --record on a pass prints the reply's closing line and the Layers rule.
    assert.match(both.out, /End the reply with: State: concept-ready\. Record: .*r3\.md/);
    assert.match(both.out, /A Layers \(\.\.\.\) line in the reply is only ever the full one-line record, and must pass --record -/);
    const unstamped = check("r3a.md", rec(write("n3a.md", { restamp: ["premises"], repairs: ["premises", "connection"] })));
    assert.equal(unstamped.code, 1);
    assert.match(unstamped.out, /layer "connection" has a "Repair \(review 1\):" paragraph but no "reopened: ad-concepts\/connection review 1" line/);
    // The repair written at the end of the file, under the heading --repair adds, counts for that layer; under another layer's heading it does not.
    const PARA = "Repair (review 1): the second premise now carries the offer's end date, and the set was read again side by side.";
    const atEnd = check("r3b.md", rec(write("n3b.md", { tail: ["", "## premises: repair 1", "<!-- reopened: ad-concepts/premises review 1 2026-11-15T09:40:00Z -->", PARA] })));
    assert.equal(atEnd.code, 0, atEnd.out);
    const elsewhere = check("r3c.md", rec(write("n3c.md", { tail: ["<!-- reopened: ad-concepts/premises review 1 2026-11-15T09:40:00Z -->", "", "## connection: repair 1", PARA] })));
    assert.equal(elsewhere.code, 1);
    assert.match(elsewhere.out, /"premises", but its notes section has no repair paragraph/);
    const plain = check("r4.md", rec(write("n4.md", { restamp: ["premises", "cast-treatment"], repairs: ["premises", "cast-treatment"] })));
    assert.equal(plain.code, 1);
    assert.match(plain.out, /layer "cast-treatment" was reopened for a repair .* recorded as a plain pass/);
    // 4. After the last allowed review the only repair is a cut; new words re-checked by the maker still fail.
    const n5 = write("n5.md", { restamp: ["premises"], repairs: ["premises"] });
    const cutRev = (after) => `review fail, then pass (reviewer: fresh agent given the brief word for word; findings: 2 blocking [premises], all repaired; reviewed: concepts-v3.md; after review: ${after}; ${SCORES})`;
    assert.equal(check("r5.md", rec(n5, { rev: cutRev('cut: "Frost does not wait." (finding 2)') })).code, 0);
    const unquoted = check("r5b.md", rec(n5, { rev: cutRev("cut: the second sentence of the body (finding 2)") }));
    assert.equal(unquoted.code, 1);
    assert.match(unquoted.out, /records a cut without quoting it/);
    const rewritten = check("r6.md", rec(n5, { rev: cutRev("headline rewritten, re-checked by the maker") }));
    assert.equal(rewritten.code, 1);
    assert.match(rewritten.out, /passes on a fresh review, but text changed after it/);
    // 5. Once a review has run, its row tells the review's story on any verdict; only pending is exempt.
    const nc = (ev) => rec("none (cannot write files here)", { premises: "pass", rev: `review not checked (${ev})` }).replace("State: concept-ready", "State: not ready (review not checked)");
    const bare = check("r7.md", nc("three fresh reviews done; one sentence added after the last"));
    assert.equal(bare.code, 1);
    assert.match(bare.out, /layer "review" is not checked after a review, without these evidence items: "reviewer:", "reviewed:", "findings:", "after review:"/);
    assert.equal(check("r8.md", nc("three fresh reviews done; reviewer: fresh agent each time; reviewed: concepts-v3.md; findings: 9, then 7, then 2 blocking [premises], all repaired; after review: one sentence added after the last, re-checked by the maker only")).code, 0);
    assert.equal(check("r9.md", nc("pending fresh review")).code, 0);
    // 6. A reply whose record is in a file points at it; the reply's state must be the record's, and "reviewed" needs a passed review.
    const file = path.join(tmp, "ad.md");
    fs.writeFileSync(file, nc("pending fresh review"));
    assert.equal(pipe(`Two concepts below.\n\nState: not ready (review not checked). Record: ${file}\n`).code, 0);
    assert.match(pipe(`State: concept-ready. Record: ${file}\n`).out, /the reply says "State: concept-ready", but the record in .* supports "not ready"/);
    assert.match(pipe(`State: not ready, written and reviewed. Record: ${file}\n`).out, /the reply's state calls the work reviewed, but the record's review row is not checked/);
    assert.match(pipe("State: not ready. Record: no-such-record.md\n").out, /points at the record "no-such-record\.md", which was not found/);
    assert.match(check("r10.md", nc("pending fresh review").replace("State: not ready (review not checked)", "State: not ready, reviewed (review not checked)")).out, /the state calls the work reviewed, but layer "review" is not checked/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: a layer is written up after it is opened, and the finished file's check names what it saw", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-order-"));
  const check = (name, text) => { const f = path.join(tmp, name); fs.writeFileSync(f, text); return wo("--record", f); };
  const pipe = (input) => { const r = spawnSync(process.execPath, [path.join(scripts, "workorder.mjs"), "--record", "-"], { encoding: "utf8", input, cwd: tmp }); return { code: r.status, out: r.stdout + r.stderr }; };
  const SEC = (id) => `\n## ${id}\nResult of the ${id} layer, written when it was reached: what was built, compared and rejected, and what the check found.\n`;
  const count = (f) => (fs.readFileSync(f, "utf8").match(/<!-- opened: /g) || []).length;
  try {
    // 1. The gate: a never-opened layer whose section is already in the notes is refused, with no stamp.
    const notes = path.join(tmp, "notes.md");
    assert.equal(wo("--id", "ad-concepts", "--layer", "fundamentals", "--notes", notes).code, 0);
    fs.appendFileSync(notes, SEC("fundamentals") + SEC("premises"));
    const early = wo("--id", "ad-concepts", "--layer", "premises", "--notes", notes);
    assert.equal(early.code, 1);
    assert.match(early.out, /Layer "premises" was never opened, but .* already holds a section for it.*remove what was written, open "premises", read what it prints/);
    assert.equal(count(notes), 1);
    assert.equal(count(`${notes}.opened`), 1);
    fs.writeFileSync(notes, fs.readFileSync(notes, "utf8").replace(SEC("premises"), ""));
    assert.equal(wo("--id", "ad-concepts", "--layer", "premises", "--notes", notes).code, 0);
    // An earlier work order's section of the same layer id does not block this one.
    const two = path.join(tmp, "two.md");
    assert.equal(wo("--id", "ad-concepts", "--layer", "fundamentals", "--notes", two).code, 0);
    fs.appendFileSync(two, SEC("fundamentals"));
    assert.equal(wo("--id", "ad-concepts", "--layer", "premises", "--notes", two).code, 0);
    fs.appendFileSync(two, SEC("premises"));
    assert.equal(wo("--id", "ad-copy", "--layer", "fundamentals", "--notes", two).code, 0);
    fs.appendFileSync(two, SEC("fundamentals"));
    const again = wo("--id", "ad-copy", "--layer", "premises", "--notes", two);
    assert.equal(again.code, 0, again.out);
    // 4. The --repair refusal says not to save the later layer's changes yet.
    const rep = path.join(tmp, "rep.md");
    assert.equal(wo("--id", "ad-concepts", "--layer", "fundamentals", "--notes", rep).code, 0);
    fs.appendFileSync(rep, SEC("fundamentals"));
    assert.equal(wo("--id", "ad-concepts", "--layer", "premises", "--notes", rep).code, 0);
    fs.appendFileSync(rep, SEC("premises"));
    assert.equal(wo("--id", "ad-concepts", "--layer", "fundamentals", "--repair", "1", "--notes", rep).code, 0);
    assert.match(wo("--id", "ad-concepts", "--layer", "premises", "--repair", "1", "--notes", rep).out, /do not save this layer's changes to the output until this layer is reopened/);
    // 2 and 3. The record: a section above its own opened line fails; the ledger must be there and hold every stamp.
    const c = (await import("../workorder.mjs")).loadMap(hubRoot).work_orders.find((o) => o.id === "claims-check");
    const ids = [...c.layers.map((l) => l.id), "whole"];
    const stamp = (id, n) => `<!-- opened: claims-check/${id} 2026-11-16T09:${String(10 + n).padStart(2, "0")}:00Z -->`;
    const body = (id) => (id === "claims-list" ? `Read to the last line: ${c.load.join(", ")}; the channel note, each to its end.\n${EXAMPLES}` : `Result of the ${id} layer, written when it was reached: what was built, compared and rejected, and what the check found.`);
    const notesText = (swap) => ["# Notes", ...ids.flatMap((id, n) => (swap && id === "report" ? [`## ${id}`, body(id), stamp(id, n)] : [stamp(id, n), `## ${id}`, body(id)]))].join("\n") + "\n";
    const rec = (f) => ["## Layer record", "Work order: claims-check", `Notes: ${f}`, "| Layer | Verdict | Evidence | Fix |", "| --- | --- | --- | --- |", ...c.layers.map((l) => `| ${l.id} | pass | the ${l.id} result read line by line in the notes |  |`), "| whole | pass | the report read top to bottom |  |", "State: checked, clean", ""].join("\n");
    const inOrder = path.join(tmp, "in.md");
    writeNotes(fs, inOrder, notesText(false));
    assert.equal(check("r-in.md", rec(inOrder)).code, 0, check("r-in.md", rec(inOrder)).out);
    const above = path.join(tmp, "above.md");
    writeNotes(fs, above, notesText(true));
    const a = check("r-above.md", rec(above));
    assert.equal(a.code, 1);
    assert.match(a.out, /layer "report" has its section \("report"\) above its own "opened:" line/);
    fs.rmSync(`${inOrder}.opened`);
    const noLedger = check("r-noled.md", rec(inOrder));
    assert.equal(noLedger.code, 1);
    assert.match(noLedger.out, /there is no ledger beside the notes file/);
    writeNotes(fs, inOrder, notesText(false));
    fs.writeFileSync(`${inOrder}.opened`, fs.readFileSync(`${inOrder}.opened`, "utf8").replace(stamp("policy", 2) + "\n", ""));
    const typed = check("r-typed.md", rec(inOrder));
    assert.equal(typed.code, 1);
    assert.match(typed.out, /the notes hold "<!-- opened: claims-check\/policy .*", which the ledger does not; stamps are written by the tool, never typed/);
    writeNotes(fs, inOrder, notesText(false));
    const restored = fs.readFileSync(inOrder, "utf8").replace(stamp("policy", 2), "").replace("## policy", `${stamp("policy", 2)}\n## policy`);
    fs.writeFileSync(inOrder, restored);
    assert.equal(check("r-restored.md", rec(inOrder)).code, 0, "a hand-restored stamp identical to the ledger's passes");
    // B1. The finished file's check names the feed size, what the image says alone, the safe zones and Finish.
    const static_ = (rr) => ["## Layer record", "Work order: static-ad", "Notes: none (cannot write files here)", "| Layer | Verdict | Evidence | Fix |", "| --- | --- | --- | --- |",
      "| fundamentals | pass | every Load first file and the channel note read to the last line |  |", "| premises | pass | closest earlier: the spring ad for the same kit leads on price, this idea on frost; five premises, three rejected |  |", "| cast-treatment | pass | hands only; illustrated rejected |  |", "| visual-stop | pass | frame read with copy hidden |  |", "| connection | pass | read start to end |  |", "| claims | pass | condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against proof rows |  |",
      "| copy | pass | own words: \"Frost comes early this year\" beside \"Beat the early frost\": new; corrections: the owner's two channel corrections quoted, both followed |  |",
      "| review | pass | reviewer: fresh agent given the brief word for word; findings: three, none blocking; reviewed: draft v1; after review: nothing changed; audience: any; register: at register beside the owner's frost caption example; hook: 4, the frost image stops the scroll; glance: 4, offer reads in a second; one job: 4, one promise only; proof: 3, proof row 2 stated plainly |  |",
      "| destination | pass | the live page opened beside the ad, same offer and date |  |", "| production | pass | the 1080x1350 file opened, on-image text read against the copy letter by letter |  |", `| render-review | pass | ${rr} |  |`, "| whole | pass | the ad as a buyer sees it in feed |  |", "State: creative-ready", ""].join("\n");
    const FULL = "feed size: 1080x1350 viewed at 390 px wide; copy hidden: a frost-bitten seedling beside a covered one, the kit reads as the cover; safe zones: headline and logo inside the 4:5 safe area; finish: 4, the only shape asked for, inspected at feed size";
    const noFinish = check("s1.md", static_(FULL.replace(/; finish: .*$/, "")));
    assert.equal(noFinish.code, 1);
    assert.match(noFinish.out, /layer "render-review" passes without these evidence items: "finish:"/);
    const full = check("s2.md", static_(FULL));
    assert.equal(full.code, 0, full.out);
    // B2. A reply with a State: line and nothing to check is told how to end.
    assert.match(pipe("Three ads below.\n\nState: copy-ready\n").out, /end the reply with "State: <state>\. Record: <path>"/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: what a layer wrote stays written once the next layer opens", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const { loadMap, sealCopy } = await import("../workorder.mjs");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-seal-"));
  const c = loadMap(hubRoot).work_orders.find((o) => o.id === "claims-check");
  const check = (name, text) => { const f = path.join(tmp, name); fs.writeFileSync(f, text); return wo("--record", f); };
  const body = (id) => (id === "claims-list" ? `Read to the last line: ${c.load.join(", ")}; the channel note, each to its end.\n${EXAMPLES}` : `Result of the ${id} layer, written when it was reached: what was built, compared and rejected, and what the check found.`);
  const rec = (f) => ["## Layer record", "Work order: claims-check", `Notes: ${f}`, "| Layer | Verdict | Evidence | Fix |", "| --- | --- | --- | --- |", ...c.layers.map((l) => `| ${l.id} | pass | the ${l.id} result read line by line in the notes |  |`), "| whole | pass | the report read top to bottom |  |", "State: checked, clean", ""].join("\n");
  const build = (name) => {
    const f = path.join(tmp, name);
    for (const l of [...c.layers.map((x) => x.id), "whole"]) {
      const r = wo("--id", "claims-check", "--layer", l, "--notes", f);
      assert.equal(r.code, 0, r.out);
      if (l !== "whole") fs.appendFileSync(f, `\n## ${l}\n${body(l)}\n`);
    }
    return f;
  };
  const [L1, L2] = c.layers.map((l) => l.id);
  try {
    // 1. Opening layer 2 seals layer 1 and keeps a copy; opening layer 3 seals layer 2 and leaves layer 1's seal alone.
    const f = path.join(tmp, "n.md");
    assert.equal(wo("--id", "claims-check", "--layer", L1, "--notes", f).code, 0);
    fs.appendFileSync(f, `\n## ${L1}\n${body(L1)}\n`);
    const before = fs.readFileSync(f, "utf8");
    const open2 = wo("--id", "claims-check", "--layer", L2, "--notes", f);
    assert.match(open2.out, new RegExp(`^Sealed: ${L1}\\. Their sections are now added to below, never rewritten\\.`));
    const led1 = fs.readFileSync(`${f}.opened`, "utf8");
    assert.match(led1, new RegExp(`<!-- sealed: claims-check/${L1} [0-9a-f]{16} \\d+ \\S+Z -->`));
    assert.ok(fs.existsSync(sealCopy(f, "claims-check", L1)));
    assert.equal(fs.readFileSync(f, "utf8").replace(before, "").trim().split("\n").filter((l) => !l.includes("<!-- mark:")).length, 1, "the notes gain only the stamp (and the mark the agent copied)");
    fs.appendFileSync(f, `\n## ${L2}\n${body(L2)}\n`);
    wo("--id", "claims-check", "--layer", c.layers[2].id, "--notes", f);
    const led2 = fs.readFileSync(`${f}.opened`, "utf8");
    assert.equal((led2.match(new RegExp(`sealed: claims-check/${L1} `, "g")) || []).length, 1);
    assert.match(led2, new RegExp(`sealed: claims-check/${L2} `));
    assert.ok(led2.includes(led1.match(/<!-- sealed:[^>]*-->/)[0]), "layer 1's seal stands as it was");
    // 2. A changed sealed section fails, naming the layer and the copy; added text passes; restored text passes.
    const g = build("g.md");
    assert.equal(check("r0.md", rec(g)).code, 0, check("r0.md", rec(g)).out);
    const orig = fs.readFileSync(g, "utf8");
    fs.writeFileSync(g, orig.replace("what was built, compared and rejected", "what was built, weighed and rejected"));
    const swapped = check("r1.md", rec(g));
    assert.equal(swapped.code, 1);
    assert.match(swapped.out, new RegExp(`layer "${L2}" was sealed when the next layer opened, and its section has changed since \\(sealed copy: .*${L2}\\.md\\)`));
    fs.writeFileSync(g, orig.replace(`${EXAMPLES}\n`, ""));
    assert.equal(check("r2.md", rec(g)).code, 1, "a removed line fails");
    // A record dated the day after its seals is still checked; there is no date exemption.
    fs.writeFileSync(g, orig.replace("what was built, compared and rejected", "what was built, weighed and rejected"));
    assert.match(check("r2b.md", rec(g).replace("Work order: claims-check", "Work order: claims-check\nDate: 2099-01-01")).out, /was sealed when the next layer opened/);
    // Seals are for scratch notes: a record kept in its own notes file (the output's own file) is not seal-checked.
    const ownFile = path.join(tmp, "own.md");
    fs.writeFileSync(ownFile, `${fs.readFileSync(g, "utf8")}\n${rec(ownFile)}`);
    fs.copyFileSync(`${g}.opened`, `${ownFile}.opened`);
    const ownCheck = wo("--record", ownFile);
    assert.doesNotMatch(ownCheck.out, /was sealed when the next layer opened/);
    // A record dated before today whose scratch notes are gone is checked on its rows alone, and says so.
    const goneRec = (d) => rec(path.join(tmp, "gone-notes.md")).replace("Work order: claims-check", `Work order: claims-check\nDate: ${d}`);
    const earlier = check("r-gone.md", goneRec("2026-01-02"));
    assert.equal(earlier.code, 0, earlier.out);
    assert.match(earlier.out, /NOTE  layer record at line 1 is an earlier record \(dated 2026-01-02\) whose notes file ".*gone-notes\.md" is gone; its rows were checked as written/);
    const todays = check("r-today.md", goneRec(new Date().toISOString().slice(0, 10)));
    assert.equal(todays.code, 1);
    assert.match(todays.out, /the notes file ".*gone-notes\.md" was not found/);
    // The tool does not seal a file it can tell is an output: it already holds a layer record.
    const out = path.join(tmp, "out.md");
    fs.writeFileSync(out, "# Ad draft\n\n## Layer record\nWork order: claims-check\n");
    assert.equal(wo("--id", "claims-check", "--layer", L1, "--notes", out).code, 0);
    fs.appendFileSync(out, `\n## ${L1}\n${body(L1)}\n`);
    assert.doesNotMatch(wo("--id", "claims-check", "--layer", L2, "--notes", out).out, /^Sealed:/);
    assert.doesNotMatch(fs.readFileSync(`${out}.opened`, "utf8"), /sealed:/);
    fs.writeFileSync(g, orig.replace(`## ${L2}\n`, `Read later, while ${L2} was open: the policy notes again, to the last line.\n\n## ${L2}\n`));
    assert.equal(check("r3.md", rec(g)).code, 0, "text added below a sealed section passes");
    fs.writeFileSync(g, orig);
    assert.equal(check("r4.md", rec(g)).code, 0, "restored text passes");
    // 5. A notes file rewritten wholesale with the same text (line-end whitespace aside) passes.
    fs.writeFileSync(g, orig.split("\n").map((x) => (x.startsWith("Result") ? `${x}   ` : x)).join("\n") + "\n\n");
    assert.equal(check("r5.md", rec(g)).code, 0);
    // 3. A layer with a reopened stamp is exempt from its seal.
    fs.writeFileSync(g, orig.replace(`## ${L2}\n${body(L2)}`, `## ${L2}\nRewritten after the review: ${body(L2)}`));
    assert.equal(check("r6.md", rec(g)).code, 1);
    assert.equal(wo("--id", "claims-check", "--layer", L2, "--repair", "1", "--notes", g).code, 0);
    fs.appendFileSync(g, "Repair (review 1): the second claim now carries its condition, and the proof row was read again after.\n");
    assert.doesNotMatch(check("r7.md", rec(g)).out, /was sealed when the next layer opened/);
    // 6. A ledger with no sealed lines passes as before.
    const h = build("h.md");
    fs.writeFileSync(`${h}.opened`, fs.readFileSync(`${h}.opened`, "utf8").split("\n").filter((x) => !x.includes("sealed:")).join("\n"));
    fs.writeFileSync(h, fs.readFileSync(h, "utf8").replace("what was built, compared and rejected", "what was built, weighed and rejected"));
    assert.equal(check("r8.md", rec(h)).code, 0);
    // 4. A correction added below a sealed loading section answers an earlier part read.
    const r = loadMap(hubRoot).work_orders.find((o) => o.id === "readiness");
    const rIds = r.layers.map((l) => l.id);
    const m = path.join(tmp, "m.md");
    assert.equal(wo("--id", "readiness", "--layer", rIds[0], "--notes", m).code, 0);
    fs.appendFileSync(m, `\n## ${rIds[0]}\nRead to the last line: ${r.load.join(", ")}, each to its end.\nbrief.md: lines 1-40 of 90.\nExamples: none, the business keeps no channel rules for this.\n`);
    for (const l of [...rIds.slice(1), "whole"]) { wo("--id", "readiness", "--layer", l, "--notes", m); if (l !== "whole") fs.appendFileSync(m, `\n## ${l}\n${body(l)}\n`); }
    const rRec = ["## Layer record", "Work order: readiness", `Notes: ${m}`, "| Layer | Verdict | Evidence | Fix |", "| --- | --- | --- | --- |", ...rIds.map((l) => `| ${l} | pass | the ${l} result read line by line in the notes |  |`), "| whole | pass | the readiness file read top to bottom |  |", "State: recorded, no live gaps here", ""].join("\n");
    const bad = check("r9.md", rRec);
    assert.match(bad.out, /say a file was read in part \("brief\.md: lines 1-40 of 90/);
    fs.writeFileSync(m, fs.readFileSync(m, "utf8").replace(`\n## ${rIds[1]}\n`, `\nRead later, while ${rIds[1]} was open: brief.md (90 lines), to its last line.\n\n## ${rIds[1]}\n`));
    const fixed = check("r10.md", rRec);
    assert.doesNotMatch(fixed.out, /say a file was read in part/);
    assert.doesNotMatch(fixed.out, /was sealed when the next layer opened/, "the correction is added below the sealed text");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: a printout is read to its mark, and a re-check is made through the tool", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const { createHash } = await import("node:crypto");
  const { loadMap, MARK_SENTENCE } = await import("../workorder.mjs");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-mark-"));
  const run2 = (...a) => { const r = spawnSync(process.execPath, [path.join(scripts, "workorder.mjs"), ...a], { encoding: "utf8" }); return { code: r.status, out: r.stdout + r.stderr }; };
  const markOf = answerOf;
  const stampCount = (f) => (fs.readFileSync(`${f}.opened`, "utf8").match(/<!-- (?:re)?opened:|<!-- rechecked:/g) || []).length;
  const check = (name, text) => { const f = path.join(tmp, name); fs.writeFileSync(f, text); return woRaw("--record", f); };
  const map = loadMap(hubRoot);
  const cc = map.work_orders.find((o) => o.id === "claims-check");
  const ac = map.work_orders.find((o) => o.id === "ad-concepts");
  const long = (id) => `Result of the ${id} layer, written as an agent writes it, in one long paragraph line: what was built and what was compared and rejected, which source lines were opened and quoted, and what the check found when it was answered from the evidence the layer names, with nothing left for later.`;
  try {
    // A1. No mark is handed over; one question in the middle names the Check line and two other labeled lines (never one
    // ending in a line count); questions vary; the ledger keeps a hash with "asked" and no word of the answer.
    const n1 = path.join(tmp, "a1.md");
    const p1 = run2("--id", "claims-check", "--layer", "claims-list", "--notes", n1);
    assert.equal(p1.code, 0, p1.out);
    const lines = p1.out.split("\n");
    assert.equal(lines.filter((l) => /<!-- mark: [A-Z]+-\d{2} -->/.test(l)).length, 0, "no mark is handed over");
    const qs = lines.filter((l) => l.startsWith("Mark for this printout:"));
    assert.equal(qs.length, 1);
    const at = lines.indexOf(qs[0]);
    assert.ok(at > 0 && at < lines.length - 1 && at >= Math.floor(lines.length / 4) && at <= Math.ceil((lines.length * 3) / 4), `question at ${at} of ${lines.length}`);
    assert.match(qs[0], /\*\*Check\*\* line/);
    assert.equal((qs[0].match(/the last word of the \*\*/g) || []).length, 3);
    assert.doesNotMatch(qs[0], /\*\*Method\*\* line/, "a line ending in a line count is never asked");
    assert.match(qs[0], /letters and digits only; case does not matter/);
    assert.ok(lines.slice(0, 3).join("\n").includes(MARK_SENTENCE));
    const led = fs.readFileSync(`${n1}.opened`, "utf8");
    assert.match(led, /<!-- mark: claims-check\/claims-list [0-9a-f]{16} \S+Z asked -->/);
    for (const w of answerOf(p1.out).replace(/<!-- mark: | -->/g, "").split(" ")) assert.ok(!led.toLowerCase().includes(` ${w.toLowerCase()} `), "no word of the answer in the ledger");
    const asked = new Set();
    for (let k = 0; k < 10; k++) asked.add(run2("--id", "claims-check", "--layer", "claims-list", "--notes", n1).out.split("\n").find((l) => l.startsWith("Mark for this printout:")));
    assert.ok(asked.size >= 2, "questions change from printout to printout");
    // A2. The next layer waits for the right words, in the right order; case and punctuation do not matter.
    const sec = (f, id, mark) => fs.appendFileSync(f, `\n## ${id}\n${mark ? `${mark}\n` : ""}${id === cc.layers[0].id ? `Read to the last line: ${cc.load.join(", ")}.\n${EXAMPLES}\n` : ""}${long(id)}\n`);
    const n2 = path.join(tmp, "a2.md");
    const wordsOf = (out) => answerOf(out).replace(/<!-- mark: | -->/g, "").split(" ");
    const mw = (w) => String(w).toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
    // The question is picked at random: print the open layer again (never refused) until its three words differ,
    // so that a swapped order is a wrong answer. A mark line reads whatever words it carries ("<date>.md", "n/a.").
    let o2 = run2("--id", "claims-check", "--layer", "claims-list", "--notes", n2);
    for (let k = 0; k < 30 && new Set(wordsOf(o2.out).map(mw)).size < 3; k++) o2 = run2("--id", "claims-check", "--layer", "claims-list", "--notes", n2);
    sec(n2, "claims-list", null);
    const held = run2("--id", "claims-check", "--layer", "proof-map", "--notes", n2);
    assert.equal(held.code, 1);
    assert.match(held.out, /Layer "claims-list" has an unanswered stamp .* the mark under "claims-list" is missing or is not what its printout asked for\. Print the layer again .*--layer claims-list .*it asks a new question/);
    assert.equal(stampCount(n2), 1, "no stamp was written");
    const words = wordsOf(o2.out);
    assert.equal(new Set(words.map(mw)).size, 3, "three different words were asked");
    const tryMark = (m) => { const t0 = fs.readFileSync(n2, "utf8"); fs.appendFileSync(n2, `${m}\n`); const r = run2("--id", "claims-check", "--layer", "proof-map", "--notes", n2); if (r.code !== 0) fs.writeFileSync(n2, t0); return r.code; };
    assert.equal(tryMark(`<!-- mark: ${[words[1], words[0], words[2]].join(" ")} -->`), 1, "wrong order");
    assert.equal(tryMark(`<!-- mark: ${words[0]} ${words[1]} zebra -->`), 1, "one wrong word");
    assert.equal(tryMark("<!-- mark: CEDAR-11 -->"), 1, "the old form");
    assert.equal(tryMark(`<!-- mark: ${words.map((w) => `<${w.toUpperCase()}>/,`).join(" ")} -->`), 0, "case and punctuation do not matter, a slash or angle brackets included");
    const n2b = path.join(tmp, "a2b.md");
    run2("--id", "claims-check", "--layer", "claims-list", "--notes", n2b);
    sec(n2b, "claims-list", null);
    const again = run2("--id", "claims-check", "--layer", "claims-list", "--notes", n2b);
    assert.equal(again.code, 0, "printing an open layer is never refused");
    fs.appendFileSync(n2b, `${answerOf(again.out)}\n`);
    assert.equal(run2("--id", "claims-check", "--layer", "proof-map", "--notes", n2b).code, 0);
    // proof-map's question is not answered in n2: a repair is refused the same way.
    sec(n2, "proof-map", null);
    const repHeld = run2("--id", "claims-check", "--layer", "claims-list", "--repair", "1", "--notes", n2);
    assert.equal(repHeld.code, 1);
    assert.match(repHeld.out, /Layer "proof-map" has an unanswered stamp/);
    // A4 (part). Notes and a ledger of the version before (WORD-NN marks, no "asked") pass as they did.
    const nOld = path.join(tmp, "old.md");
    const hOld = (w) => createHash("sha256").update(w).digest("hex").slice(0, 16);
    const ids0 = [...cc.layers.map((l) => l.id), "whole"];
    fs.writeFileSync(nOld, ids0.map((id, k) => `<!-- opened: claims-check/${id} 2026-11-16T09:1${k}:00Z -->\n## ${id}\n<!-- mark: CEDAR-1${k} -->\n${id === cc.layers[0].id ? `Read to the last line: ${cc.load.join(", ")}.\n${EXAMPLES}\n` : ""}${id === "whole" ? "" : long(id)}\n`).join("\n"));
    fs.writeFileSync(`${nOld}.opened`, ids0.map((id, k) => `<!-- opened: claims-check/${id} 2026-11-16T09:1${k}:00Z -->\n<!-- mark: claims-check/${id} ${hOld(`CEDAR-1${k}`)} 2026-11-16T09:1${k}:00Z -->\n`).join(""));
    // A3 and A5. A record built through the tool, every mark copied below its section (seals hold), passes; one missing fails.
    const n3 = path.join(tmp, "a3.md");
    for (const id of [...cc.layers.map((l) => l.id), "whole"]) {
      const r = run2("--id", "claims-check", "--layer", id, "--notes", n3);
      assert.equal(r.code, 0, r.out);
      if (id === "whole") fs.appendFileSync(n3, `\n## whole\n${markOf(r.out)}\n`);
      else { sec(n3, id, null); fs.appendFileSync(n3, `${markOf(r.out)}\n`); }
    }
    const rec3 = (f, v = {}) => ["## Layer record", "Work order: claims-check", `Notes: ${f}`, "| Layer | Verdict | Evidence | Fix |", "| --- | --- | --- | --- |", ...cc.layers.map((l) => `| ${l.id} | ${v[l.id] || "pass"} | the ${l.id} result read line by line in the notes |  |`), "| whole | pass | the report read top to bottom |  |", "State: checked, clean", ""].join("\n");
    assert.equal(check("rold.md", rec3(nOld)).code, 0, "notes of the version before pass as they did");
    const ok3 = check("r3.md", rec3(n3));
    assert.equal(ok3.code, 0, ok3.out);
    const full3 = fs.readFileSync(n3, "utf8");
    const policyMark = full3.split("\n").find((l, i, all) => /<!-- mark:/.test(l) && all.slice(0, i).reverse().find((x) => /^## /.test(x)) === "## policy");
    fs.writeFileSync(n3, full3.replace(`${policyMark}\n`, ""));
    const miss3 = check("r3b.md", rec3(n3));
    assert.equal(miss3.code, 1);
    assert.match(miss3.out, /layer "policy" has an unanswered stamp \("<!-- opened: claims-check\/policy /);
    fs.writeFileSync(n3, full3);
    // A reopening needs its own mark: reopen report, write its repair, copy no mark.
    const rr = run2("--id", "claims-check", "--layer", "report", "--repair", "1", "--notes", n3);
    assert.equal(rr.code, 0, rr.out);
    fs.appendFileSync(n3, "Repair (review 1): the verdict table now names the second claim's proof row, and the table was read again after.\n");
    const miss3b = check("r3c.md", rec3(n3, { report: "fail, then pass" }));
    assert.match(miss3b.out, /layer "report" has an unanswered stamp \("<!-- reopened: claims-check\/report review 1 /);
    assert.doesNotMatch(miss3b.out, /was sealed when the next layer opened/);
    // A4. Notes from the version before (no mark line) are not held to marks for their older stamps; the next stamp is.
    const n4 = path.join(tmp, "a4.md");
    writeNotes(fs, n4, `<!-- opened: claims-check/claims-list 2026-11-15T09:10:00Z -->\n## claims-list\nRead to the last line: ${cc.load.join(", ")}.\n${EXAMPLES}\n${long("claims-list")}\n`);
    const old = run2("--id", "claims-check", "--layer", "proof-map", "--notes", n4);
    assert.equal(old.code, 0, old.out);
    sec(n4, "proof-map", null);
    assert.match(run2("--id", "claims-check", "--layer", "policy", "--notes", n4).out, /Layer "proof-map" has an unanswered stamp/);
    // B. ad-concepts built through the tool with every mark copied, then premises reopened for review 1.
    const body = (id) => (id === "fundamentals" ? `Read to the last line: ${ac.load.join(", ")}; the channel note, each to its end.\n${EXAMPLES}\n${long(id)}` : long(id));
    const build = (name, upto = "whole") => {
      const f = path.join(tmp, name);
      for (const id of [...ac.layers.map((l) => l.id), "whole"]) {
        const r = run2("--id", "ad-concepts", "--layer", id, "--notes", f);
        assert.equal(r.code, 0, r.out);
        fs.appendFileSync(f, id === "whole" ? `\n## whole\n${markOf(r.out)}\n` : `\n## ${id}\n${body(id)}\n${markOf(r.out)}\n`);
        if (id === upto) break;
      }
      return f;
    };
    const repair = (f, id = "premises", n = 1) => { const r = run2("--id", "ad-concepts", "--layer", id, "--repair", String(n), "--notes", f); assert.equal(r.code, 0, r.out); fs.appendFileSync(f, `Repair (review ${n}): the ${id} result now carries the offer's end date, and the set was read again side by side.\n${markOf(r.out)}\n`); };
    const recheck = (f, id, n = 1, line = true) => { const r = run2("--id", "ad-concepts", "--layer", id, "--recheck", String(n), "--notes", f); assert.equal(r.code, 0, r.out); fs.appendFileSync(f, `${line ? `Re-checked (review ${n}): premises now names the end date (its repair paragraph); the ${id} section was read again against it.\n` : ""}${markOf(r.out)}\n`); return r; };
    const SCORES = "audience: any; register: at register beside the owner's frost caption example; hook: 4, the frost image stops the scroll; glance: 4, offer reads in a second; one job: 4, one promise only; proof: 3, proof row 2 stated plainly";
    const recB = (f, v = {}) => `Layers (ad-concepts): fundamentals pass (every Load first file read to its end) · premises fail, then pass (closest earlier: the spring ad for the same kit leads on price, this idea on frost; five compared, three rejected; the end date added after review) · cast-treatment ${v["cast-treatment"] || "pass"} (hands only; illustrated rejected) · visual-stop pass (frame read with copy hidden) · connection pass (read start to end) · claims pass (condition: “Order by May 1”; shown in: the image, the headline and both primary texts; claims map against proof rows) · review fail, then pass (reviewer: fresh agent given the brief word for word; findings: 2 blocking [premises], all repaired, ${v.nb || "not blocking (review 1): none"}; reviewed: concepts-v1.md; after review: nothing changed; ${SCORES}) · whole pass (set read as the operator sees it). State: concept-ready. Notes: ${f}\n${v.tail || ""}`;
    const later = ["cast-treatment", "visual-stop", "connection", "claims", "whole"];
    // B1. --recheck refuses with no reopening upstream, on a layer never opened, and while the upstream repair is unwritten.
    const b1 = build("b1.md", "connection");
    assert.match(run2("--id", "ad-concepts", "--layer", "connection", "--recheck", "1", "--notes", b1).out, /no layer before it was reopened for review 1/);
    assert.match(run2("--id", "ad-concepts", "--layer", "claims", "--recheck", "1", "--notes", b1).out, /Layer "claims" was never opened/);
    const rp = run2("--id", "ad-concepts", "--layer", "premises", "--repair", "1", "--notes", b1);
    fs.appendFileSync(b1, `${markOf(rp.out)}\n`);
    assert.match(run2("--id", "ad-concepts", "--layer", "connection", "--recheck", "1", "--notes", b1).out, /layer "premises", earlier in the work order, was reopened for review 1 and has no "Repair \(review 1\):" paragraph/);
    fs.appendFileSync(b1, "Repair (review 1): the premise now carries the end date, and the set was read again side by side.\n");
    const rc1 = run2("--id", "ad-concepts", "--layer", "connection", "--recheck", "1", "--notes", b1);
    assert.equal(rc1.code, 0, rc1.out);
    assert.ok(rc1.out.includes(ac.layers.find((l) => l.id === "connection").check));
    assert.match(rc1.out, /Reopened for review 1, upstream: premises\./);
    assert.match(rc1.out, /begins "Re-checked \(review 1\):" and names what changed upstream and what was looked at here, by a file path or a quoted line/);
    // A5. The re-check printout carries the Check and Evidence lines with their labels, and its question names the Check line.
    assert.match(rc1.out, /^- \*\*Check:\*\* /m);
    assert.match(rc1.out, /^- \*\*Evidence:\*\* /m);
    assert.match(rc1.out.split("\n").find((l) => l.startsWith("Mark for this printout:")), /\*\*Check\*\* line/);
    assert.match(fs.readFileSync(b1, "utf8"), /\n## connection: re-check \(review 1\)\n<!-- rechecked: ad-concepts\/connection review 1 \S+Z -->\n$/);
    assert.match(fs.readFileSync(`${b1}.opened`, "utf8"), /<!-- rechecked: ad-concepts\/connection review 1 \S+Z -->/);
    // A2 for --recheck: refused while a stamp is unanswered (the repair's printout was not read to its mark).
    const b7 = build("b7.md", "connection");
    run2("--id", "ad-concepts", "--layer", "premises", "--repair", "1", "--notes", b7);
    fs.appendFileSync(b7, "Repair (review 1): the premise now carries the end date, and the set was read again side by side.\n");
    const rcHeld = run2("--id", "ad-concepts", "--layer", "connection", "--recheck", "1", "--notes", b7);
    assert.equal(rcHeld.code, 1);
    assert.match(rcHeld.out, /Layer "premises" has an unanswered stamp \("<!-- reopened: ad-concepts\/premises review 1 /);
    // B2. Neither: one finding per later layer, naming both layers and both commands.
    const b2 = build("b2.md");
    repair(b2);
    const none = check("rb1.md", recB(b2));
    assert.equal(none.code, 1);
    assert.equal((none.out.match(/while layer "cast-treatment", later in the work order/g) || []).length, 1);
    assert.match(none.out, /layer "premises" was reopened for review 1 while layer "cast-treatment", later in the work order, was already open; reopen "cast-treatment" too \(.*--layer cast-treatment --repair 1 .*\), or re-check it \(.*--layer cast-treatment --recheck 1 .*\)/);
    // A typed line with no stamp: a re-check is made through the tool.
    fs.appendFileSync(b2, "\n## cast-treatment, after review 1\nRe-checked (review 1): nothing here changed.\n");
    assert.match(check("rb2.md", recB(b2)).out, /layer "cast-treatment" has a "Re-checked \(review 1\):" line but no "rechecked: ad-concepts\/cast-treatment review 1" stamp; a re-check is made through the tool/);
    // Re-checked through the tool, every later layer: passes.
    const b3 = build("b3.md");
    repair(b3);
    for (const id of later) recheck(b3, id);
    const allOk = check("rb3.md", recB(b3));
    assert.equal(allOk.code, 0, allOk.out);
    // B2. What the last review did not block reaches the reply, each finding tagged [R<N>-<number>] outside the record.
    const noNb = check("nb0.md", recB(b3, { nb: "two open items" }));
    assert.match(noNb.out, /layer "review" gives "findings:" without its last part; end it with "not blocking \(review <N>\): <numbers, or none>"/);
    const nb = "not blocking (review 2): 3, 5";
    const neither = check("nb1.md", recB(b3, { nb }));
    assert.equal((neither.out.match(/lists findings of review 2 that were not blocking/g) || []).length, 1);
    assert.match(neither.out, /\[R2-3\], \[R2-5\] are not in the text checked; each goes in the reply as an open item in plain words ending with its tag \(this record was checked as a file: the open items sit in that file, outside the layer record, or pipe the whole reply with --record -\)/);
    assert.match(check("nb2.md", recB(b3, { nb, tail: "\nOpen: the second headline repeats a word from the first [R2-3].\n" })).out, /\[R2-5\] is not in the text checked/);
    assert.equal(check("nb3.md", recB(b3, { nb, tail: "\nOpen items:\n- The second headline repeats a word from the first [R2-3].\n- The card's last line could be shorter [R2-5].\n" })).code, 0);
    assert.equal(check("nb4.md", recB(b3, { nb: "not blocking (review 2): none" })).code, 0);
    assert.match(check("nb5.md", recB(b3, { nb }).replace("set read as the operator sees it", "set read as the operator sees it; open items [R2-3] [R2-5]")).out, /\[R2-3\], \[R2-5\] are not in the text checked/, "tags inside the record do not count");
    assert.equal(check("nb6.md", recB(b3, { nb: "not blocking (review 2): N1", tail: "\nOpen: the hook could carry the date [R2-N1].\n" })).code, 0);
    const piped = spawnSync(process.execPath, [path.join(scripts, "workorder.mjs"), "--record", "-"], { encoding: "utf8", input: `Three ads below.\n\nOpen: the second headline repeats a word [R2-3].\n${recB(b3, { nb: "not blocking (review 2): 3" })}` });
    assert.equal(piped.status, 0, piped.stdout);
    // The table form: a record is its own fields and rows, so open items under its State line, heading or not, are outside it.
    const asTable = (compact, tail) => {
      const body = compact.slice(compact.indexOf("): ") + 3, compact.indexOf(". State:"));
      const rows = [...body.matchAll(/([a-z-]+) (fail, then pass|pass) \((.*?)\)(?= · |$)/g)].map((m) => `| ${m[1]} | ${m[2]} | ${m[3]} | |`);
      return ["## Layer record", "Work order: ad-concepts", `Notes: ${b3}`, "| Layer | Verdict | Evidence | Fix |", "| --- | --- | --- | --- |", ...rows, "State: concept-ready", tail].join("\n");
    };
    const tabled = asTable(recB(b3, { nb }), "");
    assert.match(check("nbt0.md", tabled).out, /\[R2-3\], \[R2-5\] are not in the text checked/);
    const under = check("nbt1.md", asTable(recB(b3, { nb }), "\nOpen items:\n- The second headline repeats a word from the first [R2-3].\n- The card's last line could be shorter [R2-5].\n"));
    assert.equal(under.code, 0, under.out);
    assert.match(check("nbt2.md", tabled.replace("| set read as the operator sees it |", "| set read as the operator sees it [R2-3] [R2-5] |")).out, /\[R2-3\], \[R2-5\] are not in the text checked/, "tags inside a table row do not count");
    // B3. Not held to it: a ledger with no "asked" line, a pending row, a self-review, a record with Notes: none.
    assert.equal(check("nb7.md", recB(b3, { nb: "two open items" }).replace("reviewer: fresh agent given the brief word for word", "reviewer: self, no fresh agent can be started here")).code, 0);
    assert.equal(check("nb8.md", recB(b3, { nb: "two open items" }).replace(`Notes: ${b3}`, "Notes: none (cannot write files here)")).code, 0);
    // The later layer reopened instead: passes.
    const b4 = build("b4.md");
    repair(b4);
    repair(b4, "cast-treatment");
    for (const id of later.slice(1)) recheck(b4, id);
    const reopened = check("rb4.md", recB(b4, { "cast-treatment": "fail, then pass" }));
    assert.equal(reopened.code, 0, reopened.out);
    // A stamp for another review does not count.
    const b5 = build("b5.md");
    repair(b5);
    for (const id of later.slice(1)) recheck(b5, id);
    const r2 = createHash("sha256").update("QUILL-02").digest("hex").slice(0, 16);
    const t2 = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const st2 = `<!-- rechecked: ad-concepts/cast-treatment review 2 ${t2} -->`;
    fs.appendFileSync(`${b5}.opened`, `${st2}\n<!-- mark: ad-concepts/cast-treatment ${r2} ${t2} -->\n`);
    fs.appendFileSync(b5, `\n## cast-treatment: re-check (review 2)\n${st2}\nRe-checked (review 2): the frame was read again.\n<!-- mark: QUILL-02 -->\n`);
    assert.match(check("rb5.md", recB(b5)).out, /reopen "cast-treatment" too/);
    // B3. A layer opened after the repair needs nothing; the review layer never does.
    const b6 = build("b6.md", "review");
    repair(b6);
    for (const id of later.slice(0, -1)) recheck(b6, id);
    const w = run2("--id", "ad-concepts", "--layer", "whole", "--notes", b6);
    assert.equal(w.code, 0, w.out);
    fs.appendFileSync(b6, `\n## whole\n${markOf(w.out)}\n`);
    const lateOk = check("rb6.md", recB(b6));
    assert.equal(lateOk.code, 0, lateOk.out);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: every layer of every work order asks for its mark from its Check line", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const { loadMap } = await import("../workorder.mjs");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-walk-"));
  const sec = (id) => `\n## ${id}\nResult of the ${id} layer, written as it was reached: what was built, compared and rejected, and what the check found from the evidence opened.\n`;
  try {
    for (const o of loadMap(hubRoot).work_orders) {
      const f = path.join(tmp, `${o.id}.md`);
      const ids = [...o.layers.map((l) => l.id), "whole"];
      let prevAnswer = null;
      for (const [k, id] of ids.entries()) {
        if (k > 0) {
          const held = woRaw("--id", o.id, "--layer", id, "--notes", f);
          assert.equal(held.code, 1, `${o.id}/${id} opened before ${ids[k - 1]} was answered`);
          fs.appendFileSync(f, `${prevAnswer}\n`);
        }
        const r = woRaw("--id", o.id, "--layer", id, "--notes", f);
        assert.equal(r.code, 0, `${o.id}/${id}: ${r.out}`);
        const q = r.out.split("\n").find((l) => l.startsWith("Mark for this printout:"));
        assert.match(q || "", /\*\*Check\*\* line/, `${o.id}/${id} asks from its Check line`);
        prevAnswer = answerOf(r.out);
        if (id !== "whole") fs.appendFileSync(f, sec(id));
      }
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: a broken map fails the check", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-map-"));
  const hub = path.join(tmp, "hub");
  fs.cpSync(fx("hub"), hub, { recursive: true });
  fs.mkdirSync(path.join(hub, "core/_system"), { recursive: true });
  const layer = { id: "one", name: "One", build: "b", method: ["core/skills/ad-strategy/SKILL.md#no-such-heading"], check: "is it right", evidence: "e", on_fail: "f", returns_to: ["nowhere"], evidence_items: ["seen", "Seen"], reads: "yes" };
  const order = {
    id: "plan", name: "Plan", say: ["plan it"], owner: "rogue", load: ["core/skills/missing/SKILL.md"], record: "reply",
    layers: [layer], whole: { check: "ok?", evidence: "e", on_fail: "f" },
    recheck: [{ when: "x changes", redo: ["ghost"] }], states: [{ state: "done", needs: ["ghost"], must_pass: ["phantom"], means: "m" }], contains: ["nothing"],
  };
  fs.writeFileSync(path.join(hub, "core/_system/work-orders.json"), JSON.stringify({ version: 1, work_orders: [order] }));
  try {
    const r = wo("--hub", hub, "--check");
    assert.equal(r.code, 1);
    for (const want of [
      /owner "rogue" is not a built skill/,
      /load file not found: core\/skills\/missing\/SKILL\.md/,
      /method core\/skills\/ad-strategy\/SKILL\.md#no-such-heading: no heading/,
      /"check" is one question and ends with a question mark/,
      /returns_to names unknown layer "nowhere"/,
      /recheck names unknown layer "ghost"/,
      /state "done" needs unknown layer "ghost"/,
      /state "done" must_pass names "phantom", which is not in its needs/,
      /names unknown work order "nothing"/,
      /skill ad-strategy owns no work order/,
      /evidence item "seen" appears twice/,
      /"reads" is true or false/,
    ]) assert.match(r.out, want);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("work orders: pointers in a business repo carry the staged-work step", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "adhub-pointer-"));
  try {
    const r = spawnSync(process.execPath, [path.join(hubRoot, "install/adhub-skills.mjs"), "--root", tmp], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
    const text = fs.readFileSync(path.join(tmp, ".claude/skills/adhub-ad-creative/SKILL.md"), "utf8");
    assert.match(text, /workorder\.mjs --for "<the request>"/);
    assert.match(text, /This skill owns: .*ad-concepts.*static-ad/);
    assert.match(text, /Do not draft\s+the finished output and check it afterward/);
    const steps = [...text.matchAll(/^(\d)\. /gm)].map((m) => Number(m[1]));
    assert.deepEqual(steps, steps.map((_, i) => i + 1), "pointer steps are numbered in order");
    const live = fs.readFileSync(path.join(tmp, ".claude/skills/adhub-ad-launch/SKILL.md"), "utf8");
    const liveSteps = [...live.matchAll(/^(\d)\. /gm)].map((m) => Number(m[1]));
    assert.deepEqual(liveSteps, [1, 2, 3, 4, 5, 6]);
    assert.match(live, /5\. Before anything reaches an ad account/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("staged work: the contract keeps its rules explicit", async () => {
  const { readFileSync } = await import("node:fs");
  const text = readFileSync(path.join(hubRoot, "core/_system/staged-work.md"), "utf8");
  for (const rule of [/One layer, one question/, /Do not draft the finished piece and check it afterward/, /Evidence is something that was looked at/, /`n\/a` with the reason/, /`not checked` with the reason/, /does not pass its parent/, /dependents lose their pass/, /not a request for the operator to\s+approve each step/, /Three reviews and one closing re-check/, /never padded/, /Tested structure is not tested performance/, /Naming a gap is a pass/, /One verdict per row/, /`carried`/, /a pass whose evidence says the check was not made is a `not checked`/, /emergency stop covers only/]) {
    assert.match(text, rule);
  }
  // Stamps are read, never repaired; the brief's last line says what blocking means.
  assert.doesNotMatch(text, /real time between/);
  assert.match(text, /Blocking is only: a fact, price, date, condition, claim or word/);
  // Round five: register is a verdict and blocks; the last review is named; a changed word is not a cut; every re-check runs the facts check on the whole output.
  assert.match(text, /a piece `below register`; a rubric score below its floor/);
  assert.match(text, /`at register`\s+>?\s*or `below register`/);
  assert.match(text, /A change to any word that remains,\s+grammar included, is not a cut/);
  assert.match(text, /runs checks 2 and 5 on the\s+whole output \(a repair can move a sentence into an unchanged field;[^)]*\), checks 3 and 4 on the\s+changed lines only/);
  assert.match(text, /earlier\s+ads for the same offer or service/);
  // A closing re-check after the last allowed review, and which review is the last; client claim; the reviewer names what it was not given.
  assert.match(text, /a closing re-check by a fresh\s+agent reads only those lines against their findings, plus checks 2 and 5 on the whole output/);
  assert.match(text, /The\s+last review is the closing re-check when one ran, otherwise the review that ended the loop\s+with nothing blocking/);
  assert.match(text, /is `client claim` \(source and line\), not `reworded`/);
  assert.match(text, /`client claim: <source\s+>\s+and line>`/);
  assert.match(text, /name any file\s+>\s+the maker's notes say was read that is not among your paths; that is a finding/);
  assert.match(text, /The paths are every path\s+under the loading layer's heading in the notes/);
  // A re-check's facts check opens each source again; the brief trusts neither the notes nor an earlier review; closest earlier covers the picture.
  assert.match(text, /check 2 opens each source\s+again and does not lean on the earlier reviewer/);
  assert.match(text, /Trust nothing in the maker's notes or an earlier review/);
  assert.match(JSON.parse(readFileSync(path.join(hubRoot, "core/_system/work-orders.json"), "utf8")).layer_sets["concept-passes"].find((l) => l.id === "premises").evidence, /a picture or subject reused from that ad counts as no difference for the visual stop, and is said so/);
  // A condition is seen surface by surface: the brief reads each surface on its own, the gate names the two kinds.
  assert.match(text, /Read each surface a\s+>\s+viewer can see on its own, one at a time: an offer stated without its qualifying\s+>\s+condition is blocking/);
  const gate = readFileSync(path.join(hubRoot, "core/skills/ad-creative/references/claims-and-policy.md"), "utf8");
  assert.match(gate, /\*\*qualifying condition\*\*/);
  assert.match(gate, /\*\*scope limit\*\*/);
  assert.match(gate, /A\s+surface too short to hold the qualifying condition does not state the offer/);
  assert.doesNotMatch(gate, /in any of its\s+fields/);
  // The reviewer audits the required reads; a forbidden picture and a skipped read block; a skipped read is repaired by reading.
  assert.match(text, /List every\s+>\s+file or folder the owner's channel rules point at: one the notes do not name is skipped/);
  assert.match(text, /a line or picture that breaks a rule of the owner's, whichever of\s+>\s+the owner's files states it \(channel note, voice file, never-bend list\), such as a generated\s+>\s+result or before and after; a required read skipped;/);
  assert.doesNotMatch(text, /owner's rules for this channel forbid/);
  // The reviewer ends with the findings line; not-blocking findings are tagged in the reply.
  assert.match(text, /End with one line: `Findings: <how many>; blocking: <their numbers, or\s+>\s+none>; not blocking: <their numbers, or none>\.`/);
  assert.match(text, /`findings:` ends `not blocking \(review <N>\): <numbers,\s+or none>` for the last review, and each of those goes in the reply as an open item ending\s+with its tag, `\[R<N>-<number>\]`/);
  assert.match(text, /A skipped read is repaired by reading the file and running again the layers\s+that rest on it, not by adding its name to a list/);
  // The plain statement of the offer is an offer term, in the rule and in the brief.
  assert.match(text, /the plain statement of the offer's terms \(what is bought, by when, what comes with\s+it, its conditions\) is an offer term wherever it appears/);
  assert.match(text, /the plain statement of\s+>\s+the offer's terms is an offer term even when it matches the owner's own/);
  assert.match(text, /--repair <review number>/);
  assert.match(text, /only change is a cut/);
  assert.match(text, /`State: <state>\. Record: <path>`/);
  const video = readFileSync(path.join(hubRoot, "core/skills/ad-creative/references/video-build.md"), "utf8");
  assert.deepEqual([...video.matchAll(/^## Part (\d)\./gm)].map((m) => Number(m[1])), [1, 2, 3, 4, 5, 6, 7]);
  assert.match(video, /are not a watch/);
});
