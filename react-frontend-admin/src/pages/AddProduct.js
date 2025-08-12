// src/pages/AddProduct.js
import React, { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';
import { useNavigate, useParams } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL for editing
  const isEditing = !!id; // Check if we're editing or adding

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing); // Loading only when editing

  // Fetch product data if editing
  useEffect(() => {
    if (isEditing) {
      fetchProductById(id);
    }
  }, [id, isEditing]);

  const fetchProductById = async (productId) => {
    try {
      const response = await ProductService.getProductById(productId);
      const product = response.data;
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        quantity: product.quantity.toString()
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product for editing.');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        // Update existing product
        await ProductService.updateProduct(id, {
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        });
        alert('Product updated successfully!');
      } else {
        // Create new product
        await ProductService.createProduct({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        });
        alert('Product added successfully!');
      }
      
      navigate('/products');
    } catch (err) {
      console.error('Error saving product:', err);
      alert(`Failed to ${isEditing ? 'update' : 'add'} product. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditing && !loading) {
      // Reset to original product data
      fetchProductById(id);
    } else {
      // Reset to empty form
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: ''
      });
    }
  };

  if (loading) {
    return (
      <div className="add-product-page">
        <div className="loading">Loading product data...</div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/products')}
        >
          ← Back to Products
        </button>
      </div>

      <div className="add-product-form-container">
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter product name"
                disabled={isSubmitting}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={errors.price ? 'error' : ''}
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={errors.quantity ? 'error' : ''}
                placeholder="Enter quantity"
                disabled={isSubmitting}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter product description"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                isEditing ? 'Updating Product...' : 'Adding Product...'
              ) : (
                isEditing ? 'Update Product' : 'Add Product'
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={handleReset}
              disabled={isSubmitting}
            >
              {isEditing ? 'Reset Changes' : 'Clear Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;