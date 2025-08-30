import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import apiClient from '../utils/apiClient';

const CartDebugHelper = () => {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const [debugResults, setDebugResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Check authentication
      console.log('=== DIAGNOSTIC TEST 1: Authentication ===');
      results.auth = {
        userExists: !!user,
        userId: user?._id || user?.id,
        tokenExists: !!localStorage.getItem('token'),
        hasValidToken: !!apiClient.getCurrentToken()
      };

      // Test 2: Test auth endpoint using existing method
      console.log('=== DIAGNOSTIC TEST 2: Auth Validation ===');
      try {
        const isValid = await apiClient.validateToken();
        results.authEndpoint = { success: isValid, error: null };
      } catch (error) {
        results.authEndpoint = { success: false, error: error.message };
      }

      // Test 3: Test cart GET endpoint
      console.log('=== DIAGNOSTIC TEST 3: Cart GET ===');
      try {
        const cartResponse = await apiClient.getCart();
        results.cartGet = { 
          success: true, 
          data: cartResponse,
          itemCount: cartResponse?.data?.itemCount || 0,
          hasItems: (cartResponse?.data?.items?.length || 0) > 0
        };
      } catch (error) {
        results.cartGet = { 
          success: false, 
          error: error.message,
          status: error.status,
          data: error.data
        };
      }

      // Test 4: Get a real product for testing (skip if no products)
      console.log('=== DIAGNOSTIC TEST 4: Product Lookup ===');
      try {
        const productsResponse = await apiClient.getProducts({ limit: 1 });
        const products = productsResponse?.data?.products || productsResponse?.data || [];
        
        if (products.length > 0) {
          const testProduct = products[0];
          results.productTest = {
            success: true,
            productFound: true,
            productId: testProduct._id,
            productName: testProduct.name
          };

          // Test 5: Test adding the real product to cart
          console.log('=== DIAGNOSTIC TEST 5: Cart ADD Test ===');
          try {
            const addResponse = await apiClient.addToCart(testProduct._id, 1);
            results.cartPost = { 
              success: true, 
              data: addResponse 
            };

            // Test 6: Test removing the product from cart
            console.log('=== DIAGNOSTIC TEST 6: Cart REMOVE Test ===');
            try {
              await apiClient.removeFromCart(testProduct._id);
              results.cartRemove = { success: true };
            } catch (error) {
              results.cartRemove = { 
                success: false, 
                error: error.message,
                status: error.status
              };
            }
          } catch (error) {
            results.cartPost = { 
              success: false, 
              error: error.message,
              status: error.status,
              data: error.data
            };
          }
        } else {
          results.productTest = {
            success: true,
            productFound: false,
            message: "No products available for testing"
          };
        }
      } catch (error) {
        results.productTest = { 
          success: false, 
          error: error.message 
        };
      }

      console.log('=== DIAGNOSTIC RESULTS ===');
      console.log(results);
      setDebugResults(results);

    } catch (error) {
      console.error('Diagnostic error:', error);
      results.generalError = error.message;
      setDebugResults(results);
    } finally {
      setIsRunning(false);
    }
  };

  const getOverallStatus = () => {
    if (!debugResults.auth) return 'unknown';
    
    const authOk = debugResults.auth.userExists && debugResults.authEndpoint?.success;
    const cartOk = debugResults.cartGet?.success;
    
    if (authOk && cartOk) return 'good';
    if (authOk && !cartOk) return 'cart-issue';
    return 'auth-issue';
  };

  const getStatusMessage = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'good':
        return { 
          message: 'All systems working normally', 
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200'
        };
      case 'cart-issue':
        return { 
          message: 'Authentication OK, but cart has issues', 
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200'
        };
      case 'auth-issue':
        return { 
          message: 'Authentication problems detected', 
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        };
      default:
        return { 
          message: 'Run diagnostics to check system status', 
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200'
        };
    }
  };

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="font-bold text-red-800">System Diagnostics</h3>
        <p className="text-red-700">Please login first to run cart diagnostics.</p>
      </div>
    );
  }

  const statusInfo = getStatusMessage();

  return (
    <div className={`border rounded-lg p-4 m-4 ${statusInfo.bgColor}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800">System Status</h3>
          <p className={`text-sm ${statusInfo.color}`}>{statusInfo.message}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowTechnical(!showTechnical)}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
          >
            {showTechnical ? 'Hide Details' : 'Show Details'}
          </button>
          <button 
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run Test'}
          </button>
        </div>
      </div>

      {/* Simple Status Summary */}
      {Object.keys(debugResults).length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="bg-white p-2 rounded text-center">
              <div className="font-medium">Login</div>
              <div className={debugResults.auth?.userExists && debugResults.authEndpoint?.success ? 'text-green-600' : 'text-red-600'}>
                {debugResults.auth?.userExists && debugResults.authEndpoint?.success ? 'Working' : 'Issue'}
              </div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-medium">Cart Access</div>
              <div className={debugResults.cartGet?.success ? 'text-green-600' : 'text-red-600'}>
                {debugResults.cartGet?.success ? 'Working' : 'Issue'}
              </div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-medium">Add to Cart</div>
              <div className={debugResults.cartPost?.success ? 'text-green-600' : debugResults.cartPost ? 'text-red-600' : 'text-gray-400'}>
                {debugResults.cartPost?.success ? 'Working' : debugResults.cartPost ? 'Issue' : 'Not Tested'}
              </div>
            </div>
            <div className="bg-white p-2 rounded text-center">
              <div className="font-medium">Current Cart</div>
              <div className="text-blue-600">
                {cart?.itemCount || 0} items
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details (Hidden by default) */}
      {showTechnical && Object.keys(debugResults).length > 0 && (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Authentication Details</h4>
            <div className="text-sm space-y-1">
              <div>User logged in: <span className={debugResults.auth?.userExists ? 'text-green-600' : 'text-red-600'}>
                {debugResults.auth?.userExists ? 'Yes' : 'No'}
              </span></div>
              <div>User ID: <span className="font-mono text-xs">{debugResults.auth?.userId || 'N/A'}</span></div>
              <div>Token valid: <span className={debugResults.authEndpoint?.success ? 'text-green-600' : 'text-red-600'}>
                {debugResults.authEndpoint?.success ? 'Yes' : 'No'}
              </span></div>
              {debugResults.authEndpoint?.error && (
                <div className="text-red-600">Auth Error: {debugResults.authEndpoint.error}</div>
              )}
            </div>
          </div>

          <div className="bg-white p-3 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Cart Operations</h4>
            <div className="text-sm space-y-1">
              <div>Can access cart: <span className={debugResults.cartGet?.success ? 'text-green-600' : 'text-red-600'}>
                {debugResults.cartGet?.success ? 'Yes' : 'No'}
              </span></div>
              {debugResults.cartGet?.success && (
                <div>Items in cart: {debugResults.cartGet.itemCount}</div>
              )}
              {debugResults.cartPost && (
                <div>Can add items: <span className={debugResults.cartPost.success ? 'text-green-600' : 'text-red-600'}>
                  {debugResults.cartPost.success ? 'Yes' : 'No'}
                </span></div>
              )}
              {debugResults.cartRemove && (
                <div>Can remove items: <span className={debugResults.cartRemove.success ? 'text-green-600' : 'text-red-600'}>
                  {debugResults.cartRemove.success ? 'Yes' : 'No'}
                </span></div>
              )}
            </div>
          </div>

          {debugResults.productTest && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-gray-800 mb-2">Product Testing</h4>
              <div className="text-sm">
                {debugResults.productTest.productFound ? (
                  <div>Test product: {debugResults.productTest.productName}</div>
                ) : (
                  <div className="text-yellow-600">No products available for testing</div>
                )}
              </div>
            </div>
          )}

          {/* Error Details */}
          {(debugResults.cartGet?.error || debugResults.cartPost?.error) && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
              <div className="text-sm space-y-2">
                {debugResults.cartGet?.error && (
                  <div>
                    <strong>Cart Access Error:</strong>
                    <div className="text-red-600">{debugResults.cartGet.error}</div>
                    {debugResults.cartGet.status && (
                      <div className="text-gray-600">Status: {debugResults.cartGet.status}</div>
                    )}
                  </div>
                )}
                {debugResults.cartPost?.error && (
                  <div>
                    <strong>Cart Add Error:</strong>
                    <div className="text-red-600">{debugResults.cartPost.error}</div>
                    {debugResults.cartPost.status && (
                      <div className="text-gray-600">Status: {debugResults.cartPost.status}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {Object.keys(debugResults).length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Click "Run Test" to check if your cart system is working properly
        </div>
      )}
    </div>
  );
};

export default CartDebugHelper;