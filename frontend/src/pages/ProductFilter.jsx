import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Search, Filter, CreditCard } from 'lucide-react';
import { FaLeaf, FaSeedling, FaRecycle, FaSpider } from 'react-icons/fa';

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
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

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
    { value: '', label: 'Default Sorting' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Format price in Ghana Cedis for display
  const formatCedis = (price) => {
    if (!price) return '';
    return `GH₵${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-amber-50 to-white border border-green-200 rounded-2xl shadow-2xl p-6 mb-8 relative overflow-hidden">
      {/* Animated Spider Web Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Web Lines */}
        <div className="absolute inset-0 opacity-10">
          {/* Radial Web Lines */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <div
              key={angle}
              className="absolute top-1/2 left-1/2 w-0.5 h-64 bg-green-400 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${animated ? 1 : 0})`,
                transformOrigin: 'center',
                transitionDelay: `${angle * 8}ms`
              }}
            />
          ))}
          
          {/* Concentric Circles */}
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute top-1/2 left-1/2 border border-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
              style={{
                width: `${ring * 200}px`,
                height: `${ring * 200}px`,
                opacity: 0.15 - (ring * 0.03),
                transform: `translate(-50%, -50%) scale(${animated ? 1 : 0})`,
                transitionDelay: `${ring * 150}ms`
              }}
            />
          ))}
        </div>
        
        {/* Floating Agricultural Elements */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-amber-400 rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Corner Web Accents */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-green-300 opacity-30 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})` }}></div>
        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-green-300 opacity-30 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '200ms' }}></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-green-300 opacity-30 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '400ms' }}></div>
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-green-300 opacity-30 transition-all duration-1000"
             style={{ transform: `scale(${animated ? 1 : 0})`, transitionDelay: '600ms' }}></div>
      </div>

      {/* Mobile close button */}
      {onClose && (
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-green-900">
            <Filter className="w-5 h-5" />
            Filter Products
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-green-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-green-700" />
          </button>
        </div>
      )}

      {/* Agricultural Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3 shadow-lg">
          <FaSpider className="w-4 h-4" />
          Refine Your Agricultural Search
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          Discover Perfect <span className="text-amber-600">Farm Products</span>
        </h2>
        <div className="w-20 h-1 bg-amber-500 mx-auto mb-3"></div>
        <p className="text-green-700 text-sm max-w-md mx-auto">
          Filter through our sustainable agricultural products to find exactly what you need
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
        {/* Search Box */}
        <div className="md:col-span-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-green-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search cocoa potash, black soap, farming tools..."
              className="block w-full pl-12 pr-4 py-3.5 border border-green-200 rounded-xl bg-white/90 backdrop-blur-sm placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            />
          </div>
        </div>

        {/* Categories Dropdown */}
        <div className="md:col-span-2 relative">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className={`w-full flex items-center justify-between px-4 py-3.5 border border-green-200 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white text-green-900 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 ${
              showCategories ? 'shadow-xl ring-2 ring-green-500' : 'shadow-lg'
            }`}
          >
            <span className="flex items-center gap-2">
              <FaSeedling className="w-4 h-4 text-green-600" />
              <span className="font-semibold">Categories</span>
              {selectedCategoriesCount > 0 && (
                <span className="bg-gradient-to-r from-green-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                  {selectedCategoriesCount}
                </span>
              )}
            </span>
            <ChevronDown className={`w-4 h-4 text-green-600 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
          </button>
          
          {showCategories && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[260px] bg-white/95 backdrop-blur-sm border border-green-200 rounded-xl shadow-2xl z-20">
              <div className="p-4 max-h-56 overflow-y-auto">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <FaLeaf className="w-4 h-4" />
                  Product Categories
                </h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center hover:bg-green-50 p-3 rounded-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-green-200">
                      <input
                        type="checkbox"
                        checked={currentFilters.categories?.includes(category.id) || false}
                        onChange={() => handleCategoryChange(category.id)}
                        className="rounded border-green-300 text-green-600 focus:ring-green-500 text-sm transform group-hover:scale-110 transition-transform"
                      />
                      <span className="ml-3 text-sm text-green-900 font-medium group-hover:text-green-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setShowCategories(false)}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-amber-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-amber-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Apply Categories
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Price Range Dropdown - Ghana Cedis */}
        <div className="md:col-span-2 relative">
          <button
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className={`w-full flex items-center justify-between px-4 py-3.5 border border-green-200 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white text-green-900 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 ${
              showPriceFilter ? 'shadow-xl ring-2 ring-green-500' : 'shadow-lg'
            }`}
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              <span className="font-semibold">Price Range</span>
              {hasPriceFilter && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                  GH₵
                </span>
              )}
            </span>
            <ChevronDown className={`w-4 h-4 text-green-600 transition-transform duration-300 ${showPriceFilter ? 'rotate-180' : ''}`} />
          </button>
          
          {showPriceFilter && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-white/95 backdrop-blur-sm border border-green-200 rounded-xl shadow-2xl z-20">
              <div className="p-4">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  💰 Price in Ghana Cedis
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-green-900 mb-2">Minimum Price (GH₵)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full p-3.5 border border-green-200 rounded-lg bg-green-50/70 text-green-900 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-900 mb-2">Maximum Price (GH₵)</label>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full p-3.5 border border-green-200 rounded-lg bg-green-50/70 text-green-900 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-inner"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowPriceFilter(false)}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-amber-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-amber-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  Apply Price Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-4 py-3.5 border border-green-200 rounded-xl bg-white/90 backdrop-blur-sm text-green-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 appearance-none cursor-pointer shadow-lg hover:shadow-xl"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-2">
          {hasActiveFilters ? (
            <button
              onClick={clearAllFilters}
              className="w-full px-4 py-3.5 text-white font-semibold bg-gradient-to-r from-red-500 to-orange-500 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaRecycle className="w-4 h-4" />
              Clear All
            </button>
          ) : (
            <div className="w-full px-4 py-3.5 text-green-400 text-center font-medium bg-white/50 rounded-xl border border-green-200 shadow-lg">
              <FaLeaf className="w-4 h-4 mx-auto mb-1" />
              No filters
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-8 pt-6 border-t border-green-200">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-bold text-green-900 flex items-center gap-2">
              <FaSpider className="w-4 h-4" />
              Active Filters:
            </span>
            
            {/* Search Filter */}
            {currentFilters.search && (
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-2 rounded-full font-semibold shadow-lg">
                🔍 "{currentFilters.search}"
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onFilter({ search: undefined });
                  }}
                  className="hover:bg-blue-200 rounded-full p-1 transition-colors transform hover:scale-110"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Category Filters */}
            {currentFilters.categories?.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return category ? (
                <span key={categoryId} className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm px-3 py-2 rounded-full font-semibold shadow-lg">
                  🌱 {category.name}
                  <button
                    onClick={() => handleCategoryChange(categoryId)}
                    className="hover:bg-green-200 rounded-full p-1 transition-colors transform hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}

            {/* Price Filter - Ghana Cedis */}
            {(currentFilters.minPrice || currentFilters.maxPrice) && (
              <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm px-3 py-2 rounded-full font-semibold shadow-lg">
                💰 {formatCedis(currentFilters.minPrice || '0')} - {currentFilters.maxPrice ? formatCedis(currentFilters.maxPrice) : 'No limit'}
                <button
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    onFilter({ minPrice: undefined, maxPrice: undefined });
                  }}
                  className="hover:bg-amber-200 rounded-full p-1 transition-colors transform hover:scale-110"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Sort Filter */}
            {currentFilters.sortBy && (
              <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-sm px-3 py-2 rounded-full font-semibold shadow-lg">
                📊 {sortOptions.find(opt => opt.value === currentFilters.sortBy)?.label}
                <button
                  onClick={() => handleSortChange('')}
                  className="hover:bg-purple-200 rounded-full p-1 transition-colors transform hover:scale-110"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Add custom animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductFilter;