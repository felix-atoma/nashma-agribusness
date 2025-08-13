import React, { useState, useCallback, useMemo } from 'react';
import { Star, ShoppingCart, Heart, Minus, Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = React.memo(({ product }) => {
  const { user } = useAuth();
  const { addToCart, isUpdating } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoize product data extraction to prevent recalculation
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

    // Handle different stock field names with a more stable approach
    const actualStock = stock || productQuantity || (available ? 100 : 0) || (inStock ? 100 : 0) || 10;
    
    // Use a stable image URL strategy
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
      isOutOfStock: actualStock <= 0
    };
  }, [product]);

  // Stable image error handler that prevents infinite loops
  const handleImageError = useCallback((e) => {
    // Only set error state once to prevent loops
    if (!imageError && e.target.src !== productData.fallbackImage) {
      setImageError(true);
      e.target.src = productData.fallbackImage;
    }
  }, [imageError, productData.fallbackImage]);

  // Reset image error when product changes
  React.useEffect(() => {
    setImageError(false);
  }, [productData.primaryImage]);

  const handleAddToCart = useCallback(async () => {
    // Handle login redirect case
    if (!user) {
      navigate('/login', {
        state: {
          from: 'product',
          returnTo: `/products/${productData.productId}`,
          message: 'Please login to add items to your cart'
        }
      });
      return;
    }
    
    if (isAddingToCart || isUpdating || productData.isOutOfStock) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(productData.productId, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [user, navigate, productData.productId, isAddingToCart, isUpdating, productData.isOutOfStock, addToCart, quantity]);

  const handleQuantityChange = useCallback((newQuantity) => {
    const qty = Math.max(1, Math.min(productData.actualStock, newQuantity));
    setQuantity(qty);
  }, [productData.actualStock]);

  const toggleWishlist = useCallback(() => {
    setIsWishlisted(prev => !prev);
  }, []);

  // Memoize the image source to prevent unnecessary re-renders
  const imageSrc = useMemo(() => {
    return imageError ? productData.fallbackImage : productData.primaryImage;
  }, [imageError, productData.fallbackImage, productData.primaryImage]);

  return (
    <div className="group relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white h-full flex flex-col">
      {/* Stock Debug Badge - Remove after debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 z-20">
          Stock: {productData.actualStock}
        </div>
      )}
      
      {/* Sale Badge */}
      {productData.isOnSale && (
        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          SALE
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 p-2 rounded-full z-10 transition-colors ${
          isWishlisted 
            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
            : 'text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600'
        }`}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image */}
      <Link to={productData.productLink} className="block flex-shrink-0 relative aspect-square">
        <div className="w-full h-full bg-gray-100 overflow-hidden">
          <img 
            src={imageSrc}
            alt={productData.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
            // Add key to force re-render when product changes
            key={`${productData.productId}-${productData.primaryImage}`}
          />
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Name and Rating */}
        <Link to={productData.productLink} className="group">
          <h3 className="font-semibold text-lg mb-1 text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
            {productData.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(productData.rating) ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({productData.reviews})</span>
        </div>
        
        {/* Description */}
        {productData.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{productData.description}</p>
        )}
        
        {/* Price and Add to Cart */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-bold text-lg text-gray-900">${productData.price.toFixed(2)}</span>
              {productData.isOnSale && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${productData.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {!productData.isOutOfStock && (
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                  type="button"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-center w-8 select-none">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
            disabled={isAddingToCart || isUpdating || productData.isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              productData.isOutOfStock
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : !user
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer transform hover:scale-[1.02]'
                : isAddingToCart || isUpdating
                ? 'bg-green-600 text-white cursor-wait opacity-75'
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white cursor-pointer transform hover:scale-[1.02]'
            }`}
            type="button"
            style={{ minHeight: '44px' }} // Ensure minimum touch target
          >
            {isAddingToCart || isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : productData.isOutOfStock ? (
              'Out of Stock'
            ) : !user ? (
              'Login to Add'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;