import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../utils/apiClient';
import { Star, ChevronLeft, Heart, Loader2, Package, Truck, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Fixed query with stable queryFn
  const { 
    data: product, 
    isLoading, 
    isError, 
    error,
    isFetching
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.getProduct(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

  // Debug: Log the complete product data
  useEffect(() => {
    if (product) {
      console.log('Complete product data:', product);
      console.log('Product keys:', Object.keys(product));
    }
  }, [product]);

  if (!id) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
          Error: No product ID provided in URL
        </div>
        <Link 
          to="/products"
          className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Products
        </Link>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[500px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block max-w-md">
          Error loading product: {error?.message || 'Unknown error'}
        </div>
        <Link 
          to="/products"
          className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg inline-block">
          Product not found
        </div>
        <Link 
          to="/products"
          className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Products
        </Link>
      </div>
    );
  }

  // More comprehensive destructuring with better fallbacks
  const {
    // Basic info
    images = [],
    name = 'Unnamed Product',
    title = name, // Some APIs use 'title' instead of 'name'
    price = 0,
    _id: productId = id || '',
    
    // Rating and reviews
    rating = 0,
    averageRating = rating, // Alternative field name
    reviews = 0,
    reviewCount = reviews, // Alternative field name
    numReviews = reviews, // Another alternative
    
    // Description and details
    description = 'No description available',
    longDescription = description,
    shortDescription = '',
    details = '',
    
    // Stock and availability
    stock = 0,
    inventory = stock,
    quantity = stock,
    availability = stock > 0 ? 'In Stock' : 'Out of Stock',
    
    // Pricing
    originalPrice,
    salePrice = price,
    regularPrice = originalPrice,
    
    // Category and classification
    category = 'Uncategorized',
    categoryName = category,
    brand = '',
    manufacturer = brand,
    
    // Product flags
    isNew = false,
    isFeatured = false,
    isOnSale = originalPrice && originalPrice > price,
    
    // Additional details that might be present
    weight = '',
    dimensions = '',
    material = '',
    color = '',
    size = '',
    model = '',
    sku = '',
    tags = [],
    features = [],
    specifications = {},
    
    // Shipping and policies
    shippingInfo = '',
    returnPolicy = '',
    warranty = '',
    
    // Timestamps
    createdAt = '',
    updatedAt = '',
    
    // Any other fields that might exist
    ...otherFields
  } = product;

  // Calculate discount percentage
  const actualOriginalPrice = originalPrice || regularPrice;
  const actualPrice = salePrice || price;
  const discountPercentage = actualOriginalPrice && actualOriginalPrice > actualPrice 
    ? Math.round(((actualOriginalPrice - actualPrice) / actualOriginalPrice) * 100)
    : 0;

  // Get actual stock value
  const actualStock = stock || inventory || quantity || 0;
  const actualReviews = reviews || reviewCount || numReviews || 0;
  const actualRating = rating || averageRating || 0;
  const displayName = name || title || 'Unnamed Product';
  const displayDescription = longDescription || description || shortDescription || 'No description available';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/products"
        className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Products
      </Link>
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <img 
              src={images[selectedImage]?.url || images[selectedImage] || '/placeholder-product.jpg'} 
              alt={displayName}
              className="w-full h-96 object-contain"
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg';
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 border rounded-lg overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'border-green-600 ring-2 ring-green-200' 
                      : 'border-gray-200 hover:border-green-400'
                  }`}
                >
                  <img 
                    src={img.url || img || '/placeholder-product.jpg'} 
                    alt={`${displayName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{displayName}</h1>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`p-2 rounded-full transition-colors ${
                  wishlist 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            {/* Brand/Model */}
            {(brand || manufacturer || model) && (
              <div className="text-gray-600 mb-2">
                {brand || manufacturer} {model && `- ${model}`}
              </div>
            )}
            
            {/* SKU */}
            {sku && (
              <div className="text-sm text-gray-500 mb-2">
                SKU: {sku}
              </div>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(actualRating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {actualRating > 0 && `${actualRating.toFixed(1)} `}
              ({actualReviews} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-3xl font-bold text-gray-900">
              ${actualPrice.toFixed(2)}
            </span>
            
            {actualOriginalPrice && actualOriginalPrice > actualPrice && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ${actualOriginalPrice.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
          
          {/* Product Tags/Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
              {categoryName || category}
            </span>
            {actualStock > 0 ? (
              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                In Stock ({actualStock})
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full">
                Out of Stock
              </span>
            )}
            {isNew && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">
                New Arrival
              </span>
            )}
            {isFeatured && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
            {isOnSale && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full">
                On Sale
              </span>
            )}
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Quick Info */}
          {(color || size || weight || material) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {color && <div><span className="font-medium">Color:</span> {color}</div>}
                {size && <div><span className="font-medium">Size:</span> {size}</div>}
                {weight && <div><span className="font-medium">Weight:</span> {weight}</div>}
                {material && <div><span className="font-medium">Material:</span> {material}</div>}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          {actualStock > 0 ? (
            <AddToCartButton 
              productId={productId} 
              stock={actualStock}
              className="w-full"
            />
          ) : (
            <button 
              disabled
              className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed w-full"
            >
              Out of Stock
            </button>
          )}

          {/* Shipping Info */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto text-green-600 mb-1" />
              <div className="text-xs text-gray-600">Free Shipping</div>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 mx-auto text-green-600 mb-1" />
              <div className="text-xs text-gray-600">Secure Payment</div>
            </div>
            <div className="text-center">
              <Package className="w-5 h-5 mx-auto text-green-600 mb-1" />
              <div className="text-xs text-gray-600">Easy Returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              {displayDescription.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
              
              {features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-4">
              {Object.keys(specifications).length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <dt className="font-medium text-gray-900 capitalize">{key}:</dt>
                      <dd className="text-gray-600">{value}</dd>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No specifications available</div>
              )}
              
              {/* Show additional fields as specifications */}
              {Object.keys(otherFields).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Additional Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(otherFields).map(([key, value]) => (
                      <div key={key} className="border-b pb-2">
                        <dt className="font-medium text-gray-900 capitalize">{key}:</dt>
                        <dd className="text-gray-600">{String(value)}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8 text-gray-500">
              Reviews component would go here
              <div className="mt-2 text-sm">
                {actualReviews} total reviews with {actualRating.toFixed(1)} average rating
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;