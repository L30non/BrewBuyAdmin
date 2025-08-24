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
    quantity: '',
    imageBase64: '',
    imageType: ''
  });

  const [imagePreview, setImagePreview] = useState('');
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
      console.log('Fetching product by ID:', productId);
      
      // Log the token before making the request
      const token = localStorage.getItem('token');
      console.log('Token before API call:', token ? 'Present' : 'Missing');
      
      const response = await ProductService.getProductById(productId);
      const product = response.data;
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        imageBase64: product.imageBase64 || '',
        imageType: product.imageType || ''
      });
      
      // Set image preview if product has an image
      if (product.imageBase64 && product.imageType) {
        setImagePreview(`data:${product.imageType};base64,${product.imageBase64}`);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error.response?.status === 404) {
        alert('Product not found.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login again.');
      } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        alert('Network error. Please check your connection and ensure the backend server is running.');
      } else {
        alert('Failed to load product for editing. Please try again.');
      }
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  // Function to convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, etc.)'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      try {
        // Convert to Base64
        const base64 = await convertToBase64(file);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          imageBase64: base64,
          imageType: file.type
        }));
        
        // Set preview
        setImagePreview(URL.createObjectURL(file));
        
        // Clear any previous image errors
        if (errors.image) {
          setErrors(prev => ({
            ...prev,
            image: ''
          }));
        }
      } catch (error) {
        console.error('Error converting image:', error);
        setErrors(prev => ({
          ...prev,
          image: 'Error processing image file'
        }));
      }
    } else {
      // If no file selected, clear image data
      setFormData(prev => ({
        ...prev,
        imageBase64: '',
        imageType: ''
      }));
      setImagePreview('');
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageBase64: '',
      imageType: ''
    }));
    setImagePreview('');
    
    // Clear file input
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
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
      // Log the token before making the request
      const token = localStorage.getItem('token');
      console.log('Token before API call:', token ? 'Present' : 'Missing');
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };
      
      // Remove image data if no image is selected
      if (!formData.imageBase64) {
        delete submitData.imageBase64;
        delete submitData.imageType;
      }
      
      if (isEditing) {
        // Update existing product
        console.log('Updating product:', id, submitData);
        await ProductService.updateProduct(id, submitData);
        alert('Product updated successfully!');
      } else {
        // Create new product
        console.log('Creating new product:', submitData);
        await ProductService.createProduct(submitData);
        alert('Product added successfully!');
      }
      
      navigate('/products');
    } catch (err) {
      console.error('Error saving product:', err);
      if (err.response?.status === 401) {
        alert('Authentication required. Please login again.');
      } else if (err.response?.status === 403) {
        alert('Access forbidden. You do not have permission to save products.');
      } else if (err.response?.status === 400) {
        alert(`Invalid data: ${err.response.data?.message || 'Please check your input.'}`);
      } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        alert('Network error. Please check your connection and ensure the backend server is running.');
      } else {
        alert(`Failed to ${isEditing ? 'update' : 'add'} product. Please try again.`);
      }
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
        quantity: '',
        imageBase64: '',
        imageType: ''
      });
      setImagePreview('');
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

          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={errors.image ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.image && <span className="error-message">{errors.image}</span>}
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                <button type="button" className="btn btn-danger" onClick={handleRemoveImage} disabled={isSubmitting}>
                  Remove Image
                </button>
              </div>
            )}
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