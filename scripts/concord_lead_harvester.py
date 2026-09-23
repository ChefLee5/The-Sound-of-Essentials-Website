#!/usr/bin/env python3
"""
Education Concord Lead Harvester for The Sound of Essentials (SOE)
===================================================================
A lightweight, zero-Docker, native Python lead discovery and contact
enrichment engine designed to build targeted B2B contact lists for the
SOE Education Concord and Brevo Outreach Engine.

Target Segments:
  1. preschools: Montessori, Reggio Emilia, Private Pre-K (Brevo List 7 / 9)
  2. pediatric_clinics: Pediatric Occupational & Speech Therapy (Brevo List 8)
  3. independent_schools: Private & Independent Elementary (Brevo List 11)
  4. after_school: Music, Arts & Sensory Enrichment Programs (Brevo List 10)

Output:
  Clean, de-duplicated CSV ready for direct 1-click import into Brevo CRM.
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

import argparse
import base64
import csv
import json
import os
import re
import time
import urllib.parse
import urllib.request
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

# Segment configuration mapping to Brevo B2B templates & lists
SEGMENTS = {
    "preschools": {
        "label": "Preschool Chains & Early Learning Centers",
        "brevo_list": "List 7: Preschool Chains",
        "brevo_template": "B2B Template 1 / 3",
        "search_queries": [
            "Montessori preschools in {city_name} {state_code}",
            "private preschools in {city_name} {state_code}",
            "early childhood learning centers in {city_name} {state_code}",
            "reggio emilia preschool in {city_name} {state_code}"
        ],
        "osm_amenities": ["kindergarten", "childcare"]
    },
    "pediatric_clinics": {
        "label": "Pediatric OT & Speech Therapy Clinics",
        "brevo_list": "List 8: Pediatric Clinics (OT/SLP)",
        "brevo_template": "B2B Template 2",
        "search_queries": [
            "pediatric occupational therapy clinic in {city_name} {state_code}",
            "pediatric speech therapy in {city_name} {state_code}",
            "children sensory integration therapy {city_name} {state_code}",
            "pediatric physical therapy clinic in {city_name} {state_code}"
        ],
        "osm_amenities": []
    },
    "independent_schools": {
        "label": "Independent & Private Elementary Schools",
        "brevo_list": "List 11: Independent Schools",
        "brevo_template": "B2B Template 6",
        "search_queries": [
            "private elementary schools in {city_name} {state_code}",
            "Christian academy elementary in {city_name} {state_code}",
            "Waldorf school in {city_name} {state_code}",
            "Montessori elementary school in {city_name} {state_code}"
        ],
        "osm_amenities": ["school"]
    },
    "after_school": {
        "label": "After-School & Enrichment Programs",
        "brevo_list": "List 10: After-School Programs",
        "brevo_template": "B2B Template 5",
        "search_queries": [
            "children music academy after school in {city_name} {state_code}",
            "early childhood art music programs in {city_name} {state_code}",
            "kids sensory gym classes in {city_name} {state_code}"
        ],
        "osm_amenities": []
    }
}

SKIP_DOMAINS = [
    'yelp.com', 'yellowpages.com', 'greatschools.org', 'niche.com',
    'facebook.com', 'instagram.com', 'linkedin.com', 'wikipedia.org',
    'mapquest.com', 'expertise.com', 'care.com', 'thumbtack.com',
    'indeed.com', 'glassdoor.com', 'zippia.com', 'ziprecruiter.com',
    'tripadvisor.com', 'winnie.com', 'montessoricity.com', 'privateschoolreview.com',
    'childcarecenter.us', 'bbb.org', 'manta.com', 'chamberofcommerce.com',
    'google.com', 'yahoo.com', 'bing.com', 'usnews.com', 'zocdoc.com',
    'healthgrades.com', 'webmd.com', 'psychologytoday.com', 'independent.co.uk',
    'independent.com', 'merriam-webster.com', 'dictionary.com', 'britannica.com',
    'childrensplace.com', 'mdpi.com', 'cdc.gov', 'nih.gov', 'gov', 'edu',
    'cambridge.org', 'wiktionary.org', 'vocabulary.com', 'collinsdictionary.com',
    'thefreedictionary.com', 'macmillandictionary.com', 'target.com', 'walmart.com',
    'amazon.com', 'youtube.com', 'pinterest.com', 'twitter.com', 'x.com',
    'reddit.com', 'quora.com', 'thebump.com', 'parents.com', 'verywellfamily.com',
    'healthline.com', 'mayoclinic.org', 'clevelandclinic.org', 'hopkinsmedicine.org',
    'patch.com', 'dallasnews.com', 'austinchronicle.com', 'charlotteagenda.com',
    'seattlechildrens.org', 'childrens.com', 'childrenshospital.org'
]

REQUIRED_KEYWORDS = {
    "preschools": ['preschool', 'montessori', 'childcare', 'daycare', 'reggio', 'academy', 'kindergarten', 'pre-k', 'head start', 'infant', 'early learning'],
    "pediatric_clinics": ['therapy', 'clinic', 'pediatric', 'speech', 'occupational', 'sensory', 'ot clinic', 'slp clinic', 'peds', 'pediatrics', 'children'],
    "independent_schools": ['school', 'academy', 'elementary', 'christian academy', 'waldorf', 'montessori', 'preparatory', 'day school'],
    "after_school": ['music academy', 'art school', 'music lesson', 'after school', 'enrichment', 'sensory gym', 'dance academy']
}


def fetch_url(url, timeout=10):
    """Safely fetch HTML with standard browser headers."""
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content_type = resp.headers.get('Content-Type', '')
            if 'text/html' not in content_type and 'application/json' not in content_type:
                return ''
            return resp.read().decode('utf-8', errors='ignore')
    except Exception:
        return ''


def clean_company_name(raw_title, domain=""):
    """Clean SEO tags, prefixes, and location suffixes from company names."""
    title = raw_title.strip()
    # Strip common prefixes
    for prefix in ['Welcome to ', 'Home - ', 'About Us - ']:
        if title.lower().startswith(prefix.lower()):
            title = title[len(prefix):]
    # Split on common title dividers
    for sep in [' | ', ' - ', ' – ', ' — ', ' : ']:
        if sep in title:
            parts = title.split(sep)
            candidate = parts[0].strip()
            if candidate.lower() in ['home', 'welcome', 'about', 'about us', 'privateschool']:
                if len(parts) > 1 and len(parts[1].strip()) > 3:
                    candidate = parts[1].strip()
            if len(candidate) > 3:
                title = candidate
                break
    title = re.sub(r'\.{3,}$', '', title).strip()

    # Fallback if title is generic
    if title.lower() in ['home', 'welcome', 'about us', 'privateschool', 'home |privateschool']:
        if domain:
            parts = domain.split('.')
            main_part = parts[-2] if len(parts) >= 2 and parts[-1] in ['com', 'org', 'edu', 'net'] else parts[0]
            return main_part.replace('-', ' ').title()
    return title


def search_ddg(query, segment_key="", city="", max_results=10):
    """Search DuckDuckGo HTML without IP geolocation bias."""
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote_plus(query)
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception:
        return []

    soup = BeautifulSoup(html, 'html.parser')
    leads = []
    req_keywords = REQUIRED_KEYWORDS.get(segment_key, [])
    guide_terms = ('ultimate guide', 'guide to', 'how to choose', 'rankings', 'reviews of', 'cost of', 'directory', 'jobs', 'careers')

    for snip in soup.find_all('a', class_='result__snippet'):
        p_url = snip.find_previous('a', class_='result__url')
        p_h2 = snip.find_previous('h2')
        if not p_url or not p_h2:
            continue

        title = p_h2.get_text(strip=True)
        snippet = snip.get_text(strip=True)
        raw_href = p_url.get('href', '')

        # Decode uddg destination URL
        actual_url = ""
        parsed_href = urllib.parse.urlparse(raw_href)
        qs = urllib.parse.parse_qs(parsed_href.query)
        if 'uddg' in qs:
            actual_url = qs['uddg'][0]
        else:
            text_url = p_url.get_text(strip=True)
            if not text_url.startswith('http'):
                actual_url = f"https://{text_url}"
            else:
                actual_url = text_url

        parsed = urllib.parse.urlparse(actual_url)
        netloc = parsed.netloc.lower()

        if any(skip in netloc for skip in SKIP_DOMAINS) or not netloc:
            continue
        if any(term in title.lower() for term in guide_terms):
            continue

        combined_all = f"{title.lower()} {snippet.lower()} {netloc}"
        if req_keywords and not any(kw in combined_all for kw in req_keywords):
            continue

        base_url = f"{parsed.scheme}://{parsed.netloc}/"
        clean_name = clean_company_name(title, domain=netloc)

        leads.append({
            "name": clean_name,
            "website": base_url,
            "source": "duckduckgo_search"
        })
        if len(leads) >= max_results:
            break

    return leads


def search_bing(query, segment_key="", city="", max_results=10):
    """High-reliability web search using Bing with geographic & keyword enforcement."""
    encoded = urllib.parse.quote_plus(query)
    url = f"https://www.bing.com/search?q={encoded}"
    html = fetch_url(url, timeout=10)
    if not html:
        return []

    soup = BeautifulSoup(html, 'html.parser')
    leads = []

    informational_prefixes = ('what is', 'how to', 'why ', 'definition', 'the history of', 'top 10', 'best ', 'a guide to')
    guide_terms = ('ultimate guide', 'guide to', 'how to choose', 'rankings', 'reviews of', 'cost of', 'directory')
    req_keywords = REQUIRED_KEYWORDS.get(segment_key, [])

    # Geo terms for regional filtering
    city_parts = [p.strip().lower() for p in city.split(',') if p.strip()]
    city_name = city_parts[0] if len(city_parts) > 0 else ""
    state_code = city_parts[1] if len(city_parts) > 1 else ""

    for li in soup.find_all('li', class_='b_algo'):
        h2 = li.find('h2')
        a = li.find('a')
        if not h2 or not a:
            continue

        raw_title = h2.get_text(strip=True)
        if any(raw_title.lower().startswith(p) for p in informational_prefixes):
            continue
        if any(term in raw_title.lower() for term in guide_terms):
            continue

        caption = ""
        p_tag = li.find('p')
        if p_tag:
            caption = p_tag.get_text(strip=True)

        href = a.get('href', '')
        actual_url = href

        # Decode Bing redirect URL
        m = re.search(r'u=a1([a-zA-Z0-9_-]+)', href)
        if m:
            b64 = m.group(1).replace('-', '+').replace('_', '/')
            b64 += '=' * (-len(b64) % 4)
            try:
                actual_url = base64.b64decode(b64).decode('utf-8', errors='ignore')
            except Exception:
                actual_url = href

        parsed = urllib.parse.urlparse(actual_url)
        netloc = parsed.netloc.lower()

        if any(skip in netloc for skip in SKIP_DOMAINS) or not netloc:
            continue

        # Regional check: ensure hit mentions city or state, or URL contains city
        combined_all = f"{raw_title.lower()} {caption.lower()} {netloc}"
        if city_name and state_code:
            if city_name not in combined_all and state_code not in combined_all:
                continue

        # Segment check: ensure hit matches educational/clinical domain
        if req_keywords:
            if not any(kw in combined_all for kw in req_keywords):
                continue

        base_url = f"{parsed.scheme}://{parsed.netloc}/"
        clean_name = clean_company_name(raw_title, domain=netloc)

        leads.append({
            "name": clean_name,
            "website": base_url,
            "source": "bing_search"
        })

        if len(leads) >= max_results:
            break

    return leads


def search_osm_leads(city, amenities):
    """Query OpenStreetMap Overpass API for registered local childcare/schools/clinics."""
    if not amenities:
        return []

    city_name = city.split(',')[0].strip()
    amenity_filters = "\n".join([f'  node["amenity"="{a}"](area.searchArea);\n  way["amenity"="{a}"](area.searchArea);' for a in amenities])
    query = f"""
    [out:json][timeout:25];
    area["name"="{city_name}"]->.searchArea;
    (
    {amenity_filters}
    );
    out center 35;
    """

    overpass_url = "https://overpass-api.de/api/interpreter"
    req = urllib.request.Request(
        overpass_url,
        data=urllib.parse.urlencode({'data': query}).encode('utf-8'),
        headers={'User-Agent': 'SOEEducationConcordScraper/1.0 (info@soelearn.com)'}
    )

    leads = []
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for el in data.get('elements', []):
                tags = el.get('tags', {})
                name = tags.get('name')
                if not name or 'unnamed' in name.lower():
                    continue
                phone = tags.get('phone', tags.get('contact:phone', ''))
                website = tags.get('website', tags.get('contact:website', ''))
                addr_num = tags.get('addr:housenumber', '')
                addr_street = tags.get('addr:street', '')
                addr = f"{addr_num} {addr_street}".strip()

                leads.append({
                    "name": clean_company_name(name),
                    "phone": phone.strip(),
                    "website": website.strip() if website.startswith('http') else (f"http://{website}" if website else ""),
                    "address": addr,
                    "source": "osm_registry"
                })
    except Exception:
        pass

    return leads


def resolve_website(name, city):
    """Fallback search to find a school/clinic's official website if missing from OSM."""
    query = f'"{name}" "{city}"'
    hits = search_bing(query, segment_key="", city=city, max_results=2)
    if hits:
        return hits[0]['website']
    return ""


def extract_contact_info(website_url):
    """Scan homepage and /contact pages for direct emails (including mailto), phones, and socials."""
    if not website_url or not website_url.startswith('http'):
        return {"email": "", "phone": "", "socials": []}

    emails = set()
    phones = set()
    socials = set()

    parsed = urllib.parse.urlparse(website_url)
    base = f"{parsed.scheme}://{parsed.netloc}"

    pages_to_check = [website_url]
    discovered_links = set()

    email_regex = re.compile(r'\b[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.(?:com|org|edu|net|io|co|us)\b', re.IGNORECASE)
    phone_regex = re.compile(r'(?:\+?1[-.\s]?)?\(?([2-9]\d{2})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})')

    bad_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.css', '.js', '.woff', '.woff2')
    bad_keywords = ('wixpress', 'sentry', 'domain', 'example', 'support@wix', 'wordpress', 'cloudflare', 'schema.org', 'simplypsychology', 'sample', 'no-reply', 'noreply')

    # First fetch homepage to find contacts + discover contact subpage URLs
    home_html = fetch_url(website_url, timeout=8)
    if home_html:
        soup = BeautifulSoup(home_html, 'html.parser')

        # 1. Check mailto: links (highest accuracy)
        for a in soup.find_all('a', href=True):
            href = a['href'].strip()
            if href.lower().startswith('mailto:'):
                clean_mail = href[7:].split('?')[0].strip()
                if clean_mail and not any(bad in clean_mail.lower() for bad in bad_keywords):
                    emails.add(clean_mail)
            elif any(sub in href.lower() for sub in ['/contact', '/about', '/staff', '/leadership', '/team', '/admissions']):
                full_sub = urllib.parse.urljoin(base, href)
                if full_sub.startswith(base) and full_sub not in pages_to_check:
                    discovered_links.add(full_sub)

        # 2. Text regex on homepage
        for e in email_regex.findall(home_html):
            e_lower = e.lower().strip()
            if not any(e_lower.endswith(ext) for ext in bad_extensions) and not any(bad in e_lower for bad in bad_keywords):
                emails.add(e)

        for match in phone_regex.finditer(home_html):
            formatted_phone = f"({match.group(1)}) {match.group(2)}-{match.group(3)}"
            phones.add(formatted_phone)

        for a in soup.find_all('a', href=True):
            href = a['href'].lower()
            if 'facebook.com/' in href or 'instagram.com/' in href or 'linkedin.com/company' in href:
                socials.add(a['href'].strip())

    # Add up to 2 discovered internal contact/about pages
    pages_to_check.extend(list(discovered_links)[:2])
    if len(pages_to_check) == 1:
        # Fallback standard contact URLs
        pages_to_check.extend([
            urllib.parse.urljoin(base, '/contact'),
            urllib.parse.urljoin(base, '/contact-us')
        ])

    for page_url in pages_to_check[1:]:
        if emails and phones:
            break
        html = fetch_url(page_url, timeout=7)
        if not html:
            continue

        soup = BeautifulSoup(html, 'html.parser')
        for a in soup.find_all('a', href=True):
            href = a['href'].strip()
            if href.lower().startswith('mailto:'):
                clean_mail = href[7:].split('?')[0].strip()
                if clean_mail and not any(bad in clean_mail.lower() for bad in bad_keywords):
                    emails.add(clean_mail)

        for e in email_regex.findall(html):
            e_lower = e.lower().strip()
            if not any(e_lower.endswith(ext) for ext in bad_extensions) and not any(bad in e_lower for bad in bad_keywords):
                emails.add(e)

        for match in phone_regex.finditer(html):
            formatted_phone = f"({match.group(1)}) {match.group(2)}-{match.group(3)}"
            phones.add(formatted_phone)

        for a in soup.find_all('a', href=True):
            href = a['href'].lower()
            if 'facebook.com/' in href or 'instagram.com/' in href or 'linkedin.com/company' in href:
                socials.add(a['href'].strip())

    # Prioritize leadership/office emails
    primary_email = ""
    if emails:
        priority = ['director', 'admin', 'admissions', 'office', 'info', 'contact', 'hello', 'therapy', 'intake']
        sorted_emails = sorted(list(emails), key=lambda em: next((i for i, p in enumerate(priority) if p in em.lower()), 99))
        primary_email = sorted_emails[0]

    primary_phone = list(phones)[0] if phones else ""

    return {
        "email": primary_email,
        "phone": primary_phone,
        "socials": list(socials)[:3]
    }


def harvest_concord_leads(segment_key, city, limit=30):
    """Full discovery + enrichment pipeline for a target Concord segment."""
    cfg = SEGMENTS.get(segment_key)
    if not cfg:
        print(f"Unknown segment: {segment_key}. Available: {list(SEGMENTS.keys())}")
        return []

    print(f"\n=======================================================")
    print(f"  SOE Education Concord Lead Harvester")
    print(f"  Segment:  {cfg['label']}")
    print(f"  Target:   {city}")
    print(f"  Brevo:    {cfg['brevo_list']} ({cfg['brevo_template']})")
    print(f"=======================================================\n")

    candidates = {}

    city_parts = [p.strip() for p in city.split(',') if p.strip()]
    city_name = city_parts[0] if len(city_parts) > 0 else city
    state_code = city_parts[1] if len(city_parts) > 1 else ""

    # 1. Search Engine Discovery (DuckDuckGo primary + Bing secondary)
    for query_template in cfg['search_queries']:
        q = query_template.format(city_name=city_name, state_code=state_code)
        print(f"[*] Discovering candidates: {q}...")
        ddg_hits = search_ddg(q, segment_key=segment_key, city=city, max_results=8)
        for h in ddg_hits:
            domain = urllib.parse.urlparse(h['website']).netloc.lower()
            if domain and domain not in candidates:
                candidates[domain] = h

        if len(candidates) < limit:
            bing_hits = search_bing(q, segment_key=segment_key, city=city, max_results=8)
            for h in bing_hits:
                domain = urllib.parse.urlparse(h['website']).netloc.lower()
                if domain and domain not in candidates:
                    candidates[domain] = h
        time.sleep(1)

    # 2. OpenStreetMap Discovery (Municipal boundary)
    if cfg['osm_amenities']:
        print(f"[*] Querying OpenStreetMap municipal registry for {city_name}...")
        osm_hits = search_osm_leads(city, cfg['osm_amenities'])
        for h in osm_hits:
            if h.get('website'):
                domain = urllib.parse.urlparse(h['website']).netloc.lower()
                if domain and domain not in candidates:
                    candidates[domain] = h
            else:
                key = h['name'].lower()
                if key not in candidates:
                    candidates[key] = h

    candidate_list = list(candidates.values())[:limit]
    print(f"\n[*] Found {len(candidate_list)} unique candidates. Starting contact enrichment...\n")

    enriched_leads = []

    # 3. Concurrent Website Enrichment (3 worker threads)
    def process_candidate(lead):
        website = lead.get('website', '')
        if not website and lead.get('name'):
            website = resolve_website(lead['name'], city)
            lead['website'] = website

        contact = extract_contact_info(website)
        email = contact['email']
        phone = lead.get('phone') or contact['phone']
        socials = contact['socials']

        return {
            "COMPANY": lead['name'],
            "WEBSITE": website,
            "EMAIL": email,
            "PHONE": phone,
            "CITY": city_name,
            "STATE": state_code,
            "SEGMENT": cfg['label'],
            "BREVO_LIST": cfg['brevo_list'],
            "BREVO_TEMPLATE": cfg['brevo_template'],
            "SOCIALS": " | ".join(socials)
        }

    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [executor.submit(process_candidate, l) for l in candidate_list]
        for f in as_completed(futures):
            try:
                enriched = f.result()
                enriched_leads.append(enriched)
                status_icon = "✓" if enriched['EMAIL'] else "•"
                print(f"  {status_icon} {enriched['COMPANY'][:35]:<35} | Phone: {enriched['PHONE'] or 'N/A':<15} | Email: {enriched['EMAIL'] or '(site visited)'}")
            except Exception:
                pass

    return enriched_leads


def save_to_brevo_csv(leads, output_path):
    """Write Brevo-ready CSV."""
    if not leads:
        print("No leads to save.")
        return

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    fieldnames = ["COMPANY", "EMAIL", "PHONE", "WEBSITE", "CITY", "STATE", "SEGMENT", "BREVO_LIST", "BREVO_TEMPLATE", "SOCIALS"]

    with open(output_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in leads:
            writer.writerow(row)

    print(f"\n[+] Exported {len(leads)} leads to Brevo-ready CSV: {output_path}")


def sync_leads_to_brevo_api(leads, brevo_api_key, list_id):
    """Direct API push to Brevo CRM list."""
    if not brevo_api_key or not leads:
        return

    print(f"\n[*] Syncing leads directly into Brevo List ID: {list_id}...")
    synced = 0
    for lead in leads:
        email = lead.get('EMAIL')
        if not email:
            continue
        payload = {
            "email": email.strip().lower(),
            "attributes": {
                "FIRSTNAME": lead['COMPANY'][:35],
                "LANDLINE_NUMBER": lead['PHONE'],
                "SOURCE": f"Concord: {lead['SEGMENT']} ({lead['CITY']})",
                "JOB_TITLE": "Director / Clinical Lead",
                "PERSONA": "institutional"
            },
            "listIds": [int(list_id)],
            "updateEnabled": True
        }
        req = urllib.request.Request(
            "https://api.brevo.com/v3/contacts",
            data=json.dumps(payload).encode('utf-8'),
            headers={
                "Content-Type": "application/json",
                "api-key": brevo_api_key
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status in (200, 201, 204):
                    synced += 1
        except Exception:
            pass

    print(f"[+] Successfully synced {synced} contacts into Brevo CRM List {list_id}.")


def main():
    parser = argparse.ArgumentParser(description="SOE Education Concord Lead Harvester")
    parser.add_argument("--segment", choices=list(SEGMENTS.keys()), default="preschools", help="Target education segment")
    parser.add_argument("--city", default="Austin, TX", help="City and State (e.g. 'Austin, TX', 'Dallas, TX', 'Charlotte, NC')")
    parser.add_argument("--limit", type=int, default=20, help="Maximum leads to discover")
    parser.add_argument("--output", default="", help="Output CSV path (default: leads/concord_{segment}_{city}.csv)")
    parser.add_argument("--sync-brevo", action="store_true", help="Sync enriched contacts directly to Brevo CRM via REST API")
    parser.add_argument("--brevo-key", default=os.environ.get("BREVO_API_KEY", ""), help="Brevo API Key (or set BREVO_API_KEY env)")
    parser.add_argument("--brevo-list-id", type=int, default=0, help="Brevo target List ID (default from segment)")

    args = parser.parse_args()

    city_slug = re.sub(r'[^a-zA-Z0-9]+', '_', args.city).strip('_').lower()
    output_file = args.output or f"leads/concord_{args.segment}_{city_slug}.csv"

    leads = harvest_concord_leads(args.segment, args.city, limit=args.limit)
    save_to_brevo_csv(leads, output_file)

    with_email = sum(1 for l in leads if l['EMAIL'])
    with_phone = sum(1 for l in leads if l['PHONE'])
    print(f"\n[*] Harvesting Summary:")
    print(f"    - Total Identified:  {len(leads)}")
    print(f"    - With Direct Email: {with_email} ({int(with_email/len(leads)*100 if leads else 0)}%)")
    print(f"    - With Phone Number: {with_phone} ({int(with_phone/len(leads)*100 if leads else 0)}%)")
    print(f"    - Ready for Brevo import at: {output_file}\n")

    if args.sync_brevo and args.brevo_key and args.brevo_list_id:
        sync_leads_to_brevo_api(leads, args.brevo_key, args.brevo_list_id)


if __name__ == "__main__":
    main()

