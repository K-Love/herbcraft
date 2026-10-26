import copy
import importlib.util
import json
import re
import subprocess
import sys
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('profile_build', ROOT / 'build.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.tags = []; self.text = []; self.scripts = []; self.script = None
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs); self.tags.append((tag, attrs))
        if tag == 'script' and attrs.get('type') == 'application/ld+json': self.script = ''
    def handle_data(self, data):
        self.text.append(data)
        if self.script is not None: self.script += data
    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            self.scripts.append(json.loads(self.script)); self.script = None

class ProfileBuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.herbs = json.loads((ROOT / 'herbs.json').read_text())
        cls.template = (ROOT / 'herb-template.html').read_text()

    def test_all_fifty_committed_profiles_match_validated_build(self):
        self.assertEqual(len(self.herbs), 50)
        for herb in self.herbs:
            with self.subTest(herb=herb['id']):
                output = build.generate_herb_page(herb, self.template)
                self.assertEqual(output, (ROOT / 'herbs' / (herb['id']+'.html')).read_text())
                page = Page(output); text = ''.join(page.text)
                for field in build.REQUIRED_FIELDS[1:]: self.assertIn(herb[field], text)
                self.assertEqual(len(page.scripts), 1)
                self.assertEqual(sum(tag == 'h1' for tag, attrs in page.tags), 1)
                self.assertIn('Source review pending.', text)
                self.assertNotIn('Author A.', text)
                self.assertNotIn('Recommended Products', text)
                article = next(x for x in page.scripts[0] if x['@type'] == 'Article')
                self.assertNotIn('citation', article)
                self.assertNotIn('logo', article['publisher'])
                self.assertNotIn('dateModified', article)
                self.assertEqual(article['datePublished'], herb['date_published'])

    def test_html_and_json_are_escaped_in_every_context(self):
        herb = copy.deepcopy(self.herbs[0])
        payload = '</script><img src=x onerror="alert(1)"> & "test"'
        for field in build.REQUIRED_FIELDS[1:]: herb[field] = payload
        herb['references'] = [payload]
        output = build.generate_herb_page(herb, self.template)
        page = Page(output)
        self.assertFalse(any(tag == 'img' for tag, attrs in page.tags))
        self.assertFalse(any('onerror' in attrs for tag, attrs in page.tags))
        self.assertIn(payload, ''.join(page.text))
        self.assertEqual(page.scripts[0][-1]['description'], payload)

    def test_unknown_tokens_and_example_copy_fail(self):
        for text in ['{{UNKNOWN_TOKEN}}', '[Herb Name]', 'This is a claim about an herb', 'Author A.']:
            with self.subTest(text=text), self.assertRaises(ValueError):
                build.generate_herb_page(self.herbs[0], self.template + text)

    def test_invalid_data_fails(self):
        for key, value in [('id','../escape'), ('overview',''), ('references','not a list'),
                           ('date_published','2026-02-30'), ('date_modified','2020-01-01')]:
            herb = copy.deepcopy(self.herbs[0]); herb[key] = value
            with self.subTest(key=key), self.assertRaises(ValueError):
                build.generate_herb_page(herb, self.template)

    def test_faq_html_and_schema_agree(self):
        for herb in self.herbs:
            visible = ''.join(Page(build.generate_faq_html(herb)).text)
            for item in build.build_faq_schema(herb)['mainEntity']:
                self.assertIn(item['name'], visible)
                self.assertIn(item['acceptedAnswer']['text'], visible)

    def test_dates_only_appear_when_recorded(self):
        herb = copy.deepcopy(self.herbs[0]); herb.pop('date_published')
        article = build.build_article_schema(herb)
        self.assertNotIn('datePublished', article)
        self.assertNotIn('dateModified', article)
        herb['date_modified'] = '2026-10-26'
        self.assertEqual(build.build_article_schema(herb)['dateModified'], '2026-10-26')

    def test_missing_references_have_honest_fallback(self):
        herb = copy.deepcopy(self.herbs[0]); herb['references'] = []
        self.assertIn('No source records have been added', build.generate_herb_page(herb,self.template))

    def fixture(self, root, herbs):
        (root/'build.py').write_text((ROOT/'build.py').read_text())
        (root/'herb-template.html').write_text(self.template)
        (root/'herbs.json').write_text(json.dumps(herbs))
        (root/'herbs').mkdir()

    def test_invalid_batch_does_not_partially_write(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); herbs = copy.deepcopy(self.herbs[:2]); herbs[1]['overview'] = ''
            self.fixture(root, herbs)
            target = root/'herbs'/f"{herbs[0]['id']}.html"; target.write_text('sentinel')
            result = subprocess.run([sys.executable,str(root/'build.py')],capture_output=True)
            self.assertNotEqual(result.returncode,0)
            self.assertEqual(target.read_text(),'sentinel')
            self.assertEqual(len(list((root/'herbs').iterdir())),1)

    def test_check_mode_rejects_stale_output_without_writing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); self.fixture(root, self.herbs[:1])
            result = subprocess.run([sys.executable,str(root/'build.py'),'--check'],capture_output=True)
            self.assertNotEqual(result.returncode,0)
            self.assertEqual(list((root/'herbs').iterdir()),[])

    def test_duplicate_ids_fail(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); self.fixture(root, [self.herbs[0],self.herbs[0]])
            result = subprocess.run([sys.executable,str(root/'build.py')],capture_output=True)
            self.assertNotEqual(result.returncode,0)
            self.assertIn(b'Duplicate herb IDs', result.stderr)

    def test_compatibility_entry_point_and_single_profile_check(self):
        for script in ['build.py','generate_herbs.py']:
            result = subprocess.run([sys.executable,str(ROOT/script),'--herb','valerian','--check'],capture_output=True)
            self.assertEqual(result.returncode,0,result.stderr)

if __name__ == '__main__': unittest.main()
