import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { 
    cart, 
    cartTotal, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
  });

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    
    try {
      // Validate customer info
      if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
        throw new Error("Please fill in all required fields");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart and show success
      clearCart();
      setCheckoutSuccess(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We'll contact you shortly to confirm your order.
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !isCheckingOut) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Your Shopping Cart</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {cart.map((item) => (
          <div key={item._id} className="p-4 flex flex-col sm:flex-row border-b border-gray-200">
            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100";
                }}
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove item"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p className="text-green-800 font-bold">
                  GHS {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">GHS {cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-semibold">GHS {cart.length > 0 ? "10.00" : "0.00"}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-green-700 border-t border-gray-200 pt-3">
            <span>Total</span>
            <span>GHS {(cartTotal + (cart.length > 0 ? 10 : 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h3>
        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address *
            </label>
            <textarea
              id="address"
              required
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={customerInfo.paymentMethod === "cash"}
                  onChange={() => setCustomerInfo({...customerInfo, paymentMethod: "cash"})}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Cash on Delivery</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile_money"
                  checked={customerInfo.paymentMethod === "mobile_money"}
                  onChange={() => setCustomerInfo({...customerInfo, paymentMethod: "mobile_money"})}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Mobile Money</span>
              </label>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear Cart
            </button>
            <button
              type="submit"
              disabled={isCheckingOut}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:bg-green-400 flex items-center justify-center min-w-32"
            >
              {isCheckingOut ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;