#!/usr/bin/env python3
"""Check active routing docs for pre-transfer hub owners. Standard library only.

No network calls, writes, recursive scans, Git history, or installer execution.
Historical PR/issue/commit links are intentionally not active routing guidance.
Run from anywhere: python3 scripts/check-continuity.py [--self-test]
"""

import argparse
from pathlib import Path
import re
import sys
import unittest


ROUTING_DOCS = (
    "AGENTS.md", "CLAUDE.md", "README.md", "CONTINUITY.md",
    "install/README.md", "PROJECT-MAP.md", "NEW-PROJECT.md",
    "templates/AGENTS.md", "templates/CLAUDE.md",
)
OLD_OWNER = re.compile(
    r"(?<![\w.-])lowkeycm/(?P<repo>rtvaistudios|Marketing-Hub|ad-hub)"
    r"(?![\w-])", re.IGNORECASE,
)
HISTORICAL_LINK = re.compile(r"/(?:pull/\d+|issues/\d+|commit/[0-9a-f]{7,40})(?:[/?#)\s`]|$)", re.IGNORECASE)


def stale_routes(text):
    """Yield (line number, old route, replacement) for active owner references."""
    canonical = {"rtvaistudios": "rtvaistudios", "marketing-hub": "Marketing-Hub", "ad-hub": "ad-hub"}
    for number, line in enumerate(text.splitlines(), 1):
        for match in OLD_OWNER.finditer(line):
            if HISTORICAL_LINK.match(line[match.end():]):
                continue
            yield number, match.group(), "Relevaint/" + canonical[match["repo"].lower()]


class RouteTests(unittest.TestCase):
    def test_old_active_routes(self):
        for route in (
            "https://github.com/lowkeycm/rtvaistudios.git",
            "git@github.com:lowkeycm/Marketing-Hub.git",
            "github.com/lowkeycm/ad-hub", "`LOWKEYCM/AD-HUB`",
            "https://github.com/lowkeycm/Marketing-Hub/blob/main/README.md",
        ):
            with self.subTest(route=route):
                self.assertEqual(len(list(stale_routes(route))), 1)

    def test_current_and_unrelated_routes(self):
        for route in (
            "Relevaint/rtvaistudios Relevaint/Marketing-Hub Relevaint/ad-hub",
            "lowkeycm/clay-config lowkeycm/RTVAIStudios-Web",
            "../rtvaistudios ../Marketing-Hub ../ad-hub",
            "lowkeycm / lowkeycm@users.noreply.github.com",
            "lowkeycm/ad-hub-example otherlowkeycm/ad-hub",
        ):
            with self.subTest(route=route):
                self.assertEqual(list(stale_routes(route)), [])

    def test_historical_links(self):
        for route in (
            "[scaffolding](https://github.com/lowkeycm/ad-hub/pull/1)",
            "https://github.com/lowkeycm/rtvaistudios/commit/abcdef1234#diff-1",
            "https://github.com/lowkeycm/Marketing-Hub/issues/22",
        ):
            with self.subTest(route=route):
                self.assertEqual(list(stale_routes(route)), [])

    def test_history_does_not_hide_active_route_on_same_line(self):
        text = "https://github.com/lowkeycm/ad-hub/pull/1 then lowkeycm/ad-hub"
        self.assertEqual(list(stale_routes(text)), [(1, "lowkeycm/ad-hub", "Relevaint/ad-hub")])

    def test_line_and_replacement(self):
        self.assertEqual(list(stale_routes("safe\nlowkeycm/marketing-hub")),
                         [(2, "lowkeycm/marketing-hub", "Relevaint/Marketing-Hub")])

    def test_scope_excludes_history_and_settings(self):
        self.assertNotIn("HANDOFF.md", ROUTING_DOCS)
        self.assertNotIn(".claude/settings.json", ROUTING_DOCS)
        self.assertIn("templates/AGENTS.md", ROUTING_DOCS)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true", help="run synthetic regression cases only")
    args = parser.parse_args()
    if args.self_test:
        result = unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(RouteTests))
        return 0 if result.wasSuccessful() else 1

    root = Path(__file__).resolve().parents[1]
    checked = 0
    failures = []
    for name in ROUTING_DOCS:
        path = root / name
        if not path.is_file():
            continue  # Each repo has its own subset of the named entry documents.
        checked += 1
        for line, old, new in stale_routes(path.read_text(encoding="utf-8")):
            failures.append(f"{name}:{line}: stale hub route {old}; use {new}")
    if not checked:
        print("No routing documents found; run the copy under this repo's scripts/.", file=sys.stderr)
        return 1
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print(f"Continuity routes OK ({checked} active documents checked; history and installations untouched).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
