// src/TestAPI.js
import React, { useState } from 'react';
import ProductService from './services/ProductService';

const TestAPI = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const testWithAxios = async () => {
    try {
      setResult('');
      setError('');
      console.log('Testing with axios...');
      
      const response = await ProductService.getAllProducts();
      setResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error('Axios error:', err);
      setError(`Axios error: ${err.message}`);
    }
  };

  const testWithFetch = async () => {
    try {
      setResult('');
      setError('');
      console.log('Testing with fetch...');
      
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Fetch response:', response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Fetch error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>API Test</h2>
      <button onClick={testWithAxios}>Test with Axios</button>
      <button onClick={testWithFetch}>Test with Fetch</button>
      
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;