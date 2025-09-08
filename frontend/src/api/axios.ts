import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api" || "https://event-manager-kunal.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
