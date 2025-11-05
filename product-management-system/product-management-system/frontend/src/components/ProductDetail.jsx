/**
 * ProductDetail Component - Hiển thị chi tiết một sản phẩm
 * 
 * Props:
 * - productId: ID của product cần hiển thị
 * 
 * Features:
 * - Tự động load product data khi có productId
 * - Hiển thị loading state
 * - Hiển thị error state
 * - Hiển thị "N/A" nếu description rỗng
 * - Format price với dấu $
 */
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductDetail = ({ productId }) => {
  // State management
  const [product, setProduct] = useState(null);       // Product data từ API
  const [loading, setLoading] = useState(true);       // Loading state
  const [error, setError] = useState(null);           // Error message

  /**
   * useEffect - Load product data khi productId thay đổi
   * Dependencies [productId]: chạy lại khi productId thay đổi
   */
  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  /**
   * Load product data từ API theo ID
   */
  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);      // Set product data
      setError(null);        // Clear error nếu có
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Guard clause: Không có productId
  if (!productId) {
    return <div data-testid="no-id">No product ID provided</div>;
  }

  // Conditional rendering: Loading state
  if (loading) return <div data-testid="loading">Loading...</div>;
  
  // Conditional rendering: Error state
  if (error) return <div data-testid="error">{error}</div>;
  
  // Conditional rendering: Product not found
  if (!product) return <div data-testid="not-found">Product not found</div>;

  // JSX Render: Hiển thị chi tiết product
  return (
    <div className="product-detail" data-testid="product-detail">
      <h2>Product Details</h2>
      
      {/* ID */}
      <div className="detail-row">
        <strong>ID:</strong>
        <span data-testid="product-id">{product.id}</span>
      </div>
      
      {/* Name */}
      <div className="detail-row">
        <strong>Name:</strong>
        <span data-testid="product-name">{product.name}</span>
      </div>
      
      {/* Description - Hiển thị "N/A" nếu rỗng */}
      <div className="detail-row">
        <strong>Description:</strong>
        <span data-testid="product-description">{product.description || 'N/A'}</span>
      </div>
      
      {/* Price - Format với $ */}
      <div className="detail-row">
        <strong>Price:</strong>
        <span data-testid="product-price">${product.price}</span>
      </div>
      
      {/* Quantity */}
      <div className="detail-row">
        <strong>Quantity:</strong>
        <span data-testid="product-quantity">{product.quantity}</span>
      </div>
    </div>
  );
};

export default ProductDetail;
