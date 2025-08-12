// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AuthService from './services/AuthService';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            AuthService.isAuthenticated() ? <Navigate to="/" replace /> : <Login />
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="main-content">
                  <Dashboard />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="main-content">
                  <Products />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          {/* Single route for both add and edit */}
          <Route path="/add-product" element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="main-content">
                  <AddProduct />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/add-product/:id" element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="main-content">
                  <AddProduct />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;