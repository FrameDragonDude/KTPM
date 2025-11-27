import React from 'react';

const ProductDetail = ({ product }) => {
  if (!product) {
    return <div role="alert">Không tìm thấy sản phẩm hoặc có lỗi xảy ra.</div>;
  }
  return (
    <div className="product-detail" data-testid="product-detail">
      <h2>{product.name}</h2>
      <div><strong>Mô tả:</strong> {product.desc}</div>
      <div><strong>Danh mục:</strong> {product.category}</div>
      <div><strong>Giá:</strong> ${product.price.toFixed(2)}</div>
      <div><strong>Tồn kho:</strong> {product.stock} cái</div>
    </div>
  );
};

export default ProductDetail;
