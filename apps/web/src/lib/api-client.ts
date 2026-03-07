/**
 * API Client Configuration
 *
 * Axios instance configured for making HTTP requests to the backend API.
 * Includes interceptors for request/response handling and error management.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/api';
import { useAppStore } from '../store/app-store';

/**
 * Create axios instance with default configuration
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Add authentication token, logging, etc.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    let token: string | null = null;

    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');

      // Recover token from persisted Zustand state if direct token key is missing.
      if (!token) {
        const persistedStore = localStorage.getItem('shreehari-mart-storage');

        if (persistedStore) {
          try {
            const parsedStore = JSON.parse(persistedStore);
            const persistedToken = parsedStore?.state?.auth?.token;

            if (typeof persistedToken === 'string' && persistedToken.length > 0) {
              token = persistedToken;
              localStorage.setItem('authToken', persistedToken);
            }
          } catch {
            // Ignore malformed persisted auth cache.
          }
        }
      }

      // Last fallback: in-memory Zustand state token.
      if (!token) {
        const storeToken = useAppStore.getState().auth.token;
        if (storeToken) {
          token = storeToken;
          localStorage.setItem('authToken', storeToken);
        }
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          params: config.params,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;

      console.error(`❌ API Error [${status}]:`, message);

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear persisted auth state so UI returns to login flow.
          if (typeof window !== 'undefined') {
            try {
              useAppStore.getState().logout();
            } catch {
              localStorage.removeItem('authToken');
            }
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ Network Error: No response received', error.request);
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to handle API errors
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as any)?.message ||
      error.message ||
      'An error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
