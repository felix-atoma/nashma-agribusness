import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], loading = false }) => {
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeProducts.length > 0 ? (
        safeProducts.map(product => (
          <ProductCard 
            key={product.id || product._id}
            product={product} 
          />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;