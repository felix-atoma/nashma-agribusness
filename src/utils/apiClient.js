// utils/apiClient.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "https://nashma-backend-1-1.onrender.com/api";

class ApiClient {
  constructor() {
    this.token = localStorage.getItem("token");
    this.pendingRequests = new Map();
  }

  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const requestKey = `${options.method || "GET"}:${endpoint}:${JSON.stringify(options.params || {})}`;

    const isCriticalOperation = ["POST", "PATCH", "DELETE"].includes(options.method || "GET") || endpoint === "/orders";

    if (this.pendingRequests.has(requestKey) && !isCriticalOperation) {
      this.pendingRequests.get(requestKey).abort();
    }
    this.pendingRequests.set(requestKey, controller);

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
      body: options.body && typeof options.body === "object" ? JSON.stringify(options.body) : options.body,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await this.parseResponse(response);
        const error = new Error(
          errorData.message || errorData.error || `Request failed with status ${response.status}`
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

  // --- Auth Methods ---
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

  async getMe() {
    const response = await this.request("/auth/me");
    return {
      ...response,
      data: {
        ...response.data,
        user: response.data?.data?.user || response.data?.user || response.data,
      },
    };
  }
  
// Add this method to your utils/apiClient.js file in the Auth Methods section

async forgotPassword(email) {
  return this.request("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

async resetPassword(token, passwords) {
  return this.request(`/auth/reset-password/${token}`, {
    method: "PATCH",
    body: passwords,
  });
}

async updatePassword(passwords) {
  return this.request("/auth/update-password", {
    method: "PATCH",
    body: passwords,
  });
}

  // --- Utility Methods ---
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

  // --- Other methods (products, cart, orders, etc.) remain the same ---
  async getProducts(filters = {}) {
    return this.request("/products", { method: "GET", params: filters });
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

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

  async removeFromCart(productId) {
    const normalizedId = typeof productId === "object" ? productId._id || productId.id : productId;
    
    try {
      const response = await this.request(`/cart/items/${normalizedId}`, {
        method: "DELETE",
      });
      return this.transformCartResponse(response);
    } catch (error) {
      if (error.status === 404) {
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
        body: { quantity }
      });
      return this.transformCartResponse(response);
    } catch (error) {
      if (error.status === 404) {
        const notFoundError = new Error("Item not found in cart");
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

  async createOrder(orderData) {
    const response = await this.request("/orders", { 
      method: "POST", 
      body: orderData 
    });
    return response;
  }

  async getOrders() {
    try {
      const response = await this.request("/orders", { 
        method: "GET",
      });
      
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
      
      return {
        ...response,
        success: true,
        data: ordersArray
      };
    } catch (error) {
      if (error.status === 404) {
        return {
          success: true,
          data: [],
          status: 200
        };
      }
      throw error;
    }
  }

  async verifyPayment(reference) {
    const response = await this.request(`/payment/verify/${reference}`, {
      method: "GET"
    });
    return response;
  }
}

const apiClient = new ApiClient();
export default apiClient;