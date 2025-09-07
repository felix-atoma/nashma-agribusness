// components/CartItem.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, cart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState(null);
  const [localQuantity, setLocalQuantity] = useState(item.quantity || 0);
  const debounceTimer = useRef(null);

  // Get product info - handle both populated and non-populated items
  const product = item.product || item;
  const productId = product._id || item.productId;
  const productName = product.name || 'Unknown Product';
  const productPrice = product.price || item.price || 0;
  const productImage = product.image || product.images?.[0] || '/placeholder-image.jpg';

  // Sync local quantity with cart updates - but only when not updating locally
  useEffect(() => {
    if (!isUpdating && !isRemoving) {
      const currentItem = cart.items.find(cartItem => 
        (cartItem.product?._id || cartItem.productId) === productId
      );
      
      if (currentItem && currentItem.quantity !== localQuantity) {
        setLocalQuantity(currentItem.quantity);
      } else if (!currentItem) {
        // Item was removed from cart externally
        setIsRemoving(true);
      }
    }
  }, [cart.items, productId, isUpdating, isRemoving, localQuantity]);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Debounced quantity update function
  const debouncedUpdateQuantity = (newQuantity) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (newQuantity <= 0) {
        await handleRemove();
        return;
      }

      setIsUpdating(true);
      setError(null);
      
      try {
        await updateQuantity(productId, newQuantity);
      } catch (err) {
        // Revert local quantity on error
        const currentItem = cart.items.find(cartItem => 
          (cartItem.product?._id || cartItem.productId) === productId
        );
        if (currentItem) {
          setLocalQuantity(currentItem.quantity);
        }
        setError('Failed to update quantity');
        console.error('Error updating quantity:', err);
      } finally {
        setIsUpdating(false);
      }
    }, 300); // 300ms debounce
  };

  // Handle quantity change (immediate local update + debounced API call)
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 0) return;
    
    // Immediate local update for responsive UI
    setLocalQuantity(newQuantity);
    
    // Debounced API call
    debouncedUpdateQuantity(newQuantity);
  };

  // Handle item removal
  const handleRemove = async () => {
    if (isRemoving || isUpdating) return;
    
    setIsRemoving(true);
    setError(null);
    
    try {
      await removeFromCart(productId);
      // Component will be filtered out by parent on success
    } catch (err) {
      setError('Failed to remove item');
      console.error('Error removing item:', err);
      setIsRemoving(false); // Reset state on error
    }
  };

  // Handle input field changes for direct quantity editing
  const handleQuantityInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 999) {
      handleQuantityChange(value);
    }
  };

  // Don't render if item is being removed
  if (isRemoving) {
    return null; // Return null instead of placeholder to completely remove from DOM
  }

  return (
    <div className={`flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 transition-all duration-200 ${isUpdating ? 'opacity-75' : ''}`}>
      {/* Product Image and Info */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {productName}
          </h3>
          <p className="text-sm text-gray-500">
            ${productPrice.toFixed(2)} each
          </p>
          
          {/* Error message */}
          {error && (
            <div className="flex items-center space-x-1 mt-1 animate-fade-in">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-500">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => handleQuantityChange(localQuantity - 1)}
            disabled={isUpdating || localQuantity <= 1}
            className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Decrease quantity"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Editable quantity input */}
          <input
            type="number"
            value={localQuantity}
            onChange={handleQuantityInputChange}
            disabled={isUpdating}
            min="1"
            max="999"
            className={`w-12 px-1 py-1 text-center text-sm font-medium bg-transparent border-0 outline-none ${
              isUpdating ? 'opacity-50' : ''
            } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          
          <button
            onClick={() => handleQuantityChange(localQuantity + 1)}
            disabled={isUpdating}
            className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Increase quantity"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Price with real-time calculation */}
        <div className="text-right min-w-[4rem]">
          <p className="text-sm font-medium text-gray-900">
            ${(productPrice * localQuantity).toFixed(2)}
          </p>
          {isUpdating && (
            <p className="text-xs text-gray-500">Updating...</p>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving || isUpdating}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;