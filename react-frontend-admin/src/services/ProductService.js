// src/services/ProductService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

const ProductService = {
  getAllProducts: () => {
    return axios.get(API_BASE_URL);
  },

  getProductById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  createProduct: (product) => {
    return axios.post(API_BASE_URL, product);
  },

  updateProduct: (id, product) => {
    return axios.put(`${API_BASE_URL}/${id}`, product);
  },

  deleteProduct: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};

export default ProductService;