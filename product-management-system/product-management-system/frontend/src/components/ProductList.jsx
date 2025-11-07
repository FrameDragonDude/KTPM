/**
 * ProductList Component - Hiển thị danh sách sản phẩm
 * 
 * Features:
 * - Load và hiển thị tất cả products trong table
 * - Delete product với confirmation
 * - Loading và error states
 * - Empty state khi không có products
 */
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import { formatCurrencyVND } from '../utils/format';

const ProductList = () => {
  // State management
  const [products, setProducts] = useState([]);        // Danh sách products
  const [loading, setLoading] = useState(true);        // Trạng thái đang load
  const [error, setError] = useState(null);            // Error message (nếu có)

  /**
   * useEffect hook - Chạy khi component mount
   * Load products ngay khi component được render lần đầu
   * Dependencies []: chỉ chạy 1 lần khi mount
   */
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Load danh sách products từ API
   * Async function với try-catch-finally để handle errors
   */
  const loadProducts = async () => {
    try {
      setLoading(true);                                  // Bật loading state
      const data = await productService.getAllProducts(); // Gọi API
      setProducts(data);                                 // Update state với data
      setError(null);                                    // Clear error nếu có
    } catch (err) {
      setError('Failed to load products');              // Set error message
      console.error('Error loading products:', err);     // Log error
    } finally {
      setLoading(false);                                 // Tắt loading state
    }
  };

  /**
   * Xử lý xóa product
   * - Hiện confirmation dialog trước khi xóa
   * - Gọi API delete
   * - Reload danh sách sau khi xóa thành công
   * 
   * @param {number} id - ID của product cần xóa
   */
  const handleDelete = async (id) => {
    // Confirmation dialog
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);          // Gọi API delete
        await loadProducts();                            // Reload danh sách
      } catch (err) {
        setError('Failed to delete product');           // Set error nếu xóa fail
        console.error('Error deleting product:', err);
      }
    }
  };

  // Conditional rendering dựa trên state
  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  /**
   * JSX Render
   * - Hiển thị empty message nếu không có products
   * - Hiển thị table với danh sách products nếu có data
   * - Mỗi row có button Delete
   * - Sử dụng data-testid để dễ dàng test với React Testing Library
   */
  return (
    <div className="product-list">
      <h2>Product List</h2>
      {/* Conditional rendering: Empty state vs Product table */}
      {products.length === 0 ? (
        <p data-testid="empty-message">No products available</p>
      ) : (
        <table data-testid="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Map qua mảng products để render từng row */}
            {products.map((product) => (
              <tr key={product.id} data-testid={`product-row-${product.id}`}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{formatCurrencyVND(product.price)}</td>
                <td>{product.quantity}</td>
                <td>
                  {/* Delete button với onClick handler */}
                  <button 
                    onClick={() => handleDelete(product.id)}
                    data-testid={`delete-btn-${product.id}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
