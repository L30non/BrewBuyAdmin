// src/components/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const totalValue = product.price * product.quantity;

  const handleEdit = () => {
    navigate(`/add-product/${product.id}`);
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-id">ID: {product.id}</span>
      </div>
      
      <div className="product-content">
        <p className="product-description">
          {product.description || 'No description provided'}
        </p>
        
        <div className="product-details">
          <div className="detail-item">
            <span className="detail-label">Price:</span>
            <span className="detail-value">${product.price}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Quantity:</span>
            <span className={`detail-value ${product.quantity < 10 ? 'low-stock' : ''}`}>
              {product.quantity}
              {product.quantity < 10 && <span className="low-stock-badge">Low Stock</span>}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Value:</span>
            <span className="detail-value">${totalValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button 
          className="btn btn-edit" 
          onClick={handleEdit}
        >
          ✏️ Edit
        </button>
        <button 
          className="btn btn-delete" 
          onClick={() => onDelete(product.id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;