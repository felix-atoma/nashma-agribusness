// Nashma Agribusiness — Google Analytics 4 event tracking
//
// Architecture:
//  1. All events push to window.dataLayer — GTM (GTM-K73256BG) relays them to GA4.
//  2. Direct gtag() calls fire as a failsafe if GA4 is loaded without GTM.
//
// SETUP STEPS:
//  A. In Google Tag Manager (tagmanager.google.com):
//     - Create a "GA4 Configuration" tag with your GA4 Measurement ID (G-XXXXXXXXXX)
//     - Get your GA4 ID from: analytics.google.com → Admin → Data Streams → Web Stream
//  B. Optionally set VITE_GA4_ID=G-XXXXXXXXXX in your .env file for direct integration.

const GA4_ID = import.meta.env?.VITE_GA4_ID || '';

const push = (eventData) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  // Clear previous ecommerce data to prevent bleed-through between events
  if (eventData.ecommerce) {
    window.dataLayer.push({ ecommerce: null });
  }
  window.dataLayer.push(eventData);
};

const gtag = (...args) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
};

export const analytics = {
  // ── Page views ──────────────────────────────────────────────────────────
  // Called automatically by AnalyticsTracker on every route change
  pageView: (path, title) => {
    push({ event: 'page_view', page_path: path, page_title: title });
    if (GA4_ID) {
      gtag('event', 'page_view', { page_path: path, page_title: title, send_to: GA4_ID });
    }
  },

  // ── Lead generation ──────────────────────────────────────────────────────
  contactFormSubmit: (subject = '') => {
    push({ event: 'contact_form_submit', form_subject: subject, form_location: 'contact_page' });
    gtag('event', 'generate_lead', {
      event_category: 'Contact',
      event_label: subject || 'General Inquiry',
      value: 1,
    });
  },

  newsletterSubscribe: () => {
    push({ event: 'newsletter_subscribe', subscribe_location: 'footer' });
    gtag('event', 'sign_up', { method: 'newsletter_footer' });
  },

  serviceInquiry: (serviceName) => {
    push({ event: 'service_inquiry', service_name: serviceName });
    gtag('event', 'generate_lead', {
      event_category: 'Services',
      event_label: serviceName,
      value: 1,
    });
  },

  // ── E-commerce — follows GA4 enhanced e-commerce spec ───────────────────
  productView: (product) => {
    push({
      event: 'view_item',
      ecommerce: {
        currency: 'GHS',
        value: parseFloat(product.price) || 0,
        items: [{
          item_id: String(product._id || product.id),
          item_name: product.name || product.title,
          item_category: product.category || 'Agri Products',
          price: parseFloat(product.price) || 0,
          quantity: 1,
        }],
      },
    });
  },

  addToCart: (product, quantity = 1) => {
    const price = parseFloat(product.price) || 0;
    push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'GHS',
        value: price * quantity,
        items: [{
          item_id: String(product._id || product.id),
          item_name: product.name || product.title,
          item_category: product.category || 'Agri Products',
          price,
          quantity,
        }],
      },
    });
  },

  beginCheckout: (cartItems, total) => {
    push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'GHS',
        value: parseFloat(total) || 0,
        items: cartItems.map((item) => ({
          item_id: String(item._id || item.id),
          item_name: item.name || item.title,
          price: parseFloat(item.price) || 0,
          quantity: item.quantity || 1,
        })),
      },
    });
  },

  purchase: (orderData) => {
    push({
      event: 'purchase',
      ecommerce: {
        transaction_id: String(orderData.orderId || orderData._id || orderData.id),
        currency: 'GHS',
        value: parseFloat(orderData.total) || 0,
        items: (orderData.items || []).map((item) => ({
          item_id: String(item._id || item.id),
          item_name: item.name || item.title,
          price: parseFloat(item.price) || 0,
          quantity: item.quantity || 1,
        })),
      },
    });
  },

  // ── General engagement ───────────────────────────────────────────────────
  ctaClick: (ctaName, location = '') => {
    push({ event: 'cta_click', cta_name: ctaName, cta_location: location });
  },

  search: (searchTerm) => {
    push({ event: 'search', search_term: searchTerm });
    gtag('event', 'search', { search_term: searchTerm });
  },
};
