import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../utils/apiClient"; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { items } = await apiClient.get("/cart");
        setCartItems(items || []);
      } catch (error) {
        console.error("Fetch cart failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Add to cart
  const addToCart = async (item) => {
    if (!item?._id) return;
    try {
      const { items } = await apiClient.post("/cart", {
        productId: item._id,
        quantity: 1,
      });
      setCartItems(items);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  // Remove from cart
  const removeFromCart = async (id) => {
    try {
      const { items } = await apiClient.delete(`/cart/${id}`);
      setCartItems(items);
    } catch (error) {
      console.error("Remove from cart failed:", error);
    }
  };

  // Update quantity
  const updateQuantity = async (id, quantity) => {
    if (Number(quantity) < 1) return;
    try {
      const { items } = await apiClient.patch(`/cart/${id}`, { quantity });
      setCartItems(items);
    } catch (error) {
      console.error("Update quantity failed:", error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await apiClient.delete("/cart");
      setCartItems([]);
    } catch (error) {
      console.error("Clear cart failed:", error);
    }
  };

  // Calculate totals
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export default CartContext;