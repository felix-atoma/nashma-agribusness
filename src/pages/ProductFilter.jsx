import React, { useState } from 'react';
import { X, ChevronDown, Search, Filter, DollarSign } from 'lucide-react';

const ProductFilter = ({ 
  categories = [], 
  onFilter, 
  currentFilters = {}, 
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState(currentFilters.search || '');
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || '',
    max: currentFilters.maxPrice || ''
  });
  const [showCategories, setShowCategories] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || '');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onFilter({ search: value || undefined });
  };

  const handleCategoryChange = (categoryId) => {
    const selectedCategories = currentFilters.categories || [];
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onFilter({ categories: updatedCategories.length > 0 ? updatedCategories : undefined });
  };

  const handlePriceChange = (field, value) => {
    const newRange = { ...priceRange, [field]: value };
    setPriceRange(newRange);
    
    onFilter({
      minPrice: newRange.min || undefined,
      maxPrice: newRange.max || undefined
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onFilter({ sortBy: value || undefined });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSortBy('');
    onFilter({});
  };

  const hasActiveFilters = Object.keys(currentFilters).some(key => 
    currentFilters[key] !== undefined && currentFilters[key] !== '' && 
    (Array.isArray(currentFilters[key]) ? currentFilters[key].length > 0 : true)
  );

  const selectedCategoriesCount = currentFilters.categories?.length || 0;
  const hasPriceFilter = currentFilters.minPrice || currentFilters.maxPrice;

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  return (
    <div className="bg-green-600 border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
      {/* Mobile close button */}
      {onClose && (
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Box */}
        <div className="md:col-span-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>
        </div>

        {/* Categories Dropdown */}
        <div className="md:col-span-2 relative">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="text-gray-700">Categories</span>
              {selectedCategoriesCount > 0 && (
                <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                  {selectedCategoriesCount}
                </span>
              )}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {showCategories && (
            <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg z-20">
              <div className="p-3 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={currentFilters.categories?.includes(category.id) || false}
                        onChange={() => handleCategoryChange(category.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 text-sm"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setShowCategories(false)}
                  className="mt-3 w-full bg-green-600 text-white py-1.5 px-3 rounded text-sm hover:bg-green-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Price Range Dropdown */}
        <div className="md:col-span-2 relative">
          <button
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
          >
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">Price</span>
              {hasPriceFilter && (
                <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                  •
                </span>
              )}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {showPriceFilter && (
            <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg z-20">
              <div className="p-3">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="∞"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowPriceFilter(false)}
                  className="mt-3 w-full bg-green-600 text-white py-1.5 px-3 rounded text-sm hover:bg-green-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-2">
          {hasActiveFilters ? (
            <button
              onClick={clearAllFilters}
              className="w-full px-3 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              Clear All
            </button>
          ) : (
            <div className="w-full px-3 py-2 text-sm text-gray-400 text-center">
              No filters
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {/* Search Filter */}
            {currentFilters.search && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Search: "{currentFilters.search}"
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onFilter({ search: undefined });
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Category Filters */}
            {currentFilters.categories?.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return category ? (
                <span key={categoryId} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {category.name}
                  <button
                    onClick={() => handleCategoryChange(categoryId)}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}

            {/* Price Filter */}
            {(currentFilters.minPrice || currentFilters.maxPrice) && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                ${currentFilters.minPrice || '0'} - ${currentFilters.maxPrice || '∞'}
                <button
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    onFilter({ minPrice: undefined, maxPrice: undefined });
                  }}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Sort Filter */}
            {currentFilters.sortBy && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                Sort: {sortOptions.find(opt => opt.value === currentFilters.sortBy)?.label}
                <button
                  onClick={() => handleSortChange('')}
                  className="hover:bg-orange-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;