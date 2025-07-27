import { createContext, useContext, useEffect, useState } from "react";

// Create the context
const CartContext = createContext();

// Create the provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("nashma-cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart data:", error);
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("nashma-cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart data:", error);
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    if (!item || !item._id) {
      console.error("Invalid item added to cart");
      return;
    }
    
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      if (existingItem) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    const newQuantity = Number(quantity);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  // Calculate total price of items in cart
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );

  // Value provided to consumers
  const value = {
    cart: cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}

// Export the context itself for advanced use cases
export default CartContext;