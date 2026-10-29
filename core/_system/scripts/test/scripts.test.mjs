// Tests for the Ad-Hub helper scripts. Run from the repo root: npm test
// Fixtures are synthetic (test/fixtures/README.md). The last tests run the checks
// against the real hub, so a broken freshness header or a skill that breaks the
// frontmatter rules fails the build gate.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
