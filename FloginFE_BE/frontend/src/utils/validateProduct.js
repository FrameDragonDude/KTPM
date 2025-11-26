export function validateProduct(product) {
  if (!product) return 'Invalid product';
  const errors = {};

  if (!product.name || product.name.trim() === '') {
    errors.name = 'Thiếu tên sản phẩm';
  }
  if (!product.desc || product.desc.trim() === '') {
    errors.desc = 'Mô tả là bắt buộc';
  }
  if (product.price == null || isNaN(product.price) || product.price <= 0) {
    errors.price = 'Giá phải lớn hơn 0';
  }
  if (product.stock == null || isNaN(product.stock) || product.stock < 0) {
    errors.stock = 'Số lượng không được âm';
  }
  if (product.desc && product.desc.length > 500) {
    errors.desc = 'Mô tả quá dài';
  }
  const validCategories = ['Điện tử', 'Phụ kiện'];
  if (product.category && !validCategories.includes(product.category)) {
    errors.category = 'Danh mục không hợp lệ';
  }
  if (Object.keys(errors).length === 0) return true;
  return errors;
}