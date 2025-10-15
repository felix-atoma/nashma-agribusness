import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Funnel, Sparkles } from 'lucide-react';
import { FaLeaf, FaSeedling, FaRecycle, FaSpider, FaTractor, FaTree } from 'react-icons/fa';
import apiClient from '../utils/apiClient';
import ProductGrid from '../components/ProductGrid';
import ProductFilter from './ProductFilter';
import Loader from '../components/Loader';

const ProductsPage = () => {
  const [filters, setFilters] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-lime-50 relative overflow-hidden">
      {/* Enhanced Agricultural Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Field Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-full h-8 bg-green-600"></div>
          <div className="absolute top-16 left-0 w-full h-8 bg-amber-600"></div>
          <div className="absolute top-32 left-0 w-full h-8 bg-emerald-600"></div>
          <div className="absolute top-48 left-0 w-full h-8 bg-lime-600"></div>
        </div>

        {/* Floating Agricultural Elements */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full animate-float opacity-60 ${
                i % 3 === 0 ? 'bg-emerald-400' : 
                i % 3 === 1 ? 'bg-amber-400' : 'bg-lime-400'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Corner Accents */}
        <div className="absolute top-6 left-6 w-20 h-20 border-t-4 border-l-4 border-emerald-300 opacity-20 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0}) rotate(0deg)` }}></div>
        <div className="absolute top-6 right-6 w-20 h-20 border-t-4 border-r-4 border-amber-300 opacity-20 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0}) rotate(0deg)`, transitionDelay: '200ms' }}></div>
        <div className="absolute bottom-6 left-6 w-20 h-20 border-b-4 border-l-4 border-lime-300 opacity-20 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0}) rotate(0deg)`, transitionDelay: '400ms' }}></div>
        <div className="absolute bottom-6 right-6 w-20 h-20 border-b-4 border-r-4 border-emerald-300 opacity-20 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0}) rotate(0deg)`, transitionDelay: '600ms' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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

        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-6 py-3 rounded-2xl text-sm font-semibold mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Our Sustainable Products</span>
            <FaLeaf className="w-4 h-4" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Agricultural <span className="text-transparent bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text">Excellence</span>
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
            designed to <span className="text-emerald-600 font-semibold">empower farmers</span> and promote 
            <span className="text-amber-600 font-semibold"> eco-friendly farming practices</span>.
          </p>
        </div>

        {/* Enhanced Header with Filter Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Product Collection
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              High-quality agricultural products from sustainable, organic sources
            </p>
          </div>
          
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-lime-600"
            aria-label="Open filters"
          >
            <Funnel className="w-5 h-5" />
            <span>Filter Products</span>
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Enhanced Filters Sidebar (Desktop) */}
          <div className="hidden lg:block xl:w-80 flex-shrink-0">
            <div className={`bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-emerald-100 p-6 transition-all duration-1000 ${
              animated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-xl">
                  <Funnel className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Filter Products</h3>
              </div>
              
              <ProductFilter 
                categories={categories} 
                onFilter={handleFilter}
                currentFilters={filters}
              />
            </div>

            {/* Enhanced Agricultural Stats */}
            <div className="mt-6 bg-gradient-to-br from-emerald-600 via-lime-500 to-amber-500 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-20">
                <FaSeedling className="w-12 h-12" />
              </div>
              
              <div className="flex items-center gap-3 justify-center mb-4 relative z-10">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <FaSpider className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-lg">Our Impact</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center relative z-10">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">1000+</div>
                  <div className="text-emerald-100 text-sm font-medium">Tons Processed</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">100%</div>
                  <div className="text-amber-100 text-sm font-medium">Organic</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">50+</div>
                  <div className="text-lime-100 text-sm font-medium">Farmers</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">100%</div>
                  <div className="text-emerald-100 text-sm font-medium">Sustainable</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid Section */}
          <div className="flex-1">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Unable to load products
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    {error?.message || 'Something went wrong while fetching products.'}
                  </p>
                  <button 
                    onClick={handleRetry}
                    className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-8 py-3.5 rounded-2xl font-semibold hover:from-emerald-600 hover:to-lime-600 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className={`transition-all duration-1000 ${
                animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                {/* Enhanced Results Count */}
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-emerald-100 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {products.length}
                      </div>
                      <div className="text-gray-600 font-medium">
                        product{products.length !== 1 ? 's' : ''} found
                        {filters.search && (
                          <span className="ml-2 text-amber-600 font-semibold">
                            for "{filters.search}"
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-xl shadow-lg">
                      <FaSeedling className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Enhanced Products Grid Container */}
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-emerald-100 p-6">
                  <ProductGrid products={products} loading={isLoading} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-40 overflow-y-auto bg-emerald-900/60 backdrop-blur-lg transition-all duration-300 md:hidden">
            <div className="relative z-50 p-4 min-h-full flex items-center justify-center">
              <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200 w-full max-w-sm mx-auto">
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

      {/* Enhanced floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% { 
            transform: translateY(-15px) rotate(120deg) scale(1.1);
          }
          66% { 
            transform: translateY(-8px) rotate(240deg) scale(0.9);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;