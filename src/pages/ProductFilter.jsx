import React, { useState } from 'react';
import { Sliders, X } from 'lucide-react';

const ProductFilter = ({ 
  categories = [], // Default to empty array
  onFilter, 
  className = '',
  showMobileFilters,
  onCloseMobileFilters
}) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sort: '',
    search: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      category: '',
      priceRange: '',
      sort: '',
      search: ''
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  // Ensure categories is always an array and has items
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className={`bg-white p-4 rounded-lg shadow border border-gray-200 ${className} ${
      showMobileFilters ? 'fixed inset-0 z-50 overflow-y-auto' : ''
    }`}>
      {showMobileFilters && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <button 
            onClick={onCloseMobileFilters}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {safeCategories.map(category => (
              <option key={category.id || category} value={category.id || category}>
                {category.name || category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200+">$200+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            onClick={clearFilters}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;