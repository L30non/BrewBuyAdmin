// src/components/ProductCard.js
import React from 'react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      <h4>{product.name}</h4>
      <p className="product-description">{product.description}</p>
      <div className="product-details">
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
      </div>
      <div className="card-actions">
        <button className="btn btn-edit" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(product.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;