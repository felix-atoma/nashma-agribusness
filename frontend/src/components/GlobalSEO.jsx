// components/GlobalSEO.jsx
// Site-wide SEO defaults. Per-page overrides live in each page's own <Helmet>.
// GTM + Google Ads scripts are in index.html (pre-JS, crawler-visible).
// This file handles: meta tags, Open Graph, Twitter cards, JSON-LD structured data.

import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.nashmaagribusiness.com';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    // ── Organization ─────────────────────────────────────────────────────
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      'name': 'Nashma Agribusiness Ltd',
      'alternateName': ['Nashma Agri', 'Nashma Agribusiness', 'Nashma Cocoa Potash'],
      'url': BASE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${BASE_URL}/nashma-removebg-preview.png`,
        'width': 200,
        'height': 60,
      },
      'description':
        'Nashma Agribusiness Ltd is a Ghana-based social enterprise producing organic cocoa potash, training women and youth in potash making, and supplying agro-commodities across Ghana and Africa.',
      'foundingDate': '2014',
      'telephone': ['+233545086577', '+233243241649'],
      'email': 'info@nashmaagribusiness.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Apemso-KNUST',
        'addressLocality': 'Kumasi',
        'addressRegion': 'Ashanti Region',
        'postalCode': '',
        'addressCountry': 'GH',
      },
      'areaServed': [
        { '@type': 'Country', 'name': 'Ghana' },
        { '@type': 'Place', 'name': 'West Africa' },
        { '@type': 'Place', 'name': 'Africa' },
      ],
      'knowsAbout': [
        'Cocoa Potash Production',
        'Organic Farming',
        'Women Empowerment in Agriculture',
        'Sustainable Agribusiness',
        'African Black Soap',
        'Potash Making Training',
        'Cocoa Pod Processing',
      ],
      'contactPoint': [
        {
          '@type': 'ContactPoint',
          'telephone': '+233545086577',
          'contactType': 'sales',
          'availableLanguage': ['English', 'Twi'],
          'areaServed': 'GH',
        },
        {
          '@type': 'ContactPoint',
          'telephone': '+233243241649',
          'contactType': 'customer service',
          'availableLanguage': 'English',
        },
      ],
      'sameAs': [
        'https://web.facebook.com/profile.php?id=61569281702237',
        'https://www.instagram.com/nashma_agribusiness/',
        'https://www.tiktok.com/@nasma_agribusines_ltd',
      ],
    },

    // ── Local Business ────────────────────────────────────────────────────
    {
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#localbusiness`,
      'name': 'Nashma Agribusiness Ltd',
      'image': `${BASE_URL}/nashma-removebg-preview.png`,
      'priceRange': '$$',
      'currenciesAccepted': 'GHS',
      'paymentAccepted': 'Cash, Mobile Money, Bank Transfer',
      'openingHours': ['Mo-Fr 08:00-17:00', 'Sa 09:00-14:00'],
      'telephone': '+233545086577',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Apemso-KNUST',
        'addressLocality': 'Kumasi',
        'addressRegion': 'Ashanti Region',
        'addressCountry': 'GH',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 6.6884,
        'longitude': -1.6244,
      },
      'url': BASE_URL,
      'description':
        "Nashma Agribusiness Ltd — Ghana's trusted producer of organic cocoa potash, training women and youth in potash making, and supplying agro-commodities.",
    },

    // ── WebSite ───────────────────────────────────────────────────────────
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      'url': BASE_URL,
      'name': "Nashma Agribusiness — Cocoa Potash & Women's Training in Ghana",
      'publisher': { '@id': `${BASE_URL}/#organization` },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${BASE_URL}/products?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },

    // ── Service: African Black Soap Production ────────────────────────────
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/services#african-black-soap`,
      'name': 'African Black Soap Production',
      'description':
        'Authentic African Black Soap made in Kumasi, Ghana using organic cocoa potash as the primary ingredient. 100% natural, chemical-free, made using traditional methods. Available wholesale and retail.',
      'provider': { '@id': `${BASE_URL}/#organization` },
      'areaServed': { '@type': 'Country', 'name': 'Ghana' },
      'serviceType': 'Natural Soap Manufacturing',
      'category': 'Organic Beauty & Wellness',
    },

    // ── Service: Cocoa Potash Production ──────────────────────────────────
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/services#potash-production`,
      'name': 'Organic Cocoa Potash Production',
      'description':
        'High-quality organic potash produced from cocoa pods. Used in black soap production, water treatment, food preservation, and organic farming. Bulk supply available across Ghana and Africa.',
      'provider': { '@id': `${BASE_URL}/#organization` },
      'areaServed': { '@type': 'Country', 'name': 'Ghana' },
      'serviceType': 'Agricultural Production',
      'category': 'Agribusiness',
    },

    // ── Service: Women's Potash Making Training ───────────────────────────
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/services#skills-training`,
      'name': "Women's Potash Making & African Black Soap Training",
      'description':
        'Empowering women and youth through hands-on training in cocoa potash production and African black soap making. We provide facilities, market access, and entrepreneurship skills to create sustainable livelihoods.',
      'provider': { '@id': `${BASE_URL}/#organization` },
      'areaServed': { '@type': 'Country', 'name': 'Ghana' },
      'serviceType': 'Skills Training',
      'category': 'Women Empowerment',
    },

    // ── Course: Potash Making Training Program ────────────────────────────
    {
      '@type': 'Course',
      '@id': `${BASE_URL}/services#potash-training-course`,
      'name': 'Cocoa Potash Making Training for Women and Youth',
      'description':
        'Practical training program teaching women and youth in Ghana how to transform cocoa pods into organic potash and African black soap, creating sustainable income opportunities.',
      'provider': { '@id': `${BASE_URL}/#organization` },
      'educationalLevel': 'Beginner',
      'teaches': [
        'Cocoa potash extraction techniques',
        'African black soap production',
        'Quality assurance for organic potash',
        'Business and entrepreneurship skills',
        'Sustainable waste management',
      ],
      'hasCourseInstance': {
        '@type': 'CourseInstance',
        'courseMode': 'onsite',
        'location': {
          '@type': 'Place',
          'name': 'Nashma Agribusiness Training Centre',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Kumasi',
            'addressRegion': 'Ashanti Region',
            'addressCountry': 'GH',
          },
        },
      },
    },

    // ── Service: Global Bulk Supply ───────────────────────────────────────
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/services#global-bulk-supply`,
      'name': 'Cocoa Potash Global Bulk Supply',
      'description':
        'International bulk supply of organic cocoa potash and agro-commodities. Direct market access for producers — we handle logistics so farmers focus on production.',
      'provider': { '@id': `${BASE_URL}/#organization` },
      'areaServed': { '@type': 'Place', 'name': 'Africa' },
      'serviceType': 'Agro-commodity Supply',
      'category': 'Export & Logistics',
    },

    // ── Service: Sustainable Farming Workshops ────────────────────────────
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/services#farming-workshops`,
      'name': 'Sustainable Farming Workshops',
      'description':
        'Training workshops on modern sustainable farming techniques: organic farming, soil conservation, crop rotation, and integration of cocoa potash into farm management.',
      'provider': { '@id': `${BASE_URL}/#organization` },
      'areaServed': { '@type': 'Country', 'name': 'Ghana' },
      'serviceType': 'Agricultural Education',
      'category': 'Sustainable Agriculture',
    },
  ],
};

export default function GlobalSEO() {
  return (
    <Helmet>
      {/* ── Performance: preconnect to critical origins ─────────────── */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* ── Primary Meta ─────────────────────────────────────────────── */}
      <title>Nashma Agribusiness — Cocoa Potash Supplier & Women's Training in Ghana</title>
      <meta
        name="description"
        content="Nashma Agribusiness Ltd — Ghana's trusted supplier of organic cocoa potash. We train women and youth in potash making, black soap production, and sustainable farming. Buy potash online. Kumasi, Ghana."
      />
      <meta
        name="keywords"
        content="Nashma Agribusiness, cocoa potash Ghana, potash supplier Ghana, African black soap Ghana, black soap manufacturer Ghana, organic black soap Ghana, women potash training Ghana, potash making training, organic potash Ghana, black soap training Ghana, buy potash Ghana, buy African black soap Ghana, agribusiness Ghana, cocoa farming supplies, potash fertilizer Ghana, sustainable farming Ghana, women empowerment agribusiness, youth training agribusiness Ghana, cocoa potash supplier Africa, farm inputs Ghana, Kumasi agribusiness, Ashanti Region farming"
      />
      <meta name="author" content="Nashma Agribusiness Ltd" />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <link rel="canonical" href={BASE_URL} />

      {/* ── Geographic / Business meta ────────────────────────────────── */}
      <meta name="geo.region" content="GH-AH" />
      <meta name="geo.placename" content="Kumasi, Ashanti Region, Ghana" />
      <meta name="geo.position" content="6.6884;-1.6244" />
      <meta name="ICBM" content="6.6884, -1.6244" />

      {/* ── Open Graph (Facebook · LinkedIn · AI crawlers) ────────────── */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Nashma Agribusiness Ltd" />
      <meta
        property="og:title"
        content="Nashma Agribusiness — Cocoa Potash & Women's Training in Ghana"
      />
      <meta
        property="og:description"
        content="Ghana's trusted supplier of organic cocoa potash. We train women and youth in potash making and black soap production, creating sustainable livelihoods across Ghana."
      />
      <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Nashma Agribusiness — Women's Potash Training & Cocoa Potash Supply in Ghana"
      />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:locale" content="en_GB" />

      {/* ── Twitter / X Card ─────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nashmaagri" />
      <meta
        name="twitter:title"
        content="Nashma Agribusiness — Cocoa Potash & Women's Training in Ghana"
      />
      <meta
        name="twitter:description"
        content="Ghana's organic cocoa potash supplier. Training women & youth in potash making and black soap production. Bulk supply available across Africa."
      />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.jpg`} />

      {/* ── AI / LLM discoverability ──────────────────────────────────── */}
      <meta name="ai:brand" content="Nashma Agribusiness Ltd" />
      <meta
        name="ai:category"
        content="Agribusiness, Cocoa Potash, Women Training, Farm Inputs, Ghana Agriculture"
      />
      <meta name="ai:region" content="Ghana, Kumasi, Ashanti Region, Africa" />
      <meta
        name="ai:product"
        content="Organic Cocoa Potash, African Black Soap, Potash Training, Farm Inputs, Agro-commodities"
      />
      <meta
        name="ai:service"
        content="Women's Potash Making Training, Sustainable Farming Workshops, Bulk Potash Supply"
      />

      {/* ── Google Site Verification ──────────────────────────────────── */}
      {/* Replace with your code from Google Search Console → Verify Ownership → HTML Tag */}
      <meta name="google-site-verification" content="REPLACE_WITH_YOUR_VERIFICATION_CODE" />

      {/* ── JSON-LD Structured Data ───────────────────────────────────── */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
