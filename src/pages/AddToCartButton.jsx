import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';

const AddToCartButton = ({ productId, stock = 0, className = '' }) => {
  const { addToCart, isUpdating } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    console.log('=== ADD TO CART DEBUG ===');
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);
    console.log('Stock:', stock);
    
    if (!productId) {
      console.error('No product ID provided');
      return;
    }

    if (stock <= 0) {
      console.error('Product out of stock');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling addToCart function...');
      const result = await addToCart(productId, quantity);
      console.log('AddToCart result:', result);
      
      if (result) {
        console.log('✅ Add to cart successful');
        // Reset quantity after successful add
        setQuantity(1);
      } else {
        console.log('❌ Add to cart failed');
      }
    } catch (error) {
      console.error('❌ Add to cart error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= stock) {
      setQuantity(value);
    }
  };

  if (stock <= 0) {
    return (
      <button 
        disabled
        className={`bg-gray-300 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
          />
          <button
            onClick={incrementQuantity}
            disabled={quantity >= stock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-500">
          ({stock} available)
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isLoading || isUpdating || stock <= 0}
        className={`w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      >
        {isLoading || isUpdating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>

      {/* Debug Info - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs">
          <div className="font-medium mb-2">Debug Info:</div>
          <div>Product ID: {productId || 'Not provided'}</div>
          <div>Quantity: {quantity}</div>
          <div>Stock: {stock}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div>Cart Updating: {isUpdating ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;