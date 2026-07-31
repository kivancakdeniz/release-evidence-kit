#!/usr/bin/env python3

from __future__ import annotations

import hashlib
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parent.parent
EXCLUDED_DIRECTORIES = {".git", ".vscode", "_site", "node_modules"}
TEXT_EXTENSIONS = {".html", ".md", ".mjs", ".py", ".svg", ".txt", ".xml", ".yml", ".yaml"}
REPOSITORY_ORIGIN = "https://repository.invalid"
ERRORS: list[str] = []

SENSITIVE_PATTERNS = [
    ("private key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----")),
    ("GitHub token", re.compile(r"(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})")),
    ("OpenAI-style secret", re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("Azure storage key", re.compile(r"\bAccountKey=[A-Za-z0-9+/=]{20,}", re.IGNORECASE)),
    ("local macOS user path", re.compile(r"/Use" + r"rs/[^/\s]+/")),
    ("Microsoft tenant domain", re.compile(r"\b[A-Za-z0-9.-]+\.onmicrosoft\.com\b", re.IGNORECASE)),
    (
        "embedded Azure endpoint",
        re.compile(r"\b[A-Za-z0-9-]+\.(?:cognitiveservices\.azure\.com|openai\.azure\.com)\b", re.IGNORECASE),
    ),
]

REQUIRED_FILES = [
    "LICENSE",
    "robots.txt",
    "sitemap.xml",
    "README.md",
    "README.tr.md",
    "CHANGELOG.md",
    "CHANGELOG.tr.md",
    "PROJECT-STATUS.md",
    "PROJECT-STATUS.tr.md",
    "PUBLICATION-CHECKLIST.md",
    "PUBLICATION-CHECKLIST.tr.md",
    "SECURITY.md",
    "SECURITY.tr.md",
    "CONTRIBUTING.md",
    "CONTRIBUTING.tr.md",
    "GOVERNANCE.md",
    "GOVERNANCE.tr.md",
    "CODE_OF_CONDUCT.md",
    "CODE_OF_CONDUCT.tr.md",
    "assets/README.md",
    "docs/README.md",
    "docs/tr/README.md",
    "docs/tr/ARCHITECTURE.md",
    "docs/tr/DECISIONS.md",
    "docs/tr/DOMAIN-MODEL.md",
    "docs/tr/LANDSCAPE.md",
    "docs/tr/ROADMAP.md",
    "docs/tr/SCOPE.md",
    "docs/tr/SPEC-DRAFT.md",
    "docs/tr/THREAT-MODEL.md",
]


def report(path: Path, message: str) -> None:
    try:
        display_path = path.relative_to(ROOT)
    except ValueError:
        display_path = path
    ERRORS.append(f"{display_path}: {message}")


def publication_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        relative_parts = path.relative_to(ROOT).parts
        if any(part in EXCLUDED_DIRECTORIES for part in relative_parts):
            continue
        files.append(path)
    return files


class StructuredMarkupParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.tags: list[tuple[str, dict[str, str]]] = []
        self.scripts: list[str] = []
        self._script_parts: list[str] | None = None

    def _record_tag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        normalized = {name.lower(): value or "" for name, value in attrs}
        lowered_tag = tag.lower()
        self.tags.append((lowered_tag, normalized))
        if lowered_tag == "script" and self._script_parts is None:
            self._script_parts = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._record_tag(tag, attrs)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._record_tag(tag, attrs)
        if tag.lower() == "script" and self._script_parts is not None:
            self.scripts.append("".join(self._script_parts))
            self._script_parts = None

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "script" and self._script_parts is not None:
            self.scripts.append("".join(self._script_parts))
            self._script_parts = None

    def handle_data(self, data: str) -> None:
        if self._script_parts is not None:
            self._script_parts.append(data)

    def close(self) -> None:
        super().close()
        if self._script_parts is not None:
            ERRORS.append("index.html: script element is not closed")
            self._script_parts = None


def parse_markup(path: Path, content: str) -> StructuredMarkupParser:
    parser = StructuredMarkupParser()
    try:
        parser.feed(content)
        parser.close()
    except Exception as error:  # HTMLParser exposes malformed input through parser exceptions.
        report(path, f"markup parsing failed: {error}")
    return parser


def classify_target(source_file: Path, raw_target: str) -> tuple[str, str, Path | None]:
    target = raw_target.strip().removeprefix("<").removesuffix(">")
    if not target or "${" in target or target.startswith("#"):
        return "ignored", target, None

    if any(ord(character) < 0x20 and character not in "\t\r\n" for character in target):
        report(source_file, f"link contains a forbidden control character: {target!r}")
        return "invalid", target, None

    browser_normalized_target = target.replace("\\", "/").replace("\t", "").replace("\r", "").replace("\n", "")
    source_directory = source_file.parent.relative_to(ROOT).as_posix()
    base = f"{REPOSITORY_ORIGIN}/{source_directory + '/' if source_directory != '.' else ''}"
    parsed = urlsplit(urljoin(base, browser_normalized_target))

    if parsed.scheme == "mailto":
        return "mailto", target, None
    if parsed.scheme not in {"http", "https"}:
        report(source_file, f"link uses a forbidden URL protocol: {parsed.scheme or '(none)'}")
        return "forbidden", target, None
    if f"{parsed.scheme}://{parsed.netloc}" != REPOSITORY_ORIGIN:
        return "external", target, None

    try:
        decoded_path = unquote(parsed.path.lstrip("/"), errors="strict")
    except (UnicodeDecodeError, ValueError):
        report(source_file, f"link contains invalid URL encoding: {target}")
        return "invalid", target, None

    resolved = (ROOT / decoded_path).resolve()
    if not resolved.is_relative_to(ROOT):
        report(source_file, f"link escapes repository: {target}")
        return "invalid", target, None
    return "local", target, resolved


def validate_target(source_file: Path, raw_target: str) -> tuple[str, str, Path | None]:
    classified = classify_target(source_file, raw_target)
    kind, target, resolved = classified
    if kind == "local" and resolved is not None and not resolved.exists():
        report(source_file, f"broken local link: {target}")
    return classified


def scan_sensitive_content(files: list[Path]) -> None:
    for path in files:
        if path.suffix.lower() not in TEXT_EXTENSIONS and path.relative_to(ROOT).as_posix() != "LICENSE":
            continue
        try:
            content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            report(path, "expected UTF-8 text")
            continue
        for name, pattern in SENSITIVE_PATTERNS:
            if pattern.search(content):
                report(path, f"contains a possible {name}")


def scan_links(files: list[Path]) -> None:
    markdown_link = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
    for path in files:
        extension = path.suffix.lower()
        if extension not in {".md", ".html"}:
            continue
        content = path.read_text(encoding="utf-8")
        if extension == ".md":
            for match in markdown_link.finditer(content):
                validate_target(path, match.group(1))
            continue

        validate_html_document(path, content)


def validate_html_document(path: Path, content: str) -> None:
    parser = parse_markup(path, content)
    for tag, attributes in parser.tags:
        href_classification: tuple[str, str, Path | None] | None = None
        for attribute_name in ("href", "src"):
            if attribute_name not in attributes:
                continue
            classification = validate_target(path, attributes[attribute_name])
            if attribute_name == "href":
                href_classification = classification
        if tag == "a" and href_classification and href_classification[0] == "external":
            rel = set(attributes.get("rel", "").lower().split())
            if attributes.get("target") != "_blank" or not {"noopener", "noreferrer"}.issubset(rel):
                report(path, f"external link must use target=_blank and rel=noopener noreferrer: {href_classification[1]}")



def scan_svg(files: list[Path]) -> None:
    for path in (candidate for candidate in files if candidate.suffix.lower() == ".svg"):
        validate_svg_document(path, path.read_text(encoding="utf-8"))


def validate_svg_document(path: Path, content: str) -> None:
    parser = parse_markup(path, content)
    for tag, attributes in parser.tags:
        if tag in {"script", "foreignobject"}:
            report(path, f"contains forbidden SVG element: {tag}")
        for attribute_name, value in attributes.items():
            if attribute_name.startswith("on"):
                report(path, f"contains SVG event attribute: {attribute_name}")
            if attribute_name in {"href", "xlink:href", "src"}:
                kind, target, _ = validate_target(path, value)
                if kind == "external":
                    report(path, f"contains external SVG resource: {target}")


def validate_required_files() -> None:
    for required_file in REQUIRED_FILES:
        if not (ROOT / required_file).exists():
            ERRORS.append(f"{required_file}: required publication file is missing")


def validate_project_status() -> None:
    status = (ROOT / "PROJECT-STATUS.md").read_text(encoding="utf-8")
    for expected in ("status: pre-draft", "publication: public-design-review", "specification: not-approved", "implementation: none"):
        if expected not in status:
            ERRORS.append(f"PROJECT-STATUS.md: missing {expected}")

    asset_record = (ROOT / "assets/README.md").read_text(encoding="utf-8")
    if "Not yet recorded" in asset_record or "| Blocked |" in asset_record:
        ERRORS.append("assets/README.md: asset provenance is incomplete")


def validate_site_security() -> None:
    site_path = ROOT / "index.html"
    site = site_path.read_text(encoding="utf-8")
    parser = parse_markup(site_path, site)

    if re.search(r"npx\s+release-evidence|npm\s+(?:i|install)\s+release-evidence", site):
        ERRORS.append("index.html: unreleased install command is present")
    if "No implementation" not in site or "No implementation or conformance claim" not in site:
        ERRORS.append("index.html: pre-draft limitation is not explicit")

    referrer_policy = next(
        (attributes.get("content") for tag, attributes in parser.tags if tag == "meta" and attributes.get("name", "").lower() == "referrer"),
        None,
    )
    if (referrer_policy or "").lower() != "no-referrer":
        ERRORS.append("index.html: no-referrer policy is missing")

    content_security_policy = next(
        (
            attributes.get("content")
            for tag, attributes in parser.tags
            if tag == "meta" and attributes.get("http-equiv", "").lower() == "content-security-policy"
        ),
        None,
    )
    if not content_security_policy:
        ERRORS.append("index.html: Content Security Policy is missing")
        return

    for script in parser.scripts:
        digest = hashlib.sha256(script.encode("utf-8")).digest()
        import base64

        script_hash = f"sha256-{base64.b64encode(digest).decode('ascii')}"
        if f"'{script_hash}'" not in content_security_policy:
            ERRORS.append(f"index.html: CSP is missing script hash {script_hash}")
    for directive in ("default-src 'none'", "connect-src 'none'", "object-src 'none'", "form-action 'none'"):
        if directive not in content_security_policy:
            ERRORS.append(f"index.html: CSP is missing {directive}")


def run_self_tests() -> int:
    test_path = ROOT / "index.html"
    cases = [
        (
            "entity-encoded JavaScript URL",
            lambda: validate_html_document(test_path, '<a href="java&#x73;cript:alert(1)">unsafe</a>'),
            "forbidden URL protocol: javascript",
        ),
        (
            "backslash-normalized external URL",
            lambda: validate_html_document(test_path, r'<a href="https:\\evil.example">external</a>'),
            "external link must use target=_blank and rel=noopener noreferrer",
        ),
        (
            "SVG event handler",
            lambda: validate_svg_document(test_path, '<svg onload="alert(1)"></svg>'),
            "contains SVG event attribute: onload",
        ),
    ]

    failures: list[str] = []
    for name, exercise, expected in cases:
        ERRORS.clear()
        exercise()
        if not any(expected in error for error in ERRORS):
            failures.append(f"{name}: expected {expected!r}, got {ERRORS!r}")

    ERRORS.clear()
    validate_html_document(
        test_path,
        '<a href="https://example.com" target="_blank" rel="noopener noreferrer">safe</a>',
    )
    if ERRORS:
        failures.append(f"safe external URL: expected no errors, got {ERRORS!r}")

    ERRORS.clear()
    if failures:
        print(f"Publication validator self-test failed with {len(failures)} issue(s):", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print(f"Publication validator self-test passed: {len(cases) + 1} cases checked.")
    return 0


def main() -> int:
    files = publication_files()
    scan_sensitive_content(files)
    scan_links(files)
    scan_svg(files)
    validate_required_files()
    validate_project_status()
    validate_site_security()

    if ERRORS:
        print(f"Publication validation failed with {len(ERRORS)} issue(s):", file=sys.stderr)
        for error in ERRORS:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(f"Publication validation passed: {len(files)} files checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(run_self_tests() if "--self-test" in sys.argv[1:] else main())
