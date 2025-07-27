import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../utils/apiClient"; 
import { toast } from "react-toastify"; // ✅ import toast

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
        toast.error("Failed to fetch cart");
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
      toast.success("Added to cart!"); // ✅ toast
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Failed to add item");
    }
  };

  // Remove from cart
  const removeFromCart = async (id) => {
    try {
      const { items } = await apiClient.delete(`/cart/${id}`);
      setCartItems(items);
      toast.info("Item removed from cart"); // ✅ toast
    } catch (error) {
      console.error("Remove from cart failed:", error);
      toast.error("Failed to remove item");
    }
  };

  // Update quantity
  const updateQuantity = async (id, quantity) => {
    if (Number(quantity) < 1) return;
    try {
      const { items } = await apiClient.patch(`/cart/${id}`, { quantity });
      setCartItems(items);
      toast.success("Quantity updated"); // ✅ toast
    } catch (error) {
      console.error("Update quantity failed:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await apiClient.delete("/cart");
      setCartItems([]);
      toast.success("Cart cleared"); // ✅ toast
    } catch (error) {
      console.error("Clear cart failed:", error);
      toast.error("Failed to clear cart");
    }
  };

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
