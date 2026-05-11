import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, cart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState(null);
  const [localQuantity, setLocalQuantity] = useState(item.quantity || 1);
  const debounceTimer = useRef(null);

  const product   = item.product || item;
  const productId = product._id || item.productId;
  const name      = product.name || 'Unknown Product';
  const imgSrc    = product.images?.[0] || product.image || item.image || null;
  const unitPrice = item.priceAtAddition ?? product.price ?? item.price ?? 0;
  const lineTotal = unitPrice * localQuantity;

  // Sync local quantity when server responds
  useEffect(() => {
    if (isUpdating || isRemoving) return;
    const cartItem = cart.items?.find(ci => (ci.product?._id || ci.productId) === productId);
    if (cartItem && cartItem.quantity !== localQuantity) setLocalQuantity(cartItem.quantity);
    else if (!cartItem) setIsRemoving(true);
  }, [cart.items, productId, isUpdating, isRemoving, localQuantity]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => () => debounceTimer.current && clearTimeout(debounceTimer.current), []);

  const debouncedUpdate = (newQty) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      if (newQty <= 0) { handleRemove(); return; }
      setIsUpdating(true);
      setError(null);
      try {
        await updateQuantity(productId, newQty);
      } catch {
        const ci = cart.items?.find(i => (i.product?._id || i.productId) === productId);
        if (ci) setLocalQuantity(ci.quantity);
        setError('Could not update quantity');
      } finally {
        setIsUpdating(false);
      }
    }, 350);
  };

  const handleQuantityChange = (val) => {
    if (val < 0) return;
    setLocalQuantity(val);
    debouncedUpdate(val);
  };

  const handleRemove = async () => {
    if (isRemoving || isUpdating) return;
    setIsRemoving(true);
    try {
      await removeFromCart(productId);
    } catch {
      setError('Could not remove item');
      setIsRemoving(false);
    }
  };

  if (isRemoving) return null;

  return (
    <div className={`flex items-center gap-4 px-5 py-4 transition-opacity ${isUpdating ? 'opacity-60' : 'opacity-100'}`}>
      {/* Image */}
      <Link to={`/products/${productId}`} className="flex-shrink-0 group">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-medium text-center px-2">
              {name.split(' ').slice(0, 2).join(' ')}
            </div>
          )}
        </div>
      </Link>

      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${productId}`}>
          <p className="font-semibold text-gray-900 hover:text-green-600 transition-colors text-sm leading-snug">
            {name}
          </p>
        </Link>
        <p className="text-amber-700 font-semibold text-sm mt-1">
          GHS {unitPrice.toFixed(2)}
          <span className="text-gray-400 font-normal text-xs ml-1">/ unit</span>
        </p>
        {error && (
          <div className="flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
            <span className="text-xs text-red-400">{error}</span>
          </div>
        )}
      </div>

      {/* Quantity */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1">
          <button
            onClick={() => handleQuantityChange(localQuantity - 1)}
            disabled={isUpdating || localQuantity <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
          >
            <Minus className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <input
            type="number"
            value={localQuantity}
            onChange={e => {
              const val = parseInt(e.target.value) || 0;
              if (val >= 0 && val <= 999) handleQuantityChange(val);
            }}
            disabled={isUpdating}
            min="1"
            max="999"
            className="w-10 text-center text-sm font-bold bg-transparent border-0 outline-none text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => handleQuantityChange(localQuantity + 1)}
            disabled={isUpdating}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
        {isUpdating && <span className="text-[10px] text-gray-400">Saving…</span>}
      </div>

      {/* Line total */}
      <div className="text-right flex-shrink-0 w-24 hidden sm:block">
        <p className="text-sm font-bold text-gray-900">GHS {lineTotal.toFixed(2)}</p>
        {localQuantity > 1 && (
          <p className="text-xs text-gray-400">{localQuantity} × {unitPrice.toFixed(2)}</p>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={isRemoving || isUpdating}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 transition-all flex-shrink-0"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartItem;
