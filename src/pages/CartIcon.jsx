import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom';

const CartIcon = () => {
  const { cart } = useCart();
  
  return (
    <Link to="/cart" className="relative flex items-center justify-center">
      <ShoppingCart className="w-6 h-6 text-green-700 hover:text-green-600 transition-colors" />
      {cart.itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cart.itemCount > 9 ? '9+' : cart.itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;