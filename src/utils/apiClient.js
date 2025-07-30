import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://nashma-backend-1.onrender.com";
if (!baseURL) {
  throw new Error("❌ Missing API base URL configuration");
}

console.log("✅ API base URL:", baseURL);

const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Store token if it comes in response
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    };

    console.error("API Error:", errorDetails);
    
    // Handle 401 unauthorized errors
    if (errorDetails.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(errorDetails);
  }
);

export default apiClient;