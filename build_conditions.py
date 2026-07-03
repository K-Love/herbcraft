#!/usr/bin/env python3
"""
HerbCraft Condition Pages Build Script
=======================================
Reads conditions.json + herbs.json + conditions/template.html and generates
a complete HTML page for each condition in the conditions/ directory.

Usage:
    python3 build_conditions.py                    # Build all condition pages
    python3 build_conditions.py --condition sleep  # Rebuild a single condition page

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
CONDITIONS_JSON = REPO_DIR / "conditions.json"
HERBS_JSON = REPO_DIR / "herbs.json"
TEMPLATE_HTML = REPO_DIR / "conditions" / "template.html"
CONDITIONS_DIR = REPO_DIR / "conditions"

AMAZON_TAG = "herbcraft0a-20"  # Replace with real Associates tag when available

# Herb emoji icons for cards
HERB_ICONS = {
    "turmeric": "🌿", "ginkgo": "🍃", "echinacea": "🌸", "chamomile": "🌼",
    "peppermint": "🌱", "ginger": "🫚", "lavender": "💜", "ashwagandha": "🌿",
    "valerian": "😴", "st-johns-wort": "☀️", "ginseng": "🌿", "elderberry": "🫐",
    "garlic": "🧄", "rosemary": "🌿", "cinnamon": "🍂", "sage": "🌿",
    "basil": "🌿", "fennel": "🌿", "dandelion": "🌻", "lemon-balm": "🍋",
    "licorice": "🌿", "calendula": "🌼", "black-cohosh": "🌿", "boswellia": "🌳",
    "cats-claw": "🐾", "cayenne": "🌶️", "devils-claw": "🌿", "dong-quai": "🌿",
    "fenugreek": "🌿", "feverfew": "🌸", "gotu-kola": "🍃", "hawthorn": "❤️",
    "holy-basil": "🙏", "hops": "🍺", "horsetail": "🌿", "kava": "🌊",
    "lions-mane": "🦁", "marshmallow-root": "🌿", "milk-thistle": "🌸",
    "motherwort": "💚", "mullein": "🌿", "nettle": "🌿", "passionflower": "🌺",
    "rhodiola": "🏔️", "saw-palmetto": "🌴", "schisandra": "🍒", "skullcap": "🌿",
    "slippery-elm": "🌳", "tribulus": "💪", "white-willow-bark": "🌿",
}

# Condition-specific benefit snippets for herb cards
CONDITION_HERB_BENEFITS = {
    "sleep": {
        "valerian": "May reduce sleep latency and improve sleep quality through GABA modulation.",
        "chamomile": "Contains apigenin that binds to GABA receptors, promoting relaxation and sleep.",
        "lavender": "Aromatherapy and oral lavender oil shown to improve sleep quality and reduce anxiety.",
        "passionflower": "Clinical trials show significant reduction in insomnia and anxiety before sleep.",
        "hops": "Traditional sedative; combined with valerian shows improved sleep latency.",
        "lemon-balm": "Calms the nervous system; combined with valerian improves sleep quality.",
    },
    "anxiety": {
        "ashwagandha": "Reduces cortisol levels and perceived stress; well-studied adaptogen for anxiety.",
        "kava": "Multiple meta-analyses confirm significant anxiolytic effects comparable to some pharmaceuticals.",
        "passionflower": "Shown comparable to low-dose oxazepam for anxiety in some clinical trials.",
        "lavender": "Oral lavender oil (Silexan) approved in Germany for anxiety disorders.",
        "lemon-balm": "Calms the nervous system and reduces anxiety without significant sedation.",
        "holy-basil": "Adaptogenic herb that reduces cortisol and supports stress resilience.",
    },
    "stress": {
        "ashwagandha": "Strongest clinical evidence for reducing cortisol and perceived stress levels.",
        "rhodiola": "Particularly effective for mental fatigue, burnout, and stress-related exhaustion.",
        "holy-basil": "Broad adaptogenic effects; reduces cortisol and supports HPA axis balance.",
        "ginseng": "Classic adaptogen that improves stress resilience and reduces fatigue.",
        "schisandra": "Five-flavor berry adaptogen that supports liver function and stress response.",
        "lemon-balm": "Calms the nervous system and reduces stress-related anxiety and irritability.",
    },
    "inflammation": {
        "turmeric": "Curcumin inhibits NF-kB, COX-2, and multiple inflammatory pathways.",
        "boswellia": "AKBA compound specifically inhibits 5-LOX; strong evidence for arthritis.",
        "ginger": "Gingerols and shogaols inhibit inflammatory enzymes; effective for joint pain.",
        "devils-claw": "Harpagoside reduces inflammatory markers; approved in Germany for musculoskeletal pain.",
        "cats-claw": "Alkaloids modulate immune response and reduce inflammatory cytokines.",
        "white-willow-bark": "Salicin (natural aspirin precursor) provides anti-inflammatory and analgesic effects.",
    },
    "immune-support": {
        "echinacea": "Most studied herb for cold prevention and duration reduction.",
        "elderberry": "Antiviral properties; may reduce flu duration and severity.",
        "garlic": "Allicin has broad antimicrobial and immune-enhancing properties.",
        "cats-claw": "Stimulates white blood cell activity and modulates immune response.",
        "lions-mane": "Supports immune function through beta-glucan polysaccharides.",
        "nettle": "Rich in vitamins and minerals that support overall immune health.",
    },
    "digestion": {
        "peppermint": "Strongest evidence for IBS; enteric-coated capsules reduce abdominal pain.",
        "ginger": "Highly effective for nausea, bloating, and digestive motility.",
        "fennel": "Carminative properties reduce bloating, gas, and digestive cramping.",
        "dandelion": "Stimulates bile production and acts as a gentle digestive tonic.",
        "marshmallow-root": "Mucilage soothes irritated digestive mucous membranes.",
        "slippery-elm": "Inner bark mucilage coats and soothes the digestive tract.",
    },
    "memory-focus": {
        "ginkgo": "Most studied herb for cognitive function; improves cerebral blood flow.",
        "lions-mane": "Stimulates nerve growth factor (NGF); improves mild cognitive impairment.",
        "gotu-kola": "Triterpenoids improve memory, cognitive function, and reduce anxiety.",
        "rosemary": "1,8-cineole improves cognitive performance; aromatherapy shows memory benefits.",
        "ginseng": "Ginsenosides improve cognitive function, mental clarity, and reduce fatigue.",
        "rhodiola": "Reduces mental fatigue and improves cognitive performance under stress.",
    },
    "energy": {
        "ginseng": "Strongest evidence for reducing fatigue and improving physical and mental energy.",
        "rhodiola": "Particularly effective for mental fatigue, burnout, and physical endurance.",
        "ashwagandha": "Improves strength, muscle recovery, and reduces exercise-induced fatigue.",
        "schisandra": "Adaptogenic lignans improve physical endurance and mental performance.",
        "holy-basil": "Broad adaptogenic effects support energy and stress resilience.",
        "cayenne": "Capsaicin improves circulation and may boost metabolism and energy.",
    },
    "liver-health": {
        "milk-thistle": "Silymarin is the gold standard for liver protection and regeneration.",
        "dandelion": "Stimulates bile production and supports liver detoxification pathways.",
        "schisandra": "Lignans protect liver cells and improve liver enzyme levels.",
        "turmeric": "Curcumin provides antioxidant protection and anti-inflammatory support for liver.",
        "licorice": "Glycyrrhizin has hepatoprotective effects; DGL form is safer for long-term use.",
        "gotu-kola": "Triterpenoids support liver function and have mild hepatoprotective effects.",
    },
    "joint-pain": {
        "turmeric": "Curcumin shown comparable to ibuprofen for knee osteoarthritis in some studies.",
        "boswellia": "Strong clinical evidence for reducing joint pain and improving function in osteoarthritis.",
        "devils-claw": "Harpagoside reduces joint pain; approved in Germany for musculoskeletal conditions.",
        "ginger": "Anti-inflammatory gingerols reduce joint pain and stiffness.",
        "white-willow-bark": "Natural salicin provides analgesic and anti-inflammatory effects for joint pain.",
        "cats-claw": "Anti-inflammatory alkaloids may reduce joint pain and swelling in arthritis.",
    },
    "skin-health": {
        "calendula": "Strongest evidence for wound healing, skin inflammation, and dermatitis.",
        "gotu-kola": "Asiaticoside stimulates collagen synthesis; widely used for scars and skin firming.",
        "turmeric": "Curcumin reduces skin inflammation and may help with acne and eczema.",
        "chamomile": "Anti-inflammatory and soothing; effective for sensitive skin and eczema.",
        "rosemary": "Antioxidant rosmarinic acid protects skin from oxidative damage.",
        "nettle": "Rich in vitamins and minerals that support skin health from within.",
    },
    "menopause": {
        "black-cohosh": "Most studied herb for hot flashes; approved by German Commission E for menopause.",
        "dong-quai": "Traditional blood tonic for menstrual and menopausal symptoms in TCM.",
        "sage": "Clinical trials show effectiveness for reducing hot flash frequency and severity.",
        "st-johns-wort": "May help with menopausal mood changes and mild depression.",
        "hops": "Phytoestrogenic 8-prenylnaringenin may reduce menopausal symptoms.",
        "ashwagandha": "Adaptogenic effects help with stress, sleep, and mood during menopause.",
    },
    "mens-health": {
        "saw-palmetto": "Most studied herb for BPH; may reduce urinary symptoms.",
        "tribulus": "Traditional testosterone-supporting herb; may improve sexual function.",
        "ginseng": "Strongest evidence for improving erectile function and sexual performance.",
        "ashwagandha": "Improves testosterone levels, sperm quality, and athletic performance.",
        "fenugreek": "May support testosterone levels and improve sexual function in men.",
        "nettle": "Nettle root may help with BPH symptoms; often combined with saw palmetto.",
    },
    "heart-health": {
        "hawthorn": "Strongest clinical evidence for cardiovascular support; approved for heart failure.",
        "garlic": "Well-documented effects on blood pressure and LDL cholesterol reduction.",
        "turmeric": "Curcumin improves endothelial function and reduces cardiovascular inflammation.",
        "ginger": "May reduce blood pressure, LDL cholesterol, and platelet aggregation.",
        "motherwort": "Traditional herb for heart palpitations and mild antihypertensive effects.",
        "cayenne": "Capsaicin improves circulation and may support cardiovascular health.",
    },
    "blood-sugar": {
        "cinnamon": "Most studied herb for blood sugar; improves insulin sensitivity.",
        "fenugreek": "Galactomannan fiber and 4-hydroxyisoleucine improve glucose metabolism.",
        "turmeric": "Curcumin improves insulin sensitivity and reduces diabetes-related inflammation.",
        "ginseng": "Ginsenosides improve insulin secretion and glucose uptake.",
        "berberine": "Alkaloid with strong evidence for blood sugar reduction comparable to metformin.",
        "bitter-melon": "Traditional diabetes herb with multiple hypoglycemic compounds.",
    },
}


# ---------------------------------------------------------------------------
# Schema generation
# ---------------------------------------------------------------------------

def build_faq_schema(condition: dict) -> dict:
    """FAQPage schema for condition page."""
    entities = []
    for faq in condition.get("faqs", []):
        entities.append({
            "@type": "Question",
            "name": faq["question"],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq["answer"],
            },
        })
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": entities,
    }


def build_breadcrumb_schema(condition: dict) -> dict:
    """BreadcrumbList schema."""
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
            {"@type": "ListItem", "position": 2, "name": "Herb Directory", "item": f"{BASE_URL}/herb-directory.html"},
            {"@type": "ListItem", "position": 3, "name": condition["title"], "item": f"{BASE_URL}/conditions/{condition['id']}.html"},
        ],
    }


def build_article_schema(condition: dict) -> dict:
    """Article schema for condition page."""
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": condition["title"],
        "description": condition["intro"],
        "author": {
            "@type": "Organization",
            "name": "HerbCraft Editorial Team",
            "url": f"{BASE_URL}/about/",
        },
        "publisher": {
            "@type": "Organization",
            "name": "HerbCraft",
            "url": BASE_URL,
            "logo": {"@type": "ImageObject", "url": f"{BASE_URL}/assets/logo.png"},
        },
        "datePublished": condition.get("date_published", TODAY),
        "dateModified": TODAY,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": f"{BASE_URL}/conditions/{condition['id']}.html",
        },
    }


def generate_schema_json(condition: dict) -> str:
    """Generate the full JSON-LD array for a condition page."""
    schemas = [
        build_faq_schema(condition),
        build_breadcrumb_schema(condition),
        build_article_schema(condition),
    ]
    return json.dumps(schemas, indent=2, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Herb cards generation
# ---------------------------------------------------------------------------

def generate_herb_cards(condition: dict, herbs_by_id: dict) -> str:
    """Generate herb card HTML for the condition page."""
    condition_id = condition["id"]
    herb_benefits = CONDITION_HERB_BENEFITS.get(condition_id, {})
    cards = []

    for herb_id in condition.get("herbs", []):
        herb = herbs_by_id.get(herb_id)
        if not herb:
            # Herb not in herbs.json — create a placeholder card
            icon = HERB_ICONS.get(herb_id, "🌿")
            benefit = herb_benefits.get(herb_id, "Traditionally used for " + condition["name"].lower() + " support.")
            card = (
                '            <a href="../herbs/' + herb_id + '.html" class="herb-card">\n'
                '                <div class="herb-card__icon">' + icon + '</div>\n'
                '                <h3 class="herb-card__name">' + herb_id.replace("-", " ").title() + '</h3>\n'
                '                <p class="herb-card__benefit">' + benefit + '</p>\n'
                '                <span class="herb-card__link-text">Read full profile</span>\n'
                '            </a>'
            )
            cards.append(card)
            continue

        icon = HERB_ICONS.get(herb_id, "🌿")
        benefit = herb_benefits.get(herb_id, herb.get("benefits", "")[:150] + "...")
        card = (
            '            <a href="../herbs/' + herb_id + '.html" class="herb-card">\n'
            '                <div class="herb-card__icon">' + icon + '</div>\n'
            '                <h3 class="herb-card__name">' + herb["name"] + '</h3>\n'
            '                <p class="herb-card__benefit">' + benefit + '</p>\n'
            '                <span class="herb-card__link-text">Read full profile</span>\n'
            '            </a>'
        )
        cards.append(card)

    return "\n".join(cards)


# ---------------------------------------------------------------------------
# FAQ HTML generation
# ---------------------------------------------------------------------------

def generate_faq_html(condition: dict) -> str:
    items = []
    for faq in condition.get("faqs", []):
        items.append(
            '            <details class="faq-item">\n'
            '                <summary class="faq-item__question">' + faq["question"] + '</summary>\n'
            '                <div class="faq-item__answer">\n'
            '                    <p>' + faq["answer"] + '</p>\n'
            '                </div>\n'
            '            </details>'
        )
    return "\n".join(items)


# ---------------------------------------------------------------------------
# Page generation
# ---------------------------------------------------------------------------

def generate_condition_page(condition: dict, template: str, herbs_by_id: dict) -> str:
    condition_name = condition["name"]
    condition_name_lower = condition_name.lower()
    search_term = condition.get("amazon_search_term", condition_name_lower + " herbal supplement")
    encoded_term = urllib.parse.quote(search_term)
    amazon_url = "https://www.amazon.com/s?k=" + encoded_term + "&tag=" + AMAZON_TAG

    meta_description = (
        condition["title"] + " — educational research on herbs traditionally associated with "
        + condition_name_lower + ". Not medical advice. Always consult a healthcare professional."
    )

    schema_json = generate_schema_json(condition)
    herb_cards = generate_herb_cards(condition, herbs_by_id)
    faq_html = generate_faq_html(condition)

    html = template
    html = html.replace("{{CONDITION_ID}}", condition["id"])
    html = html.replace("{{CONDITION_NAME}}", condition_name)
    html = html.replace("{{CONDITION_NAME_LOWER}}", condition_name_lower)
    html = html.replace("{{PAGE_TITLE}}", condition["title"])
    html = html.replace("{{CONDITION_INTRO}}", condition["intro"])
    html = html.replace("{{META_DESCRIPTION}}", meta_description)
    html = html.replace("{{SCHEMA_JSON}}", schema_json)
    html = html.replace("{{HERB_CARDS}}", herb_cards)
    html = html.replace("{{FAQ_HTML}}", faq_html)
    html = html.replace("{{AMAZON_URL}}", amazon_url)

    return html


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="HerbCraft condition pages build script."
    )
    parser.add_argument(
        "--condition",
        metavar="CONDITION_ID",
        help="Regenerate a single condition page by ID (e.g. --condition sleep)",
    )
    args = parser.parse_args()

    if not CONDITIONS_JSON.exists():
        print("ERROR: conditions.json not found at " + str(CONDITIONS_JSON), file=sys.stderr)
        sys.exit(1)
    if not HERBS_JSON.exists():
        print("ERROR: herbs.json not found at " + str(HERBS_JSON), file=sys.stderr)
        sys.exit(1)
    if not TEMPLATE_HTML.exists():
        print("ERROR: conditions/template.html not found at " + str(TEMPLATE_HTML), file=sys.stderr)
        sys.exit(1)

    with open(CONDITIONS_JSON, "r", encoding="utf-8") as f:
        conditions = json.load(f)

    with open(HERBS_JSON, "r", encoding="utf-8") as f:
        herbs_list = json.load(f)
    herbs_by_id = {h["id"]: h for h in herbs_list}

    with open(TEMPLATE_HTML, "r", encoding="utf-8") as f:
        template = f.read()

    CONDITIONS_DIR.mkdir(exist_ok=True)

    if args.condition:
        conditions = [c for c in conditions if c["id"] == args.condition]
        if not conditions:
            print("ERROR: No condition found with id '" + args.condition + "'", file=sys.stderr)
            sys.exit(1)

    generated = 0
    errors = []

    for condition in conditions:
        condition_id = condition["id"]
        output_path = CONDITIONS_DIR / (condition_id + ".html")

        try:
            html = generate_condition_page(condition, template, herbs_by_id)
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(html)
            print("  ✓  " + condition_id + ".html  (" + condition["title"] + ")")
            generated += 1
        except Exception as e:
            msg = "  ✗  " + condition_id + ".html — ERROR: " + str(e)
            print(msg, file=sys.stderr)
            errors.append(msg)

    print()
    print("=" * 50)
    print("Build complete: " + str(generated) + " condition page(s) generated")
    if errors:
        print("Errors (" + str(len(errors)) + "):")
        for e in errors:
            print("  " + e)
    else:
        print("No errors.")
    print("=" * 50)

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
