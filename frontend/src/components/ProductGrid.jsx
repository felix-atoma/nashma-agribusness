import React from 'react';
import ProductCard from './ProductCard';
import { ShoppingBag } from 'lucide-react';

const SkeletonCard = () => (
  <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
      <div className="h-3 bg-gray-100 rounded-lg w-full" />
      <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-5 bg-gray-100 rounded-lg w-1/3" />
        <div className="h-5 bg-gray-100 rounded-full w-1/3" />
      </div>
      <div className="h-9 bg-gray-100 rounded-xl w-full mt-1" />
    </div>
  </div>
);

const ProductGrid = ({ products = [], loading = false }) => {
  const safeProducts = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (safeProducts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No Products Found</h3>
        <p className="text-gray-400 text-sm">Check back soon or try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeProducts.map((product) => (
        <ProductCard key={product.id || product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
