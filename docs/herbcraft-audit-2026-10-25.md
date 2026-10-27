# HerbCraft: first audit and implementation plan

Audit date: October 25, 2026. Baseline: main commit
`5de4690610046c840cd5ebb65e084f9d4001a7a3`.
This is the first technical and commercial assessment, not a completed clinical
review, keyword study, or revenue forecast. No analytics account was accessed.

## 1. Executive verdict

HerbCraft has a useful lightweight foundation, an established visual palette,
structured herb data, and existing interactive tools. The largest immediate
constraint is a mismatch between data, templates, navigation, and published content.
Repair that foundation before adding hundreds of pages.

Recommended commercial direction (hypothesis): practical herb growing and kitchen
utility, with a small paid garden planner and relevant gardening affiliates.
Medical-condition pages impose a much larger source-verification burden for a
solo operator. Keep existing health content under review rather than expanding it.

## 2. What I found

| Status | Finding and evidence | Implication |
|---|---|---|
| Verified in code | No package.json; static HTML/CSS/JS plus `build.py`, `build_conditions.py`, `generate_herbs.py` | Preserve architecture; no framework migration needed |
| Verified in code | `herbs.json`: 50 records; `herb-detail.js`: 22 identities; `script.js` and `herb-directory.js`: 20 hardcoded entries | Different interfaces expose different inventories |
| Verified live | On https://herbcraft.app/ searching Valerian displays no matches; Search Herbs navigates without the query | Existing content cannot reliably be discovered |
| Verified in code | Directory query text is concatenated into `innerHTML` in the empty state | Query-controlled markup injection; repaired with textContent |
| Verified in code | Both directory variants omit the shared navigation script; shared CSS lacks complete mobile toggle behavior | Directory menu is unwired; repair scoped to home/directory |
| Verified live and in code | https://herbcraft.app/herbs/valerian and /herbs/st-johns-wort return 200 with “This is a claim about an herb” in HTML; `herb-template.html` and generated profiles include invented example references | Publishing is not ready to scale; template content must be replaced and sources verified |
| Verified in code | `build.py` replaces metadata/FAQ/product placeholders but not the main article sections; `generate_herbs.py` uses incompatible replacement assumptions | Two competing generation paths need consolidation |
| Verified in code | `vercel.json`, `_redirects`, and `serve.py` route clean herb URLs toward the legacy shell, while live sampled responses serve static generated HTML | Repository routing alone cannot establish deployed behavior; test hosting rules explicitly |
| Verified in code | Homepage promises every claim links to an original source; legacy renderer has no bibliography and generated pages contain example citations | Trust promise exceeds what the implementation supports |
| Verified in code | Amazon tag `herbcraft0a-20` has a “replace with real” comment; cards call unspecified supplements high-quality and organic | Attribution and recommendations are unverified; do not assume revenue readiness |
| Verified in code | GA4 ID G-Y7JYY85G6Q is present; sitemap and robots file exist | Reuse measurement setup, but actual collection/indexing is unverified |
| Verified in code | Schema references nonexistent `assets/logo.png`; build stamps dateModified on every run | Fix schema accuracy and use real editorial update dates |
| Requires access | Traffic, Search Console coverage, affiliate acceptance/tag ownership, orders, hosting deployment configuration | No claims about actual rankings, conversion, earnings, or profitability |

The visual inspection shows a cream/green editorial design with serif typography.
It is a reasonable foundation. Search usability and content integrity matter more
than a full redesign at this stage. No comprehensive mobile render audit completed.

## 3. Profitability strategy

Test one practical offer: a downloadable small-space herb-garden planner, with a
free sample and a clear purchase path. Price hypothesis: $9–$15; determine willingness
to pay before building a large bundle. Gardening product affiliates can complement
it after program acceptance and tracking are verified. Do not begin with display ads
or a paid medical advice tool.

Illustrative gross revenue arithmetic at $12: 9 sales exceed $100, 42 exceed $500,
and 84 exceed $1,000. These are not demand or earnings forecasts. Fees, refunds,
tax treatment, production time and other costs are excluded. At 1% visitor-to-sale
conversion, 84 sales would require about 8,400 qualified visits; at 2%, about 4,200.
This is why an offer and distribution test is more useful than a page-count target.

Competitor signals: Epic Gardening and Rural Sprout publicly disclose affiliate
monetization. This confirms the model exists, not their profits or HerbCraft's
likely conversion. University extension guides already answer basic growing
questions well; our advantage must be a usable planner, comparison, or checklist.

## 4. pSEO opportunity map

Provisional ordering based on utility, commercial fit, maintainability, and review
burden. Search volume and competition have NOT been measured.

| Rank | Page family | Distinctive value / requirement |
|---|---|---|
| 1 | Container growing guides | Species-specific light, pot, drainage and harvest checklist with cited horticultural sources |
| 2 | Herb comparisons | Real differences in growing needs and kitchen uses; avoid arbitrary pairs |
| 3 | Beginner setup guides | Budget-specific supply checklist and planner; disclose affiliates; no fabricated testing |
| 4 | Culinary substitutions | Flavor, use case and limitations; validate quantities and culinary suitability |
| 5 | Harvesting and storage | Species-specific methods and printable checklist |
| 6 | Indoor growing troubleshooting | Symptoms, environmental causes and steps; original useful decision tree |
| 7 | Propagation guides | Method, timing, success conditions and sourced visuals |
| 8 | Growing-condition finder pages | Structured factual data behind filters; avoid indexing every empty combination |
| 9 | Improved existing profiles | Source traceability, limitations, and consistent article rendering |
| 10 | Health-condition/evidence pages | Defer expansion until claim-level sources and a workable review process exist |

First three templates: intent-led introduction, concise comparison/facts table,
actionable steps, relevant cautions, citations with review date, useful internal
links, and optional commercial placement. Store botanical identity, source URL,
source-supported fact, geography, review status, reviewer, reviewed date, and
publication status separately. No source, unresolved contradiction, placeholder
copy, or insufficient unique information means no new publication.

Pilot: three container guides and one genuinely useful comparison, supported by
one setup checklist. All content must pass source and template review before it
is indexed. Do not generate dozens of near-identical location variants.

## 5. HerbCraft experience

Keep botanical green, warm paper and serif headings. Improve legibility and mobile
controls before decorative work. Make discovery explicit: common and botanical
names, visible result counts, recoverable empty states and stable links.

Next design work: factual profile headers, clear distinction between culinary,
growing, traditional-use and clinical-evidence sections, source links beside claims,
and a practical tool that visitors can print or save. Avoid implying that a quiz
or missing interaction warning establishes an herb's suitability for a person.

## 6. Growth engine

Start with one distribution channel and one useful asset. Proposed first test:
share a free sample of the garden planner through an existing channel or an
appropriate gardening community where self-promotion is allowed. Track qualified
visits and purchases, not impressions alone. Nothing has been posted or sent.

Five candidate assets: small-space garden planner; container shopping checklist;
side-by-side herb comparison; harvest/storage checklist; growing-condition finder.
The planner is the strongest initial commercial experiment because the free
sample and paid version can serve the same task. Pinterest is a channel hypothesis
for useful visual checklists, not a promise of traffic or virality.

## 7. Prioritized action plan

| Window | Work and acceptance criterion | Effort / dependency | Decision rule |
|---|---|---|---|
| First 48h | Review search PR; confirm preview at mobile widths; fix template placeholders and references in a separate bounded change | Search complete in branch; profile repair estimated 1–2 focused days plus source review | No broader publication until profiles render real content and references resolve |
| Days 3–7 | Consolidate generators and routing; align canonical URLs/sitemap; remove schema errors and unsupported trust/product claims; verify GA4 and Search Console | Estimated 2–4 days; account access and hosting configuration | Build must fail on placeholders, missing routes and invalid data |
| Days 8–14 | Build and source the four-page gardening pilot and planner sample; confirm purchase delivery and one distribution channel | Estimated 3–5 days; offer choice and checkout provider | Do not expand if source review or delivery is unreliable |
| Days 15–30 | Run offer test and compare landing-page behavior | Traffic sufficient for interpretation; track costs/time | After 100 qualified visits, inspect actual sales and objections; no sales is a reason to revise offer, not proof the market is absent |
| Days 31–90 | Expand only useful page families and the offer that show demand | Depends on measured results | Scale when revenue, engagement and maintenance cost justify it; pause weak clusters |

Three initial experiments: discovery completion (instrument search/profile navigation
without collecting health-query text); planner purchase conversion (test after
checkout is validated); four-page content pilot (review indexability/impressions at
30 and 60 days, recognizing SEO latency). Baseline and targets must be calibrated
with actual data; current traffic and revenue are unknown.

Do not build a membership, AI treatment advisor, mobile app, large condition-page
factory, or multi-platform content automation yet.

## 8. Immediate implementation

This branch repairs home search submission, derives a shared search index, renders
22 directory links in HTML, adds common/botanical search and combined A–Z filters,
handles query text safely, exposes result status to assistive technologies, and
repairs navigation on home/directory at the mobile breakpoint. Both existing
directory variants are maintained. No medical copy, affiliate account, production
routing or production branch was changed.

The compatibility gate does not certify these profiles as editorially complete.
The live placeholder finding is the next urgent repair. This PR intentionally does
not expand discovery to all 50 data records or imply that they are ready.

Validation: 6 JavaScript DOM tests and 3 Python tests pass. Generated assets reproduce
byte-for-byte. JavaScript syntax checks pass. Live baseline behavior was reproduced.
Local browser preview was unavailable from the cloud browser; viewport rendering,
touch interactions and screen-reader testing remain preview acceptance work.

## 9. Critical decisions

No decision blocks this PR. Before monetization, confirm whether the Amazon tag
belongs to an approved account and whether a paid gardening planner fits the desired
positioning. Before the next publishing change, establish the actual hosting/build
configuration and access to Search Console/GA4 reports. Never paste credentials into
an issue or chat; use the provider's connection controls.

## Sources

- Live homepage: https://herbcraft.app/ (browser interaction verified).
- Live sampled profile responses: https://herbcraft.app/herbs/valerian and
  https://herbcraft.app/herbs/st-johns-wort (HTTP 200; placeholder text verified).
- Google scaled-content guidance: https://developers.google.com/search/docs/essentials/spam-policies
- Google generative-content guidance: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Epic Gardening disclosure: https://www.epicgardening.com/disclaimer/
- Rural Sprout disclosure: https://www.ruralsprout.com/affiliate-disclosure/
- University of Maryland Extension: https://extension.umd.edu/resource/growing-herbs-containers-and-indoors

Google's policy targets scaled content created primarily to manipulate rankings
rather than help people. Automation itself is not a substitute for original value.
