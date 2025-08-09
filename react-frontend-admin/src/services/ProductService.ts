// src/services/ProductService.ts
import axios, { AxiosResponse } from 'axios';
import { Product } from '../types/Product';

const API_BASE_URL = 'http://localhost:8080/api/products';

const ProductService = {
  getAllProducts: (): Promise<AxiosResponse<Product[]>> => {
    return axios.get(API_BASE_URL);
  },

  getProductById: (id: number): Promise<AxiosResponse<Product>> => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  createProduct: (product: Product): Promise<AxiosResponse<Product>> => {
    return axios.post(API_BASE_URL, product);
  },

  updateProduct: (id: number, product: Product): Promise<AxiosResponse<Product>> => {
    return axios.put(`${API_BASE_URL}/${id}`, product);
  },

  deleteProduct: (id: number): Promise<AxiosResponse<void>> => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};

export default ProductService;
