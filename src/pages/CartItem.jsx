import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  // Defensive check
  if (!item || !item.product) {
    return null;
  }

  const { removeFromCart, updateCartItems } = useCart();

  // Normalize productId for all actions
  const productId = item.product?._id || item.productId;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    updateCartItems([{ productId, quantity: newQuantity }]);
  };

  return (
    <div className="flex items-start py-4 border-b border-gray-100">
      <Link to={`/products/${productId}`} className="flex-shrink-0">
        <img
          src={
            item.product.images?.[0] ||
            'https://via.placeholder.com/80x80?text=No+Image'
          }
          alt={item.product.name || 'Product'}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </Link>

      <div className="ml-4 flex-1">
        <Link
          to={`/products/${productId}`}
          className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
        >
          {item.product.name || 'Unnamed Product'}
        </Link>
        <p className="text-gray-600 text-sm mt-1">
          ${item.product.price ? item.product.price.toFixed(2) : '0.00'}
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Control */}
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-1 text-center w-10">
              {item.quantity || 0}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-3 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
              disabled={item.quantity >= 99}
            >
              +
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeFromCart(productId)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
