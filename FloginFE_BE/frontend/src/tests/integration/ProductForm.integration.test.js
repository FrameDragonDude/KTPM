import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Product from '../../components/Product';
jest.mock('axios');

// 4.2.1a - Product List Integration
describe('ProductList Integration', () => {
  it('renders products from API', async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { name: 'A', desc: 'descA', category: 'CatA', price: 10, stock: 1 },
      { name: 'B', desc: 'descB', category: 'CatB', price: 20, stock: 2 }
    ] });
    render(<Product onLogout={() => {}} />);
    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledTimes(1);
      const [payload] = createProduct.mock.calls[0];
      expect(payload).toMatchObject({
        name: 'Đồng hồ thông minh',
        price: 990000,
        stock: 36,
        desc: 'Theo dõi sức khỏe với cảm biến nhịp tim',
        category: 'Điện tử',
      });
      expect(validateProduct(payload)).toBe(true);
    });
  })

  test('Tạo sản phẩm lỗi để hiển thị lỗi', async () => {
    // Giả lập API ném lỗi
    createProduct.mockRejectedValueOnce(new Error('Server error'))

    const initialProduct = { name: '', desc: '', price: 0, stock: 0, category: '' };
    const handleChange = jest.fn();
    const handleSubmit = jest.fn((e) => e.preventDefault());
    render(<ProductForm product={initialProduct} onChange={handleChange} onSubmit={handleSubmit} error="Server error" />)

    // Nhập dữ liệu vào form
    fireEvent.change(screen.getByLabelText('Tên sản phẩm'), { target: { value: 'Đồng hồ thông minh' } })
    fireEvent.change(screen.getByLabelText('Giá ($)'), { target: { value: '990000' } })
    fireEvent.change(screen.getByLabelText('Tồn kho'), { target: { value: '36' } })

    // Gửi form
    fireEvent.submit(screen.getByLabelText('product-form'))

    // Kiểm tra hiển thị lỗi đúng dạng alert
    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toMatch(/server error/i)
    })
  })
})