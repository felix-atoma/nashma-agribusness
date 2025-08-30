import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import apiClient from '../utils/apiClient';

const CartDebugHelper = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [debugResults, setDebugResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);

    try {
      const results = {
        cartAccessible: false,
        hasItems: false,
        itemCount: 0,
        status: 'checking...'
      };

      try {
        const cartResponse = await apiClient.getCart();
        results.cartAccessible = true;
        results.hasItems = (cartResponse?.data?.items?.length || 0) > 0;
        results.itemCount = cartResponse?.data?.itemCount || 0;
        results.status = 'Cart is working properly';
      } catch (error) {
        results.status = 'Cart has issues: ' + (error.message || 'Unknown error');
      }

      setDebugResults(results);
    } catch (error) {
      setDebugResults({ status: 'Test failed: ' + error.message });
    } finally {
      setIsRunning(false);
    }
  };

  const getFriendlyMessage = (results) => {
    if (!results.cartAccessible) {
      return "We couldn’t reach your cart right now. Please try again later.";
    }
    if (results.itemCount === 0) {
      return "Your cart is empty. Start adding items to see them here!";
    }
    if (results.hasItems && results.itemCount > 0) {
      return `Your cart is working fine with ${results.itemCount} item${results.itemCount > 1 ? "s" : ""}.`;
    }
    return "Checking your cart status...";
  };

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-4">
        <h3 className="font-bold text-blue-800 mb-2">Shopping Cart Status</h3>
        <p className="text-blue-700">Please log in to check your cart status.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-blue-800">Your Cart Status</h3>
        <button 
          onClick={runDiagnostics}
          disabled={isRunning}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {isRunning ? 'Checking...' : 'Check Status'}
        </button>
      </div>

      {Object.keys(debugResults).length > 0 ? (
        <div className="space-y-3">
          {/* User-friendly message */}
          <div className="bg-white p-3 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Current Status</h4>
            <p className="text-blue-700">
              {getFriendlyMessage(debugResults)}
            </p>
          </div>

          {/* Debug info panel (for developer insight) */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white p-2 rounded text-center">
              <div className="font-medium">Cart Access</div>
              <div className={debugResults.cartAccessible ? 'text-green-600' : 'text-red-600'}>
                {debugResults.cartAccessible ? 'Working' : 'Not Working'}
              </div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-medium">Items in Cart</div>
              <div className="text-blue-600">
                {debugResults.itemCount || 0}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-blue-700">
          <p>Your cart is set up and ready to use.</p>
          <p className="text-sm mt-1">Click "Check Status" to verify everything is working.</p>
        </div>
      )}

      {/* Always show current cart status */}
      <div className="mt-4 pt-3 border-t border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Your Current Cart</h4>
        <div className="text-sm space-y-1">
          <p>Items: <span className="font-medium">{cart?.itemCount || 0}</span></p>
          <p>Total: <span className="font-medium">${cart?.total?.toFixed(2) || '0.00'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default CartDebugHelper;
