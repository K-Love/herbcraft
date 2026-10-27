# Profile publishing repair

This change repairs the existing 50 generated profiles. It does not add new herbs,
certify medical accuracy, change production routing, or deploy the site.

## What changed

- `build.py` now fills names, scientific names, main article sections, and source
  records from `herbs.json`. Text and attributes are HTML-escaped; JSON-LD cannot
  break out of its script element. Visible FAQ answers and FAQ structured data
  use the same source.
- `generate_herbs.py` delegates to the same generator, including command-line flags.
- Example citations and unverified structured citations are removed. Existing
  reference identifiers appear as source records explicitly awaiting verification.
- Profile pages and homepage copy describe that limitation; no clinical approval,
  professional review, or complete citation coverage is implied.
- Generic “high-quality”/“organic” product recommendation cards and their unverified
  affiliate assertion are removed from profile output. Affiliate data remains in
  the dataset for future review. Condition-page commerce is outside this change.
- Article metadata uses only recorded publication/modification dates. A rebuild
  does not create an editorial update date. The nonexistent publisher logo and
  the invalid standalone MedicalEntity properties are removed.
- Profile navigation points to real directory/explorer routes instead of nonexistent
  homepage anchors. Existing canonical/routing conventions are unchanged.

## Build and validation

```sh
python3 build.py
python3 build.py --herb valerian
python3 build.py --check
python3 generate_herbs.py --herb valerian --check
python3 -m unittest discover -s tests -p 'test_profile_build.py' -v
```

The build validates every selected record and renders all selected pages before
writing any. A content/template validation failure leaves existing files intact.
This is not a transaction against filesystem errors during the write phase.
`--check` never rewrites output; stale or missing pages fail with a nonzero exit.
Commit generated HTML with source changes. The GitHub workflow checks both the
regression suite and committed output on pull requests and pushes to main.

Tests cover every generated profile, valid JSON-LD, one H1 per profile, required
content, placeholder rejection, escaping, missing fields, duplicate/unsafe IDs,
invalid dates, missing references, FAQ parity, unchanged timestamps, and no partial
writes on content-validation failure. They do not perform clinical verification,
full schema.org vocabulary validation, or real-browser/mobile layout testing.

## Remaining gates before growth

1. Review the existing dataset claim by claim. Replace source identifiers with
   exact source URLs, titles, supported claims and review dates. Existing safety
   summaries may be incomplete; the build repair does not resolve that.
2. Reconcile host routing with the generated static pages and legacy detail script.
   Confirm clean-URL responses and canonical redirects in the deployment preview.
3. Apply the same content-integrity checks to condition pages and interactive tools.
4. Choose a small gardening-content pilot and verify sources before expanding.
5. Confirm affiliate account ownership and select actual products before restoring
   commercial recommendations.

The search/discovery PR (#17) is independent. This PR can be reviewed separately;
merging either one does not automatically complete the other. No merge or production
publication was performed during this task.
