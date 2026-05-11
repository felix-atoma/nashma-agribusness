import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { FaLeaf, FaSeedling, FaRecycle, FaTractor, FaTree } from 'react-icons/fa';
import apiClient from '../utils/apiClient';
import ProductGrid from '../components/ProductGrid';
import Loader from '../components/Loader';

const ProductsPage = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

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
    retry: (failureCount, error) =>
      error?.status >= 400 && error?.status < 500 ? false : failureCount < 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-lime-50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 left-6 w-20 h-20 border-t-4 border-l-4 border-emerald-300 opacity-20 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})` }}></div>
        <div className="absolute top-6 right-6 w-20 h-20 border-t-4 border-r-4 border-amber-300 opacity-20 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '200ms' }}></div>
        <div className="absolute bottom-6 left-6 w-20 h-20 border-b-4 border-l-4 border-lime-300 opacity-20 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '400ms' }}></div>
        <div className="absolute bottom-6 right-6 w-20 h-20 border-b-4 border-r-4 border-emerald-300 opacity-20 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '600ms' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Helmet>
          <title>Our Products — Nashma Agribusiness | Sustainable Potash & Eco-Friendly Exports</title>
          <meta
            name="description"
            content="Explore Nashma Agribusiness products made from cocoa pod waste: eco-friendly potash, sustainable farming materials, and organic black soap ingredients."
          />
          <meta name="keywords" content="Nashma Agribusiness products, potash Ghana, cocoa waste recycling, sustainable agriculture, eco-friendly exports, black soap potash" />
          <meta name="author" content="Nashma Agribusiness" />
          <meta property="og:title" content="Our Products — Nashma Agribusiness" />
          <meta property="og:description" content="Discover sustainable potash and eco-products from Nashma Agribusiness." />
          <meta property="og:image" content="/20241112_160941.jpg" />
          <meta property="og:type" content="website" />
        </Helmet>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-6 py-3 rounded-2xl text-sm font-semibold mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Our Sustainable Products</span>
            <FaLeaf className="w-4 h-4" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Agricultural{' '}
            <span className="text-transparent bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text">
              Excellence
            </span>
          </h1>

          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>
            <FaTractor className="w-6 h-6 text-amber-500" />
            <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            <FaTree className="w-6 h-6 text-lime-500" />
            <div className="w-16 h-1 bg-lime-500 rounded-full"></div>
          </div>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Discover our premium range of sustainable agricultural solutions crafted from cocoa waste,
            designed to{' '}
            <span className="text-emerald-600 font-semibold">empower farmers</span> and promote{' '}
            <span className="text-amber-600 font-semibold">eco-friendly farming practices</span>.
          </p>
        </div>

        {/* Products section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Product Collection</h2>
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow">
              <FaSeedling className="w-4 h-4" />
              <span>{products.length} product{products.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {isLoading && !products.length ? (
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-emerald-100 p-8">
              <Loader className="min-h-[400px]" />
            </div>
          ) : isError ? (
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-emerald-100 p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaRecycle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to load products</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {error?.message || 'Something went wrong while fetching products.'}
                </p>
                <button
                  onClick={() => refetch()}
                  className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-8 py-3.5 rounded-2xl font-semibold hover:from-emerald-600 hover:to-lime-600 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className={`bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-emerald-100 p-6 transition-all duration-1000 ${
              animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <ProductGrid products={products} loading={isLoading} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ProductsPage;
