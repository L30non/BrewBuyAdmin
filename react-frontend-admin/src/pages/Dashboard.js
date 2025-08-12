// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await ProductService.getAllProducts();
      const products = response.data;
      
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const lowStock = products.filter(product => product.quantity < 10).length;
      const recentProducts = products.slice(-5).reverse(); // Last 5 products
      
      setStats({
        totalProducts,
        totalValue,
        lowStock
      });
      setRecentProducts(recentProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <span>📦</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-green">
            <span>💰</span>
          </div>
          <div className="stat-info">
            <h3>${stats.totalValue.toLocaleString()}</h3>
            <p>Total Inventory Value</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-orange">
            <span>⚠️</span>
          </div>
          <div className="stat-info">
            <h3>{stats.lowStock}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
      </div>

      <div className="recent-products">
        <h3>Recently Added Products</h3>
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.quantity}</td>
                  <td>${(product.price * product.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;