// src/services/ProductService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log('Making request to:', config.url);
    
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Present' : 'Missing');
    
    if (token) {
      // Remove any whitespace that might have been accidentally included
      const cleanToken = token.trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
      console.log('Authorization header set with clean token');
    } else {
      console.log('No token found, not setting Authorization header');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error);
    console.error('Error config:', error.config);
    return Promise.reject(error);
  }
);

const ProductService = {
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('');
      return response;
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error in getProductById(${id}):`, error);
      throw error;
    }
  },

  createProduct: async (product) => {
    try {
      const response = await apiClient.post('', product);
      return response;
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    try {
      const response = await apiClient.put(`/${id}`, product);
      return response;
    } catch (error) {
      console.error(`Error in updateProduct(${id}):`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error(`Error in deleteProduct(${id}):`, error);
      throw error;
    }
  }
};

export default ProductService;