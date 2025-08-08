import React, { useState } from 'react';
import { useCart } from '../context/CartContext'
import { ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';

const AddToCartButton = ({ productId, stock = 1, className = '' }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading } = useCart();

  const handleAddToCart = () => {
    addToCart(productId, quantity);
  };

  const increment = () => {
    if (quantity < stock) setQuantity(prev => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center border border-gray-200 rounded-lg">
        <button 
          onClick={decrement}
          className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-3 text-center w-8">{quantity}</span>
        <button 
          onClick={increment}
          className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
          disabled={quantity >= stock}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={loading || stock <= 0}
        className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
          loading ? 'opacity-80' : ''
        } ${
          stock <= 0 ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span>{stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;