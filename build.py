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
import os
import sys
import argparse
import urllib.parse
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_URL = "https://herbcraft.app"
TODAY = date.today().isoformat()  # YYYY-MM-DD

REPO_DIR = Path(__file__).parent
HERBS_JSON = REPO_DIR / "herbs.json"
TEMPLATE_HTML = REPO_DIR / "herb-template.html"
HERBS_DIR = REPO_DIR / "herbs"

AMAZON_TAG = "herbcraft0a-20"  # Replace with real Associates tag when available


# ---------------------------------------------------------------------------
# Schema generation (Python port of components/schema.js)
# ---------------------------------------------------------------------------

def build_medical_entity_schema(herb: dict) -> dict:
    """MedicalEntity schema for the herb."""
    return {
        "@context": "https://schema.org",
        "@type": "MedicalEntity",
        "name": herb["name"],
        "alternateName": herb["scientific"],
        "description": herb["overview"],
        "medicineSystem": {
            "@type": "MedicineSystem",
            "name": "Traditional Medicine",
        },
        "relevantSpecialty": {
            "@type": "MedicalSpecialty",
            "name": "Herbal Medicine",
        },
        "activeIngredient": herb["active_compounds"],
        "warning": herb["safety_info"],
        "url": f"{BASE_URL}/herbs/{herb['id']}.html",
    }


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
    """Article schema with author, publisher, and citation list."""
    citations = [
        {"@type": "CreativeWork", "name": ref}
        for ref in (herb.get("references") or [])
    ]
    date_published = herb.get("date_published", TODAY)
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": f"{herb['name']} ({herb['scientific']}): Uses, Benefits & Safety",
        "description": herb["overview"],
        "author": {
            "@type": "Organization",
            "name": "HerbCraft Editorial Team",
            "url": f"{BASE_URL}/about/",
        },
        "publisher": {
            "@type": "Organization",
            "name": "HerbCraft",
            "url": BASE_URL,
            "logo": {
                "@type": "ImageObject",
                "url": f"{BASE_URL}/assets/logo.png",
            },
        },
        "datePublished": date_published,
        "dateModified": TODAY,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": f"{BASE_URL}/herbs/{herb['id']}.html",
        },
        "citation": citations,
        "about": {
            "@type": "MedicalEntity",
            "name": herb["name"],
            "alternateName": herb["scientific"],
        },
    }


def generate_schema_json(herb: dict) -> str:
    """Generate the full JSON-LD array for a herb (all 4 schemas)."""
    schemas = [
        build_medical_entity_schema(herb),
        build_faq_schema(herb),
        build_breadcrumb_schema(herb),
        build_article_schema(herb),
    ]
    return json.dumps(schemas, indent=2, ensure_ascii=False)


# ---------------------------------------------------------------------------
# FAQ HTML generation
# ---------------------------------------------------------------------------

def generate_faq_html(herb: dict) -> str:
    """
    Generate the FAQ section HTML using <details>/<summary> pattern.
    Returns the inner HTML for the {{FAQ_HTML}} placeholder.
    """
    name = herb["name"]

    # Build the same 6 Q&As as the schema
    faqs = [
        (
            f"What is {name} used for?",
            herb["benefits"],
        ),
        (
            f"Is {name} safe?",
            herb["safety_info"],
        ),
        (
            f"What are the active compounds in {name}?",
            herb["active_compounds"],
        ),
        (
            f"What is the scientific name of {name}?",
            f"The scientific name of {name} is <em>{herb['scientific']}</em>.",
        ),
        (
            f"What are the traditional uses of {name}?",
            herb["traditional"],
        ),
        (
            f"When should I see a doctor when using {name}?",
            (
                f"Always consult a qualified healthcare professional before using {name} "
                "or any herbal supplement, especially if you are pregnant, nursing, taking "
                "prescription medications, have a chronic health condition, or are scheduled "
                "for surgery. Seek immediate medical attention if you experience severe "
                "allergic reactions, chest pain, irregular heartbeat, severe digestive issues, "
                "or any symptoms that worsen or do not improve."
            ),
        ),
    ]

    items_html = []
    for question, answer in faqs:
        items_html.append(
            f'                    <details class="faq-item">\n'
            f'                        <summary class="faq-item__question">{question}</summary>\n'
            f'                        <div class="faq-item__answer">\n'
            f'                            <p>{answer}</p>\n'
            f'                        </div>\n'
            f'                    </details>'
        )

    return "\n".join(items_html)


# ---------------------------------------------------------------------------
# Product cards generation
# ---------------------------------------------------------------------------

def generate_product_cards(herb: dict) -> str:
    """
    Generate 2 placeholder product cards with Amazon affiliate links.
    Uses AMAZON_ASIN_PLACEHOLDER comments for future ASIN injection.
    """
    search_term = herb.get("amazon_search_term", f"{herb['name']} supplement")
    encoded_term = urllib.parse.quote(search_term)
    amazon_url = f"https://www.amazon.com/s?k={encoded_term}&tag={AMAZON_TAG}"

    # Card 1: General supplement
    card1_search = search_term
    card1_url = f"https://www.amazon.com/s?k={urllib.parse.quote(card1_search)}&tag={AMAZON_TAG}"

    # Card 2: Organic / premium variant
    card2_search = f"organic {herb['name'].lower()} supplement"
    card2_url = f"https://www.amazon.com/s?k={urllib.parse.quote(card2_search)}&tag={AMAZON_TAG}"

    cards_html = (
        f'<!-- AMAZON_ASIN_PLACEHOLDER: search term: {search_term} -->\n'
        f'                        <div class="product-card">\n'
        f'                            <div class="product-card__image-placeholder" aria-hidden="true">🌿</div>\n'
        f'                            <div class="product-card__content">\n'
        f'                                <h3 class="product-card__title">{herb["name"]} Supplement</h3>\n'
        f'                                <p class="product-card__description">High-quality {herb["name"]} supplement. Search Amazon for top-rated options.</p>\n'
        f'                                <a href="{card1_url}" class="product-card__link" target="_blank" rel="noopener noreferrer nofollow">Shop on Amazon</a>\n'
        f'                            </div>\n'
        f'                        </div>\n'
        f'<!-- AMAZON_ASIN_PLACEHOLDER: search term: {card2_search} -->\n'
        f'                        <div class="product-card">\n'
        f'                            <div class="product-card__image-placeholder" aria-hidden="true">🌱</div>\n'
        f'                            <div class="product-card__content">\n'
        f'                                <h3 class="product-card__title">Organic {herb["name"]}</h3>\n'
        f'                                <p class="product-card__description">Organic {herb["name"]} options for those seeking certified natural products.</p>\n'
        f'                                <a href="{card2_url}" class="product-card__link" target="_blank" rel="noopener noreferrer nofollow">Shop on Amazon</a>\n'
        f'                            </div>\n'
        f'                        </div>'
    )
    return cards_html


# ---------------------------------------------------------------------------
# Page generation
# ---------------------------------------------------------------------------

def generate_herb_page(herb: dict, template: str) -> str:
    """
    Replace all {{PLACEHOLDER}} tokens in the template with herb-specific content.
    Returns the complete HTML string for the herb page.
    """
    meta_description = (
        f"{herb['name']} ({herb['scientific']}) — educational research on uses, "
        f"benefits, active compounds, and safety. Not medical advice."
    )

    # Generate all dynamic content
    schema_json = generate_schema_json(herb)
    faq_html = generate_faq_html(herb)
    product_cards = generate_product_cards(herb)

    # Perform all replacements
    html = template
    html = html.replace("{{HERB_ID}}", herb["id"])
    html = html.replace("{{HERB_NAME}}", herb["name"])
    html = html.replace("{{META_DESCRIPTION}}", meta_description)
    html = html.replace("{{SCHEMA_JSON}}", schema_json)
    html = html.replace("{{FACT_SCIENTIFIC_NAME}}", herb["scientific"])
    html = html.replace("{{FACT_PLANT_FAMILY}}", herb.get("plant_family", "Unknown"))
    html = html.replace("{{FACT_ORIGIN}}", herb.get("origin", "Unknown"))
    html = html.replace("{{FACT_PRIMARY_USE}}", herb["category"])
    html = html.replace("{{FAQ_HTML}}", faq_html)
    html = html.replace("{{PRODUCT_CARDS}}", product_cards)

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
    HERBS_DIR.mkdir(exist_ok=True)

    # --- Filter to single herb if --herb flag provided ---
    if args.herb:
        herbs = [h for h in herbs if h["id"] == args.herb]
        if not herbs:
            print(f"ERROR: No herb found with id '{args.herb}'", file=sys.stderr)
            print(f"Available IDs: {[h['id'] for h in json.load(open(HERBS_JSON))]}")
            sys.exit(1)

    # --- Build pages ---
    generated = 0
    errors = []

    for herb in herbs:
        herb_id = herb["id"]
        output_path = HERBS_DIR / f"{herb_id}.html"

        try:
            html = generate_herb_page(herb, template)
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"  ✓  {herb_id}.html  ({herb['name']})")
            generated += 1
        except Exception as e:
            msg = f"  ✗  {herb_id}.html — ERROR: {e}"
            print(msg, file=sys.stderr)
            errors.append(msg)

    # --- Summary ---
    print()
    print("=" * 50)
    print(f"Build complete: {generated} page(s) generated")
    if errors:
        print(f"Errors ({len(errors)}):")
        for e in errors:
            print(f"  {e}")
    else:
        print("No errors.")
    print("=" * 50)

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
