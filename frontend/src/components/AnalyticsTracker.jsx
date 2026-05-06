import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics';

// Fires a GA4-compatible page_view event on every client-side navigation.
// Place this inside <BrowserRouter> so useLocation works.
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Small delay lets the page title update before we read it
    const timer = setTimeout(() => {
      analytics.pageView(
        location.pathname + location.search,
        document.title,
      );
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}
