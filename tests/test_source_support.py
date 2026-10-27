import copy
import json
import unittest
from pathlib import Path
from html.parser import HTMLParser
import build
import source_support as sources

ROOT=Path(__file__).resolve().parents[1]
class SourcesTests(unittest.TestCase):
    def setUp(self):
        self.herbs=json.loads((ROOT/'herbs.json').read_text())
        self.pilot=next(h for h in self.herbs if h['id']=='ginger')

    def test_exactly_three_checked_profiles(self):
        self.assertEqual({h['id'] for h in self.herbs if sources.is_checked(h)}, {'ginger','peppermint','chamomile'})
        for h in self.herbs: sources.validate_sources(h)

    def test_modified_claim_requires_new_source_check(self):
        h=copy.deepcopy(self.pilot);h['benefits']='A new claim without a source check.'
        with self.assertRaisesRegex(ValueError,'content changed'): sources.validate_sources(h)

    def test_sources_require_complete_coverage(self):
        for change in ['missing','unknown','empty','url','duplicate','method']:
            h=copy.deepcopy(self.pilot)
            if change=='missing':del h['field_sources']['safety_info']
            if change=='unknown':h['field_sources']['safety_info']=['missing-source']
            if change=='empty':h['field_sources']['safety_info']=[]
            if change=='url':h['sources'][0]['url']='javascript:alert(1)'
            if change=='duplicate':h['sources'][1]['id']='nccih'
            if change=='method':h['source_check']['method']='Clinically approved'
            with self.subTest(change=change),self.assertRaises(ValueError):sources.validate_sources(h)

    def test_citation_targets_exist_and_source_links_match_schema(self):
        class Links(HTMLParser):
            def __init__(self,text):super().__init__();self.ids=set();self.hrefs=[];self.feed(text)
            def handle_starttag(self,tag,attrs):
                d=dict(attrs)
                if 'id' in d:self.ids.add(d['id'])
                if tag=='a':self.hrefs.append(d.get('href',''))
        for h in self.herbs:
            if not sources.is_checked(h):continue
            p=Links((ROOT/'herbs'/f"{h['id']}.html").read_text())
            for href in p.hrefs:
                if href.startswith('#source-'):self.assertIn(href[1:],p.ids)
            for src in h['sources']:self.assertIn(src['url'],p.hrefs)
            self.assertEqual({c['url'] for c in build.build_article_schema(h)['citation']},{s['url'] for s in h['sources']})

    def test_pending_profiles_do_not_gain_review_badges(self):
        h=next(h for h in self.herbs if h['id']=='turmeric')
        text=build.generate_herb_page(h,(ROOT/'herb-template.html').read_text())
        self.assertIn('Source review pending.',text)
        self.assertNotIn('Sources checked',text)
        self.assertNotIn('citation',build.build_article_schema(h))

if __name__=='__main__':unittest.main()
