#!/usr/bin/env python3
"""يبني index.html من projects.json وindex.template.html.

كل رقم في الصفحة يُحسب هنا من البيانات، فلا يُكتب عدد باليد (دستور الويب §0.3، الفهرس).
التشغيل من جذر المستودع:  python3 build.py
"""
import json, re, sys, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE = "https://kakramah.github.io/"
MONTHS = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
          "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"]


def day(d):
    y, m, dd = map(int, d.split("-"))
    return f"{dd} {MONTHS[m - 1]} {y}"


def month(d):
    y, m, _ = map(int, d.split("-"))
    return f"{MONTHS[m - 1]} {y}"


def plain(s):
    return re.sub(r"<[^>]+>", "", s)


def thumb(repo, alt_title, cls, lazy=True, w=640, h=360):
    load = ' loading="lazy" decoding="async"' if lazy else ' fetchpriority="high"'
    return (f'<img class="{cls}" src="images/thumb-{repo}.webp" '
            f'alt="الصفحة الأولى من «{html.escape(plain(alt_title))}»" width="{w}" height="{h}"{load}>')


def link(repo):
    return f'href="{BASE}{repo}/" target="_blank" rel="noopener noreferrer"'


def main():
    data = json.loads((ROOT / "projects.json").read_text(encoding="utf-8"))
    types, works = data["types"], data["works"]
    by_repo = {w["repo"]: w for w in works}
    missing = [r for r in data["featured"] if r not in by_repo]
    if missing:
        sys.exit(f"✗ مختارات بلا عمل في works: {missing}")
    for w in works + data["clients"] + data["tools"]:
        if not (ROOT / f"images/thumb-{w['repo']}.webp").exists():
            sys.exit(f"✗ لا صورة مصغّرة لـ {w['repo']}")
        if "—" in w["desc"] or "–" in w["desc"]:
            sys.exit(f"✗ شَخْطة في وصف {w['repo']} (§4.12)")

    all_items = works + data["clients"] + data["tools"]
    first = min(w["date"] for w in all_items)

    lead_w = by_repo[data["featured"][0]]
    lead = (f'<a class="lead-work" {link(lead_w["repo"])}>'
            f'<figure>{thumb(lead_w["repo"], lead_w["title"], "lead-img", lazy=False)}'
            f'<figcaption><span class="meta">{types[lead_w["type"]]} · {day(lead_w["date"])}</span>'
            f'<span class="t">{lead_w["title"]}</span>'
            f'<span class="d">{lead_w["desc"]}</span></figcaption></figure></a>')

    feat = []
    for r in data["featured"][1:]:
        w = by_repo[r]
        feat.append(f'<a class="feat" {link(r)}>{thumb(r, w["title"], "feat-img")}'
                    f'<span class="meta">{types[w["type"]]} · {day(w["date"])}</span>'
                    f'<h3>{w["title"]}</h3><p>{w["desc"]}</p></a>')

    filters = "".join(
        f'<button type="button" class="chip" data-type="{k}" aria-pressed="false">{v} '
        f'<span class="n">{sum(1 for w in works if w["type"] == k)}</span></button>'
        for k, v in types.items())

    groups, current = [], None
    for w in sorted(works, key=lambda w: w["date"], reverse=True):
        mo = month(w["date"])
        if mo != current:
            if current is not None:
                groups.append("</ol></div>")
            groups.append(f'<div class="month"><h3 class="month-h">{mo}</h3><ol class="rows">')
            current = mo
        hay = html.escape(plain(w["title"] + " " + w["desc"] + " " + types[w["type"]] + " " + mo), quote=True)
        groups.append(
            f'<li class="row" data-type="{w["type"]}" data-hay="{hay}">'
            f'<a {link(w["repo"])}>{thumb(w["repo"], w["title"], "row-img")}'
            f'<span class="row-text"><span class="t">{w["title"]}</span>'
            f'<span class="d">{w["desc"]}</span>'
            f'<span class="meta">{types[w["type"]]} · {day(w["date"])}</span></span></a></li>')
    groups.append("</ol></div>")

    def small(items):
        return '<ul class="minis">' + "".join(
            f'<li><a {link(w["repo"])}>{thumb(w["repo"], w["title"], "mini-img")}'
            f'<span class="t">{w["title"]}</span><span class="d">{w["desc"]}</span></a></li>'
            for w in items) + "</ul>"

    out = (ROOT / "index.template.html").read_text(encoding="utf-8")
    for k, v in {
        "{{COUNT}}": str(len(all_items)),
        "{{WORKS}}": str(len(works)),
        "{{SINCE}}": month(first),
        "{{LEAD}}": lead,
        "{{FEATURED}}": "".join(feat),
        "{{FILTERS}}": filters,
        "{{ARCHIVE}}": "".join(groups),
        "{{CLIENTS}}": small(data["clients"]),
        "{{TOOLS}}": small(data["tools"]),
    }.items():
        out = out.replace(k, v)
    if "{{" in out:
        sys.exit("✗ بقي موضع لم يُملأ في القالب")
    (ROOT / "index.html").write_text(out, encoding="utf-8")
    print(f"✓ index.html: {len(all_items)} عملاً ({len(works)} في الأرشيف) منذ {month(first)}")


if __name__ == "__main__":
    main()
