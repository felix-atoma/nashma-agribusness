import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(new Set());

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/products", {
        timeout: 15000
      });
      setProducts(Array.isArray(response) ? response : []);
      setRetryCount(0);
    } catch (err) {
      console.error("Fetch Error:", err.details);
      
      if (err.code === 'ECONNABORTED') {
        setError(`Request timed out. ${retryCount < 2 ? 'Trying again...' : 'Please check your connection.'}`);
        
        if (retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            fetchProducts();
          }, delay);
          return;
        }
      } else {
        setError(err.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (productId) => {
    setFailedImages(prev => new Set(prev).add(productId));
  };

  const handleAddToCart = async (product) => {
    // Wait for auth to initialize
    if (authLoading) {
      toast.info("Please wait...");
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.info("Please login to add items to cart");
      navigate("/login", { state: { from: "/products" } });
      return;
    }

    const productId = product._id || product.id;
    
    // Prevent multiple clicks
    if (addingToCart.has(productId)) {
      return;
    }

    try {
      setAddingToCart(prev => new Set(prev).add(productId));
      
      const result = await addToCart(productId, 1);
      
      if (result.success) {
        toast.success(`${product.name} added to cart!`);
      }
      
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      
      if (error.message === 'Authentication required') {
        toast.error("Please login to add items to cart");
        navigate("/login", { state: { from: "/products" } });
      } else {
        toast.error("Failed to add item to cart");
      }
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading && !error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Loading Products...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border p-4 rounded-md animate-pulse">
              <div className="bg-gray-200 h-48 w-full mb-4 rounded"></div>
              <div className="bg-gray-200 h-6 w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-4 w-full mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Products</h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => {
            setRetryCount(0);
            fetchProducts();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
        {retryCount > 0 && (
          <p className="mt-4 text-sm text-gray-600">
            Attempt {retryCount + 1} of 3
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Our Products</h2>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const productId = product._id || product.id;
            const isAddingToCart = addingToCart.has(productId);
            
            return (
              <div key={productId} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {failedImages.has(productId) ? (
                    <div className="text-gray-500 p-4 text-center">
                      <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">Image unavailable</p>
                    </div>
                  ) : (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(productId)}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-green-600">
                      ${product.price?.toFixed(2) || '0.00'}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAddingToCart || authLoading}
                      className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        isAddingToCart || authLoading
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                  {product.stock !== undefined && (
                    <p className="text-xs text-gray-500 mt-2">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductPage;