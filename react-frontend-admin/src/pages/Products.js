// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortOption]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching products...');
      
      // Log the token before making the request
      const token = localStorage.getItem('token');
      console.log('Token before API call:', token ? 'Present' : 'Missing');
      
      const response = await ProductService.getAllProducts();
      console.log('Products response:', response);
      setProducts(response.data);
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

  const filterAndSortProducts = () => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'quantity':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(id);
        fetchProducts(); // Refresh the list
      } catch (err) {
        console.error('Error deleting product:', err);
        if (err.response?.status === 401) {
          alert('Authentication required. Please login again.');
        } else if (err.response?.status === 403) {
          alert('Access forbidden. You do not have permission to delete products.');
        } else if (err.response?.status === 404) {
          alert('Product not found.');
        } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
          alert('Network error. Please check your connection and ensure the backend server is running.');
        } else {
          alert('Failed to delete product. Please try again.');
        }
      }
    }
  };

  if (loading) {
    return <div className="products-page">Loading products...</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Product Management</h2>
        <div className="products-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="quantity">Quantity: High to Low</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found.</p>
            {searchTerm && <p>Try adjusting your search term.</p>}
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))
        )}
      </div>

      <div className="products-summary">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>
    </div>
  );
};

export default Products;