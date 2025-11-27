
import React, { useEffect, useState } from 'react';
import productService from '../services/productService.js';

const ProductList = ({ onEdit, onDelete }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    productService.getAllProducts()
      .then(setProducts)
      .catch(err => setError(err.message || 'Server error'));
  }, []);

  return (
    <div>
      {error && <div role="alert">{error}</div>}
      <table className="product-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={idx} data-testid="product-item">
              <td>
                <div className="product-name">{p.name}</div>
                <div className="product-desc">{p.desc}</div>
              </td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock} cái</td>
              <td>
                <span className="action-icon edit" title="Sửa" onClick={() => onEdit && onEdit(idx)}>✏️</span>
                <span className="action-icon delete" title="Xóa" onClick={() => onDelete && onDelete(idx)}>🗑️</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
