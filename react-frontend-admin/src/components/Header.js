// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Header = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Product Manager</h1>
        </Link>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/add-product" className="nav-link">Add Product</Link>
        </nav>
        <div className="user-menu">
          <span className="user-info">
            Welcome, <strong>{currentUser?.username || 'Admin'}</strong>
          </span>
          <button 
            onClick={handleLogout}
            className="btn btn-logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;