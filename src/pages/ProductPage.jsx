import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../utils/apiClient';
import ProductGrid from '../components/ProductGrid';
import ProductFilter from './ProductFilter';
import Loader from '../components/Loader';
import { Funnel } from 'lucide-react';

const ProductsPage = () => {
  const [filters, setFilters] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Fetch products with filters
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => apiClient.getProducts(filters),
    keepPreviousData: true
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/products') // Assuming REST API endpoint
  });

  // Handle filter changes
  const handleFilter = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
      
      <div className="grid md:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <ProductFilter 
            categories={categories} 
            onFilter={handleFilter} 
          />
        </div>
        
        {/* Product Grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <Loader className="min-h-[300px]" />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="relative z-50 p-4">
            <ProductFilter 
              categories={categories} 
              onFilter={(newFilters) => {
                handleFilter(newFilters);
                setShowMobileFilters(false);
              }}
              onCloseMobileFilters={() => setShowMobileFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;