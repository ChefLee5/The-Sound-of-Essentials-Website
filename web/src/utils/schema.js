/**
 * schema.js — Schema.org JSON-LD generators for SOE Rhythm Quest
 *
 * Each function returns a plain object (or array) ready to be passed
 * to the <JsonLd data={...} /> component.
 */

import heroesData from '../data/heroes.json';
import tracksData from '../data/tracks.json';
import landsData  from '../data/lands.json';
import productsData from '../data/products.json';

const SITE_URL  = 'https://cheflee5.github.io/SOE-Website';
const SITE_NAME = 'The Sound of Essentials: Rhythm Quest';
const ORG_LOGO  = `${SITE_URL}/assets/marketing/quest-collage.webp`;

/* ─────────────────────────────────────────────
 * Home — EducationalOrganization + WebSite
 * ───────────────────────────────────────────── */
export function homeSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: ORG_LOGO,
      description: 'A music-powered educational experience designed for the developing brain. 19 original tracks, 15 hero characters, and 7 thematic lands guide children Pre-K through Grade 3 through language, math, movement, science, and more.',
      foundingDate: '2024',
      sameAs: [],
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
      audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
        suggestedMinAge: 3,
        suggestedMaxAge: 9,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}

/* ─────────────────────────────────────────────
 * Heroes — ItemList of Person entities
 * ───────────────────────────────────────────── */
export function heroesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SOE Rhythm Quest Heroes',
    description: '15 hero characters who guide children through music-powered learning across 7 thematic lands.',
    numberOfItems: heroesData.length,
    itemListElement: heroesData.map((hero, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: hero.name,
        jobTitle: hero.title,
        description: hero.bio,
        image: `${SITE_URL}${hero.selfie}`,
        knowsAbout: hero.traits,
        memberOf: {
          '@type': 'Organization',
          name: `Land of ${hero.land}`,
        },
      },
    })),
  };
}

/* ─────────────────────────────────────────────
 * Media Room — MusicAlbum + MusicRecording[]
 * ───────────────────────────────────────────── */
export function mediaRoomSchema(trackTitles) {
  // trackTitles is an array of { id, title, domain } from the translated component
  const titleMap = {};
  if (trackTitles) {
    trackTitles.forEach(t => { titleMap[t.id] = t; });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: 'The Sound of Essentials: Rhythm Quest',
    description: '19 original educational tracks designed for the developing brain, covering language, math, movement, time, nature, and more.',
    numTracks: tracksData.length,
    genre: ['Children\'s Music', 'Educational'],
    byArtist: {
      '@type': 'MusicGroup',
      name: 'Sound of Essentials',
    },
    image: `${SITE_URL}/assets/marketing/quest-collage.webp`,
    track: tracksData.map((track, i) => ({
      '@type': 'MusicRecording',
      position: i + 1,
      name: titleMap[track.id]?.title || track.slug.replace(/-/g, ' '),
      description: titleMap[track.id]?.domain || track.domainIcon,
      image: `${SITE_URL}/assets/track-art/${track.cover}`,
      genre: 'Educational',
      inAlbum: {
        '@type': 'MusicAlbum',
        name: 'The Sound of Essentials: Rhythm Quest',
      },
    })),
  };
}

/* ─────────────────────────────────────────────
 * Universe — Course with CoursePart for each land
 * ───────────────────────────────────────────── */
export function universeSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'The SOE Rhythm Quest Universe',
    description: 'A music-powered curriculum spanning 7 thematic lands, each focusing on a developmental domain from language and math to movement and science.',
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    educationalLevel: 'Pre-K through Grade 3',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      suggestedMinAge: 3,
      suggestedMaxAge: 9,
    },
    hasPart: landsData.map((land, i) => ({
      '@type': 'Course',
      position: i + 1,
      name: land.name,
      description: `${land.focus} — guided by ${land.duoLabel}`,
      image: `${SITE_URL}/assets/lands/${land.panorama}`,
      educationalLevel: 'Pre-K through Grade 3',
      teaches: land.focus,
    })),
  };
}

/* ─────────────────────────────────────────────
 * Products — Product + Offer for each item
 * ───────────────────────────────────────────── */
export function productsSchema() {
  return productsData.map(product => ({
    '@context': 'https://schema.org',
    '@type': product.type === 'music-album' ? 'MusicAlbum' : 'Product',
    name: product.name,
    description: product.description,
    image: `${SITE_URL}${product.cover}`,
    brand: {
      '@type': 'Brand',
      name: 'Sound of Essentials',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      suggestedMinAge: 3,
      suggestedMaxAge: 9,
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: product.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'Sound of Essentials',
      },
    },
    ...(product.isbn ? { isbn: product.isbn } : {}),
    ...(product.features ? {
      additionalProperty: product.features.map(f => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: f,
      })),
    } : {}),
  }));
}
