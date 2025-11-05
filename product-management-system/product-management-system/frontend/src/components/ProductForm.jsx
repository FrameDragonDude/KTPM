import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductForm = ({ productId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
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

  const validate = () => {
    const errors = {};
    
    if (!formData.name || formData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.price || formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (formData.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (productId) {
        await productService.updateProduct(productId, productData);
      } else {
        await productService.createProduct(productData);
      }
      
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

  if (loading && productId) return <div data-testid="loading">Loading...</div>;

  return (
    <div className="product-form">
      <h2>{productId ? 'Edit Product' : 'Create Product'}</h2>
      {error && <div data-testid="error" className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} data-testid="product-form">
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
          {validationErrors.name && (
            <span data-testid="name-error" className="error">{validationErrors.name}</span>
          )}
        </div>

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

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            data-testid="price-input"
          />
          {validationErrors.price && (
            <span data-testid="price-error" className="error">{validationErrors.price}</span>
          )}
        </div>

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

        <button 
          type="submit" 
          disabled={loading}
          data-testid="submit-btn"
        >
          {loading ? 'Saving...' : (productId ? 'Update' : 'Create')}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
