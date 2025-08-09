// src/components/ProductList.tsx
import React, { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import { Product } from '../types/Product';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await ProductService.getAllProducts();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData: Product): Promise<void> => {
    try {
      await ProductService.createProduct(productData);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Failed to create product');
    }
  };

  const handleUpdateProduct = async (productData: Product): Promise<void> => {
    if (!editingProduct) return;
    try {
      await ProductService.updateProduct(editingProduct.id!, productData);
      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: number): Promise<void> => {
    try {
      await ProductService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const handleEdit = (product: Product): void => {
    setEditingProduct(product);
    setShowForm(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <h2>Products</h2>
      <button onClick={() => setShowForm(true)}>Add New Product</button>
      
      {showForm && (
        <ProductForm
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          initialData={editingProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => handleEdit(product)}
            onDelete={() => product.id && handleDeleteProduct(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
