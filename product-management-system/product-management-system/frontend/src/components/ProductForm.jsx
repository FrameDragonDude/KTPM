/**
 * ProductForm Component - Form tạo/chỉnh sửa sản phẩm
 * 
 * Props:
 * - productId: ID của product cần edit (null/undefined nếu đang tạo mới)
 * - onSuccess: Callback function gọi khi save thành công
 * 
 * Features:
 * - Create mode: không có productId
 * - Edit mode: có productId, tự động load product data
 * - Validation: name >= 3 chars, price > 0, quantity >= 0
 * - Loading và error states
 */
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import { validateProduct } from '../utils/validation';

const ProductForm = ({ productId, onSuccess }) => {
  // State quản lý form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);              // Loading state khi save/load
  const [error, setError] = useState(null);                   // Error message
  const [validationErrors, setValidationErrors] = useState({}); // Validation errors cho từng field

  /**
   * useEffect - Load product data khi có productId (Edit mode)
   * Dependencies [productId]: chạy lại khi productId thay đổi
   */
  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  /**
   * Load product data theo ID để fill vào form (Edit mode)
   */
  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      // Set form data với giá trị từ API
      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price,
        quantity: data.quantity
      });
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate form data
   * 
   * Rules:
   * - Name: bắt buộc, >= 3 ký tự
   * - Price: bắt buộc, > 0
   * - Quantity: phải >= 0
   * 
   * @returns {boolean} true nếu valid, false nếu có lỗi
   */
  const validate = () => {
    const errors = validateProduct({
      name: formData.name,
      price: formData.price,
      quantity: formData.quantity,
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle input change events
   * Update formData state khi user nhập liệu
   * 
   * @param {Event} e - Change event từ input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value  // Sử dụng computed property name để update field động
    }));
  };

  /**
   * Handle form submit
   * 
   * Flow:
   * 1. Prevent default form submission
   * 2. Validate form data
   * 3. Parse price và quantity từ string sang number
   * 4. Gọi API create hoặc update tùy theo mode
   * 5. Gọi onSuccess callback nếu thành công
   * 
   * @param {Event} e - Submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();  // Ngăn form submit default (reload page)
    
    // Validate trước khi submit
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Parse string sang number type (API yêu cầu number)
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),      // Convert string to decimal
        quantity: parseInt(formData.quantity)   // Convert string to integer
      };

      // Edit mode: gọi updateProduct với ID
      if (productId) {
        await productService.updateProduct(productId, productData);
      } 
      // Create mode: gọi createProduct
      else {
        await productService.createProduct(productData);
      }
      
      // Gọi callback sau khi save thành công (parent component xử lý)
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị loading khi đang load product data (Edit mode)
  if (loading && productId) return <div data-testid="loading">Loading...</div>;

  // JSX Render: Form với validation errors
  return (
    <div className="product-form">
      {/* Title động: Edit hoặc Create */}
      <h2>{productId ? 'Edit Product' : 'Create Product'}</h2>
      
      {/* Error message nếu có */}
      {error && <div data-testid="error" className="error">{error}</div>}
      
      {/* Form với onSubmit handler */}
      <form onSubmit={handleSubmit} data-testid="product-form">
        
        {/* Name field - Required, min 3 chars */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            data-testid="name-input"
          />
          {/* Hiển thị validation error nếu có */}
          {validationErrors.name && (
            <span data-testid="name-error" className="error">{validationErrors.name}</span>
          )}
        </div>

        {/* Description field - Optional */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            data-testid="description-input"
          />
        </div>

        {/* Price field - Required, must be > 0 */}
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"  // Cho phép nhập decimal với 2 chữ số
            value={formData.price}
            onChange={handleChange}
            data-testid="price-input"
          />
          {validationErrors.price && (
            <span data-testid="price-error" className="error">{validationErrors.price}</span>
          )}
        </div>

        {/* Quantity field - Must be >= 0 */}
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            data-testid="quantity-input"
          />
          {validationErrors.quantity && (
            <span data-testid="quantity-error" className="error">{validationErrors.quantity}</span>
          )}
        </div>

        {/* Submit button - disabled khi đang loading */}
        <button 
          type="submit" 
          disabled={loading}
          data-testid="submit-btn"
        >
          {/* Text động dựa vào loading state và mode */}
          {loading ? 'Saving...' : (productId ? 'Update' : 'Create')}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
