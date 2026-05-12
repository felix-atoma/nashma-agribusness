import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';

const AddToCartButton = ({ productId, stock = 0, className = '' }) => {
  const { addToCart, isUpdating, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!productId || stock <= 0) return;

    setIsLoading(true);
    try {
      const result = await addToCart(productId, quantity);
      if (result) {
        setQuantity(1);
        openCart();
      }
    } catch {
      // error handled by CartContext
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < stock) setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= stock) setQuantity(value);
  };

  if (stock <= 0) {
    return (
      <button disabled className={`bg-gray-300 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed ${className}`}>
        Out of Stock
      </button>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button onClick={decrementQuantity} disabled={quantity <= 1} className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
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
          <button onClick={incrementQuantity} disabled={quantity >= stock} className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-500">({stock} available)</span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading || isUpdating || stock <= 0}
        className={`w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      >
        {isLoading || isUpdating ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Adding to Cart...</>
        ) : (
          <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;
