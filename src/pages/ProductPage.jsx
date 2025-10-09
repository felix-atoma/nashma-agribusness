import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../utils/apiClient';
import ProductGrid from '../components/ProductGrid';
import ProductFilter from './ProductFilter';
import Loader from '../components/Loader';
import { Funnel } from 'lucide-react';

const ProductsPage = () => {
  const [filters, setFilters] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Stable filter object for React Query key
  const queryFilters = useMemo(() => {
    const stableFilters = {};
    const sortedKeys = Object.keys(filters).sort();
    sortedKeys.forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        stableFilters[key] = filters[key];
      }
    });
    return stableFilters;
  }, [filters]);

  // ✅ Fetch products
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['products', queryFilters],
    queryFn: async () => {
      const response = await apiClient.getProducts(queryFilters);
      return response.data?.products || response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      error?.status >= 400 && error?.status < 500 ? false : failureCount < 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
  });

  // ✅ Fetch categories
  const { 
    data: categories = [],
    isError: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.getCategories();
      return response.data || [];
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleFilter = newFilters => setFilters(prev => ({ ...prev, ...newFilters }));

  const handleRetry = () => {
    refetchProducts();
    if (categoriesError) refetchCategories();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Our Products — Nashma Agribusiness | Sustainable Potash & Eco-Friendly Exports</title>
        <meta
          name="description"
          content="Explore Nashma Agribusiness products made from cocoa pod waste: eco-friendly potash, sustainable farming materials, and organic black soap ingredients. Empowering communities through circular innovation."
        />
        <meta
          name="keywords"
          content="Nashma Agribusiness products, potash Ghana, cocoa waste recycling, sustainable agriculture, eco-friendly exports, black soap potash, agribusiness Ghana, green farming solutions"
        />
        <meta name="author" content="Nashma Agribusiness" />

        {/* Open Graph for social media */}
        <meta property="og:title" content="Our Products — Nashma Agribusiness" />
        <meta
          property="og:description"
          content="Discover sustainable potash and eco-products from Nashma Agribusiness — turning cocoa waste into wealth for farmers and communities."
        />
        <meta property="og:image" content="/20241112_160941.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nashma Agribusiness | Eco-Friendly Potash Products" />
        <meta
          name="twitter:description"
          content="Explore our eco-friendly products — potash, organic black soap ingredients, and sustainable farming materials made from cocoa waste."
        />
        <meta name="twitter:image" content="/20241112_160941.jpg" />
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Our Products</h1>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg text-gray-700"
          aria-label="Open filters"
        >
          <Funnel className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters (Desktop) */}
      <div className="hidden md:block">
        <ProductFilter 
          categories={categories} 
          onFilter={handleFilter}
          currentFilters={filters}
        />
      </div>
      
      {/* Products Grid */}
      <div>
        {isLoading && !products.length ? (
          <Loader className="min-h-[300px]" />
        ) : isError ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Unable to load products
              </h3>
              <p className="text-gray-600 mb-4">
                {error?.message || 'Something went wrong while fetching products.'}
              </p>
              <button 
                onClick={handleRetry}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {products.length} product{products.length !== 1 ? 's' : ''} found
              {filters.search && (
                <span className="ml-2">
                  for "<span className="font-medium">{filters.search}</span>"
                </span>
              )}
            </div>
            <ProductGrid products={products} loading={isLoading} />
          </>
        )}
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity md:hidden">
          <div className="relative z-50 p-4">
            <div className="bg-white rounded-lg">
              <ProductFilter 
                categories={categories} 
                onFilter={newFilters => {
                  handleFilter(newFilters);
                  setShowMobileFilters(false);
                }}
                currentFilters={filters}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
