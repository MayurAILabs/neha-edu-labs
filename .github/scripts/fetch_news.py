#!/usr/bin/env python3
"""
Neha Edu Labs — RSS news aggregator.

Fetches the feeds listed in .github/scripts/feeds.json, normalizes entries into
the schema consumed by assets/js/news.js, merges them with the existing
data/news.json (so a temporarily-down feed doesn't wipe out its old items),
sorts by publish date, caps the total, and writes data/news.json back out.

Designed to run unattended on a GitHub Actions cron schedule (see
.github/workflows/update-news.yml) with no paid services and no backend —
this script is the entire "backend". A single feed failing (bad URL, timeout,
site down) must never crash the run; it is logged and skipped.
"""
import hashlib
import json
import sys
import time
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
FEEDS_FILE = ROOT / ".github" / "scripts" / "feeds.json"
OUTPUT_FILE = ROOT / "data" / "news.json"

MAX_ITEMS = 48
PER_FEED_LIMIT = 6
REQUEST_TIMEOUT = 12
USER_AGENT = "NehaEduLabsNewsBot/1.0 (+https://www.nehaedulabs.online/)"

CATEGORY_IMAGE = {
    "AI": "assets/images/news/cat-ai.svg",
    "Education": "assets/images/news/cat-education.svg",
    "Programming": "assets/images/news/cat-programming.svg",
    "Engineering": "assets/images/news/cat-engineering.svg",
}


def log(msg):
    print(f"[fetch_news] {msg}", file=sys.stderr)


def load_feeds():
    with open(FEEDS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def load_existing():
    if OUTPUT_FILE.exists():
        try:
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError) as exc:
            log(f"could not read existing news.json, starting fresh: {exc}")
    return []


def make_id(url, title):
    digest = hashlib.sha1((url or title).encode("utf-8")).hexdigest()[:12]
    return f"news-{digest}"


def to_iso(date_str):
    if not date_str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        dt = parsedate_to_datetime(date_str)
    except (TypeError, ValueError):
        try:
            dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except ValueError:
            return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def strip_tags(text):
    if not text:
        return ""
    out, in_tag = [], False
    for ch in text:
        if ch == "<":
            in_tag = True
        elif ch == ">":
            in_tag = False
        elif not in_tag:
            out.append(ch)
    return " ".join("".join(out).split())


def fetch_bytes(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        return resp.read()


NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
}


def parse_feed(xml_bytes, source, category):
    root = ET.fromstring(xml_bytes)
    items = []

    # RSS 2.0 (<rss><channel><item>)
    channel = root.find("channel")
    if channel is not None:
        for item in channel.findall("item")[:PER_FEED_LIMIT]:
            title = strip_tags((item.findtext("title") or "").strip())
            link = (item.findtext("link") or "").strip()
            desc = strip_tags(item.findtext("description") or item.findtext("content:encoded", namespaces=NS) or "")
            pub = item.findtext("pubDate") or item.findtext("dc:date", namespaces=NS)
            if title and link:
                items.append(build_entry(title, link, desc, pub, source, category))
        return items

    # Atom (<feed><entry>)
    if root.tag.endswith("feed"):
        for entry in root.findall("atom:entry", NS)[:PER_FEED_LIMIT]:
            title = strip_tags((entry.findtext("atom:title", namespaces=NS) or "").strip())
            link_el = entry.find("atom:link[@rel='alternate']", NS)
            if link_el is None:
                link_el = entry.find("atom:link", NS)
            link = link_el.get("href") if link_el is not None else ""
            desc = strip_tags(entry.findtext("atom:summary", namespaces=NS) or entry.findtext("atom:content", namespaces=NS) or "")
            pub = entry.findtext("atom:updated", namespaces=NS) or entry.findtext("atom:published", namespaces=NS)
            if title and link:
                items.append(build_entry(title, link, desc, pub, source, category))
        return items

    return items


def build_entry(title, link, desc, pub, source, category):
    summary = desc[:220].rsplit(" ", 1)[0] + "…" if len(desc) > 220 else desc
    return {
        "id": make_id(link, title),
        "title": title[:180],
        "summary": summary or f"Latest update from {source}.",
        "url": link,
        "image": CATEGORY_IMAGE.get(category, CATEGORY_IMAGE["Education"]),
        "source": source,
        "category": category,
        "publishedAt": to_iso(pub),
    }


def main():
    feeds = load_feeds()
    existing = load_existing()
    existing_by_id = {item["id"]: item for item in existing}

    fetched = []
    for feed in feeds:
        source, url, category = feed["source"], feed["url"], feed["category"]
        try:
            xml_bytes = fetch_bytes(url)
            entries = parse_feed(xml_bytes, source, category)
            log(f"OK   {source}: {len(entries)} items")
            fetched.extend(entries)
        except Exception as exc:  # noqa: BLE001 — a single bad feed must never fail the run
            log(f"SKIP {source} ({url}): {exc}")
        time.sleep(0.3)  # be polite to upstream hosts

    merged = {item["id"]: item for item in existing}
    for item in fetched:
        merged[item["id"]] = item

    all_items = sorted(merged.values(), key=lambda x: x["publishedAt"], reverse=True)[:MAX_ITEMS]

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
        f.write("\n")

    log(f"Wrote {len(all_items)} items ({len(fetched)} fetched this run) to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
