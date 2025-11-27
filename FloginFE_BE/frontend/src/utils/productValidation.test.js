// productValidation.test.js
import { validateProduct } from './validateProduct';

describe('product validation tests', () => {

  test('Test1: Name rỗng gây ra lỗi', () => {
    const p = { name: '', price: 1000, stock: 10 };
    const e = validateProduct(p);
    expect(e.name).toBe('Thiếu tên sản phẩm');
  });

  test('Test2: Gía <= 0 gây ra lỗi', () => {
    const p = { name: 'Đồng hồ thông minh', price: 0, stock: 1 };
    const e = validateProduct(p);
    expect(e.price).toBe('Giá phải lớn hơn 0');
  });

  test('Test3: Số lượng < 0 gây ra lỗi', () => {
    const p = { name: 'Đồng hồ thông minh', price: 1000, stock: -1 };
    const e = validateProduct(p);
    expect(e.stock).toBe('Số lượng không được âm');
  });

  test('Test4: Mô tả quá 500 ký tự gây ra lỗi', () => {
    const p = { name: 'Đồng hồ thông minh', price: 1000, stock: 1, desc: 'x'.repeat(501) };
    const e = validateProduct(p);
    expect(e.desc).toBe('Mô tả quá dài');
  });

  test('Test5: Danh mục không hợp lệ gây ra lỗi', () => {
    const p = { name: 'Đồng hồ thông minh', price: 1000, stock: 1, category: 'Unknown' };
    const e = validateProduct(p);
    expect(e.category).toBe('Danh mục không hợp lệ');
  });

  test('Test6: Dữ liệu không lỗi', () => {
    const p = { name: 'Đồng hồ thông minh', price: 990000, stock: 36, category: 'Điện tử', desc: 'Theo dõi sức khỏe với cảm biến nhịp tim' };
    const e = validateProduct(p);
    expect(e).toBe(true);
  });
});
