// utils/apiClient.js
// Use env var if available, otherwise fallback to localhost:5000
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "https://nashma-backend-1-1.onrender.com/api";

class ApiClient {
  constructor() {
    this.token = localStorage.getItem("token");
    this.pendingRequests = new Map();
  }

  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const requestKey = `${options.method || "GET"}:${endpoint}:${JSON.stringify(
      options.params || {}
    )}`;

    // Include orders GET requests as critical operations to prevent cancellation
    const isCriticalOperation = ["POST", "PATCH", "DELETE"].includes(
      options.method || "GET"
    ) || endpoint === "/orders";

    if (this.pendingRequests.has(requestKey) && !isCriticalOperation) {
      this.pendingRequests.get(requestKey).abort();
    }
    this.pendingRequests.set(requestKey, controller);

    // Build full URL
    let url = `${API_BASE_URL}${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const config = {
      method: options.method || "GET",
      headers,
      signal: controller.signal,
      ...options,
      body:
        options.body && typeof options.body === "object"
          ? JSON.stringify(options.body)
          : options.body,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await this.parseResponse(response);
        const error = new Error(
          errorData.message ||
            errorData.error ||
            `Request failed with status ${response.status}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const data = await this.parseResponse(response);
      return {
        data,
        success: true,
        status: response.status,
      };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request was cancelled");
      }
      throw error;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  async parseResponse(response) {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        return await response.json();
      } catch {
        return {};
      }
    }
    return await response.text();
  }

  transformCartResponse(response) {
    if (response.data?.data?.cart) {
      const cart = response.data.data.cart;
      return {
        ...response,
        data: {
          items: cart.items || [],
          itemCount: cart.itemCount || 0,
          subtotal: cart.subtotal || 0,
          total: cart.total || 0,
          discount: cart.discount || 0,
          coupon: cart.coupon || null,
          id: cart.id,
        },
      };
    }

    return {
      ...response,
      data: {
        items: response.data?.items || [],
        itemCount: response.data?.itemCount || 0,
        subtotal: response.data?.subtotal || 0,
        total: response.data?.total || 0,
        discount: response.data?.discount || 0,
        coupon: response.data?.coupon || null,
      },
    };
  }

  // --- Auth ---
  async signup(userData) {
    const response = await this.request("/auth/signup", {
      method: "POST",
      body: userData,
    });
    if (response.data?.token) this.setAuthToken(response.data.token);
    return response;
  }

  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: credentials,
    });
    if (response.data?.token) this.setAuthToken(response.data.token);
    return response;
  }

  async logout() {
    try {
      if (!this.token) {
        this.setAuthToken(null);
        return { success: true, message: "No active session to logout" };
      }
      const response = await this.request("/auth/logout", {
        method: "POST",
      });
      this.setAuthToken(null);
      return response;
    } catch (error) {
      this.setAuthToken(null);
      return { success: true, message: "Logged out locally" };
    }
  }

  async validateToken() {
    try {
      if (!this.token) return false;
      await this.request("/auth/me");
      return true;
    } catch {
      return false;
    }
  }

  async getMe() {
    const response = await this.request("/auth/me");
    return {
      ...response,
      data: {
        ...response.data,
        user:
          response.data?.data?.user ||
          response.data?.user ||
          response.data,
      },
    };
  }

  // --- Products ---
  async getProducts(filters = {}) {
    return this.request("/products", { method: "GET", params: filters });
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getCategories() {
    return this.request("/products/categories");
  }

  // --- Cart ---
  async getCart() {
    const response = await this.request("/cart");
    return this.transformCartResponse(response);
  }

  async addToCart(productId, quantity = 1) {
    const payload = { productId, quantity };
    const response = await this.request("/cart", {
      method: "POST",
      body: payload,
    });
    return this.transformCartResponse(response);
  }

  async addManyToCart(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items array is required for bulk add");
    }
    const response = await this.request("/cart", {
      method: "POST",
      body: { items },
    });
    return this.transformCartResponse(response);
  }

  async removeFromCart(productId) {
    const normalizedId =
      typeof productId === "object" ? productId._id || productId.id : productId;
    
    try {
      const response = await this.request(`/cart/items/${normalizedId}`, {
        method: "DELETE",
      });
      return this.transformCartResponse(response);
    } catch (error) {
      // If item is not found (404), treat it as success since it's already removed
      if (error.status === 404) {
        console.warn(`Item ${normalizedId} was already removed from cart`);
        return {
          success: true,
          data: { message: "Item was already removed from cart" }
        };
      }
      throw error;
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      const response = await this.request(`/cart/items/${productId}`, {
        method: "PATCH",
        body: { quantity },
      });
      return this.transformCartResponse(response);
    } catch (error) {
      // If item is not found (404), handle gracefully
      if (error.status === 404) {
        console.warn(`Item ${productId} not found in cart for update`);
        // Throw a more descriptive error that the context can handle
        const notFoundError = new Error("Item not found in cart");
        notFoundError.status = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async updateCartItems(items) {
    try {
      const response = await this.request("/cart/items", {
        method: "PATCH",
        body: { items },
      });
      return this.transformCartResponse(response);
    } catch (error) {
      // Handle case where some items might not be found
      if (error.status === 404) {
        console.warn("Some items not found in cart during bulk update");
        const notFoundError = new Error("Some items not found in cart");
        notFoundError.status = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async clearCart() {
    const response = await this.request("/cart/clear", { method: "DELETE" });
    return this.transformCartResponse(response);
  }

  async applyCoupon(code) {
    const response = await this.request("/cart/coupon", {
      method: "POST",
      body: { couponCode: code },
    });
    return this.transformCartResponse(response);
  }

  async removeCoupon() {
    const response = await this.request("/cart/coupon", { method: "DELETE" });
    return this.transformCartResponse(response);
  }

  // --- Orders ---
  async createOrder(orderData) {
    console.log('ApiClient: Creating order with data:', orderData);
    try {
      const response = await this.request("/orders", { 
        method: "POST", 
        body: orderData 
      });
      console.log('ApiClient: Order creation response:', response);
      return response;
    } catch (error) {
      console.error('ApiClient: Order creation failed:', error);
      throw error;
    }
  }

  async getOrders() {
    try {
      console.log('ApiClient: Fetching orders...');
      const response = await this.request("/orders", { 
        method: "GET",
        // Add a flag to prevent request cancellation
        skipDeduplication: true 
      });
      console.log('ApiClient: Raw orders response:', response);
      
      // Handle different response structures more robustly
      let ordersArray = [];
      
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          ordersArray = response.data;
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          ordersArray = response.data.orders;
        } else if (response.data.data && response.data.data.orders && Array.isArray(response.data.data.orders)) {
          ordersArray = response.data.data.orders;
        }
      }
      
      console.log('ApiClient: Processed orders:', ordersArray);
      
      return {
        ...response,
        success: true,
        data: ordersArray
      };
    } catch (error) {
      console.error('ApiClient: Failed to fetch orders:', error);
      
      // Handle specific error cases
      if (error.status === 404) {
        console.log('Orders endpoint not found, returning empty array');
        return {
          success: true,
          data: [],
          status: 200
        };
      }
      
      if (error.status === 401) {
        console.log('Authentication required for orders');
        throw new Error('Please log in to view your orders');
      }
      
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await this.request(`/orders/${orderId}`, { method: "GET" });
      return response;
    } catch (error) {
      console.error('ApiClient: Failed to fetch order by ID:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await this.request(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status }
      });
      return response;
    } catch (error) {
      console.error('ApiClient: Failed to update order status:', error);
      throw error;
    }
  }

  async getOrderStats() {
    try {
      const response = await this.request("/orders/stats", { method: "GET" });
      return response;
    } catch (error) {
      console.error('ApiClient: Failed to fetch order stats:', error);
      throw error;
    }
  }

  // --- Contact ---
  async sendContactMessage(messageData) {
    return this.request("/contact", {
      method: "POST",
      body: messageData,
    });
  }

  // --- Utils ---
  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  cancelPendingRequests() {
    this.pendingRequests.forEach((controller) => controller.abort());
    this.pendingRequests.clear();
  }

  // --- Debug helpers ---
  getApiBaseUrl() {
    return API_BASE_URL;
  }

  getCurrentToken() {
    return this.token;
  }

  async testConnection() {
    try {
      const response = await this.request("/", { method: "GET" });
      console.log('API Connection test:', response);
      return response;
    } catch (error) {
      console.error('API Connection test failed:', error);
      throw error;
    }
  }
}

const apiClient = new ApiClient();

// Add global error handler for debugging
window.apiClient = apiClient;

export default apiClient;