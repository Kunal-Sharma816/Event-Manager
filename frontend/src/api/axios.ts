import axios from "axios";

const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  "https://event-manager-kunal.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
       
      // Only redirect if user is on a protected route
      const protectedPaths = ["/admin", "/organizer", "/student"];
      if (protectedPaths.some(path => window.location.pathname.startsWith(path))) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
   }
);

export default axiosInstance;