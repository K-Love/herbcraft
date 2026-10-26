# Source-check pilot: ginger, peppermint and German chamomile

Prepared October 26, 2026. Built on the publishing repair in PR #18. The PR for
this pilot targets `fix/profile-publishing` so only the additional pilot work is
shown. Merge/rebase onto main after that prerequisite is reviewed and merged.

## Editorial scope

Three existing profiles were rewritten against NIH NCCIH health summaries and NC
State Extension botanical/horticultural pages. This was an AI-assisted comparison
with the cited sources, NOT review by a clinician, systematic review of primary
studies, or endorsement from either source institution. No clinical credential,
professional reviewer, efficacy rating or product testing has been invented.

- Ginger: distinguish supplements from foods; qualify evidence by indication;
  retain uncertainties and adverse-effect/pregnancy/medication cautions.
- Peppermint: separate leaf tea from concentrated oil and enteric-coated capsules;
  retain limited evidence and warnings about young children and side effects.
- Chamomile: identify German chamomile; do not extrapolate to Roman chamomile;
  replace a general relaxation claim with limited clinical evidence, and include
  allergy, interaction, pregnancy and estrogen-sensitive-condition cautions.
- Add brief growing notes based on Extension guidance. No plant-identification or
  foraging advice, dosage recommendations, or treatment selection was added.

The other 47 profiles remain source-review-pending, with byte-identical HTML to
PR #18. Data consumers that read herbs.json receive the revised summaries. The
legacy `herb-detail.js` still embeds older summaries: the production route check
must establish that static pages are served before release. Resolving that legacy
rendering path is a separate deployment prerequisite, not a claim of this pilot.

## Source register and coverage

| Profile | Health evidence, preparation limits, history, safety | Botanical identity, family, origin, growing notes |
|---|---|---|
| Ginger | https://www.nccih.nih.gov/health/ginger | https://plants.ces.ncsu.edu/plants/zingiber-officinale/ |
| Peppermint | https://www.nccih.nih.gov/health/peppermint-oil | https://plants.ces.ncsu.edu/plants/mentha-x-piperita/ |
| German chamomile | https://www.nccih.nih.gov/health/chamomile | https://plants.ces.ncsu.edu/plants/matricaria-chamomilla/ |

All six pages were opened and read for the relevant sections on October 26, 2026.
Source access date is distinct from the source publication/update date. Category
labels and summary scope are editorial organization, not efficacy classifications.
The preparation sections intentionally avoid claiming isolated compounds have
clinical effects. Source links are attached at section/field level; they are not
assertions that every word is a quotation or that all evidence has been surveyed.

## Reusable data standard

Each checked record adds:

- `sources`: stable local ID, actual title, publisher, HTTPS URL and access date.
- `field_sources`: source IDs for all reviewed factual/summary fields.
- `source_check`: explicit status, check date, actual method and content digest.
- `date_modified`: date these summaries were edited; never automatic on rebuild.
- `growing_notes`: short practical horticultural guidance tied to its source.

The generator creates numbered references, per-section links, cited FAQ answers,
and matching Article citation metadata. It renders a truthful source-check status
rather than a medical approval badge. Unknown source IDs, missing field coverage,
unsafe URLs, missing metadata or changed checked text fail validation.

The digest detects text changes after review. It cannot prove that a source supports
a claim, that a website has not changed, or that a summary is medically complete.
Never refresh the digest merely to silence a failure: compare the edited passage
against its source, record the new check date, and preserve evidence limitations.
Source changes, contrary evidence or meaningful edits trigger a new check.

## Verification

```sh
python3 -m unittest discover -s tests -p 'test_*.py' -v
python3 build.py --check
```

16 tests pass, including citation-target resolution, schema/reference agreement,
checked-text drift, coverage failures and pending-profile isolation. All 50 files
are reproducible, and only the three pilot profile HTML files change. GitHub CI
now includes both the original build tests and the new source tests.

Real-browser mobile rendering, full source/clinical review and production routing
remain release checks. No merge, production deployment or affiliate change is
included.

## Next practical milestone

Confirm the static profile routes in a deployment preview and review the three
summaries. Then use the cited growing data to build a small container-gardening
comparison/checklist. Validate interest in a printable planner before creating a
large product or scaling medical-topic pages. Source-check the next small batch
only after the pilot format and workflow are accepted.
