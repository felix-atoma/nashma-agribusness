// components/PageSEO.jsx
// Drop <PageSEO /> at the top of any page component to set unique SEO per route.
// GlobalSEO in App.jsx sets the site-wide defaults; PageSEO overrides them per page.

import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.nashmaagribusiness.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const SITE_NAME = 'Nashma Agribusiness Ltd';

export default function PageSEO({
  title,
  description,
  keywords,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
}) {
  const fullTitle = title
    ? `${title} | Nashma Agribusiness`
    : 'Nashma Agribusiness - Cocoa Potash Supplies in Ghana';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={`${BASE_URL}${canonical}`} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={`${BASE_URL}${canonical || ''}`} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}