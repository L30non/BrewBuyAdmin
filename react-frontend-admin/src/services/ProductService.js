// src/services/ProductService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ProductService = {
  getAllProducts: () => {
    return apiClient.get('');
  },

  getProductById: (id) => {
    return apiClient.get(`/${id}`);
  },

  createProduct: (product) => {
    return apiClient.post('', product);
  },

  updateProduct: (id, product) => {
    return apiClient.put(`/${id}`, product);
  },

  deleteProduct: (id) => {
    return apiClient.delete(`/${id}`);
  }
};

export default ProductService;