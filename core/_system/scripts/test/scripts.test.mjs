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

// ---- staged work: the output map, its pages and the layer record ----

const wo = (...a) => run("workorder.mjs", ...a);
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
  const rows = [
    row("1 fundamentals", "pass", "offer file proof rows 1 to 3; landing page copy on file read"),
    row("2 premises", "pass", "four premises compared; two rejected as category slogans"),
    row("3 cast-treatment", "pass", "hands-only against illustrated planner; hands chosen for recognition"),
    row("4 visual-stop", "fail, then pass", "frost-bitten seedlings frame read with copy hidden", "returned to premises; replaced the generic garden shot"),
    row("5 connection", "pass", "sequence read start to end: the planner answers the frost loss"),
    row("6 claims", "pass", "claims map against proof rows 1 and 3; the review withheld, no permission on record"),
    row("7 review", "pass", "self-review; Hook 4, Glance 4, One job 4, Proof 3"),
    row("8 copy", "pass", "each field read against the claims map; no required strings for this offer"),
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
    const good = check("good.md", doc(rows, "copy-ready"));
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
    const carried = check("carried.md", doc(swap("5 connection", row("5 connection", "carried", "passed in the record of 2026-10-07; the payoff did not change")), "copy-ready"));
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
    const lineWordy = check("linewordy.md", "Layers (ad-concepts): fundamentals pass (offer file and proof table read) · premises pass after a fix (five compared, three rejected) · cast-treatment pass (hands only; illustrated rejected) · visual-stop pass (frame read with copy hidden) · connection pass (read start to end) · claims pass (claims map against proof rows; review withheld) · review pass (self-review, Hook 4 Glance 4) · whole pass (set read as the operator sees it). State: concept-ready\n");
    assert.equal(lineWordy.code, 1);
    assert.match(lineWordy.out, /layer "premises" has the verdict "pass after a fix"/);
    // A layer checked in part is partial; a verdict the contract does not have is named; a separator inside evidence stays evidence.
    const partly = check("partly.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck partly done (two October ads corrected, claims and copy pass; page not checked) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: partly rechecked\n");
    assert.equal(partly.code, 0, partly.out);
    const bold = check("bold.md", "**Layers (change-recheck):** record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck partial (two October ads corrected; page and renders not checked) · states pass (ledger beside the updated records) · whole not checked (page and live ad text not seen). State: **partly rechecked**\n");
    assert.equal(bold.code, 0, bold.out);
    const partialNeeded = check("partialneeded.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck partial (two October ads corrected; page and renders not checked) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: rechecked\n");
    assert.equal(partialNeeded.code, 1);
    assert.match(partialNeeded.out, /state "rechecked" needs layer "recheck" to pass; it is partial/);
    const odd = check("odd.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck mostly fine (two October ads corrected) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: partly rechecked\n");
    assert.equal(odd.code, 1);
    assert.match(odd.out, /layer "recheck" has the verdict "mostly fine", which is not one of/);
    const dotted = check("dotted.md", "Layers (ad-concepts): fundamentals pass (offer file and proof table read) · premises pass (five compared, three rejected) · cast-treatment pass (hands only; illustrated rejected) · visual-stop pass (frame read with copy hidden) · connection pass (read start to end) · claims pass (footer strings checked: Instant download · 30-day refund; review withheld) · review pass (self-review, Hook 4 Glance 4) · whole pass (set read as the operator sees it). State: concept-ready\n");
    assert.equal(dotted.code, 0, dotted.out);
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
    const items = "fundamentals pass (offer file and proof table read) · premises pass (five compared, three rejected) · cast-treatment pass (hands only; illustrated rejected) · visual-stop pass (frame read with copy hidden) · connection pass (read start to end) · claims pass (claims map against proof rows; review withheld) · review pass (self-review, Hook 4 Glance 4) · whole pass (set read as the operator sees it)";
    const line = check("line.md", `Three concepts below.\n\nLayers (ad-concepts): ${items}. State: concept-ready, untested\n`);
    assert.equal(line.code, 0, line.out);
    const stateFirst = check("statefirst.md", `State: concept-ready. Layers (ad-concepts): ${items}.\n`);
    assert.equal(stateFirst.code, 0, stateFirst.out);
    const bare = check("bare.md", "Layers (ad-concepts): fundamentals pass · premises pass · cast-treatment pass · visual-stop pass · connection pass · claims pass · review pass · whole pass. State: concept-ready\n");
    assert.equal(bare.code, 1);
    assert.match(bare.out, /layer "fundamentals" passes with no evidence/);
    const shortLine = check("short.md", "Layers (ad-concepts): fundamentals pass (offer file read) · premises pass (five compared) · review pass (self-review, scores 4) · whole pass (set read whole). State: concept-ready\n");
    assert.equal(shortLine.code, 1);
    assert.match(shortLine.out, /layer "visual-stop" has no row/);
    // A state claimed with an exception is not that state.
    const excepted = check("excepted.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck pass (both October ads corrected and their records updated) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: rechecked, except the four live ads\n");
    assert.equal(excepted.code, 1);
    assert.match(excepted.out, /state "rechecked" is claimed with an exception/);
    const qualified = check("qualified.md", "Layers (change-recheck): record pass (offer file read back, old value kept) · dependents pass (ads searched for the old wording, hits listed) · recheck pass (both October ads corrected and their records updated) · states pass (ledger beside the updated records) · whole pass (second search of ads finds no old wording). State: rechecked. The only thing left is your review.\n");
    assert.equal(qualified.code, 0, qualified.out);
    const lineMixed = check("linemixed.md", "Layers (change-recheck): record pass (offer file read back) · dependents pass (ads searched for the old wording) · recheck pass for the two October ads, not checked for the four live ads (no creative files) · states pass (ledger beside the records) · whole not checked (page unseen). State: partly rechecked\n");
    assert.equal(lineMixed.code, 1);
    assert.match(lineMixed.out, /layer "recheck" carries two verdicts/);
    const piped = spawnSync(process.execPath, [path.join(scripts, "workorder.mjs"), "--record", "-"], { encoding: "utf8", input: `Layers (ad-concepts): ${items}. State: concept-ready\n` });
    assert.equal(piped.status, 0, piped.stdout);
    assert.equal(check("none.md", "# nothing here\n").code, 1);
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
  const layer = { id: "one", name: "One", build: "b", method: ["core/skills/ad-strategy/SKILL.md#no-such-heading"], check: "is it right", evidence: "e", on_fail: "f", returns_to: ["nowhere"] };
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
  for (const rule of [/One layer, one question/, /Do not draft the finished piece and check it afterward/, /Evidence is something that was looked at/, /`n\/a` with the reason/, /`not checked` with the reason/, /does not pass its parent/, /dependents lose their pass/, /not a request for the operator to\s+approve each step/, /Three repair cycles/, /never padded/, /Tested structure is not tested performance/, /Naming a gap is a pass/, /One verdict per row/, /`carried`/, /a pass whose evidence says the check was not made is a `not checked`/, /emergency stop covers only/]) {
    assert.match(text, rule);
  }
  const video = readFileSync(path.join(hubRoot, "core/skills/ad-creative/references/video-build.md"), "utf8");
  assert.deepEqual([...video.matchAll(/^## Part (\d)\./gm)].map((m) => Number(m[1])), [1, 2, 3, 4, 5, 6, 7]);
  assert.match(video, /are not a watch/);
});
