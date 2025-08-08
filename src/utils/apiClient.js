// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nashma-backend-1-1.onrender.com/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
    this.pendingRequests = new Map();
    this.abortControllers = new Map();
  }

  async request(endpoint, options = {}, isRetry = false) {
    // Generate a unique requestKey — skip aborting for /auth/* calls
    let requestKey = `${options.method || 'GET'}:${endpoint}`;
    if (endpoint.startsWith('/auth/')) {
      requestKey += `:${Date.now()}`; // unique so it won't get aborted
    }

    // Cancel previous request for this key (unless it's auth which now has a unique key)
    if (this.pendingRequests.has(requestKey)) {
      this.abortControllers.get(requestKey)?.abort();
      this.abortControllers.delete(requestKey);
    }

    // Create AbortController for this request
    const abortController = new AbortController();
    this.abortControllers.set(requestKey, abortController);

    const config = {
      signal: abortController.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const requestPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else if (contentType?.includes('text/')) {
          data = await response.text();
        } else {
          data = await response.blob();
        }

        if (!response.ok) {
          if (response.status === 401 && !isRetry) {
            // token refresh logic could go here
          }
          throw {
            message: data.message || `Request failed with status ${response.status}`,
            status: response.status,
            data
          };
        }

        return { data, success: true, status: response.status };
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request was aborted');
          return { message: 'Request cancelled', success: false, status: 0 };
        }
        console.error('API Error:', error);
        return {
          message: error.message || 'Unknown error occurred',
          success: false,
          status: error.status,
          data: error.data
        };
      } finally {
        this.pendingRequests.delete(requestKey);
        this.abortControllers.delete(requestKey);
      }
    })();

    this.pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  }

  // HTTP helpers
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: data });
  }

  async put(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: data });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, { method: 'PATCH', body: data });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async signup(userData) {
    const response = await this.post('/auth/signup', userData);
    if (response.data?.token) this.setAuthToken(response.data.token);
    return response;
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.data?.token) this.setAuthToken(response.data.token);
    return response;
  }

  async logout() {
    const response = await this.post('/auth/logout', {});
    this.setAuthToken(null);
    return response;
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, passwords) {
    return this.patch(`/auth/reset-password/${token}`, passwords);
  }

  async updatePassword(passwords) {
    return this.patch('/auth/update-password', passwords);
  }

  async getMe() {
    return this.get('/auth/me');
  }

  // Product endpoints
  async getProducts(filters = {}) {
    return this.get('/products', filters);
  }

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async getCategories() {
    return this.get('/products/categories');
  }

  async getFeaturedProducts() {
    return this.get('/products/featured');
  }

  // Cart endpoints
  async getCart() {
    return this.get('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.post('/cart/add', { productId, quantity });
  }

  async removeFromCart(productId) {
    return this.delete(`/cart/remove/${productId}`);
  }

  async updateCartItems(items) {
    return this.patch('/cart/update', { items });
  }

  async clearCart() {
    return this.delete('/cart/clear');
  }

  async applyCoupon(couponCode) {
    return this.post('/cart/apply-coupon', { couponCode });
  }

  async removeCoupon() {
    return this.delete('/cart/remove-coupon');
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

  cancelRequest(requestKey) {
    if (this.abortControllers.has(requestKey)) {
      this.abortControllers.get(requestKey)?.abort();
      return true;
    }
    return false;
  }

  cancelAllRequests() {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
    this.pendingRequests.clear();
  }

  getPendingRequests() {
    return Array.from(this.pendingRequests.keys());
  }
}

// Singleton instance
const apiClient = new ApiClient();
export default apiClient;
