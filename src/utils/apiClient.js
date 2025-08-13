const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nashma-backend-1-1.onrender.com/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
    this.pendingRequests = new Map();
  }

  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const requestKey = `${options.method || 'GET'}:${endpoint}:${JSON.stringify(options.params || {})}`;

    // Cancel previous request if it exists
    if (this.pendingRequests.has(requestKey)) {
      this.pendingRequests.get(requestKey).abort();
    }
    this.pendingRequests.set(requestKey, controller);

    // Handle query parameters
    let url = `${API_BASE_URL}${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const config = {
      method: options.method || 'GET',
      headers,
      signal: controller.signal,
      ...options,
      body: options.body && typeof options.body === 'object' 
        ? JSON.stringify(options.body) 
        : options.body,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await this.parseResponse(response);
        const error = new Error(errorData.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error; // This will be caught by React Query as a failed request
      }

      const data = await this.parseResponse(response);
      return {
        data,
        success: true,
        status: response.status
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        // For aborted requests, we can return a cancelled response
        // but React Query will handle this appropriately
        throw new Error('Request was cancelled');
      }
      
      console.error('API Error:', error);
      // Re-throw the error so React Query knows the request failed
      throw error;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  async parseResponse(response) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      try {
        return await response.json();
      } catch (error) {
        console.error('Failed to parse JSON response:', error);
        return {};
      }
    }
    return await response.text();
  }

  // Auth endpoints
  async signup(userData) {
    try {
      const response = await this.request('/auth/signup', {
        method: 'POST',
        body: userData
      });
      
      if (response.data?.token) {
        this.setAuthToken(response.data.token);
      }
      return response;
    } catch (error) {
      // Handle auth-specific errors if needed
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: credentials
      });
      
      if (response.data?.token) {
        this.setAuthToken(response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.request('/auth/logout', {
        method: 'POST'
      });
      this.setAuthToken(null);
      return response;
    } catch (error) {
      // Even if logout fails on server, clear local token
      this.setAuthToken(null);
      throw error;
    }
  }

  async getMe() {
    const response = await this.request('/auth/me');
    
    // Normalize response structure
    return {
      ...response,
      data: {
        ...response.data,
        user: response.data?.data?.user || response.data?.user || response.data
      }
    };
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });
  }

  async resetPassword(token, passwords) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'PATCH',
      body: passwords
    });
  }

  async updatePassword(passwords) {
    return this.request('/auth/update-password', {
      method: 'PATCH',
      body: passwords
    });
  }

  // Product endpoints
  async getProducts(filters = {}) {
    return this.request('/products', {
      method: 'GET',
      params: filters
    });
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getCategories() {
    return this.request('/products/categories');
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart', {
      method: 'POST',
      body: { productId, quantity }
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/items/${productId}`, {
      method: 'DELETE'
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: { quantity }
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE'
    });
  }

  // Utility methods
  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  cancelPendingRequests() {
    this.pendingRequests.forEach(controller => controller.abort());
    this.pendingRequests.clear();
  }
}

const apiClient = new ApiClient();
export default apiClient;