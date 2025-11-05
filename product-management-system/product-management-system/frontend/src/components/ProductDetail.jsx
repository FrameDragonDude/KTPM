import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!productId) {
    return <div data-testid="no-id">No product ID provided</div>;
  }

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">{error}</div>;
  if (!product) return <div data-testid="not-found">Product not found</div>;

  return (
    <div className="product-detail" data-testid="product-detail">
      <h2>Product Details</h2>
      <div className="detail-row">
        <strong>ID:</strong>
        <span data-testid="product-id">{product.id}</span>
      </div>
      <div className="detail-row">
        <strong>Name:</strong>
        <span data-testid="product-name">{product.name}</span>
      </div>
      <div className="detail-row">
        <strong>Description:</strong>
        <span data-testid="product-description">{product.description || 'N/A'}</span>
      </div>
      <div className="detail-row">
        <strong>Price:</strong>
        <span data-testid="product-price">${product.price}</span>
      </div>
      <div className="detail-row">
        <strong>Quantity:</strong>
        <span data-testid="product-quantity">{product.quantity}</span>
      </div>
    </div>
  );
};

export default ProductDetail;
