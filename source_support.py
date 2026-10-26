"""Traceable source checks for editorial summaries, never clinical approval."""
import hashlib
import json
import re
from datetime import date
from html import escape
from urllib.parse import urlsplit

CHECKED_FIELDS = ('scientific','plant_family','origin','category','overview','traditional',
                  'active_compounds','benefits','safety_info','growing_notes')


def is_checked(herb):
    return herb.get('source_check', {}).get('status') == 'source_checked'


def content_digest(herb):
    content = json.dumps({k: herb[k] for k in sorted(herb['field_sources'])},sort_keys=True,ensure_ascii=False)
    return hashlib.sha256(content.encode()).hexdigest()


def validate_sources(herb):
    check = herb.get('source_check')
    if check is None:
        if herb.get('sources') or herb.get('field_sources'):
            raise ValueError('Source metadata requires an explicit source check')
        return
    if not isinstance(check,dict) or check.get('status') != 'source_checked':
        raise ValueError('Unknown source-check status')
    date.fromisoformat(check['checked_on'])
    if check.get('method') != 'AI-assisted comparison with the cited sources; not a clinical review.':
        raise ValueError('Source-check method must describe its actual limits')
    sources=herb.get('sources',[]); ids=[]
    if not isinstance(sources,list) or not sources: raise ValueError('Missing sources')
    for source in sources:
        if not isinstance(source,dict): raise ValueError('Invalid source record')
        if not all(isinstance(source.get(k),str) and source[k].strip() for k in ('id','title','publisher','url','accessed')):
            raise ValueError('Incomplete source')
        if not re.fullmatch('[a-z][a-z0-9-]*',source['id']): raise ValueError('Invalid source ID')
        url=urlsplit(source['url'])
        if url.scheme!='https' or not url.hostname or url.username or url.password:
            raise ValueError('Source URL must use HTTPS without credentials')
        date.fromisoformat(source['accessed']);ids.append(source['id'])
    if len(ids)!=len(set(ids)):raise ValueError('Duplicate source IDs')
    mapping=herb.get('field_sources',{})
    if not isinstance(mapping,dict) or set(mapping)!=set(CHECKED_FIELDS): raise ValueError('Every reviewed field needs source coverage')
    for field, refs in mapping.items():
        if not isinstance(herb.get(field),str) or not herb[field].strip(): raise ValueError('Missing reviewed text')
        if not isinstance(refs,list) or not refs or any(ref not in ids for ref in refs):
            raise ValueError('Unknown or empty field citation')
    if content_digest(herb)!=check.get('content_sha256'):
        raise ValueError('Reviewed content changed: recheck sources before updating the content digest')


def citations(herb,field):
    if not is_checked(herb):return ''
    numbers={source['id']:i+1 for i,source in enumerate(herb['sources'])}
    refs=herb['field_sources'].get(field,[])
    return ''.join(f' <sup class="citation"><a href="#source-{ref}" aria-label="Source {numbers[ref]}">[{numbers[ref]}]</a></sup>' for ref in refs)


def references(herb):
    return '<ol class="references-list">'+''.join(
        f'<li id="source-{s["id"]}" tabindex="-1"><a href="{escape(s["url"],quote=True)}">{escape(s["title"])}</a> — {escape(s["publisher"])}. Accessed {escape(s["accessed"])}.</li>'
        for s in herb['sources'])+'</ol>'
