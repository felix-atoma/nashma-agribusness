// main.jsx
// SEO is handled at two levels:
//   1. index.html  → static meta tags, JSON-LD, GTM, Google Ads (read by crawlers before JS)
//   2. GlobalSEO   → dynamic per-page meta via react-helmet-async (for SPAs)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min — reduces unnecessary refetches
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);