import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

// Mock productService đúng export mặc định và method getAllProducts
jest.mock('../../services/productService.js', () => ({
  __esModule: true,
  default: {
    getAllProducts: jest.fn(),
  },
}));

import productService from '../../services/productService.js';
import ProductList from '../../components/ProductList.jsx'
import { validateProduct } from '../../utils/validateProduct.js'

describe('ProductList Integration', () => {
  afterEach(() => jest.clearAllMocks())

  test('Hiển thị danh sách sản phẩm từ API', async () => {
    const mockProducts = [
      { id: 1, name: 'Đồng hồ thông minh', desc: 'Đồng hồ thông minh đa năng', price: 999000, category: 'Điện tử', stock: 36 },
      { id: 2, name: 'Giá đỡ laptop', desc: 'Giá đỡ laptop nhôm ergonomic', price: 399000, category: 'Phụ kiện', stock: 78 },
      { id: 3, name: 'Chuột không dây', desc: 'Chuột không dây tiện lợi', price: 299000, category: 'Phụ kiện', stock: 20 },
    ]
    productService.getAllProducts.mockResolvedValueOnce(mockProducts);

    render(<ProductList />)

    await waitFor(() => {
      const items = screen.getAllByTestId('product-item')
      expect(items).toHaveLength(3)
      expect(items[0].textContent).toContain('Đồng hồ thông minh')
      // Kiểm tra validateProduct cho từng sản phẩm
      mockProducts.forEach(p => {
        expect(validateProduct(p)).toBe(true)
      })
    })
  })

  test('Hiển thị lỗi khi API lỗi', async () => {
    productService.getAllProducts.mockRejectedValueOnce(new Error('Server error'));
    render(<ProductList />)

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/server error/i)
    })
  })
})