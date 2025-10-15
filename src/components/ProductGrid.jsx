import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], loading = false }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    setAnimated(true);
  }, []);

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200 h-80 animate-pulse shadow-lg"
            style={{ 
              animationDelay: `${i * 100}ms`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeProducts.length > 0 ? (
        safeProducts.map((product, index) => (
          <div
            key={product.id || product._id}
            className={`transition-all duration-500 ${
              animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaSeedling className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">No Products Found</h3>
            <p className="text-green-700 mb-4">
              We couldn't find any products matching your criteria.
            </p>
            <div className="w-12 h-1 bg-amber-500 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;