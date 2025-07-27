import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import apiClient from "../utils/apiClient";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, isCartLoading } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient.get("/api/products");

        console.log("Fetched Products:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.warn("Unexpected response format:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Loading Products...
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border border-green-200 p-4 rounded-md animate-pulse"
            >
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
        Our Products
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-green-200 p-4 rounded-md shadow-sm hover:shadow-md transition"
            >
              <img
                src={product.image}
                onError={(e) => {
                  const fallback =
                    "https://via.placeholder.com/300x200?text=No+Image";
                  if (e.target.src !== fallback) {
                    e.target.src = fallback;
                  }
                }}
                alt={product.name}
                width={300}
                height={200}
              />

              <h3 className="text-lg font-semibold text-green-700">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              <p className="text-green-800 font-bold mt-2">₵{product.price}</p>
              <button
                onClick={() => addToCart(product)}
                disabled={isCartLoading}
                className={`mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
                  isCartLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isCartLoading ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-10">
          <p>No products available at the moment</p>
        </div>
      )}
    </div>
  );
};

export default Products;
