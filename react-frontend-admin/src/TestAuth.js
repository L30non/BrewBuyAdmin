// src/TestAuth.js
import React, { useState, useEffect } from 'react';
import AuthService from './services/AuthService';
import ProductService from './services/ProductService';

const TestAuth = () => {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken || '');
  }, []);

  const handleTestToken = () => {
    const currentToken = localStorage.getItem('token');
    console.log('Current token:', currentToken);
    setToken(currentToken || '');
    
    if (currentToken) {
      // Try to fetch products
      ProductService.getAllProducts()
        .then(response => {
          console.log('Products response:', response);
          setProducts(response.data);
          setError('');
        })
        .catch(err => {
          console.error('Error fetching products:', err);
          setError(`Error: ${err.message}`);
        });
    } else {
      setError('No token found in localStorage');
    }
  };

  const handleClearToken = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Authentication Test</h2>
      <div>
        <p>Token in localStorage: {token ? 'Yes' : 'No'}</p>
        {token && <p>Token length: {token.length} characters</p>}
      </div>
      <button onClick={handleTestToken}>Test Token & Fetch Products</button>
      <button onClick={handleClearToken}>Clear Token</button>
      
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      
      <div style={{ marginTop: '20px' }}>
        <h3>Products:</h3>
        <pre>{JSON.stringify(products, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TestAuth;