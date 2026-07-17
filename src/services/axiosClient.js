/**
 * Axios base client — single configured instance.
 * All services import from here. Handles auth headers, error toasts, and mock fallback.
 */
import axios from 'axios';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token if present
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — global error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (!error.response) {
      // Network error — running without backend is expected
      console.info('[axiosClient] No backend available — use mock data.');
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
