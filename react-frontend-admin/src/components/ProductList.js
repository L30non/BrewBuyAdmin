// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAllProducts();
      setProducts(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. You do not have permission to view products.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError('Network error. Please check your connection and ensure the backend server is running.');
      } else {
        setError(`Failed to fetch products: ${err.message || 'Unknown error'}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await ProductService.createProduct(productData);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. You do not have permission to create products.');
      } else if (err.response?.status === 400) {
        setError(`Invalid data: ${err.response.data?.message || 'Please check your input.'}`);
      } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError('Network error. Please check your connection and ensure the backend server is running.');
      } else {
        setError('Failed to create product');
      }
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await ProductService.updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. You do not have permission to update products.');
      } else if (err.response?.status === 400) {
        setError(`Invalid data: ${err.response.data?.message || 'Please check your input.'}`);
      } else if (err.response?.status === 404) {
        setError('Product not found.');
      } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError('Network error. Please check your connection and ensure the backend server is running.');
      } else {
        setError('Failed to update product');
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        if (err.response?.status === 401) {
          setError('Authentication required. Please login again.');
        } else if (err.response?.status === 403) {
          setError('Access forbidden. You do not have permission to delete products.');
        } else if (err.response?.status === 404) {
          setError('Product not found.');
        } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
          setError('Network error. Please check your connection and ensure the backend server is running.');
        } else {
          setError('Failed to delete product');
        }
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-list">
      <div className="header">
        <h2>Product Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          Add Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={handleCancel}
        />
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <p>No products found. Add your first product!</p>
          ) : (
            products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;