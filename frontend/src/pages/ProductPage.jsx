import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { FaLeaf } from 'react-icons/fa';
import apiClient from '../utils/apiClient';
import ProductGrid from '../components/ProductGrid';

const ProductsPage = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.getProducts({});
      return response.data?.products || response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, err) =>
      err?.status >= 400 && err?.status < 500 ? false : failureCount < 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Our Products — Nashma Agribusiness</title>
        <meta
          name="description"
          content="Explore Nashma Agribusiness products: eco-friendly potash, sustainable farming materials, and authentic African Black Soap."
        />
        <meta name="keywords" content="Nashma Agribusiness products, potash Ghana, cocoa waste, sustainable agriculture, black soap" />
        <meta property="og:title" content="Our Products — Nashma Agribusiness" />
        <meta property="og:description" content="Discover sustainable potash and eco-products from Nashma Agribusiness." />
        <meta property="og:image" content="/20241112_160941.jpg" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <FaLeaf className="w-3 h-3" />
            Sustainable Products
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
              <p className="text-gray-500 max-w-xl">
                Authentic natural products sourced and supplied from across Ghana.
              </p>
            </div>
            {!isLoading && !isError && (
              <span className="text-sm text-gray-400 font-medium self-start sm:self-auto">
                {products.length} product{products.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Products */}
        {isError ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to load products</h3>
            <p className="text-gray-500 text-sm mb-6">
              {error?.message || 'Something went wrong. Please try again.'}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : (
          <ProductGrid products={products} loading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
