/**
 * Câu 3 - Integration Test (Frontend)
 * ProductForm + productService
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock đúng tên export của service bằng Jest
jest.mock('../../services/productService.js', () => ({
  createProduct: jest.fn(),
}))

import { createProduct } from '../../services/productService.js'
import ProductForm from '../../components/ProductForm.jsx'
import { validateProduct } from '../../utils/validateProduct.js'

describe('Product Integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Tạo sản phẩm thành công sẽ gọi API đúng payload', async () => {
    createProduct.mockResolvedValueOnce({
      id: 1,
      name: 'Đồng hồ thông minh',
      price: 990000,
      quantity: 36,
      category: 'Điện tử',
      description: 'Theo dõi sức khỏe với cảm biến nhịp tim',
    });

    function Wrapper() {
      const [product, setProduct] = React.useState({ name: '', desc: '', price: 0, stock: 0, category: '' });
      const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(product);
      };
      return <ProductForm product={product} onChange={handleChange} onSubmit={handleSubmit} />;
    }
    render(<Wrapper />);

    fireEvent.change(screen.getByLabelText('Tên sản phẩm'), { target: { value: 'Đồng hồ thông minh' } });
    fireEvent.change(screen.getByLabelText('Giá ($)'), { target: { value: '990000' } });
    fireEvent.change(screen.getByLabelText('Tồn kho'), { target: { value: '36' } });
    fireEvent.change(screen.getByLabelText('Danh mục'), { target: { value: 'Điện tử' } });
    fireEvent.change(screen.getByLabelText('Mô tả'), { target: { value: 'Theo dõi sức khỏe với cảm biến nhịp tim' } });
    fireEvent.submit(screen.getByLabelText('product-form'));

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