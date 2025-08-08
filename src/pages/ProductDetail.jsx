import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // ✅ CORRECT


import apiClient from '../utils/apiClient';
import { Star, ChevronLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton'
import Loader from '../components/Loader'

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  
  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => apiClient.getProduct(id)
  );

  if (isLoading) return <Loader className="min-h-[500px]" />;
  if (error) return <div className="text-center py-12">Error loading product</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/products"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Products
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4 bg-white p-4 rounded-xl border border-gray-200">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 border rounded-lg overflow-hidden ${
                  selectedImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} thumbnail ${index}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>
            <button
              onClick={() => setWishlist(!wishlist)}
              className={`p-2 rounded-full ${
                wishlist ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              } transition-colors`}
            >
              <Heart className={`w-5 h-5 ${wishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </div>
          
          <div className="text-3xl font-bold text-gray-900 mb-4">
            ${product.price.toFixed(2)}
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
              {product.isNew && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">
                  New Arrival
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
          </div>

          {product.stock > 0 ? (
            <AddToCartButton 
              productId={product._id} 
              stock={product.stock}
              className="max-w-md"
            />
          ) : (
            <button 
              disabled
              className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed w-full max-w-md"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;