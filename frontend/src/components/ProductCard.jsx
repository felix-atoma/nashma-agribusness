import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Minus, Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaSeedling, FaRecycle } from 'react-icons/fa';

const ProductCard = React.memo(({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const productData = useMemo(() => {
    const {
      images = [],
      name = 'Product Name',
      price = 0,
      _id: productId = product?.id || '',
      rating = 0,
      reviews = 0,
      description = '',
      stock = 0,
      originalPrice,
      quantity: productQuantity,
      available,
      inStock
    } = product || {};

    const actualStock =
      stock || productQuantity || (available ? 100 : 0) || (inStock ? 100 : 0) || 10;

    const primaryImage = images[0] || 'https://via.placeholder.com/400x400?text=No+Image';
    const fallbackImage = 'https://via.placeholder.com/400x400?text=Product+Image';

    return {
      images,
      name,
      price,
      productId,
      rating,
      reviews,
      description,
      actualStock,
      originalPrice,
      primaryImage,
      fallbackImage,
      productLink: `/products/${productId}`,
      isOnSale: originalPrice && originalPrice > price,
      isOutOfStock: actualStock <= 0,
    };
  }, [product]);

  const handleImageError = useCallback(
    (e) => {
      if (!imageError && e.target.src !== productData.fallbackImage) {
        setImageError(true);
        e.target.src = productData.fallbackImage;
      }
    },
    [imageError, productData.fallbackImage]
  );

  React.useEffect(() => {
    setImageError(false);
  }, [productData.primaryImage]);

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: 'product',
          returnTo: `/products/${productData.productId}`,
          message: 'Please login to add items to your cart',
        },
      });
      return;
    }

    if (isAddingToCart || productData.isOutOfStock) return;

    setIsAddingToCart(true);
    try {
      await addToCart(productData.productId, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [user, navigate, productData.productId, isAddingToCart, productData.isOutOfStock, addToCart, quantity]);

  const handleQuantityChange = useCallback(
    (newQuantity) => {
      const qty = Math.max(1, Math.min(productData.actualStock, newQuantity));
      setQuantity(qty);
    },
    [productData.actualStock]
  );

  const toggleWishlist = useCallback(() => {
    setIsWishlisted((prev) => !prev);
  }, []);

  const imageSrc = useMemo(() => {
    return imageError ? productData.fallbackImage : productData.primaryImage;
  }, [imageError, productData.fallbackImage, productData.primaryImage]);

  // Format price in Ghana Cedis
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className={`group relative border border-green-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm h-full flex flex-col transform hover:-translate-y-2 ${
      animated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      {/* Agricultural Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-2 left-2 w-8 h-8 border border-green-300 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border border-amber-300 rounded-full"></div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 z-20 rounded-br-xl">
          Stock: {productData.actualStock}
        </div>
      )}

      {productData.isOnSale && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
          SALE
        </div>
      )}

      {/* Organic Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <FaLeaf className="w-3 h-3" />
          <span>ORGANIC</span>
        </div>
      </div>

      <button
        onClick={toggleWishlist}
        className={`absolute top-14 right-3 p-2 rounded-full z-10 transition-all duration-300 ${
          isWishlisted
            ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-lg'
            : 'text-gray-400 bg-white/80 hover:bg-white hover:text-gray-600 shadow-md'
        } transform hover:scale-110`}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <Link to={productData.productLink} className="block flex-shrink-0 relative aspect-square">
        <div className="w-full h-full bg-gradient-to-br from-green-50 to-amber-50 overflow-hidden relative">
          {/* Web Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-green-300 rounded-full"></div>
          </div>
          
          <img
            src={imageSrc}
            alt={productData.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
            onError={handleImageError}
            loading="lazy"
            key={`${productData.productId}-${productData.primaryImage}`}
          />
        </div>
      </Link>

      <div className="p-5 flex-grow flex flex-col">
        <Link to={productData.productLink} className="group">
          <h3 className="font-bold text-lg mb-2 text-green-900 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
            {productData.name}
          </h3>
        </Link>

        <div className="flex items-center mb-3">
          <div className="flex text-amber-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(productData.rating) ? 'fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-green-600 font-medium">({productData.reviews})</span>
        </div>

        {productData.description && (
          <p className="text-green-700 text-sm mb-4 line-clamp-2 leading-relaxed">
            {productData.description}
          </p>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xl text-green-900">
                {formatPrice(productData.price)}
              </span>
              {productData.isOnSale && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(productData.originalPrice)}
                </span>
              )}
            </div>

            {!productData.isOutOfStock && (
              <div className="flex items-center border border-green-200 rounded-xl bg-green-50/50">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-2 py-1 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-30 rounded-l-xl"
                  disabled={quantity <= 1}
                  type="button"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-center w-8 select-none text-green-900 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-2 py-1 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-30 rounded-r-xl"
                  disabled={quantity >= productData.actualStock}
                  type="button"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || productData.isOutOfStock}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${
              productData.isOutOfStock
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-md'
                : !user
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white cursor-pointer shadow-lg hover:shadow-xl'
                : isAddingToCart
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-wait opacity-75 shadow-lg'
                : 'bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600 text-white cursor-pointer shadow-lg hover:shadow-xl'
            }`}
            type="button"
            style={{ minHeight: '48px' }}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Adding to Cart...</span>
              </>
            ) : productData.isOutOfStock ? (
              <>
                <FaRecycle className="w-5 h-5" />
                <span>Out of Stock</span>
              </>
            ) : !user ? (
              <>
                <FaSeedling className="w-5 h-5" />
                <span>Login to Purchase</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-300 rounded-2xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;