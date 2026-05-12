import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../utils/apiClient';
import { Star, ChevronLeft, Heart, Loader2, Package, Truck, Shield, Info } from 'lucide-react';
import { FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddToCartButton from './AddToCartButton';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Fixed query to handle API response structure
  const {
    data: response,
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

  // Extract product data from response
  const product = response?.data || response;

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

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
    title = name,
    price = 0,
    _id: productId = id || '',

    // Rating and reviews
    rating = 0,
    averageRating = rating,
    reviews = 0,
    reviewCount = reviews,
    numReviews = reviews,
    productReviews = [],

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

  // Get actual stock value
  const actualStock = stock || inventory || quantity || 0;
  const actualReviews = reviews || reviewCount || numReviews || 0;
  const actualRating = rating || averageRating || 0;
  const displayName = name || title || 'Unnamed Product';
  const displayDescription = longDescription || description || shortDescription || 'No description available';

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error('Please select a star rating before submitting.');
      return;
    }
    if (!reviewName.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review before submitting.');
      return;
    }
    setReviewSubmitted(true);
    toast.success('Review submitted! Thank you.');
    setReviewRating(0);
    setReviewHover(0);
    setReviewName('');
    setReviewText('');
  };

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

          {/* Rating — clicking opens the Reviews tab */}
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
            title="Click to write a review"
          >
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(actualRating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 underline underline-offset-2">
              {actualRating > 0 && `${actualRating.toFixed(1)} · `}
              {actualReviews} review{actualReviews !== 1 ? 's' : ''} — Write a review
            </span>
          </button>

          {/* Price on Delivery badge — no dollar amounts */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 w-fit">
            <FaTruck className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Price confirmed on delivery</span>
          </div>

          {/* Product Tags/Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">
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
              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
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
              <div className="text-xs text-gray-600">Delivery Available</div>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 mx-auto text-green-600 mb-1" />
              <div className="text-xs text-gray-600">Quality Assured</div>
            </div>
            <div className="text-center">
              <Package className="w-5 h-5 mx-auto text-green-600 mb-1" />
              <div className="text-xs text-gray-600">Fresh Products</div>
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
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
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
          {/* Description Tab */}
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

          {/* Specifications Tab */}
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

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="max-w-2xl">
              {/* Overall Rating Summary */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-700">
                    {actualRating > 0 ? actualRating.toFixed(1) : '—'}
                  </div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(actualRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {actualReviews} review{actualReviews !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-1 pl-4 border-l border-green-200">
                  <p className="text-sm text-gray-600">Share your experience with this Nashma product. Your feedback helps other customers make informed decisions.</p>
                </div>
              </div>

              {/* Review Form */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Star Rating Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= (reviewHover || reviewRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {reviewRating > 0 && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Kofi Mensah"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Tell others what you think about this product..."
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Existing Reviews */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  Customer Reviews
                  {actualReviews > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">({actualReviews})</span>
                  )}
                </h3>

                {productReviews && productReviews.length > 0 ? (
                  <div className="space-y-4">
                    {productReviews.map((review, index) => (
                      <div key={index} className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-800 text-sm">
                            {review.name || review.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-GH') : ''}
                          </span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        {review.comment || review.text ? (
                          <p className="text-sm text-gray-700">{review.comment || review.text}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No reviews yet</p>
                    <p className="text-sm text-gray-400 mt-1">Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
