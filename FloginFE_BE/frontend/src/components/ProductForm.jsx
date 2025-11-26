import React from 'react';

const ProductForm = ({ product, onChange, onSubmit, onCancel, isEdit, error }) => (
  <form className="modal-form" onSubmit={onSubmit} aria-label="product-form">
    {error && <div role="alert" style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
    <div className="modal-group">
      <label htmlFor="name">Tên sản phẩm</label>
      <input id="name" name="name" value={product.name} onChange={onChange} placeholder="Nhập tên sản phẩm" />
    </div>
    <div className="modal-group">
      <label htmlFor="desc">Mô tả</label>
      <input id="desc" name="desc" value={product.desc} onChange={onChange} placeholder="Nhập mô tả sản phẩm" />
    </div>
    <div className="modal-row">
      <div className="modal-group">
        <label htmlFor="price">Giá ($)</label>
        <input id="price" name="price" type="number" min="0" step="0.01" value={product.price} onChange={onChange} placeholder="0.00" />
      </div>
      <div className="modal-group">
        <label htmlFor="stock">Tồn kho</label>
        <input id="stock" name="stock" type="number" min="0" value={product.stock} onChange={onChange} placeholder="0" />
      </div>
    </div>
    <div className="modal-group">
      <label htmlFor="category">Danh mục</label>
      <input id="category" name="category" value={product.category} onChange={onChange} placeholder="Nhập danh mục" />
    </div>
    <div className="modal-actions">
      <button type="button" className="modal-cancel" onClick={onCancel}>Hủy</button>
      <button type="submit" className="modal-submit">{isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</button>
    </div>
  </form>
);

export default ProductForm;
