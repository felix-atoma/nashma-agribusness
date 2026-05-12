import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, Loader2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTruck } from 'react-icons/fa';

const ProductCard = React.memo(({ product }) => {
  const { user, openAuth } = useAuth();
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  const productData = useMemo(() => {
    const {
      images: imagesArr = [],
      image: imageSingle = null,
      name = 'Product Name',
      price = 0,
      _id: productId = product?.id || '',
      description = '',
      stock = 0,
      countInStock = 0,
      originalPrice,
      quantity: productQuantity,
      available,
      inStock,
    } = product || {};

    const images = imagesArr.length > 0 ? imagesArr : (imageSingle ? [imageSingle] : []);
    const actualStock = stock || countInStock || productQuantity || (available ? 100 : 0) || (inStock ? 100 : 0) || 10;
    const primaryImage  = images[0] || 'https://placehold.co/400x400/f0fdf4/166534?text=Nashma';
    const fallbackImage = 'https://placehold.co/400x400/f0fdf4/166534?text=Product';

    return {
      name, price, productId, description, actualStock, originalPrice,
      primaryImage, fallbackImage,
      productLink: `/products/${productId}`,
      isOnSale: originalPrice && originalPrice > price,
      isOutOfStock: actualStock <= 0,
    };
  }, [product]);

  const handleImageError = useCallback((e) => {
    if (!imageError && e.target.src !== productData.fallbackImage) {
      setImageError(true);
      e.target.src = productData.fallbackImage;
    }
  }, [imageError, productData.fallbackImage]);

  useEffect(() => { setImageError(false); }, [productData.primaryImage]);

  const handleAddToCart = useCallback(async () => {
    if (!user) { openAuth('login'); return; }
    if (isAddingToCart || productData.isOutOfStock) return;
    setIsAddingToCart(true);
    try {
      const result = await addToCart(productData.productId, quantity);
      if (result) openCart();
    } catch {
      // handled by CartContext
    } finally {
      setIsAddingToCart(false);
    }
  }, [user, openAuth, productData.productId, isAddingToCart, productData.isOutOfStock, addToCart, quantity, openCart]);

  const handleQuantityChange = useCallback((newQty) => {
    setQuantity(Math.max(1, Math.min(productData.actualStock, newQty)));
  }, [productData.actualStock]);

  const imageSrc = imageError ? productData.fallbackImage : productData.primaryImage;

  return (
    <div className={`group relative border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Sale badge */}
      {productData.isOnSale && (
        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
          SALE
        </div>
      )}

      {/* Product image */}
      <Link to={productData.productLink} className="block flex-shrink-0 aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageSrc}
          alt={productData.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={handleImageError}
          loading="lazy"
        />
      </Link>

      {/* Card body */}
      <div className="p-4 flex-grow flex flex-col">
        <Link to={productData.productLink}>
          <h3 className="font-bold text-base text-gray-900 hover:text-green-700 transition-colors line-clamp-2 mb-1">
            {productData.name}
          </h3>
        </Link>

        {productData.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
            {productData.description}
          </p>
        )}

        <div className="mt-auto space-y-3">
          {/* Price row */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              GHS {Number(productData.price).toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
              <FaTruck className="w-3 h-3" />
              <span className="text-[10px] font-semibold">Pay on delivery</span>
            </div>
          </div>

          {/* Quantity selector */}
          {!productData.isOutOfStock && (
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                type="button"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-sm font-semibold text-gray-800 select-none min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= productData.actualStock}
                className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                type="button"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || productData.isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all ${
              productData.isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-green-600 text-white opacity-75 cursor-wait'
                : !user
                ? 'bg-gray-900 hover:bg-green-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow'
            }`}
            type="button"
          >
            {isAddingToCart ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</>
            ) : productData.isOutOfStock ? (
              'Out of Stock'
            ) : !user ? (
              <><Lock className="w-4 h-4" /> Login to Buy</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
