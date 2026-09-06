"""Read-only SEO release crawl. Never submits forms or follows private API routes."""
from __future__ import annotations

import argparse
import concurrent.futures
import datetime
import hashlib
import json
import re
import struct
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ORIGIN = "https://redclaycap.com"
UNKNOWN = "/does-not-exist-upgrade-test"
DUPLICATES = {
    f"/areas-we-serve/{city}-nc": f"/sell-your-house-fast-{city}-nc"
    for city in ["burlington", "graham", "greensboro", "haw-river", "roxboro"]
}
PROOF = {"/testimonials", "/recently-purchased-properties", "/reviews"}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.canonical = []
        self.meta = {}
        self.links = []
        self.images = []
        self.ids = set()
        self.title = []
        self.visible = []
        self.schema = []
        self.schema_errors = []
        self.in_title = False
        self.hidden = 0
        self.ld = False
        self.buf = ""

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "h1":
            self.h1 += 1
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "img":
            self.images.append({k: attrs.get(k) for k in ["src", "srcset", "alt"]})
        if tag == "meta":
            self.meta[attrs.get("property", attrs.get("name", ""))] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href", ""))
        if tag == "title":
            self.in_title = True
        if tag in ["script", "style"]:
            self.hidden += 1
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.ld = True
            self.buf = ""

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        if self.ld:
            self.buf += data
        if not self.hidden:
            self.visible.append(data)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.ld:
            try:
                self.schema.append(json.loads(self.buf))
            except ValueError as error:
                self.schema_errors.append(str(error))
            self.ld = False
        if tag in ["script", "style"]:
            self.hidden = max(0, self.hidden - 1)


def fetch(base, path):
    started = time.monotonic()
    request = urllib.request.Request(base + path, headers={"User-Agent": "RedClayReleaseReadOnlyQA/1.0"})
    try:
        with urllib.request.build_opener(NoRedirect()).open(request, timeout=60) as response:
            status = response.status
            headers = {k.lower(): v for k, v in response.headers.items()}
            body = response.read()
    except urllib.error.HTTPError as response:
        status = response.code
        headers = {k.lower(): v for k, v in response.headers.items()}
        body = response.read()
    except Exception as error:
        return {"path": path, "error": str(error)}, b""
    result = {
        "path": path,
        "status": status,
        "location": headers.get("location"),
        "contentType": headers.get("content-type"),
        "xRobotsTag": headers.get("x-robots-tag"),
        "vercelId": headers.get("x-vercel-id"),
        "cache": headers.get("x-vercel-cache"),
        "seconds": round(time.monotonic() - started, 3),
        "bytes": len(body),
        "sha256": hashlib.sha256(body).hexdigest(),
    }
    if "text/html" in headers.get("content-type", ""):
        document = Document()
        document.feed(body.decode("utf-8", "replace"))
        visible = " ".join(document.visible)
        result.update(
            title="".join(document.title), h1Count=document.h1,
            canonical=document.canonical, description=document.meta.get("description"),
            robots=document.meta.get("robots"), ogImage=document.meta.get("og:image"),
            ogWidth=document.meta.get("og:image:width"), ogHeight=document.meta.get("og:image:height"),
            links=sorted(set(document.links)), ids=sorted(document.ids), images=document.images,
            schema=document.schema, schemaErrors=document.schema_errors,
            oldPhone=bool(re.search(r"888.?626.?3213|18886263213", visible + " ".join(document.links))),
            founderReferences=bool(re.search(r"Michael\s+Cobb|owned by Michael|meet (?:the|our) founder|a person behind the process|a person behind this process", visible, re.I)),
            founderImageReferences=[image for image in document.images if re.search(r"founder|michael|portrait|headshot", json.dumps(image), re.I)],
            callPresent="tel:+19197781228" in document.links,
            textPresent="sms:+19197781228" in document.links,
        )
    return result, body


def sitemap_paths(xml):
    return {urllib.parse.urlparse(element.text).path or "/" for element in ET.fromstring(xml).iter() if element.tag.endswith("loc")}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, help="Origin to inspect; no deployment or writes occur")
    parser.add_argument("--output", required=True)
    parser.add_argument("--label", default="HTTP release verification")
    parser.add_argument("--baseline", default="docs/upgrade/before-sitemap.xml")
    parser.add_argument("--workers", type=int, default=3)
    args = parser.parse_args()
    base = args.base.rstrip("/")
    output = Path(args.output)
    sitemap_result, sitemap_body = fetch(base, "/sitemap.xml")
    if sitemap_result.get("status") != 200:
        print(json.dumps({"error": "Sitemap unavailable; no route assertions made", "result": sitemap_result}))
        return 1
    current = sitemap_paths(sitemap_body)
    baseline = sitemap_paths(Path(args.baseline).read_bytes())
    paths = current | baseline | set(DUPLICATES) | PROOF | {UNKNOWN, "/get-offer", "/privacy"}
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        results = list(pool.map(lambda path: fetch(base, path)[0], sorted(paths)))
    linked = set()
    for result in results:
        for link in result.get("links", []):
            url = urllib.parse.urlparse(urllib.parse.urljoin(base + result["path"], link))
            if url.netloc not in [urllib.parse.urlparse(base).netloc, "redclaycap.com"]:
                continue
            if url.path.startswith(("/api/", "/admin")) or re.search(r"\.[a-zA-Z0-9]{2,5}$", url.path):
                continue
            linked.add(url.path or "/")
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        results.extend(pool.map(lambda path: fetch(base, path)[0], sorted(linked - paths)))
    findings = []
    def finding(path, check, actual):
        findings.append({"path": path, "check": check, "actual": actual})
    for result in results:
        path = result["path"]
        expected_status = 404 if path == UNKNOWN else 308 if path in DUPLICATES else 200
        if result.get("status") != expected_status:
            finding(path, f"expected HTTP {expected_status}", result.get("status", result.get("error")))
        if path in DUPLICATES and result.get("location") != DUPLICATES[path]:
            finding(path, "exact permanent redirect target", result.get("location"))
        if result.get("status") != 200:
            continue
        canonical = ORIGIN + ("/how-it-works" if path == "/our-buying-process" else path)
        if [url.rstrip("/") for url in result.get("canonical", [])] != [canonical.rstrip("/")]:
            finding(path, "canonical", result.get("canonical"))
        if result.get("h1Count") != 1:
            finding(path, "one H1", result.get("h1Count"))
        for field in ["title", "description", "callPresent", "textPresent"]:
            if not result.get(field):
                finding(path, field, result.get(field))
        noindex = "noindex" in (result.get("robots") or "") + (result.get("xRobotsTag") or "")
        if noindex != (path in PROOF):
            finding(path, "intentional indexability", result.get("robots"))
        for field in ["oldPhone", "founderReferences", "founderImageReferences", "schemaErrors"]:
            if result.get(field):
                finding(path, field, result[field])
        if result.get("ogImage") != ORIGIN + "/social-preview.png":
            finding(path, "shared social image", result.get("ogImage"))
        for link in result.get("links", []):
            if link.startswith("#") and link[1:] not in result.get("ids", []):
                finding(path, "same-page fragment", link)
    assets = [sitemap_result]
    for path in ["/robots.txt", "/google3b135227f2cfe181.html", "/social-preview.png"]:
        result, body = fetch(base, path)
        if path.endswith(".png") and body.startswith(b"\x89PNG\r\n\x1a\n"):
            result["imageDimensions"] = list(struct.unpack(">II", body[16:24]))
        if path.endswith(".txt") or path.endswith(".html"):
            result["body"] = body.decode("utf-8", "replace")
        if result.get("status") != 200:
            finding(path, "public asset HTTP 200", result.get("status"))
        assets.append(result)
    report = {
        "label": args.label, "base": base,
        "checkedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "readOnly": True, "formSubmissions": 0, "baselineCount": len(baseline),
        "sitemapCount": len(current), "routeCount": len(results),
        "statusCounts": {str(status): sum(r.get("status") == status for r in results) for status in [200, 308, 404]},
        "findings": findings, "assets": assets, "results": results,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: report[key] for key in ["base", "baselineCount", "routeCount", "statusCounts", "findings"]}, indent=2))
    return int(bool(findings))


if __name__ == "__main__":
    sys.exit(main())
