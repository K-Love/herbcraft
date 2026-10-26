#!/usr/bin/env python3
"""
HerbCraft Build Script
======================
Reads herbs.json + herb-template.html and generates a complete HTML page
for each herb in the herbs/ directory.

Usage:
    python3 build.py              # Build all herb pages
    python3 build.py --herb chamomile  # Rebuild a single herb page

The script is idempotent — safe to run multiple times.
"""

import json
import sys
import argparse
import re
from html import escape
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_URL = "https://herbcraft.app"

REPO_DIR = Path(__file__).parent
HERBS_JSON = REPO_DIR / "herbs.json"
TEMPLATE_HTML = REPO_DIR / "herb-template.html"
HERBS_DIR = REPO_DIR / "herbs"



# ---------------------------------------------------------------------------
# Schema generation (Python port of components/schema.js)
# ---------------------------------------------------------------------------

def build_faq_schema(herb: dict) -> dict:
    """FAQPage schema with 6 standard Q&As derived from herb data."""
    name = herb["name"]
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f"What is {name} used for?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": herb["benefits"],
                },
            },
            {
                "@type": "Question",
                "name": f"Is {name} safe?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": herb["safety_info"],
                },
            },
            {
                "@type": "Question",
                "name": f"What are the active compounds in {name}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": herb["active_compounds"],
                },
            },
            {
                "@type": "Question",
                "name": f"What is the scientific name of {name}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f"The scientific name of {name} is {herb['scientific']}.",
                },
            },
            {
                "@type": "Question",
                "name": f"What are the traditional uses of {name}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": herb["traditional"],
                },
            },
            {
                "@type": "Question",
                "name": f"When should I see a doctor when using {name}?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": (
                        f"Always consult a qualified healthcare professional before using {name} "
                        "or any herbal supplement, especially if you are pregnant, nursing, taking "
                        "prescription medications, have a chronic health condition, or are scheduled "
                        "for surgery. Seek immediate medical attention if you experience severe "
                        "allergic reactions, chest pain, irregular heartbeat, severe digestive issues, "
                        "or any symptoms that worsen or do not improve. This information is for "
                        "educational purposes only and is not a substitute for professional medical advice."
                    ),
                },
            },
        ],
    }


def build_breadcrumb_schema(herb: dict) -> dict:
    """BreadcrumbList: Home > Herb Directory > Herb Name."""
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": f"{BASE_URL}/",
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Herb Directory",
                "item": f"{BASE_URL}/herb-directory.html",
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": herb["name"],
                "item": f"{BASE_URL}/herbs/{herb['id']}.html",
            },
        ],
    }


def build_article_schema(herb: dict) -> dict:
    """Article schema with recorded dates; unverified source IDs are not citations."""
    article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": f"{herb['name']} ({herb['scientific']}): Uses, Benefits & Safety",
        "description": herb["overview"],
        "author": {
            "@type": "Organization",
            "name": "HerbCraft",
            "url": f"{BASE_URL}/about/",
        },
        "publisher": {
            "@type": "Organization",
            "name": "HerbCraft",
            "url": BASE_URL,
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": f"{BASE_URL}/herbs/{herb['id']}.html",
        },
        "about": {
            "@type": "MedicalEntity",
            "name": herb["name"],
            "alternateName": herb["scientific"],
        },
    }

    for field, key in (("date_published", "datePublished"), ("date_modified", "dateModified")):
        if herb.get(field):
            article[key] = herb[field]
    return article


def generate_schema_json(herb: dict) -> str:
    """Generate the full JSON-LD array for a herb (article, FAQ and breadcrumb schemas)."""
    schemas = [
        build_faq_schema(herb),
        build_breadcrumb_schema(herb),
        build_article_schema(herb),
    ]
    return json.dumps(schemas, indent=2, ensure_ascii=False).replace("<", "\\u003c")


# ---------------------------------------------------------------------------
# FAQ HTML generation
# ---------------------------------------------------------------------------

def generate_faq_html(herb: dict) -> str:
    """
    Generate the FAQ section HTML using <details>/<summary> pattern.
    Returns the inner HTML for the {{FAQ_HTML}} placeholder.
    """
    # Derive visible answers and structured data from exactly the same content.
    faqs = [(item["name"], item["acceptedAnswer"]["text"])
            for item in build_faq_schema(herb)["mainEntity"]]

    items_html = []
    for question, answer in faqs:
        items_html.append(
            f'                    <details class="faq-item">\n'
            f'                        <summary class="faq-item__question">{escape(question)}</summary>\n'
            f'                        <div class="faq-item__answer">\n'
            f'                            <p>{escape(answer)}</p>\n'
            f'                        </div>\n'
            f'                    </details>'
        )

    return "\n".join(items_html)


# ---------------------------------------------------------------------------
# Profile validation and rendering
# ---------------------------------------------------------------------------

REQUIRED_FIELDS = ("id", "name", "scientific", "category", "overview", "traditional",
                   "active_compounds", "benefits", "safety_info")
PLACEHOLDER_PATTERNS = (
    r"\{\{[^{}]+\}\}", r"\[(?:Herb Name|Scientific Name)\]",
    r"This is a claim about an herb", r"Example paragraph", r"Author [A-Z]\.",
    r"Title of the Study or Article", r"AMAZON_ASIN_PLACEHOLDER",
)


def validate_herb(herb):
    for key in REQUIRED_FIELDS:
        if not isinstance(herb.get(key), str) or not herb[key].strip():
            raise ValueError(f"Missing required text field: {key}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", herb["id"]):
        raise ValueError("Invalid herb ID")
    refs = herb.get("references", [])
    if not isinstance(refs, list) or any(not isinstance(ref, str) or not ref.strip() for ref in refs):
        raise ValueError("References must be a list of nonempty source identifiers")
    for key in ("date_published", "date_modified"):
        if herb.get(key):
            if not isinstance(herb[key], str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", herb[key]):
                raise ValueError(f"Invalid {key}")
            date.fromisoformat(herb[key])
    if herb.get("date_modified") and herb.get("date_published") and herb["date_modified"] < herb["date_published"]:
        raise ValueError("Modification date precedes publication date")


def validate_page(html):
    for pattern in PLACEHOLDER_PATTERNS:
        if re.search(pattern, html):
            raise ValueError(f"Unresolved template/example content: {pattern}")
    for script in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        json.loads(script)


def generate_herb_page(herb: dict, template: str) -> str:
    """Render plain-text data safely. Existing source identifiers are not verified citations."""
    validate_herb(herb)
    fields = {
        "HERB_ID": herb["id"], "HERB_NAME": herb["name"],
        "META_DESCRIPTION": f"{herb['name']} ({herb['scientific']}) — educational information on traditional uses, compounds and safety. Source review pending; not medical advice.",
        "FACT_SCIENTIFIC_NAME": herb["scientific"],
        "FACT_PLANT_FAMILY": herb.get("plant_family", "Not recorded"),
        "FACT_ORIGIN": herb.get("origin", "Not recorded"),
        "FACT_PRIMARY_USE": herb["category"],
        "OVERVIEW": herb["overview"], "TRADITIONAL": herb["traditional"],
        "ACTIVE_COMPOUNDS": herb["active_compounds"], "BENEFITS": herb["benefits"],
        "SAFETY_INFO": herb["safety_info"],
    }
    replacements = {key: escape(str(value), quote=True) for key, value in fields.items()}
    refs = herb.get("references", [])
    replacements.update({
        "SCHEMA_JSON": generate_schema_json(herb),
        "FAQ_HTML": generate_faq_html(herb),
        "REFERENCES_HTML": ("<ul class=\"references-list\">" +
            "".join("<li>" + escape(ref) + "</li>" for ref in refs) + "</ul>"
            if refs else "<p>No source records have been added for this profile.</p>"),
    })
    # Single pass: tokens in user-authored data are never interpreted as template code.
    html = re.sub(r"\{\{([A-Z_]+)\}\}",
                  lambda match: replacements.get(match[1], match[0]), template)
    validate_page(html)
    return html


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="HerbCraft build script — generates herb HTML pages from template."
    )
    parser.add_argument(
        "--herb",
        metavar="HERB_ID",
        help="Regenerate a single herb page by ID (e.g. --herb chamomile)",
    )
    parser.add_argument("--check", action="store_true", help="Validate committed output without writing files")
    args = parser.parse_args()

    # --- Load data ---
    if not HERBS_JSON.exists():
        print(f"ERROR: herbs.json not found at {HERBS_JSON}", file=sys.stderr)
        sys.exit(1)
    if not TEMPLATE_HTML.exists():
        print(f"ERROR: herb-template.html not found at {TEMPLATE_HTML}", file=sys.stderr)
        sys.exit(1)

    with open(HERBS_JSON, "r", encoding="utf-8") as f:
        herbs = json.load(f)

    with open(TEMPLATE_HTML, "r", encoding="utf-8") as f:
        template = f.read()

    # Ensure output directory exists
    if not args.check:
        HERBS_DIR.mkdir(exist_ok=True)

    # --- Filter to single herb if --herb flag provided ---
    if args.herb:
        herbs = [h for h in herbs if h["id"] == args.herb]
        if not herbs:
            print(f"ERROR: No herb found with id '{args.herb}'", file=sys.stderr)
            print(f"Available IDs: {[h['id'] for h in json.load(open(HERBS_JSON))]}")
            sys.exit(1)

    # Render every selected page before writing any; fail closed on data/template errors.
    try:
        if len({h["id"] for h in herbs}) != len(herbs):
            raise ValueError("Duplicate herb IDs")
        pages = [(h["id"], generate_herb_page(h, template)) for h in herbs]
    except (ValueError, KeyError, TypeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
    if args.check:
        stale = [slug for slug, html in pages
                 if not (HERBS_DIR / f"{slug}.html").exists()
                 or (HERBS_DIR / f"{slug}.html").read_text(encoding="utf-8") != html]
        if stale:
            print("ERROR: Generated profiles differ: " + ", ".join(stale), file=sys.stderr)
            sys.exit(1)
        print(f"Validated {len(pages)} reproducible profiles.")
        return
    for slug, html in pages:
        (HERBS_DIR / f"{slug}.html").write_text(html, encoding="utf-8")
    print(f"Built {len(pages)} profiles. Source verification remains pending.")


if __name__ == "__main__":
    main()
